import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
    listTemplates,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
} from "../controllers/template.controller";

const router = Router();

router.use(authenticate);

router.get("/", listTemplates);
router.get("/:id", getTemplate);
router.post("/", createTemplate);
router.patch("/:id", updateTemplate);
router.delete("/:id", deleteTemplate);

export default router;
