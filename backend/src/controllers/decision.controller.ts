import { type Response } from "express";
import { type AuthRequest } from "../middleware/auth.middleware";
import { db } from "../db/connection";
import { decisions } from "../db/schema";
import { eq, and, sql, desc, asc, isNull } from "drizzle-orm";

// ─── List Decisions (with filtering & pagination) ───────────────────────────
export const listDecisions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
        const offset = (page - 1) * limit;
        const category = req.query.category as string | undefined;
        const status = req.query.status as string | undefined;
        const sortBy = (req.query.sortBy as string) || "decisionDate";
        const sortOrder = (req.query.sortOrder as string) === "asc" ? "asc" : "desc";

        // Build conditions
        const conditions: any[] = [
            eq(decisions.userId, userId),
            isNull(decisions.deletedAt),
        ];

        if (category) {
            conditions.push(eq(decisions.category, category as any));
        }
        if (status) {
            conditions.push(eq(decisions.status, status as any));
        }

        const whereClause = and(...conditions);

        // Get total count
        const countResult = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(decisions)
            .where(whereClause);
        const total = countResult[0]?.count ?? 0;

        // Get paginated results
        const sortColumn = sortBy === "createdAt" ? decisions.createdAt
            : sortBy === "title" ? decisions.title
            : decisions.decisionDate;

        const allDecisions = await db
            .select()
            .from(decisions)
            .where(whereClause)
            .orderBy(sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn))
            .limit(limit)
            .offset(offset);

        res.json({
            data: allDecisions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("listDecisions error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Get Single Decision ────────────────────────────────────────────────────
export const getDecision = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const id = req.params.id as string;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const records = await db
            .select()
            .from(decisions)
            .where(and(eq(decisions.id, id), eq(decisions.userId, userId), isNull(decisions.deletedAt)))
            .limit(1);

        const decision = records[0];
        if (!decision) {
            res.status(404).json({ error: "Decision not found" });
            return;
        }

        res.json({ data: decision });
    } catch (error) {
        console.error("getDecision error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Create Decision ────────────────────────────────────────────────────────
export const createDecision = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const body = req.body;

        if (!body.title) {
            res.status(400).json({ error: "Title is required" });
            return;
        }

        const newDecision = await db
            .insert(decisions)
            .values({
                userId,
                title: body.title,
                category: body.category || "other",
                status: body.status || "active",
                description: body.description,
                context: body.context,
                reasoningProcess: body.reasoningProcess,
                alternativesConsidered: body.alternativesConsidered,
                expectedOutcomes: body.expectedOutcomes || [],
                confidenceLevel: body.confidenceLevel || 5,
                frameworkUsed: body.frameworkUsed,
                tags: body.tags,
                isPrivate: body.isPrivate ?? true,
                subcategory: body.subcategory,
                expectedOutcomeDate: body.expectedOutcomeDate
                    ? new Date(body.expectedOutcomeDate)
                    : undefined,
                parentDecisionId: body.parentDecisionId,
            })
            .returning();

        res.status(201).json({ data: newDecision[0] });
    } catch (error) {
        console.error("createDecision error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Update Decision ────────────────────────────────────────────────────────
export const updateDecision = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const id = req.params.id as string;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const body = req.body;

        // Only allow specific fields to be updated
        const updateData: Record<string, any> = { updatedAt: new Date() };
        const allowedFields = [
            "title", "description", "category", "subcategory", "status",
            "context", "reasoningProcess", "alternativesConsidered",
            "expectedOutcomes", "confidenceLevel", "frameworkUsed",
            "tags", "isPrivate", "expectedOutcomeDate",
        ];

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                if (field === "expectedOutcomeDate") {
                    updateData[field] = new Date(body[field]);
                } else {
                    updateData[field] = body[field];
                }
            }
        }

        const records = await db
            .update(decisions)
            .set(updateData)
            .where(and(eq(decisions.id, id), eq(decisions.userId, userId), isNull(decisions.deletedAt)))
            .returning();

        const decision = records[0];
        if (!decision) {
            res.status(404).json({ error: "Decision not found" });
            return;
        }

        res.json({ data: decision });
    } catch (error) {
        console.error("updateDecision error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Delete Decision (Soft Delete) ──────────────────────────────────────────
export const deleteDecision = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const id = req.params.id as string;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const records = await db
            .update(decisions)
            .set({
                status: "deleted",
                deletedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(and(eq(decisions.id, id), eq(decisions.userId, userId), isNull(decisions.deletedAt)))
            .returning();

        if (records.length === 0) {
            res.status(404).json({ error: "Decision not found" });
            return;
        }

        res.status(204).send();
    } catch (error) {
        console.error("deleteDecision error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
