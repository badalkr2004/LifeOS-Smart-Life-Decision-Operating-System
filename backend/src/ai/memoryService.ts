/**
 * Memory Extraction Service
 *
 * Extracts key facts from conversations and outcome reflections.
 * Stores them in the userMemories table for cross-session persistence.
 *
 * Runs asynchronously after each chat turn / outcome recording.
 */

import { db } from "../db/connection";
import { userMemories } from "../db/schema";
import { generateText } from "ai";
import { models, SYSTEM_PROMPTS } from "./config";
import type { UserMemoryCategory } from "../db/intelligence.schema";

type ExtractedMemory = {
  fact: string;
  category: UserMemoryCategory;
  importance: number;
};

/**
 * Extract key facts from a conversation and store them.
 * Runs async — failures are logged but don't block the main flow.
 */
export async function extractAndStoreMemories(
  userId: string,
  content: string,
  source: string,
  sourceId?: string,
): Promise<void> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.log("[MemoryService] No OPENAI_API_KEY, skipping memory extraction");
      return;
    }

    if (!content || content.length < 20) return;

    const result = await generateText({
      model: models.extraction,
      system: SYSTEM_PROMPTS.memoryExtraction,
      prompt: content,
      maxTokens: 500,
    });

    let memories: ExtractedMemory[] = [];

    try {
      // Parse the JSON array from the LLM response
      const cleaned = result.text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      memories = JSON.parse(cleaned);
    } catch {
      console.warn("[MemoryService] Failed to parse LLM memory extraction:", result.text);
      return;
    }

    if (!Array.isArray(memories) || memories.length === 0) return;

    // Filter valid memories
    const validMemories = memories.filter(
      (m) =>
        m.fact &&
        m.fact.length > 5 &&
        m.importance >= 1 &&
        m.importance <= 10,
    );

    if (validMemories.length === 0) return;

    // Insert into DB
    await db.insert(userMemories).values(
      validMemories.map((m) => ({
        userId,
        fact: m.fact,
        category: m.category || ("behavioral" as UserMemoryCategory),
        importance: Math.min(10, Math.max(1, m.importance)),
        source,
        sourceId: sourceId || null,
      })),
    );

    console.log(
      `[MemoryService] Extracted ${validMemories.length} memories for user ${userId}`,
    );
  } catch (err) {
    console.error("[MemoryService] Memory extraction failed:", err);
    // Non-critical — don't throw
  }
}
