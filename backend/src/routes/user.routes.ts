import { Router } from "express";
import { getMe, updateMe, getProfile, updateProfile, deleteAccount } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/me", getMe);
router.patch("/me", updateMe);
router.delete("/me", deleteAccount);
router.get("/me/profile", getProfile);
router.put("/me/profile", updateProfile);

export default router;
