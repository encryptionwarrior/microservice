import { authenticateToken, validateRequest } from "@shared/middleware";
import { Router } from "express";
import * as userController from "./userController";
import { updateProfileSchema } from "./validate";

const router = Router();

router.get("/profile", authenticateToken, userController.getProfile);
router.put("/profile", authenticateToken, validateRequest(updateProfileSchema), userController.updateProfile);

router.delete("/profile", authenticateToken, userController.deleteProfile);

export default router;
