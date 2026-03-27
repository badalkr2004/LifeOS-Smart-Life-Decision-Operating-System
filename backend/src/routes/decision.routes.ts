import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
    listDecisions,
    getDecision,
    createDecision,
    updateDecision,
    deleteDecision,
} from "../controllers/decision.controller";

const router = Router();

router.use(authenticate);

router.get("/", listDecisions);
router.get("/:id", getDecision);
router.post("/", createDecision);
router.patch("/:id", updateDecision);
router.delete("/:id", deleteDecision);

export default router;
