import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
    preDecisionAnalysis,
    analyzeDecision,
    chat,
    getChatSessions,
    getChatHistory,
    triggerProfileComputation,
    triggerEmbedding,
    getPatterns,
    triggerPatternDetection,
} from "../controllers/ai.controller";

const router = Router();

router.use(authenticate);

// Intelligence
router.post("/pre-decision-analysis", preDecisionAnalysis);
router.post("/analyze-decision", analyzeDecision);
router.post("/compute-profile", triggerProfileComputation);
router.post("/generate-embedding", triggerEmbedding);
router.post("/detect-patterns", triggerPatternDetection);
router.get("/patterns", getPatterns);

// Chat (streaming)
router.post("/chat", chat);
router.get("/chat/sessions", getChatSessions);
router.get("/chat/sessions/:id", getChatHistory);

export default router;
