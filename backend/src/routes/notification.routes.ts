import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
    listNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} from "../controllers/notification.controller";

const router = Router();

router.use(authenticate);

router.get("/", listNotifications);
router.patch("/:id/read", markAsRead);
router.post("/mark-all-read", markAllAsRead);
router.delete("/:id", deleteNotification);

export default router;
