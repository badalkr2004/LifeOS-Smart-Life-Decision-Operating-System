/**
 * AI Pipeline — 3-Layer Intelligence Assembly
 *
 * Builds the optimal prompt for any AI request by combining:
 *  Layer 1: User Decision Profile (~150 tokens, pre-computed)
 *  Layer 2: Category Summary (~100 tokens, from profile)
 *  Layer 3: RAG — semantically similar past decisions (~500 tokens)
 *  Layer 4: Detected behavioral patterns (~100 tokens)
 *  + User Memories (~100 tokens)
 *
 *  Total: ~1,500-2,500 tokens per request (vs. 10-50K naive approach)
 */

import { db } from "../db/connection";
import {
  decisions,
  outcomes,
  userDecisionProfiles,
  userMemories,
  decisionPatterns,
} from "../db/schema";
import { eq, and, isNull, desc, sql } from "drizzle-orm";
import { embed } from "ai";
import { models } from "./config";

// ─── Types ───────────────────────────────────────────────────────────────────

export type AssembledContext = {
  userProfile: string;
  categoryContext: string;
  relevantDecisions: string;
  patterns: string;
  memories: string;
  fullPrompt: string;
};

// ─── Main Assembly Function ──────────────────────────────────────────────────

export async function assembleContext(
  userId: string,
  query: string,
  options: {
    category?: string;
    includeRAG?: boolean;
    maxSimilarDecisions?: number;
  } = {},
): Promise<AssembledContext> {
  const { category, includeRAG = true, maxSimilarDecisions = 3 } = options;

  // ── Layer 1: User Profile ──
  const userProfile = await getUserProfileSummary(userId);

  // ── Layer 2: Category Context ──
  const categoryContext = await getCategoryContext(userId, category);

  // ── Layer 3: RAG — Similar Decisions ──
  let relevantDecisions = "No relevant past decisions found.";
  if (includeRAG) {
    relevantDecisions = await getRelevantDecisions(userId, query, maxSimilarDecisions);
  }

  // ── Memories ──
  const memories = await getUserMemories(userId);

  // ── Layer 4: Detected Patterns ──
  const patterns = await getDetectedPatterns(userId);

  // ── Assemble Full Context ──
  const sections: string[] = [];

  if (userProfile) {
    sections.push(`=== USER PROFILE ===\n${userProfile}`);
  }

  if (categoryContext) {
    sections.push(`=== CATEGORY CONTEXT ===\n${categoryContext}`);
  }

  sections.push(`=== RELEVANT PAST DECISIONS ===\n${relevantDecisions}`);

  if (patterns) {
    sections.push(`=== BEHAVIORAL PATTERNS ===\n${patterns}`);
  }

  if (memories) {
    sections.push(`=== KEY FACTS ABOUT USER ===\n${memories}`);
  }

  const fullPrompt = sections.join("\n\n");

  return { userProfile, categoryContext, relevantDecisions, patterns, memories, fullPrompt };
}

// ─── Layer 1: User Profile ───────────────────────────────────────────────────

async function getUserProfileSummary(userId: string): Promise<string> {
  const profile = await db
    .select({ textSummary: userDecisionProfiles.textSummary })
    .from(userDecisionProfiles)
    .where(eq(userDecisionProfiles.userId, userId))
    .limit(1);

  if (profile.length > 0 && profile[0]?.textSummary) {
    return profile[0].textSummary;
  }

  // Fallback: basic stats if profile not yet computed
  const decisionCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(decisions)
    .where(and(eq(decisions.userId, userId), isNull(decisions.deletedAt)));

  return `New user with ${decisionCount[0]?.count || 0} decisions. No behavioral profile computed yet.`;
}

// ─── Layer 2: Category Context ───────────────────────────────────────────────

async function getCategoryContext(
  userId: string,
  category?: string,
): Promise<string> {
  if (!category) return "";

  const profile = await db
    .select({ profile: userDecisionProfiles.profile })
    .from(userDecisionProfiles)
    .where(eq(userDecisionProfiles.userId, userId))
    .limit(1);

  if (profile.length > 0 && profile[0]?.profile?.categoryProfiles) {
    const catProfile = profile[0].profile.categoryProfiles[category];
    if (catProfile) {
      const lines: string[] = [
        `${category} decisions: ${catProfile.count} total`,
      ];
      if (catProfile.avgSatisfaction !== null) {
        lines.push(`Avg satisfaction: ${catProfile.avgSatisfaction}/10`);
      }
      if (catProfile.regretRate > 0) {
        lines.push(`Regret rate: ${catProfile.regretRate}%`);
      }
      if (catProfile.topLessons.length > 0) {
        lines.push(`Key lessons: ${catProfile.topLessons.join("; ")}`);
      }
      if (catProfile.commonMistakes.length > 0) {
        lines.push(`Common mistakes: ${catProfile.commonMistakes.join("; ")}`);
      }
      return lines.join(". ");
    }
  }

  return `No historical data for ${category} decisions yet.`;
}

// ─── Layer 3: RAG — Similar Decisions via pgvector ───────────────────────────

async function getRelevantDecisions(
  userId: string,
  query: string,
  limit: number,
): Promise<string> {
  try {
    // Check if OPENAI_API_KEY is set for embeddings
    if (!process.env.OPENAI_API_KEY) {
      return await getRecentDecisionsFallback(userId, limit);
    }

    // Generate embedding for the query
    const { embedding: queryEmbedding } = await embed({
      model: models.embedding,
      value: query,
    });

    // Vector similarity search
    const similar = await db.execute<{
      id: string;
      title: string;
      category: string;
      description: string | null;
      confidence_level: number;
      decision_date: string;
      similarity: number;
    }>(sql`
      SELECT
        d.id,
        d.title,
        d.category,
        d.description,
        d.confidence_level,
        d.decision_date,
        1 - (d.embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
      FROM decisions d
      WHERE d.user_id = ${userId}
        AND d.deleted_at IS NULL
        AND d.embedding IS NOT NULL
      ORDER BY d.embedding <=> ${JSON.stringify(queryEmbedding)}::vector
      LIMIT ${limit}
    `);

    if (!similar.rows || similar.rows.length === 0) {
      return await getRecentDecisionsFallback(userId, limit);
    }

    // Enrich with outcomes
    const lines: string[] = [];
    for (const d of similar.rows) {
      const decisionOutcomes = await db
        .select({
          satisfactionScore: outcomes.satisfactionScore,
          wouldDecideAgain: outcomes.wouldDecideAgain,
          lessonsLearned: outcomes.lessonsLearned,
          actualResults: outcomes.actualResults,
        })
        .from(outcomes)
        .where(eq(outcomes.decisionId, d.id))
        .orderBy(desc(outcomes.checkInDate))
        .limit(1);

      let line = `• "${d.title}" (${d.category}, confidence: ${d.confidence_level}/10, similarity: ${(d.similarity * 100).toFixed(0)}%)`;

      if (decisionOutcomes.length > 0) {
        const o = decisionOutcomes[0]!;
        line += ` → Satisfaction: ${o.satisfactionScore}/10`;
        if (o.wouldDecideAgain !== null) {
          line += `, Would decide again: ${o.wouldDecideAgain ? "Yes" : "No"}`;
        }
        if (o.lessonsLearned) {
          line += `. Lesson: "${o.lessonsLearned}"`;
        }
      } else {
        line += ` → No outcome recorded yet`;
      }

      lines.push(line);
    }

    return lines.join("\n");
  } catch (err) {
    console.warn("[Pipeline] RAG search failed, using fallback:", err);
    return await getRecentDecisionsFallback(userId, limit);
  }
}

// ─── Fallback: Recent Decisions (no embeddings) ──────────────────────────────

async function getRecentDecisionsFallback(
  userId: string,
  limit: number,
): Promise<string> {
  const recent = await db
    .select({
      id: decisions.id,
      title: decisions.title,
      category: decisions.category,
      confidenceLevel: decisions.confidenceLevel,
    })
    .from(decisions)
    .where(and(eq(decisions.userId, userId), isNull(decisions.deletedAt)))
    .orderBy(desc(decisions.decisionDate))
    .limit(limit);

  if (recent.length === 0) return "No past decisions found.";

  const lines: string[] = [];
  for (const d of recent) {
    const decisionOutcomes = await db
      .select({
        satisfactionScore: outcomes.satisfactionScore,
        wouldDecideAgain: outcomes.wouldDecideAgain,
        lessonsLearned: outcomes.lessonsLearned,
      })
      .from(outcomes)
      .where(eq(outcomes.decisionId, d.id))
      .limit(1);

    let line = `• "${d.title}" (${d.category}, confidence: ${d.confidenceLevel}/10)`;
    if (decisionOutcomes.length > 0) {
      const o = decisionOutcomes[0]!;
      line += ` → Satisfaction: ${o.satisfactionScore}/10`;
      if (o.lessonsLearned) line += `. Lesson: "${o.lessonsLearned}"`;
    }
    lines.push(line);
  }

  return lines.join("\n");
}

// ─── User Memories ───────────────────────────────────────────────────────────

async function getUserMemories(userId: string): Promise<string> {
  const mems = await db
    .select({ fact: userMemories.fact, category: userMemories.category })
    .from(userMemories)
    .where(eq(userMemories.userId, userId))
    .orderBy(desc(userMemories.importance))
    .limit(10);

  if (mems.length === 0) return "";

  return mems.map((m) => `• [${m.category || "general"}] ${m.fact}`).join("\n");
}

// ─── Layer 4: Detected Patterns ──────────────────────────────────────────────

async function getDetectedPatterns(userId: string): Promise<string> {
  const patterns = await db
    .select({
      patternType: decisionPatterns.patternType,
      category: decisionPatterns.category,
      pattern: decisionPatterns.pattern,
      strength: decisionPatterns.strength,
    })
    .from(decisionPatterns)
    .where(eq(decisionPatterns.userId, userId))
    .orderBy(desc(decisionPatterns.strength))
    .limit(5);

  if (patterns.length === 0) return "";

  return patterns
    .map((p) => {
      const pat = p.pattern as any;
      return `• [${p.patternType}${p.category ? ` / ${p.category}` : ""}] ${pat?.condition || ""}: ${pat?.outcome || ""}`;
    })
    .join("\n");
}

// ─── Generate Decision Embedding ─────────────────────────────────────────────

export async function generateDecisionEmbedding(decisionId: string): Promise<void> {
  if (!process.env.OPENAI_API_KEY) {
    console.log("[Pipeline] No OPENAI_API_KEY, skipping embedding generation");
    return;
  }

  try {
    const decision = await db
      .select({
        title: decisions.title,
        description: decisions.description,
        category: decisions.category,
        context: decisions.context,
        tags: decisions.tags,
      })
      .from(decisions)
      .where(eq(decisions.id, decisionId))
      .limit(1);

    if (decision.length === 0) return;

    const d = decision[0]!;
    const textToEmbed = [
      d.title,
      d.description || "",
      `Category: ${d.category}`,
      d.context || "",
      d.tags?.join(", ") || "",
    ]
      .filter(Boolean)
      .join(". ");

    const { embedding } = await embed({
      model: models.embedding,
      value: textToEmbed,
    });

    await db.execute(sql`
      UPDATE decisions
      SET embedding = ${JSON.stringify(embedding)}::vector
      WHERE id = ${decisionId}
    `);

    console.log(`[Pipeline] Embedding generated for decision ${decisionId}`);
  } catch (err) {
    console.error("[Pipeline] Embedding generation failed:", err);
  }
}
