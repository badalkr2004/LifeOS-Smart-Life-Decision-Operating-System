/**
 * Profile Computation Service
 *
 * Computes the User Decision Profile (Layer 1 of the intelligence stack).
 * Runs as a background job — triggered on significant events or daily cron.
 *
 * Outputs:
 *  - Structured `profile` JSON (for programmatic use)
 *  - `textSummary` string (~200-400 tokens, injected directly into LLM prompts)
 */

import { db } from "../db/connection";
import {
  decisions,
  outcomes,
  userDecisionProfiles,
  decisionPatterns,
  users,
} from "../db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { generateText } from "ai";
import { models, SYSTEM_PROMPTS } from "./config";
import type { UserProfileData, CategoryProfile } from "../db/intelligence.schema";

// ─── Main Computation ────────────────────────────────────────────────────────

export async function computeUserProfile(userId: string): Promise<void> {
  console.log(`[ProfileService] Computing profile for user ${userId}`);

  // ── 1. Fetch all user decisions ──
  const allDecisions = await db
    .select()
    .from(decisions)
    .where(and(eq(decisions.userId, userId), isNull(decisions.deletedAt)))
    .orderBy(desc(decisions.decisionDate));

  // ── 2. Fetch all outcomes ──
  const allOutcomes = await db
    .select({
      satisfactionScore: outcomes.satisfactionScore,
      wouldDecideAgain: outcomes.wouldDecideAgain,
      lessonsLearned: outcomes.lessonsLearned,
      actualResults: outcomes.actualResults,
      mood: outcomes.moodAtCheckIn,
      stressLevel: outcomes.stressLevel,
      decisionId: outcomes.decisionId,
      checkInDate: outcomes.checkInDate,
    })
    .from(outcomes)
    .innerJoin(decisions, eq(outcomes.decisionId, decisions.id))
    .where(and(eq(decisions.userId, userId), isNull(decisions.deletedAt)))
    .orderBy(desc(outcomes.checkInDate));

  // ── 3. Fetch user info ──
  const userRecord = await db
    .select({ createdAt: users.createdAt })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (allDecisions.length === 0) {
    console.log(`[ProfileService] No decisions found for user ${userId}, skipping.`);
    return;
  }

  // ── 4. Build category profiles ──
  const categoryProfiles: Record<string, CategoryProfile> = {};
  const decisionsByCategory: Record<string, typeof allDecisions> = {};

  for (const d of allDecisions) {
    const cat = d.category;
    if (!decisionsByCategory[cat]) decisionsByCategory[cat] = [];
    decisionsByCategory[cat].push(d);
  }

  // Map outcomes to their decisions
  const outcomesByDecisionId = new Map<string, typeof allOutcomes>();
  for (const o of allOutcomes) {
    const arr = outcomesByDecisionId.get(o.decisionId) || [];
    arr.push(o);
    outcomesByDecisionId.set(o.decisionId, arr);
  }

  for (const [cat, catDecisions] of Object.entries(decisionsByCategory)) {
    const catOutcomes = catDecisions.flatMap(
      (d) => outcomesByDecisionId.get(d.id) || [],
    );

    const avgSatisfaction =
      catOutcomes.length > 0
        ? catOutcomes.reduce((s, o) => s + o.satisfactionScore, 0) / catOutcomes.length
        : null;

    const regretCount = catOutcomes.filter((o) => o.wouldDecideAgain === false).length;
    const regretRate =
      catOutcomes.length > 0 ? Math.round((regretCount / catOutcomes.length) * 100) : 0;

    const avgConfidence =
      catDecisions.reduce((s, d) => s + d.confidenceLevel, 0) / catDecisions.length;

    // Extract unique lessons
    const topLessons = catOutcomes
      .map((o) => o.lessonsLearned)
      .filter((l): l is string => !!l && l.length > 10)
      .slice(0, 3);

    // Detect common mistakes (low satisfaction + lessons)
    const commonMistakes = catOutcomes
      .filter((o) => o.satisfactionScore <= 4 && o.lessonsLearned)
      .map((o) => o.lessonsLearned!)
      .slice(0, 3);

    categoryProfiles[cat] = {
      count: catDecisions.length,
      avgSatisfaction: avgSatisfaction ? parseFloat(avgSatisfaction.toFixed(1)) : null,
      regretRate,
      avgConfidence: parseFloat(avgConfidence.toFixed(1)),
      topLessons,
      commonMistakes,
    };
  }

  // ── 5. Calculate global metrics ──
  const now = new Date();
  const memberSince = userRecord[0]?.createdAt?.toISOString().split("T")[0] || "unknown";
  const totalDecisions = allDecisions.length;
  const totalOutcomes = allOutcomes.length;

  // Decision velocity (decisions per week)
  const firstDecisionDate = allDecisions[allDecisions.length - 1]?.decisionDate;
  const lastDecisionDate = allDecisions[0]?.decisionDate;
  const spanDays = firstDecisionDate && lastDecisionDate
    ? Math.max(1, (new Date(lastDecisionDate).getTime() - new Date(firstDecisionDate).getTime()) / (1000 * 60 * 60 * 24))
    : 7;
  const decisionsPerWeek = parseFloat(((totalDecisions / spanDays) * 7).toFixed(1));

  // Average time between decisions
  let avgTimeBetween = 0;
  if (allDecisions.length > 1) {
    const gaps: number[] = [];
    for (let i = 0; i < allDecisions.length - 1; i++) {
      const gap =
        (new Date(allDecisions[i]!.decisionDate).getTime() -
          new Date(allDecisions[i + 1]!.decisionDate).getTime()) /
        (1000 * 60 * 60 * 24);
      gaps.push(gap);
    }
    avgTimeBetween = parseFloat((gaps.reduce((a, b) => a + b, 0) / gaps.length).toFixed(1));
  }

  // Overall satisfaction
  const overallSatisfaction =
    allOutcomes.length > 0
      ? parseFloat(
          (allOutcomes.reduce((s, o) => s + o.satisfactionScore, 0) / allOutcomes.length).toFixed(1),
        )
      : null;

  // Confidence accuracy: correlation between confidence and satisfaction
  let confidenceAccuracy: number | null = null;
  if (allOutcomes.length >= 3) {
    const pairs = allOutcomes
      .map((o) => {
        const decision = allDecisions.find((d) => d.id === o.decisionId);
        if (!decision) return null;
        return { confidence: decision.confidenceLevel, satisfaction: o.satisfactionScore };
      })
      .filter(Boolean) as Array<{ confidence: number; satisfaction: number }>;

    if (pairs.length >= 3) {
      const avgConf = pairs.reduce((s, p) => s + p.confidence, 0) / pairs.length;
      const avgSat = pairs.reduce((s, p) => s + p.satisfaction, 0) / pairs.length;
      confidenceAccuracy = parseFloat((avgConf - avgSat).toFixed(1));
      // Positive = overconfident, negative = underconfident
    }
  }

  // ── 6. Detect behavioral traits (rule-based) ──
  const traits: string[] = [];

  // Impulsivity detection
  const decisionsWithNoAlts = allDecisions.filter(
    (d) => !d.alternativesConsidered || d.alternativesConsidered.length === 0,
  );
  if (decisionsWithNoAlts.length > totalDecisions * 0.6 && totalDecisions >= 3) {
    traits.push("Rarely considers alternatives — tends to go with first instinct.");
  }

  // Category specialization
  const sortedCategories = Object.entries(categoryProfiles).sort(
    (a, b) => b[1].count - a[1].count,
  );
  if (sortedCategories.length > 0) {
    const top = sortedCategories[0]!;
    if (top[1].count >= totalDecisions * 0.4) {
      traits.push(`Most decisions are in the ${top[0]} category (${top[1].count}/${totalDecisions}).`);
    }
  }

  // Confidence bias
  if (confidenceAccuracy !== null) {
    if (confidenceAccuracy > 1.5) {
      traits.push(`Tends to be overconfident — confidence predictions are ${confidenceAccuracy} points higher than actual satisfaction.`);
    } else if (confidenceAccuracy < -1.5) {
      traits.push(`Tends to underestimate outcomes — actual satisfaction is ${Math.abs(confidenceAccuracy)} points higher than predicted confidence.`);
    }
  }

  // High regret categories
  for (const [cat, cp] of Object.entries(categoryProfiles)) {
    if (cp.regretRate > 40 && cp.count >= 2) {
      traits.push(`High regret rate in ${cat} decisions (${cp.regretRate}%).`);
    }
    if (cp.avgSatisfaction !== null && cp.avgSatisfaction >= 8 && cp.count >= 2) {
      traits.push(`Consistently strong ${cat} decisions (avg ${cp.avgSatisfaction}/10).`);
    }
  }

  // Decision velocity traits
  if (decisionsPerWeek > 3) {
    traits.push("High decision-making frequency — may benefit from slowing down on major choices.");
  }

  // ── 7. Build profile object ──
  const profile: UserProfileData = {
    memberSince,
    totalDecisions,
    totalOutcomes,
    decisionsPerWeek,
    avgTimeBetweenDecisions: avgTimeBetween,
    overallSatisfaction,
    confidenceAccuracy,
    traits,
    categoryProfiles,
    lifeContext: [], // populated by memory extraction later
  };

  // ── 8. Generate text summary using LLM (background model) ──
  let textSummary = buildFallbackSummary(profile);

  try {
    if (process.env.OPENAI_API_KEY) {
      const result = await generateText({
        model: models.background,
        system: SYSTEM_PROMPTS.profileSummary,
        prompt: `Raw profile data:\n${JSON.stringify(profile, null, 2)}`,
        maxTokens: 400,
      });
      if (result.text && result.text.length > 50) {
        textSummary = result.text;
      }
    }
  } catch (err) {
    console.warn("[ProfileService] LLM summary generation failed, using fallback:", err);
  }

  // ── 9. Upsert into DB ──
  const existing = await db
    .select({ id: userDecisionProfiles.id, version: userDecisionProfiles.version })
    .from(userDecisionProfiles)
    .where(eq(userDecisionProfiles.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(userDecisionProfiles)
      .set({
        profile,
        textSummary,
        version: (existing[0]!.version || 0) + 1,
        lastComputedAt: new Date(),
      })
      .where(eq(userDecisionProfiles.userId, userId));
  } else {
    await db.insert(userDecisionProfiles).values({
      userId,
      profile,
      textSummary,
      lastComputedAt: new Date(),
    });
  }

  console.log(`[ProfileService] Profile computed for user ${userId} (v${(existing[0]?.version || 0) + 1})`);
}

// ─── Fallback Summary (no LLM needed) ────────────────────────────────────────

function buildFallbackSummary(profile: UserProfileData): string {
  const lines: string[] = [];

  lines.push(
    `User Profile: Member since ${profile.memberSince}. ${profile.totalDecisions} decisions tracked, ${profile.totalOutcomes} outcomes recorded.`,
  );
  lines.push(
    `Decision velocity: ${profile.decisionsPerWeek} decisions/week. Avg ${profile.avgTimeBetweenDecisions} days between decisions.`,
  );

  if (profile.overallSatisfaction !== null) {
    lines.push(`Overall satisfaction: ${profile.overallSatisfaction}/10.`);
  }

  if (profile.traits.length > 0) {
    lines.push(`\nKey traits:\n${profile.traits.map((t) => `- ${t}`).join("\n")}`);
  }

  const categories = Object.entries(profile.categoryProfiles);
  if (categories.length > 0) {
    lines.push("\nCategory breakdown:");
    for (const [cat, cp] of categories) {
      const sat = cp.avgSatisfaction !== null ? `, avg satisfaction: ${cp.avgSatisfaction}/10` : "";
      const regret = cp.regretRate > 0 ? `, ${cp.regretRate}% regret` : "";
      lines.push(`- ${cat}: ${cp.count} decisions${sat}${regret}`);
    }
  }

  return lines.join("\n");
}
