/**
 * AI Configuration — Model-agnostic setup via Vercel AI SDK
 *
 * Uses @ai-sdk/openai as the default provider.
 * Swap to @ai-sdk/anthropic, @ai-sdk/google, etc. by changing imports.
 *
 * Multi-model strategy:
 *  - chat:       GPT-4o       (quality responses)
 *  - profile:    GPT-4o-mini  (background computation, cheap)
 *  - embedding:  text-embedding-3-small (vector search)
 *  - extraction: GPT-4o-mini  (structured output, async)
 */

import { createOpenAI } from "@ai-sdk/openai";

// ─── Provider ────────────────────────────────────────────────────────────────

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// ─── Model Registry ──────────────────────────────────────────────────────────

export const models = {
  /** Primary chat model — best reasoning, used for user-facing responses */
  chat: openai("gpt-4o"),

  /** Background computation — profile generation, pattern detection */
  background: openai("gpt-4o-mini"),

  /** Structured extraction — memory facts, trait analysis */
  extraction: openai("gpt-4o-mini"),

  /** Embeddings model */
  embedding: openai.embedding("text-embedding-3-small"),
} as const;

// ─── System Prompts ──────────────────────────────────────────────────────────

export const SYSTEM_PROMPTS = {
  /** Main chat advisor system prompt */
  advisor: `You are LifeOS, a personal decision intelligence assistant. You help users make better life decisions by analyzing their patterns, past outcomes, and providing actionable advice.

IMPORTANT RULES:
- Always reference the user's specific history when relevant
- Be concise but thorough — aim for 2-4 short paragraphs
- Flag risks clearly but don't be overly cautious
- Suggest specific, actionable next steps
- If the user's history shows a pattern (good or bad), mention it
- Use a warm, supportive but honest tone — like a trusted friend who's also a strategist
- Never make up data — only reference what's in the provided context
- If you don't have enough historical data, say so honestly`,

  /** Profile text summary generation */
  profileSummary: `You are a behavioral analyst for LifeOS. Given a user's raw decision data and computed metrics, generate a concise text summary (150-300 tokens) that captures:
1. Decision-making tendencies and behavioral traits
2. Category-specific strengths and weaknesses
3. Key patterns (timing, impulsivity, thoroughness)
4. Life context clues from decision descriptions

Write in third person ("This user tends to..."). Be specific, not generic.
Do NOT include raw numbers — weave them into natural language observations.`,

  /** Memory/fact extraction from conversations */
  memoryExtraction: `Extract key facts from this conversation that would be useful for future advice. Return a JSON array of objects with:
- "fact": the key fact (concise, specific)
- "category": one of "financial", "life_event", "preference", "goal", "relationship", "career", "health", "behavioral"
- "importance": 1-10 (how relevant is this for future decisions?)

Only extract facts that would genuinely help personalize future advice. Skip generic observations.
Return ONLY the JSON array, no other text.`,
} as const;
