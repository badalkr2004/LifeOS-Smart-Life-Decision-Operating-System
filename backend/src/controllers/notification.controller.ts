import { type Response } from "express";
import { type AuthRequest } from "../middleware/auth.middleware";
import { db } from "../db/connection";
import { notifications } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";

// ─── List Notifications ────────────────────────────────────────────────────
export const listNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const readFilter = req.query.read;
        const conditions: any[] = [eq(notifications.userId, userId)];

        if (readFilter === "true") {
            conditions.push(eq(notifications.read, true));
        } else if (readFilter === "false") {
            conditions.push(eq(notifications.read, false));
        }

        const records = await db
            .select()
            .from(notifications)
            .where(and(...conditions))
            .orderBy(desc(notifications.createdAt));

        res.json({ data: records });
    } catch (error) {
        console.error("listNotifications error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Mark Notification as Read ──────────────────────────────────────────────
export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const id = req.params.id as string;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const updated = await db
            .update(notifications)
            .set({ read: true, readAt: new Date() })
            .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
            .returning();

        if (updated.length === 0) {
            res.status(404).json({ error: "Notification not found" });
            return;
        }

        res.json({ data: updated[0] });
    } catch (error) {
        console.error("markAsRead error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Mark All as Read ───────────────────────────────────────────────────────
export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        await db
            .update(notifications)
            .set({ read: true, readAt: new Date() })
            .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));

        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        console.error("markAllAsRead error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Delete Notification ────────────────────────────────────────────────────
export const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const id = req.params.id as string;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const deleted = await db
            .delete(notifications)
            .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
            .returning();

        if (deleted.length === 0) {
            res.status(404).json({ error: "Notification not found" });
            return;
        }

        res.status(204).send();
    } catch (error) {
        console.error("deleteNotification error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
