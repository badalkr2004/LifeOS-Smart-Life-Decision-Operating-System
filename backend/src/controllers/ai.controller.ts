import { type Response } from "express";
import { type AuthRequest } from "../middleware/auth.middleware";
import { db } from "../db/connection";
import { aiInteractions, aiChatSessions, aiChatMessages, decisions, outcomes, decisionPatterns } from "../db/schema";
import { eq, and, desc, isNull, sql } from "drizzle-orm";

// ─── Pre-Decision Analysis (Context-Aware) ──────────────────────────────────
export const preDecisionAnalysis = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const { title, category, description, context, confidenceLevel, expectedOutcomes, alternativesConsidered } = req.body;

        if (!title) {
            res.status(400).json({ error: "Title is required" });
            return;
        }

        // ── 1. Get past decisions in the SAME category ──
        const pastDecisions = await db
            .select()
            .from(decisions)
            .where(and(
                eq(decisions.userId, userId),
                eq(decisions.category, category || "other"),
                isNull(decisions.deletedAt),
            ))
            .orderBy(desc(decisions.decisionDate))
            .limit(15);

        // ── 2. Get outcomes for ALL user decisions (for cross-category patterns) ──
        const allOutcomes = await db
            .select({
                satisfactionScore: outcomes.satisfactionScore,
                wouldDecideAgain: outcomes.wouldDecideAgain,
                lessonsLearned: outcomes.lessonsLearned,
                actualResults: outcomes.actualResults,
                surprises: outcomes.surprises,
                decisionId: outcomes.decisionId,
                checkInDate: outcomes.checkInDate,
            })
            .from(outcomes)
            .innerJoin(decisions, eq(outcomes.decisionId, decisions.id))
            .where(and(
                eq(decisions.userId, userId),
                isNull(decisions.deletedAt),
            ))
            .orderBy(desc(outcomes.checkInDate));

        // ── 3. Get category-specific outcomes ──
        const categoryOutcomes = await db
            .select({
                satisfactionScore: outcomes.satisfactionScore,
                wouldDecideAgain: outcomes.wouldDecideAgain,
                lessonsLearned: outcomes.lessonsLearned,
                actualResults: outcomes.actualResults,
                decisionTitle: decisions.title,
                decisionId: outcomes.decisionId,
            })
            .from(outcomes)
            .innerJoin(decisions, eq(outcomes.decisionId, decisions.id))
            .where(and(
                eq(decisions.userId, userId),
                eq(decisions.category, category || "other"),
                isNull(decisions.deletedAt),
            ))
            .orderBy(desc(outcomes.checkInDate));

        // ── 4. Get detected patterns for this category ──
        const patterns = await db
            .select()
            .from(decisionPatterns)
            .where(and(
                eq(decisionPatterns.userId, userId),
                eq(decisionPatterns.category, category || "other"),
            ));

        // ── 5. Calculate derived metrics ──
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const recentDecisions = pastDecisions.filter(
            (d) => new Date(d.decisionDate) >= thirtyDaysAgo
        );

        const avgSatisfaction = categoryOutcomes.length > 0
            ? categoryOutcomes.reduce((sum, o) => sum + o.satisfactionScore, 0) / categoryOutcomes.length
            : null;

        const regretCount = categoryOutcomes.filter((o) => o.wouldDecideAgain === false).length;
        const regretRate = categoryOutcomes.length > 0
            ? Math.round((regretCount / categoryOutcomes.length) * 100)
            : 0;

        const overallAvgSatisfaction = allOutcomes.length > 0
            ? allOutcomes.reduce((sum, o) => sum + o.satisfactionScore, 0) / allOutcomes.length
            : null;

        // ── 6. Build intelligent analysis (rule-based — LLM-ready) ──
        const riskFactors: Array<{ factor: string; severity: "high" | "medium" | "low"; basedOn: string }> = [];
        const supportingEvidence: Array<{ point: string; source: string }> = [];
        const suggestions: string[] = [];
        const blindSpots: string[] = [];

        // Risk: High decision frequency
        if (recentDecisions.length >= 4) {
            riskFactors.push({
                factor: "High decision frequency this month",
                severity: "medium",
                basedOn: `You've made ${recentDecisions.length} ${category} decisions in the last 30 days — more than usual.`,
            });
            suggestions.push("Consider spacing out major decisions to avoid decision fatigue.");
        }

        // Risk: Low satisfaction history
        if (avgSatisfaction !== null && avgSatisfaction < 5) {
            riskFactors.push({
                factor: `Low average satisfaction in ${category} decisions`,
                severity: "high",
                basedOn: `Your average satisfaction for ${category} decisions is ${avgSatisfaction.toFixed(1)}/10.`,
            });
            suggestions.push(`Reflect on why past ${category} decisions had low satisfaction before proceeding.`);
        }

        // Risk: High regret rate
        if (regretRate > 40 && categoryOutcomes.length >= 2) {
            riskFactors.push({
                factor: `High regret rate in ${category} category`,
                severity: "high",
                basedOn: `${regretRate}% of your past ${category} outcomes led to regret.`,
            });
        }

        // Risk: Low confidence
        if (confidenceLevel && confidenceLevel <= 3) {
            riskFactors.push({
                factor: "Very low confidence level",
                severity: "medium",
                basedOn: `You rated your confidence at ${confidenceLevel}/10 — consider gathering more information.`,
            });
            suggestions.push("Gather more information or consult someone with experience before deciding.");
        }

        // Risk: No alternatives considered
        if (!alternativesConsidered || alternativesConsidered.length === 0) {
            riskFactors.push({
                factor: "No alternatives explored",
                severity: "medium",
                basedOn: "Decisions without alternatives tend to have lower satisfaction in your history.",
            });
            suggestions.push("Brainstorm at least 2-3 alternatives before committing.");
        }

        // Positive: Good track record
        if (avgSatisfaction !== null && avgSatisfaction >= 7) {
            supportingEvidence.push({
                point: `Strong track record in ${category} decisions`,
                source: `Average satisfaction of ${avgSatisfaction.toFixed(1)}/10 across ${categoryOutcomes.length} outcomes.`,
            });
        }

        // Positive: Alternatives were considered
        if (alternativesConsidered && alternativesConsidered.length >= 2) {
            supportingEvidence.push({
                point: "Multiple alternatives considered",
                source: `${alternativesConsidered.length} alternatives were evaluated — thorough analysis.`,
            });
        }

        // Positive: High confidence
        if (confidenceLevel && confidenceLevel >= 7) {
            supportingEvidence.push({
                point: "High confidence level",
                source: `Confidence of ${confidenceLevel}/10 suggests strong conviction.`,
            });
        }

        // Positive: Clear context provided
        if (context && context.length > 50) {
            supportingEvidence.push({
                point: "Well-articulated context",
                source: "Detailed context reduces blind spots and improves decision quality.",
            });
        }

        // Blind spots
        if (!context || context.length < 20) {
            blindSpots.push("Limited context provided — important factors may be missing from your analysis.");
        }
        if (!expectedOutcomes || expectedOutcomes.length === 0) {
            blindSpots.push("No expected outcomes defined — it will be hard to measure success later.");
        }
        if (pastDecisions.length === 0) {
            blindSpots.push(`No prior ${category} decisions found — no historical basis for comparison.`);
        }

        // Pattern-based insights
        patterns.forEach((p) => {
            const pattern = p.pattern as any;
            if (pattern && pattern.condition && pattern.outcome) {
                riskFactors.push({
                    factor: `Detected pattern: "${pattern.condition}"`,
                    severity: pattern.confidence > 70 ? "high" : "medium",
                    basedOn: `This pattern led to "${pattern.outcome}" in ${pattern.frequency} past decisions.`,
                });
            }
        });

        // Timing assessment
        let timingAssessment = "No timing concerns detected.";
        if (recentDecisions.length >= 3) {
            timingAssessment = `You've been making ${category} decisions frequently (${recentDecisions.length} in 30 days). Consider if this pace is sustainable.`;
        } else if (pastDecisions.length > 0) {
            const lastDecision = pastDecisions[0];
            const daysSinceLast = Math.floor((now.getTime() - new Date(lastDecision!.decisionDate).getTime()) / (1000 * 60 * 60 * 24));
            timingAssessment = `Your last ${category} decision was ${daysSinceLast} days ago. ${daysSinceLast < 7 ? "Consider spacing decisions out for better reflection." : "Good spacing between decisions."}`;
        }

        // Default suggestions
        if (suggestions.length === 0) {
            suggestions.push("Set a check-in reminder to evaluate this decision's outcome.");
            suggestions.push("Document your reasoning — it helps with future reflection.");
        }

        // ── 7. Determine verdict ──
        const highRisks = riskFactors.filter((r) => r.severity === "high").length;
        const mediumRisks = riskFactors.filter((r) => r.severity === "medium").length;

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

        // Build summary
        let summary = "";
        if (pastDecisions.length === 0) {
            summary = `This is your first ${category} decision in LifeOS. No historical data to compare against, but your decision structure looks ${riskFactors.length === 0 ? "solid" : "like it could use more thought"}.`;
        } else {
            summary = `Based on your ${pastDecisions.length} past ${category} decision${pastDecisions.length > 1 ? "s" : ""}`;
            if (avgSatisfaction !== null) {
                summary += ` (avg satisfaction: ${avgSatisfaction.toFixed(1)}/10)`;
            }
            if (riskFactors.length > 0) {
                summary += `, there ${riskFactors.length === 1 ? "is 1 risk factor" : `are ${riskFactors.length} risk factors`} to consider.`;
            } else {
                summary += `, this decision aligns well with your successful patterns.`;
            }
        }

        // Past decisions context (for display)
        const pastDecisionsSummary = categoryOutcomes.slice(0, 5).map((o) => ({
            title: o.decisionTitle,
            satisfaction: o.satisfactionScore,
            wouldDecideAgain: o.wouldDecideAgain,
            lessons: o.lessonsLearned,
        }));

        const analysis = {
            verdict,
            confidenceInVerdict,
            summary,
            riskFactors,
            supportingEvidence,
            suggestions,
            blindSpots,
            timingAssessment,
            historicalContext: {
                totalCategoryDecisions: pastDecisions.length,
                avgSatisfaction: avgSatisfaction ? parseFloat(avgSatisfaction.toFixed(1)) : null,
                regretRate,
                recentDecisionCount: recentDecisions.length,
                overallAvgSatisfaction: overallAvgSatisfaction ? parseFloat(overallAvgSatisfaction.toFixed(1)) : null,
                pastDecisions: pastDecisionsSummary,
            },
        };

        // Log the interaction
        await db.insert(aiInteractions).values({
            userId,
            interactionType: "analysis",
            userPrompt: `Pre-decision analysis for: ${title}`,
            context: { relatedDecisions: pastDecisions.map((d) => d.id) },
            aiResponse: JSON.stringify(analysis),
            responseMetadata: {
                model: "lifeos-pre-analysis-v1",
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
