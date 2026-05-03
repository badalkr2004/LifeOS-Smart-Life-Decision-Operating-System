import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
    preDecisionAnalysis,
    analyzeDecision,
    recommendApproach,
    similarDecisions,
    chat,
    getChatSessions,
    getChatHistory,
} from "../controllers/ai.controller";

const router = Router();

router.use(authenticate);

router.post("/pre-decision-analysis", preDecisionAnalysis);
router.post("/analyze-decision", analyzeDecision);
router.post("/recommend-approach", recommendApproach);
router.get("/similar-decisions", similarDecisions);
router.post("/chat", chat);
router.get("/chat/sessions", getChatSessions);
router.get("/chat/sessions/:id", getChatHistory);

export default router;
