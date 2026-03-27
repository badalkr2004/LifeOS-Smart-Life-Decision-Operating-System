import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
    listFrameworks,
    getFramework,
    createFramework,
    updateFramework,
    deleteFramework,
} from "../controllers/framework.controller";

const router = Router();

router.use(authenticate);

router.get("/", listFrameworks);
router.get("/:id", getFramework);
router.post("/", createFramework);
router.patch("/:id", updateFramework);
router.delete("/:id", deleteFramework);

export default router;
