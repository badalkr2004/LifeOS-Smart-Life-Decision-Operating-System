import { type Response } from "express";
import { type AuthRequest } from "../middleware/auth.middleware";
import { db } from "../db/connection";
import { decisionTemplates } from "../db/schema";
import { eq, and, or, desc } from "drizzle-orm";

// ─── List Templates ─────────────────────────────────────────────────────────
export const listTemplates = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const category = req.query.category as string | undefined;

        // User can see: their own templates + public templates + system templates
        const conditions: any[] = [
            or(
                eq(decisionTemplates.userId, userId),
                eq(decisionTemplates.isPublic, true),
                eq(decisionTemplates.isSystemTemplate, true),
            ),
        ];

        if (category) {
            conditions.push(eq(decisionTemplates.category, category as any));
        }

        const templates = await db
            .select()
            .from(decisionTemplates)
            .where(and(...conditions))
            .orderBy(desc(decisionTemplates.createdAt));

        res.json({ data: templates });
    } catch (error) {
        console.error("listTemplates error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Get Template ───────────────────────────────────────────────────────────
export const getTemplate = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const id = req.params.id as string;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const records = await db
            .select()
            .from(decisionTemplates)
            .where(eq(decisionTemplates.id, id))
            .limit(1);

        const template = records[0];
        if (!template) {
            res.status(404).json({ error: "Template not found" });
            return;
        }

        // Check visibility
        if (
            template.userId !== userId &&
            !template.isPublic &&
            !template.isSystemTemplate
        ) {
            res.status(404).json({ error: "Template not found" });
            return;
        }

        res.json({ data: template });
    } catch (error) {
        console.error("getTemplate error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Create Template ────────────────────────────────────────────────────────
export const createTemplate = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const { name, description, category, template, isPublic } = req.body;

        if (!name || !template || !category) {
            res.status(400).json({ error: "Name, category, and template are required" });
            return;
        }

        const newTemplate = await db
            .insert(decisionTemplates)
            .values({
                userId,
                name,
                description,
                category,
                template,
                isPublic: isPublic || false,
                isSystemTemplate: false,
            })
            .returning();

        res.status(201).json({ data: newTemplate[0] });
    } catch (error) {
        console.error("createTemplate error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Update Template ────────────────────────────────────────────────────────
export const updateTemplate = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const id = req.params.id as string;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const body = req.body;
        const updateData: Record<string, any> = { updatedAt: new Date() };
        const allowedFields = ["name", "description", "category", "template", "isPublic"];

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        }

        const updated = await db
            .update(decisionTemplates)
            .set(updateData)
            .where(and(eq(decisionTemplates.id, id), eq(decisionTemplates.userId, userId)))
            .returning();

        if (updated.length === 0) {
            res.status(404).json({ error: "Template not found or you don't have permission to edit it" });
            return;
        }

        res.json({ data: updated[0] });
    } catch (error) {
        console.error("updateTemplate error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Delete Template ────────────────────────────────────────────────────────
export const deleteTemplate = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const id = req.params.id as string;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const deleted = await db
            .delete(decisionTemplates)
            .where(and(eq(decisionTemplates.id, id), eq(decisionTemplates.userId, userId)))
            .returning();

        if (deleted.length === 0) {
            res.status(404).json({ error: "Template not found or you don't have permission to delete it" });
            return;
        }

        res.status(204).send();
    } catch (error) {
        console.error("deleteTemplate error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
