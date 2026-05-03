/**
 * Pattern Detection Service
 *
 * Analyzes user decision history to detect recurring behavioral patterns.
 * Populates the `decisionPatterns` table.
 *
 * Patterns detected:
 *  - Timing patterns (decisions made in rapid succession → lower satisfaction)
 *  - Confidence calibration (over/under-confidence by category)
 *  - Alternative exploration correlation (more alternatives → higher satisfaction?)
 *  - Category-specific regret triggers
 *  - Time-of-week/month patterns
 *
 * Runs:
 *  - After each new outcome (incremental)
 *  - Periodic batch (weekly full recomputation)
 */

import { db } from "../db/connection";
import { decisions, outcomes, decisionPatterns } from "../db/schema";
import { eq, and, isNull, desc, sql } from "drizzle-orm";
import { generateText } from "ai";
import { models } from "./config";

// ─── Main Detection ──────────────────────────────────────────────────────────

export async function detectPatterns(userId: string): Promise<void> {
  console.log(`[PatternService] Detecting patterns for user ${userId}`);

  try {
    // Fetch all decisions with outcomes
    const allDecisions = await db
      .select()
      .from(decisions)
      .where(and(eq(decisions.userId, userId), isNull(decisions.deletedAt)))
      .orderBy(desc(decisions.decisionDate));

    const allOutcomes = await db
      .select({
        id: outcomes.id,
        decisionId: outcomes.decisionId,
        satisfactionScore: outcomes.satisfactionScore,
        wouldDecideAgain: outcomes.wouldDecideAgain,
        lessonsLearned: outcomes.lessonsLearned,
        checkInDate: outcomes.checkInDate,
      })
      .from(outcomes)
      .innerJoin(decisions, eq(outcomes.decisionId, decisions.id))
      .where(and(eq(decisions.userId, userId), isNull(decisions.deletedAt)));

    if (allDecisions.length < 3 || allOutcomes.length < 2) {
      console.log(
        `[PatternService] Not enough data for pattern detection (${allDecisions.length} decisions, ${allOutcomes.length} outcomes)`,
      );
      return;
    }

    // Build decision-outcome map
    const outcomeMap = new Map<string, (typeof allOutcomes)[0]>();
    for (const o of allOutcomes) {
      // Keep the latest outcome per decision
      if (
        !outcomeMap.has(o.decisionId) ||
        new Date(o.checkInDate) >
          new Date(outcomeMap.get(o.decisionId)!.checkInDate)
      ) {
        outcomeMap.set(o.decisionId, o);
      }
    }

    const detectedPatterns: Array<{
      patternType: string;
      category: string | null;
      pattern: {
        condition: string;
        outcome: string;
        frequency: number;
        confidence: number;
        sampleSize: number;
      };
      strength: number;
    }> = [];

    // ── Pattern 1: Rapid Decision Making → Lower Satisfaction ──
    detectRapidDecisionPattern(allDecisions, outcomeMap, detectedPatterns);

    // ── Pattern 2: Alternative Exploration → Satisfaction Correlation ──
    detectAlternativePattern(allDecisions, outcomeMap, detectedPatterns);

    // ── Pattern 3: Confidence Calibration by Category ──
    detectConfidenceCalibration(allDecisions, outcomeMap, detectedPatterns);

    // ── Pattern 4: Category-Specific Regret Triggers ──
    detectCategoryRegretPatterns(allDecisions, outcomeMap, detectedPatterns);

    // ── Pattern 5: Context Length → Decision Quality ──
    detectContextQualityPattern(allDecisions, outcomeMap, detectedPatterns);

    if (detectedPatterns.length === 0) {
      console.log(
        `[PatternService] No new patterns detected for user ${userId}`,
      );
      return;
    }

    // ── Upsert patterns ──
    // Clear old patterns and insert new ones
    await db
      .delete(decisionPatterns)
      .where(eq(decisionPatterns.userId, userId));

    for (const p of detectedPatterns) {
      await db.insert(decisionPatterns).values({
        userId,
        patternType: p.patternType,
        category: p.category as any,
        pattern: p.pattern,
        strength: p.strength.toFixed(2),
        discoveredAt: new Date(),
        lastUpdatedAt: new Date(),
      });
    }

    console.log(
      `[PatternService] Detected ${detectedPatterns.length} patterns for user ${userId}`,
    );

    // ── LLM-enhanced pattern insights (if API key available) ──
    if (process.env.OPENAI_API_KEY && detectedPatterns.length > 0) {
      try {
        await generateLLMPatternInsights(userId, detectedPatterns);
      } catch (err) {
        console.warn("[PatternService] LLM pattern insights failed:", err);
      }
    }
  } catch (err) {
    console.error("[PatternService] Pattern detection failed:", err);
  }
}

// ─── Pattern Detectors ───────────────────────────────────────────────────────

function detectRapidDecisionPattern(
  allDecisions: any[],
  outcomeMap: Map<string, any>,
  patterns: any[],
): void {
  // Group decisions that happened within 48 hours of each other
  const rapidDecisions: any[] = [];
  const spacedDecisions: any[] = [];

  for (let i = 0; i < allDecisions.length - 1; i++) {
    const current = allDecisions[i]!;
    const next = allDecisions[i + 1]!;
    const gapHours =
      Math.abs(
        new Date(current.decisionDate).getTime() -
          new Date(next.decisionDate).getTime(),
      ) /
      (1000 * 60 * 60);

    const outcome = outcomeMap.get(current.id);
    if (!outcome) continue;

    if (gapHours < 48) {
      rapidDecisions.push({ decision: current, outcome });
    } else {
      spacedDecisions.push({ decision: current, outcome });
    }
  }

  if (rapidDecisions.length >= 2 && spacedDecisions.length >= 2) {
    const rapidAvg =
      rapidDecisions.reduce((s, r) => s + r.outcome.satisfactionScore, 0) /
      rapidDecisions.length;
    const spacedAvg =
      spacedDecisions.reduce((s, r) => s + r.outcome.satisfactionScore, 0) /
      spacedDecisions.length;

    if (spacedAvg - rapidAvg >= 1.5) {
      patterns.push({
        patternType: "timing",
        category: null,
        pattern: {
          condition: "Decisions made within 48 hours of another decision",
          outcome: `Average ${rapidAvg.toFixed(1)}/10 satisfaction (vs ${spacedAvg.toFixed(1)}/10 for spaced decisions)`,
          frequency: rapidDecisions.length,
          confidence: Math.min(90, 50 + rapidDecisions.length * 5),
          sampleSize: rapidDecisions.length + spacedDecisions.length,
        },
        strength: Math.min(10, (spacedAvg - rapidAvg) * 2),
      });
    }
  }
}

function detectAlternativePattern(
  allDecisions: any[],
  outcomeMap: Map<string, any>,
  patterns: any[],
): void {
  const withAlts: number[] = [];
  const withoutAlts: number[] = [];

  for (const d of allDecisions) {
    const outcome = outcomeMap.get(d.id);
    if (!outcome) continue;

    if (d.alternativesConsidered && d.alternativesConsidered.length >= 2) {
      withAlts.push(outcome.satisfactionScore);
    } else {
      withoutAlts.push(outcome.satisfactionScore);
    }
  }

  if (withAlts.length >= 2 && withoutAlts.length >= 2) {
    const altAvg = withAlts.reduce((a, b) => a + b, 0) / withAlts.length;
    const noAltAvg =
      withoutAlts.reduce((a, b) => a + b, 0) / withoutAlts.length;

    if (altAvg - noAltAvg >= 1.0) {
      patterns.push({
        patternType: "process_quality",
        category: null,
        pattern: {
          condition: "Decisions with 2+ alternatives considered",
          outcome: `Average ${altAvg.toFixed(1)}/10 satisfaction (vs ${noAltAvg.toFixed(1)}/10 without alternatives)`,
          frequency: withAlts.length,
          confidence: Math.min(90, 50 + withAlts.length * 3),
          sampleSize: withAlts.length + withoutAlts.length,
        },
        strength: Math.min(10, (altAvg - noAltAvg) * 2),
      });
    }
  }
}

function detectConfidenceCalibration(
  allDecisions: any[],
  outcomeMap: Map<string, any>,
  patterns: any[],
): void {
  // Group by category
  const byCategory: Record<
    string,
    Array<{ confidence: number; satisfaction: number }>
  > = {};

  for (const d of allDecisions) {
    const outcome = outcomeMap.get(d.id);
    if (!outcome) continue;

    if (!byCategory[d.category]) byCategory[d.category] = [];
    byCategory[d.category].push({
      confidence: d.confidenceLevel,
      satisfaction: outcome.satisfactionScore,
    });
  }

  for (const [cat, pairs] of Object.entries(byCategory)) {
    if (pairs.length < 3) continue;

    const avgConf = pairs.reduce((s, p) => s + p.confidence, 0) / pairs.length;
    const avgSat = pairs.reduce((s, p) => s + p.satisfaction, 0) / pairs.length;
    const gap = avgConf - avgSat;

    if (Math.abs(gap) >= 1.5) {
      const direction = gap > 0 ? "overconfident" : "underconfident";
      patterns.push({
        patternType: "confidence_calibration",
        category: cat,
        pattern: {
          condition: `${cat} decisions: confidence vs actual satisfaction`,
          outcome: `Tends to be ${direction} by ${Math.abs(gap).toFixed(1)} points (confidence: ${avgConf.toFixed(1)}, satisfaction: ${avgSat.toFixed(1)})`,
          frequency: pairs.length,
          confidence: Math.min(90, 50 + pairs.length * 5),
          sampleSize: pairs.length,
        },
        strength: Math.min(10, Math.abs(gap) * 1.5),
      });
    }
  }
}

function detectCategoryRegretPatterns(
  allDecisions: any[],
  outcomeMap: Map<string, any>,
  patterns: any[],
): void {
  const byCategory: Record<
    string,
    { total: number; regrets: number; lowSat: number }
  > = {};

  for (const d of allDecisions) {
    const outcome = outcomeMap.get(d.id);
    if (!outcome) continue;

    if (!byCategory[d.category])
      byCategory[d.category] = { total: 0, regrets: 0, lowSat: 0 };
    byCategory[d.category].total++;

    if (outcome.wouldDecideAgain === false) byCategory[d.category].regrets++;
    if (outcome.satisfactionScore <= 4) byCategory[d.category].lowSat++;
  }

  for (const [cat, stats] of Object.entries(byCategory)) {
    if (stats.total < 3) continue;

    const regretRate = (stats.regrets / stats.total) * 100;
    if (regretRate >= 40) {
      patterns.push({
        patternType: "category_regret",
        category: cat,
        pattern: {
          condition: `${cat} decisions`,
          outcome: `${regretRate.toFixed(0)}% regret rate (${stats.regrets}/${stats.total} decisions). ${stats.lowSat} had satisfaction ≤ 4/10.`,
          frequency: stats.regrets,
          confidence: Math.min(90, 50 + stats.total * 3),
          sampleSize: stats.total,
        },
        strength: Math.min(10, regretRate / 10),
      });
    }
  }
}

function detectContextQualityPattern(
  allDecisions: any[],
  outcomeMap: Map<string, any>,
  patterns: any[],
): void {
  const detailedContext: number[] = [];
  const sparseContext: number[] = [];

  for (const d of allDecisions) {
    const outcome = outcomeMap.get(d.id);
    if (!outcome) continue;

    const contextLength =
      (d.context?.length || 0) +
      (d.description?.length || 0) +
      (d.reasoningProcess?.length || 0);

    if (contextLength > 100) {
      detailedContext.push(outcome.satisfactionScore);
    } else {
      sparseContext.push(outcome.satisfactionScore);
    }
  }

  if (detailedContext.length >= 2 && sparseContext.length >= 2) {
    const detailedAvg =
      detailedContext.reduce((a, b) => a + b, 0) / detailedContext.length;
    const sparseAvg =
      sparseContext.reduce((a, b) => a + b, 0) / sparseContext.length;

    if (detailedAvg - sparseAvg >= 1.0) {
      patterns.push({
        patternType: "context_quality",
        category: null,
        pattern: {
          condition: "Decisions with detailed context/description (100+ chars)",
          outcome: `Average ${detailedAvg.toFixed(1)}/10 satisfaction (vs ${sparseAvg.toFixed(1)}/10 for sparse context)`,
          frequency: detailedContext.length,
          confidence: Math.min(85, 50 + detailedContext.length * 3),
          sampleSize: detailedContext.length + sparseContext.length,
        },
        strength: Math.min(10, (detailedAvg - sparseAvg) * 2),
      });
    }
  }
}

// ─── LLM-Enhanced Pattern Insights ───────────────────────────────────────────

async function generateLLMPatternInsights(
  userId: string,
  detectedPatterns: any[],
): Promise<void> {
  const result = await generateText({
    model: models.extraction,
    system: `You are a behavioral analyst. Given detected decision-making patterns, generate a brief insight for each one. Return a JSON array of objects with "patternType" and "insight" (1-2 sentences, actionable). Only return the JSON array.`,
    prompt: JSON.stringify(
      detectedPatterns.map((p) => ({
        type: p.patternType,
        category: p.category,
        condition: p.pattern.condition,
        outcome: p.pattern.outcome,
      })),
    ),
    maxTokens: 500,
  });

  // Store insights as user memories
  try {
    const cleaned = result.text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const insights = JSON.parse(cleaned);

    if (Array.isArray(insights)) {
      const { extractAndStoreMemories } = await import("./memoryService");
      for (const insight of insights) {
        if (insight.insight) {
          await db.execute(sql`
            INSERT INTO user_memories (id, user_id, category, fact, importance, source)
            VALUES (gen_random_uuid(), ${userId}, 'behavioral', ${`Pattern insight: ${insight.insight}`}, 7, 'pattern_detection')
          `);
        }
      }
    }
  } catch {
    // Non-critical
  }
}
