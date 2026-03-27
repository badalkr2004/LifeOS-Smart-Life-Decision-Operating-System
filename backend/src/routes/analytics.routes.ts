import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
    getSummary,
    getPatterns,
    getDecisionQuality,
    getInsights,
    dismissInsight,
} from "../controllers/analytics.controller";

const router = Router();

router.use(authenticate);

router.get("/summary", getSummary);
router.get("/patterns", getPatterns);
router.get("/decision-quality-over-time", getDecisionQuality);
router.get("/insights", getInsights);
router.post("/insights/:id/dismiss", dismissInsight);

export default router;
