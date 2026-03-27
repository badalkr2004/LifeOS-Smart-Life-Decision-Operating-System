import { type Response } from "express";
import { type AuthRequest } from "../middleware/auth.middleware";
import { db } from "../db/connection";
import { aiInteractions, aiChatSessions, aiChatMessages } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";

// ─── Analyze Decision ───────────────────────────────────────────────────────
export const analyzeDecision = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const { decisionId, prompt } = req.body;

        // In production, this would call an AI service. For now, we store the interaction
        // and return a structured analysis placeholder.
        const analysis = {
            summary: "Based on your decision context, here are the key factors to consider.",
            strengths: [
                "Clear objective defined",
                "Multiple alternatives considered",
            ],
            risks: [
                "Timeline may be ambitious",
                "External dependencies not fully mapped",
            ],
            suggestions: [
                "Consider breaking this into smaller decisions",
                "Set measurable milestones for tracking progress",
                "Identify a fallback plan if key assumptions fail",
            ],
            confidenceAssessment: "Your confidence level appears reasonable given the information provided.",
        };

        // Log the interaction
        const interaction = await db
            .insert(aiInteractions)
            .values({
                userId,
                decisionId: decisionId || null,
                interactionType: "analysis",
                userPrompt: prompt || "Analyze this decision",
                aiResponse: JSON.stringify(analysis),
                responseMetadata: {
                    model: "lifeos-analysis-v1",
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

// ─── Recommend Approach ─────────────────────────────────────────────────────
export const recommendApproach = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const { decisionId, prompt, context } = req.body;

        const recommendation = {
            recommendedApproach: "Based on your context, a structured decision framework is recommended.",
            framework: "Pros/Cons Analysis with Weighted Criteria",
            steps: [
                "List all options clearly",
                "Define evaluation criteria and assign weights",
                "Score each option against criteria",
                "Consider emotional and practical factors",
                "Make your decision and document reasoning",
            ],
            timelineAdvice: "Allow adequate time for reflection before finalizing.",
        };

        const interaction = await db
            .insert(aiInteractions)
            .values({
                userId,
                decisionId: decisionId || null,
                interactionType: "recommendation",
                userPrompt: prompt || "Recommend an approach",
                context: context || {},
                aiResponse: JSON.stringify(recommendation),
                responseMetadata: {
                    model: "lifeos-recommendation-v1",
                    tokensUsed: 0,
                    processingTime: 0,
                },
            })
            .returning();

        res.json({ data: { recommendation, interactionId: interaction[0]?.id } });
    } catch (error) {
        console.error("recommendApproach error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Similar Decisions ──────────────────────────────────────────────────────
export const similarDecisions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const decisionId = req.query.decision_id as string;

        // Log interaction
        await db.insert(aiInteractions).values({
            userId,
            decisionId: decisionId || null,
            interactionType: "similar_search",
            userPrompt: `Find decisions similar to ${decisionId}`,
            aiResponse: JSON.stringify({ similar: [] }),
            responseMetadata: {
                model: "lifeos-similarity-v1",
                tokensUsed: 0,
                processingTime: 0,
            },
        });

        // In production, this would use vector similarity search on the embedding column.
        // For now, return an empty result set.
        res.json({
            data: {
                similar: [],
                message: "Vector similarity search requires embeddings to be generated for decisions.",
            },
        });
    } catch (error) {
        console.error("similarDecisions error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Chat ───────────────────────────────────────────────────────────────────
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

        // Generate AI response (placeholder — in production this calls an LLM)
        const aiReply =
            "Thank you for sharing. I can help you think through this decision. " +
            "Could you tell me more about the specific factors you're weighing? " +
            "Understanding your priorities will help me provide better guidance.";

        // Store AI response
        await db.insert(aiChatMessages).values({
            sessionId: currentSessionId,
            role: "assistant",
            content: aiReply,
            metadata: {
                model: "lifeos-chat-v1",
                tokensUsed: 0,
                processingTime: 0,
            },
        });

        // Update session stats
        await db
            .update(aiChatSessions)
            .set({
                messageCount: (await db
                    .select({ count: eq(aiChatMessages.sessionId, currentSessionId) })
                    .from(aiChatMessages)
                    .where(eq(aiChatMessages.sessionId, currentSessionId))
                ).length,
                lastMessageAt: new Date(),
            })
            .where(eq(aiChatSessions.id, currentSessionId));

        res.json({
            data: {
                sessionId: currentSessionId,
                reply: aiReply,
            },
        });
    } catch (error) {
        console.error("chat error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Get Chat Sessions ──────────────────────────────────────────────────────
export const getChatSessions = async (req: AuthRequest, res: Response): Promise<void> => {
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
export const getChatHistory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const sessionId = req.params.id as string;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        // Verify session belongs to user
        const sessionRecords = await db
            .select()
            .from(aiChatSessions)
            .where(and(eq(aiChatSessions.id, sessionId), eq(aiChatSessions.userId, userId)))
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

        res.json({
            data: {
                session: sessionRecords[0],
                messages,
            },
        });
    } catch (error) {
        console.error("getChatHistory error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
