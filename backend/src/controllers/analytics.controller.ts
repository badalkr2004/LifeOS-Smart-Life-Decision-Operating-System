import { type Response } from "express";
import { type AuthRequest } from "../middleware/auth.middleware";
import { db } from "../db/connection";
import { decisions, outcomes, outcomeReminders, decisionPatterns, userInsights } from "../db/schema";
import { eq, and, sql, desc, count } from "drizzle-orm";

// ─── Get Summary ────────────────────────────────────────────────────────────
export const getSummary = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        // Total decisions
        const totalDecisionsResult = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(decisions)
            .where(eq(decisions.userId, userId));

        // Average confidence
        const avgConfidenceResult = await db
            .select({ avg: sql<number>`coalesce(avg(${decisions.confidenceLevel}), 0)::float` })
            .from(decisions)
            .where(eq(decisions.userId, userId));

        // Pending check-ins
        const pendingRemindersResult = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(outcomeReminders)
            .where(and(eq(outcomeReminders.userId, userId), eq(outcomeReminders.status, "pending")));

        // Top categories
        const categoryBreakdown = await db
            .select({
                category: decisions.category,
                count: sql<number>`count(*)::int`,
            })
            .from(decisions)
            .where(eq(decisions.userId, userId))
            .groupBy(decisions.category)
            .orderBy(desc(sql`count(*)`))
            .limit(5);

        // Average satisfaction from outcomes
        const avgSatisfactionResult = await db
            .select({
                avg: sql<number>`coalesce(avg(${outcomes.satisfactionScore}), 0)::float`,
            })
            .from(outcomes)
            .innerJoin(decisions, eq(outcomes.decisionId, decisions.id))
            .where(eq(decisions.userId, userId));

        // Total outcomes recorded
        const totalOutcomesResult = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(outcomes)
            .innerJoin(decisions, eq(outcomes.decisionId, decisions.id))
            .where(eq(decisions.userId, userId));

        const summary = {
            totalDecisions: totalDecisionsResult[0]?.count ?? 0,
            averageConfidence: Math.round((avgConfidenceResult[0]?.avg ?? 0) * 10) / 10,
            averageSatisfaction: Math.round((avgSatisfactionResult[0]?.avg ?? 0) * 10) / 10,
            pendingCheckins: pendingRemindersResult[0]?.count ?? 0,
            totalOutcomes: totalOutcomesResult[0]?.count ?? 0,
            topCategories: categoryBreakdown,
        };

        res.json({ data: summary });
    } catch (error) {
        console.error("getSummary error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Get Patterns ───────────────────────────────────────────────────────────
export const getPatterns = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const category = req.query.category as string | undefined;
        const conditions: any[] = [eq(decisionPatterns.userId, userId)];

        if (category) {
            conditions.push(eq(decisionPatterns.category, category as any));
        }

        const patterns = await db
            .select()
            .from(decisionPatterns)
            .where(and(...conditions))
            .orderBy(desc(decisionPatterns.strength));

        res.json({ data: patterns });
    } catch (error) {
        console.error("getPatterns error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Get Decision Quality Over Time ─────────────────────────────────────────
export const getDecisionQuality = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        // Get satisfaction scores over time (grouped by month)
        const timeline = await db
            .select({
                month: sql<string>`to_char(${outcomes.checkInDate}, 'YYYY-MM')`,
                avgSatisfaction: sql<number>`avg(${outcomes.satisfactionScore})::float`,
                outcomeCount: sql<number>`count(*)::int`,
            })
            .from(outcomes)
            .innerJoin(decisions, eq(outcomes.decisionId, decisions.id))
            .where(eq(decisions.userId, userId))
            .groupBy(sql`to_char(${outcomes.checkInDate}, 'YYYY-MM')`)
            .orderBy(sql`to_char(${outcomes.checkInDate}, 'YYYY-MM')`);

        res.json({ data: { timeline } });
    } catch (error) {
        console.error("getDecisionQuality error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Get Insights ───────────────────────────────────────────────────────────
export const getInsights = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const dismissed = req.query.dismissed === "true";

        const conditions: any[] = [eq(userInsights.userId, userId)];
        if (!dismissed) {
            conditions.push(eq(userInsights.dismissed, false));
        }

        const insights = await db
            .select()
            .from(userInsights)
            .where(and(...conditions))
            .orderBy(desc(userInsights.createdAt));

        res.json({ data: insights });
    } catch (error) {
        console.error("getInsights error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Dismiss Insight ────────────────────────────────────────────────────────
export const dismissInsight = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const id = req.params.id as string;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const updated = await db
            .update(userInsights)
            .set({ dismissed: true, dismissedAt: new Date() })
            .where(and(eq(userInsights.id, id), eq(userInsights.userId, userId)))
            .returning();

        if (updated.length === 0) {
            res.status(404).json({ error: "Insight not found" });
            return;
        }

        res.json({ data: updated[0] });
    } catch (error) {
        console.error("dismissInsight error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
