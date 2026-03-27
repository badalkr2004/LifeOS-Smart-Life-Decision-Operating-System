import { type Response } from "express";
import { type AuthRequest } from "../middleware/auth.middleware";
import { db } from "../db/connection";
import { outcomes, outcomeReminders, decisions } from "../db/schema";
import { eq, and } from "drizzle-orm";

// ─── List Outcomes for a Decision ───────────────────────────────────────────
export const getDecisionOutcomes = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const decisionId = req.query.decision_id as string;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        if (!decisionId) {
            res.status(400).json({ error: "Missing required query parameter: decision_id" });
            return;
        }

        // Verify the decision belongs to this user
        const decisionRecords = await db
            .select()
            .from(decisions)
            .where(and(eq(decisions.id, decisionId), eq(decisions.userId, userId)))
            .limit(1);

        if (decisionRecords.length === 0) {
            res.status(404).json({ error: "Decision not found" });
            return;
        }

        const records = await db.select().from(outcomes).where(eq(outcomes.decisionId, decisionId));
        res.json({ data: records });
    } catch (error) {
        console.error("getDecisionOutcomes error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Get Single Outcome ─────────────────────────────────────────────────────
export const getOutcome = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const id = req.params.id as string;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const records = await db.select().from(outcomes).where(eq(outcomes.id, id)).limit(1);
        const outcome = records[0];

        if (!outcome) {
            res.status(404).json({ error: "Outcome not found" });
            return;
        }

        // Verify ownership through decision
        const decisionRecords = await db
            .select()
            .from(decisions)
            .where(and(eq(decisions.id, outcome.decisionId), eq(decisions.userId, userId)))
            .limit(1);

        if (decisionRecords.length === 0) {
            res.status(404).json({ error: "Outcome not found" });
            return;
        }

        res.json({ data: outcome });
    } catch (error) {
        console.error("getOutcome error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Create Outcome ─────────────────────────────────────────────────────────
export const createOutcome = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const {
            decisionId,
            satisfactionScore,
            actualResults,
            metrics,
            reflections,
            surprises,
            lessonsLearned,
            unintendedConsequences,
            contextChanges,
            wouldDecideAgain,
            moodAtCheckIn,
            stressLevel,
        } = req.body;

        if (!decisionId || satisfactionScore === undefined || !actualResults) {
            res.status(400).json({ error: "decisionId, satisfactionScore, and actualResults are required" });
            return;
        }

        // Verify ownership
        const decisionRecords = await db
            .select()
            .from(decisions)
            .where(and(eq(decisions.id, decisionId), eq(decisions.userId, userId)))
            .limit(1);

        if (decisionRecords.length === 0) {
            res.status(404).json({ error: "Decision not found" });
            return;
        }

        const decision = decisionRecords[0]!;
        const timeElapsedDays = Math.floor(
            (Date.now() - new Date(decision.decisionDate).getTime()) / (1000 * 60 * 60 * 24),
        );

        const newOutcome = await db
            .insert(outcomes)
            .values({
                decisionId,
                satisfactionScore,
                actualResults,
                metrics: metrics || [],
                reflections,
                surprises,
                lessonsLearned,
                unintendedConsequences,
                contextChanges,
                wouldDecideAgain,
                moodAtCheckIn,
                stressLevel,
                timeElapsedDays,
            })
            .returning();

        res.status(201).json({ data: newOutcome[0] });
    } catch (error) {
        console.error("createOutcome error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Update Outcome ─────────────────────────────────────────────────────────
export const updateOutcome = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const id = req.params.id as string;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        // Get outcome and verify ownership
        const existingOutcomes = await db.select().from(outcomes).where(eq(outcomes.id, id)).limit(1);
        const existing = existingOutcomes[0];
        if (!existing) {
            res.status(404).json({ error: "Outcome not found" });
            return;
        }

        const decisionRecords = await db
            .select()
            .from(decisions)
            .where(and(eq(decisions.id, existing.decisionId), eq(decisions.userId, userId)))
            .limit(1);

        if (decisionRecords.length === 0) {
            res.status(404).json({ error: "Outcome not found" });
            return;
        }

        const body = req.body;
        const updateData: Record<string, any> = { updatedAt: new Date() };
        const allowedFields = [
            "satisfactionScore", "actualResults", "metrics", "reflections",
            "surprises", "lessonsLearned", "unintendedConsequences",
            "contextChanges", "wouldDecideAgain", "moodAtCheckIn", "stressLevel",
        ];

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        }

        const updated = await db
            .update(outcomes)
            .set(updateData)
            .where(eq(outcomes.id, id))
            .returning();

        res.json({ data: updated[0] });
    } catch (error) {
        console.error("updateOutcome error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Delete Outcome ─────────────────────────────────────────────────────────
export const deleteOutcome = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const id = req.params.id as string;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        // Get outcome and verify ownership
        const existingOutcomes = await db.select().from(outcomes).where(eq(outcomes.id, id)).limit(1);
        const existing = existingOutcomes[0];
        if (!existing) {
            res.status(404).json({ error: "Outcome not found" });
            return;
        }

        const decisionRecords = await db
            .select()
            .from(decisions)
            .where(and(eq(decisions.id, existing.decisionId), eq(decisions.userId, userId)))
            .limit(1);

        if (decisionRecords.length === 0) {
            res.status(404).json({ error: "Outcome not found" });
            return;
        }

        await db.delete(outcomes).where(eq(outcomes.id, id));
        res.status(204).send();
    } catch (error) {
        console.error("deleteOutcome error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Get Pending Checkins ───────────────────────────────────────────────────
export const getPendingCheckins = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const pending = await db
            .select()
            .from(outcomeReminders)
            .where(and(eq(outcomeReminders.userId, userId), eq(outcomeReminders.status, "pending")));

        res.json({ data: pending });
    } catch (error) {
        console.error("getPendingCheckins error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Schedule Checkin ───────────────────────────────────────────────────────
export const scheduleCheckin = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const { decisionId, reminderType, scheduledDate, customMessage } = req.body;

        if (!decisionId || !scheduledDate) {
            res.status(400).json({ error: "decisionId and scheduledDate are required" });
            return;
        }

        // Verify ownership
        const decisionRecords = await db
            .select()
            .from(decisions)
            .where(and(eq(decisions.id, decisionId), eq(decisions.userId, userId)))
            .limit(1);

        if (decisionRecords.length === 0) {
            res.status(404).json({ error: "Decision not found" });
            return;
        }

        const newReminder = await db
            .insert(outcomeReminders)
            .values({
                userId,
                decisionId,
                reminderType: reminderType || "custom",
                scheduledDate: new Date(scheduledDate),
                status: "pending",
                customMessage,
            })
            .returning();

        res.status(201).json({ data: newReminder[0] });
    } catch (error) {
        console.error("scheduleCheckin error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Complete Checkin ───────────────────────────────────────────────────────
export const completeCheckin = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const id = req.params.id as string;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const updated = await db
            .update(outcomeReminders)
            .set({
                status: "completed",
                completedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(and(eq(outcomeReminders.id, id), eq(outcomeReminders.userId, userId)))
            .returning();

        if (updated.length === 0) {
            res.status(404).json({ error: "Reminder not found" });
            return;
        }

        res.json({ data: updated[0] });
    } catch (error) {
        console.error("completeCheckin error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Skip Checkin ───────────────────────────────────────────────────────────
export const skipCheckin = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const id = req.params.id as string;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const updated = await db
            .update(outcomeReminders)
            .set({
                status: "skipped",
                skippedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(and(eq(outcomeReminders.id, id), eq(outcomeReminders.userId, userId)))
            .returning();

        if (updated.length === 0) {
            res.status(404).json({ error: "Reminder not found" });
            return;
        }

        res.json({ data: updated[0] });
    } catch (error) {
        console.error("skipCheckin error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
