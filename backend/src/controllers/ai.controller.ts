/**
 * AI Controller — Streaming Chat + Intelligence Pipeline
 *
 * Endpoints:
 *  POST /ai/chat              — Streaming chat via SSE (3-layer context)
 *  POST /ai/pre-decision-analysis — Pre-decision risk analysis
 *  POST /ai/analyze-decision  — Post-decision analysis
 *  GET  /ai/chat/sessions     — List chat sessions
 *  GET  /ai/chat/sessions/:id — Get chat history
 *  POST /ai/compute-profile   — Trigger profile recomputation
 *  POST /ai/detect-patterns   — Trigger pattern detection
 *  GET  /ai/patterns          — Get detected patterns
 */

import { type Response } from "express";
import { type AuthRequest } from "../middleware/auth.middleware";
import { db } from "../db/connection";
import {
  aiInteractions,
  aiChatSessions,
  aiChatMessages,
  decisions,
  outcomes,
  decisionPatterns,
} from "../db/schema";
import { eq, and, desc, isNull, sql } from "drizzle-orm";
import { streamText, generateText } from "ai";
import { models, SYSTEM_PROMPTS } from "../ai/config";
import { assembleContext, generateDecisionEmbedding } from "../ai/pipeline";
import { computeUserProfile } from "../ai/profileService";
import { extractAndStoreMemories } from "../ai/memoryService";
import { detectPatterns } from "../ai/patternService";

// ─── Streaming Chat (SSE) ───────────────────────────────────────────────────

export const chat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { sessionId, message, decisionId } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    let currentSessionId = sessionId;

    // Create new session if none provided
    if (!currentSessionId) {
      const newSession = await db
        .insert(aiChatSessions)
        .values({
          userId,
          decisionId: decisionId || null,
          title: message.substring(0, 100),
          messageCount: 0,
          totalTokensUsed: 0,
        })
        .returning();
      currentSessionId = newSession[0]?.id;
    }

    // Store user message
    await db.insert(aiChatMessages).values({
      sessionId: currentSessionId,
      role: "user",
      content: message,
    });

    // Get chat history for context
    const history = await db
      .select({ role: aiChatMessages.role, content: aiChatMessages.content })
      .from(aiChatMessages)
      .where(eq(aiChatMessages.sessionId, currentSessionId))
      .orderBy(aiChatMessages.createdAt)
      .limit(20); // Last 20 messages

    // Detect category from decision or message
    let category: string | undefined;
    if (decisionId) {
      const dec = await db
        .select({ category: decisions.category })
        .from(decisions)
        .where(eq(decisions.id, decisionId))
        .limit(1);
      category = dec[0]?.category;
    }

    // ── Assemble 3-layer context ──
    const context = await assembleContext(userId, message, {
      category,
      includeRAG: true,
      maxSimilarDecisions: 3,
    });

    // Build messages array
    const messages = [
      ...history.map((h) => ({
        role: h.role as "user" | "assistant" | "system",
        content: h.content,
      })),
    ];

    // Check if OPENAI_API_KEY is available
    if (!process.env.OPENAI_API_KEY) {
      // Non-streaming fallback
      const fallbackReply = generateFallbackResponse(
        message,
        context.fullPrompt,
      );

      await db.insert(aiChatMessages).values({
        sessionId: currentSessionId,
        role: "assistant",
        content: fallbackReply,
        metadata: { model: "fallback", tokensUsed: 0, processingTime: 0 },
      });

      // Update session
      await db
        .update(aiChatSessions)
        .set({ lastMessageAt: new Date() })
        .where(eq(aiChatSessions.id, currentSessionId));

      res.json({
        data: {
          sessionId: currentSessionId,
          reply: fallbackReply,
          streaming: false,
        },
      });
      return;
    }

    // ── Stream response via SSE ──
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Session-Id", currentSessionId);

    // Send session ID first
    res.write(
      `data: ${JSON.stringify({ type: "session", sessionId: currentSessionId })}\n\n`,
    );

    let fullResponse = "";

    const result = streamText({
      model: models.chat,
      system: `${SYSTEM_PROMPTS.advisor}\n\n${context.fullPrompt}`,
      messages,
      maxTokens: 1000,
      onChunk: ({ chunk }) => {
        if (chunk.type === "text-delta") {
          res.write(
            `data: ${JSON.stringify({ type: "delta", text: chunk.textDelta })}\n\n`,
          );
          fullResponse += chunk.textDelta;
        }
      },
      onFinish: async ({ usage }) => {
        // Store AI response
        await db.insert(aiChatMessages).values({
          sessionId: currentSessionId,
          role: "assistant",
          content: fullResponse,
          metadata: {
            model: "gpt-4o",
            tokensUsed: usage?.totalTokens || 0,
            processingTime: 0,
          },
        });

        // Update session stats
        await db
          .update(aiChatSessions)
          .set({ lastMessageAt: new Date() })
          .where(eq(aiChatSessions.id, currentSessionId));

        // Extract memories asynchronously (don't await)
        extractAndStoreMemories(
          userId,
          `User: ${message}\nAssistant: ${fullResponse}`,
          "chat_session",
          currentSessionId,
        ).catch((err) =>
          console.error("[Chat] Memory extraction background error:", err),
        );

        // Signal completion
        res.write(
          `data: ${JSON.stringify({ type: "done", usage: usage?.totalTokens || 0 })}\n\n`,
        );
        res.end();
      },
    });

    // Handle client disconnect
    req.on("close", () => {
      // Client disconnected
    });
  } catch (error) {
    console.error("chat error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// ─── Pre-Decision Analysis ──────────────────────────────────────────────────

export const preDecisionAnalysis = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const {
      title,
      category,
      description,
      context,
      confidenceLevel,
      expectedOutcomes,
      alternativesConsidered,
    } = req.body;

    if (!title) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    // ── Assemble context using the pipeline ──
    const assembledContext = await assembleContext(
      userId,
      `${title}. ${description || ""}`,
      {
        category: category || "other",
        includeRAG: true,
        maxSimilarDecisions: 5,
      },
    );

    // ── Gather raw metrics for rule-based analysis ──
    const pastDecisions = await db
      .select()
      .from(decisions)
      .where(
        and(
          eq(decisions.userId, userId),
          eq(decisions.category, category || "other"),
          isNull(decisions.deletedAt),
        ),
      )
      .orderBy(desc(decisions.decisionDate))
      .limit(15);

    const categoryOutcomes = await db
      .select({
        satisfactionScore: outcomes.satisfactionScore,
        wouldDecideAgain: outcomes.wouldDecideAgain,
        lessonsLearned: outcomes.lessonsLearned,
        decisionTitle: decisions.title,
      })
      .from(outcomes)
      .innerJoin(decisions, eq(outcomes.decisionId, decisions.id))
      .where(
        and(
          eq(decisions.userId, userId),
          eq(decisions.category, category || "other"),
          isNull(decisions.deletedAt),
        ),
      )
      .orderBy(desc(outcomes.checkInDate));

    // ── Calculate metrics ──
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentDecisions = pastDecisions.filter(
      (d) => new Date(d.decisionDate) >= thirtyDaysAgo,
    );

    const avgSatisfaction =
      categoryOutcomes.length > 0
        ? categoryOutcomes.reduce((s, o) => s + o.satisfactionScore, 0) /
          categoryOutcomes.length
        : null;

    const regretCount = categoryOutcomes.filter(
      (o) => o.wouldDecideAgain === false,
    ).length;
    const regretRate =
      categoryOutcomes.length > 0
        ? Math.round((regretCount / categoryOutcomes.length) * 100)
        : 0;

    // ── Build risk/evidence analysis (rule-based, enhanced with context) ──
    const riskFactors: Array<{
      factor: string;
      severity: "high" | "medium" | "low";
      basedOn: string;
    }> = [];
    const supportingEvidence: Array<{ point: string; source: string }> = [];
    const suggestions: string[] = [];
    const blindSpots: string[] = [];

    if (recentDecisions.length >= 4) {
      riskFactors.push({
        factor: "High decision frequency this month",
        severity: "medium",
        basedOn: `${recentDecisions.length} ${category} decisions in 30 days.`,
      });
    }
    if (avgSatisfaction !== null && avgSatisfaction < 5) {
      riskFactors.push({
        factor: `Low satisfaction in ${category}`,
        severity: "high",
        basedOn: `Avg: ${avgSatisfaction.toFixed(1)}/10.`,
      });
    }
    if (regretRate > 40 && categoryOutcomes.length >= 2) {
      riskFactors.push({
        factor: `High regret rate`,
        severity: "high",
        basedOn: `${regretRate}% regret in past ${category} outcomes.`,
      });
    }
    if (confidenceLevel && confidenceLevel <= 3) {
      riskFactors.push({
        factor: "Low confidence",
        severity: "medium",
        basedOn: `Confidence: ${confidenceLevel}/10.`,
      });
      suggestions.push("Gather more information before deciding.");
    }
    if (!alternativesConsidered || alternativesConsidered.length === 0) {
      riskFactors.push({
        factor: "No alternatives explored",
        severity: "medium",
        basedOn: "No alternatives listed.",
      });
      suggestions.push("Consider at least 2-3 alternatives.");
    }

    if (avgSatisfaction !== null && avgSatisfaction >= 7) {
      supportingEvidence.push({
        point: `Strong ${category} track record`,
        source: `${avgSatisfaction.toFixed(1)}/10 avg satisfaction.`,
      });
    }
    if (alternativesConsidered && alternativesConsidered.length >= 2) {
      supportingEvidence.push({
        point: "Thorough analysis",
        source: `${alternativesConsidered.length} alternatives considered.`,
      });
    }
    if (confidenceLevel && confidenceLevel >= 7) {
      supportingEvidence.push({
        point: "High confidence",
        source: `${confidenceLevel}/10 confidence.`,
      });
    }
    if (context && context.length > 50) {
      supportingEvidence.push({
        point: "Well-articulated context",
        source: "Detailed context provided.",
      });
    }

    if (!context || context.length < 20)
      blindSpots.push("Limited context provided.");
    if (!expectedOutcomes || expectedOutcomes.length === 0)
      blindSpots.push("No expected outcomes defined.");
    if (pastDecisions.length === 0)
      blindSpots.push(`No prior ${category} decisions for comparison.`);

    if (suggestions.length === 0) {
      suggestions.push(
        "Set a check-in reminder to evaluate this decision's outcome.",
      );
      suggestions.push("Document your reasoning for future reflection.");
    }

    // Timing
    let timingAssessment = "No timing concerns.";
    if (recentDecisions.length >= 3) {
      timingAssessment = `${recentDecisions.length} ${category} decisions in 30 days. Consider pacing.`;
    } else if (pastDecisions.length > 0) {
      const days = Math.floor(
        (now.getTime() - new Date(pastDecisions[0]!.decisionDate).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      timingAssessment = `Last ${category} decision was ${days} days ago. ${days < 7 ? "Consider spacing." : "Good spacing."}`;
    }

    // Verdict
    const highRisks = riskFactors.filter((r) => r.severity === "high").length;
    const mediumRisks = riskFactors.filter(
      (r) => r.severity === "medium",
    ).length;

    let verdict: "proceed" | "caution" | "reconsider";
    let confidenceInVerdict: number;
    if (highRisks >= 2 || (highRisks >= 1 && mediumRisks >= 2)) {
      verdict = "reconsider";
      confidenceInVerdict = Math.min(9, 5 + highRisks + mediumRisks);
    } else if (highRisks >= 1 || mediumRisks >= 2) {
      verdict = "caution";
      confidenceInVerdict = Math.min(8, 4 + highRisks + mediumRisks);
    } else {
      verdict = "proceed";
      confidenceInVerdict = supportingEvidence.length >= 2 ? 8 : 6;
    }

    // Summary
    let summary = "";
    if (pastDecisions.length === 0) {
      summary = `First ${category} decision. ${riskFactors.length === 0 ? "Looks solid." : "Could use more thought."}`;
    } else {
      summary = `Based on ${pastDecisions.length} past ${category} decisions`;
      if (avgSatisfaction !== null)
        summary += ` (avg: ${avgSatisfaction.toFixed(1)}/10)`;
      summary +=
        riskFactors.length > 0
          ? `, ${riskFactors.length} risk factor(s) found.`
          : `, aligns with successful patterns.`;
    }

    // ── Try LLM-enhanced summary if API key available ──
    let aiEnhancedSummary: string | undefined;
    if (process.env.OPENAI_API_KEY) {
      try {
        const llmResult = await generateText({
          model: models.background,
          system:
            "You are a concise decision advisor. Given the analysis data and user context, write a 2-3 sentence personalized summary. Be specific, reference their history.",
          prompt: `Decision: "${title}" (${category})\nContext: ${assembledContext.fullPrompt}\nRisk factors: ${JSON.stringify(riskFactors)}\nSupporting evidence: ${JSON.stringify(supportingEvidence)}`,
          maxTokens: 200,
        });
        if (llmResult.text) aiEnhancedSummary = llmResult.text;
      } catch {
        // Use rule-based summary
      }
    }

    const analysis = {
      verdict,
      confidenceInVerdict,
      summary: aiEnhancedSummary || summary,
      riskFactors,
      supportingEvidence,
      suggestions,
      blindSpots,
      timingAssessment,
      historicalContext: {
        totalCategoryDecisions: pastDecisions.length,
        avgSatisfaction: avgSatisfaction
          ? parseFloat(avgSatisfaction.toFixed(1))
          : null,
        regretRate,
        recentDecisionCount: recentDecisions.length,
        overallAvgSatisfaction: null,
        pastDecisions: categoryOutcomes.slice(0, 5).map((o) => ({
          title: o.decisionTitle,
          satisfaction: o.satisfactionScore,
          wouldDecideAgain: o.wouldDecideAgain,
          lessons: o.lessonsLearned,
        })),
      },
    };

    // Log interaction
    await db.insert(aiInteractions).values({
      userId,
      interactionType: "analysis",
      userPrompt: `Pre-decision analysis for: ${title}`,
      aiResponse: JSON.stringify(analysis),
      responseMetadata: {
        model: "lifeos-pre-analysis-v2",
        tokensUsed: 0,
        processingTime: 0,
      },
    });

    res.json({ data: analysis });
  } catch (error) {
    console.error("preDecisionAnalysis error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ─── Analyze Decision (post-creation) ───────────────────────────────────────

export const analyzeDecision = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { decisionId, prompt } = req.body;

    const context = await assembleContext(
      userId,
      prompt || "Analyze this decision",
      {
        includeRAG: true,
      },
    );

    let analysis: any;

    if (process.env.OPENAI_API_KEY) {
      const result = await generateText({
        model: models.chat,
        system: `${SYSTEM_PROMPTS.advisor}\n\n${context.fullPrompt}`,
        prompt:
          prompt ||
          "Analyze this decision in detail. What are the key factors, risks, and recommendations?",
        maxTokens: 800,
      });
      analysis = { text: result.text, model: "gpt-4o" };
    } else {
      analysis = {
        text: "AI analysis requires an API key. Configure OPENAI_API_KEY to enable intelligent analysis.",
        model: "fallback",
      };
    }

    const interaction = await db
      .insert(aiInteractions)
      .values({
        userId,
        decisionId: decisionId || null,
        interactionType: "analysis",
        userPrompt: prompt || "Analyze this decision",
        aiResponse: JSON.stringify(analysis),
        responseMetadata: {
          model: analysis.model,
          tokensUsed: 0,
          processingTime: 0,
        },
      })
      .returning();

    res.json({ data: { analysis, interactionId: interaction[0]?.id } });
  } catch (error) {
    console.error("analyzeDecision error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ─── Compute Profile (trigger endpoint) ─────────────────────────────────────

export const triggerProfileComputation = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Run async — respond immediately
    computeUserProfile(userId).catch((err) =>
      console.error("[ProfileTrigger] Computation failed:", err),
    );

    res.json({
      data: { status: "computing", message: "Profile computation started." },
    });
  } catch (error) {
    console.error("triggerProfileComputation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ─── Get Chat Sessions ──────────────────────────────────────────────────────

export const getChatSessions = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const chatSessions = await db
      .select()
      .from(aiChatSessions)
      .where(eq(aiChatSessions.userId, userId))
      .orderBy(desc(aiChatSessions.lastMessageAt));

    res.json({ data: chatSessions });
  } catch (error) {
    console.error("getChatSessions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ─── Get Chat History ───────────────────────────────────────────────────────

export const getChatHistory = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const sessionId = req.params.id as string;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const sessionRecords = await db
      .select()
      .from(aiChatSessions)
      .where(
        and(
          eq(aiChatSessions.id, sessionId),
          eq(aiChatSessions.userId, userId),
        ),
      )
      .limit(1);

    if (sessionRecords.length === 0) {
      res.status(404).json({ error: "Chat session not found" });
      return;
    }

    const messages = await db
      .select()
      .from(aiChatMessages)
      .where(eq(aiChatMessages.sessionId, sessionId))
      .orderBy(aiChatMessages.createdAt);

    res.json({ data: { session: sessionRecords[0], messages } });
  } catch (error) {
    console.error("getChatHistory error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ─── Generate Embedding (trigger) ───────────────────────────────────────────

export const triggerEmbedding = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { decisionId } = req.body;
    if (!decisionId) {
      res.status(400).json({ error: "decisionId required" });
      return;
    }

    generateDecisionEmbedding(decisionId).catch((err) =>
      console.error("[EmbeddingTrigger] Failed:", err),
    );

    res.json({ data: { status: "generating" } });
  } catch (error) {
    console.error("triggerEmbedding error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ─── Get Patterns ───────────────────────────────────────────────────────────

export const getPatterns = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const patterns = await db
      .select()
      .from(decisionPatterns)
      .where(eq(decisionPatterns.userId, userId))
      .orderBy(desc(decisionPatterns.strength));

    res.json({ data: patterns });
  } catch (error) {
    console.error("getPatterns error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ─── Trigger Pattern Detection ──────────────────────────────────────────────

export const triggerPatternDetection = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    detectPatterns(userId).catch((err) =>
      console.error("[PatternTrigger] Failed:", err),
    );

    res.json({
      data: { status: "detecting", message: "Pattern detection started." },
    });
  } catch (error) {
    console.error("triggerPatternDetection error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateFallbackResponse(message: string, context: string): string {
  return (
    "I'd love to help you think through this. Based on your decision history, " +
    "here are some things to consider:\n\n" +
    "1. Review your past outcomes in this category for patterns\n" +
    "2. Consider if you've explored enough alternatives\n" +
    "3. Check your confidence level against past accuracy\n\n" +
    "For personalized AI-powered analysis, configure your OpenAI API key in the backend settings."
  );
}
