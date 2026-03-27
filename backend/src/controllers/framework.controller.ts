import { type Response } from "express";
import { type AuthRequest } from "../middleware/auth.middleware";
import { db } from "../db/connection";
import { decisionFrameworks } from "../db/schema";
import { eq, and, or, isNull, desc } from "drizzle-orm";

// ─── List Frameworks ────────────────────────────────────────────────────────
export const listFrameworks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const category = req.query.category as string | undefined;

        // User can see: their own frameworks + public frameworks + system frameworks
        const conditions: any[] = [
            or(
                eq(decisionFrameworks.userId, userId),
                eq(decisionFrameworks.isPublic, true),
                eq(decisionFrameworks.isSystemFramework, true),
            ),
        ];

        if (category) {
            conditions.push(eq(decisionFrameworks.category, category as any));
        }

        const frameworks = await db
            .select()
            .from(decisionFrameworks)
            .where(and(...conditions))
            .orderBy(desc(decisionFrameworks.createdAt));

        res.json({ data: frameworks });
    } catch (error) {
        console.error("listFrameworks error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Get Framework ──────────────────────────────────────────────────────────
export const getFramework = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const id = req.params.id as string;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const records = await db
            .select()
            .from(decisionFrameworks)
            .where(eq(decisionFrameworks.id, id))
            .limit(1);

        const framework = records[0];
        if (!framework) {
            res.status(404).json({ error: "Framework not found" });
            return;
        }

        // Check visibility: own, public, or system framework
        if (
            framework.userId !== userId &&
            !framework.isPublic &&
            !framework.isSystemFramework
        ) {
            res.status(404).json({ error: "Framework not found" });
            return;
        }

        res.json({ data: framework });
    } catch (error) {
        console.error("getFramework error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Create Framework ───────────────────────────────────────────────────────
export const createFramework = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const { name, description, category, framework, isPublic } = req.body;

        if (!name || !framework) {
            res.status(400).json({ error: "Name and framework are required" });
            return;
        }

        const newFramework = await db
            .insert(decisionFrameworks)
            .values({
                userId,
                name,
                description,
                category,
                framework,
                isPublic: isPublic || false,
                isSystemFramework: false,
            })
            .returning();

        res.status(201).json({ data: newFramework[0] });
    } catch (error) {
        console.error("createFramework error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Update Framework ───────────────────────────────────────────────────────
export const updateFramework = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const id = req.params.id as string;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const body = req.body;
        const updateData: Record<string, any> = { updatedAt: new Date() };
        const allowedFields = ["name", "description", "category", "framework", "isPublic"];

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        }

        const updated = await db
            .update(decisionFrameworks)
            .set(updateData)
            .where(and(eq(decisionFrameworks.id, id), eq(decisionFrameworks.userId, userId)))
            .returning();

        if (updated.length === 0) {
            res.status(404).json({ error: "Framework not found or you don't have permission to edit it" });
            return;
        }

        res.json({ data: updated[0] });
    } catch (error) {
        console.error("updateFramework error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Delete Framework ───────────────────────────────────────────────────────
export const deleteFramework = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const id = req.params.id as string;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const deleted = await db
            .delete(decisionFrameworks)
            .where(and(eq(decisionFrameworks.id, id), eq(decisionFrameworks.userId, userId)))
            .returning();

        if (deleted.length === 0) {
            res.status(404).json({ error: "Framework not found or you don't have permission to delete it" });
            return;
        }

        res.status(204).send();
    } catch (error) {
        console.error("deleteFramework error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
