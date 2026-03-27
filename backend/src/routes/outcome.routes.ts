import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
    getDecisionOutcomes,
    getOutcome,
    createOutcome,
    updateOutcome,
    deleteOutcome,
    getPendingCheckins,
    scheduleCheckin,
    completeCheckin,
    skipCheckin,
} from "../controllers/outcome.controller";

const router = Router();

router.use(authenticate);

router.get("/", getDecisionOutcomes);
router.post("/", createOutcome);
router.get("/pending-checkins", getPendingCheckins);
router.post("/schedule-checkin", scheduleCheckin);
router.get("/:id", getOutcome);
router.patch("/:id", updateOutcome);
router.delete("/:id", deleteOutcome);
router.post("/checkins/:id/complete", completeCheckin);
router.post("/checkins/:id/skip", skipCheckin);

export default router;
