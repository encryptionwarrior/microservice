import { authenticateToken, validateRequest } from "@shared/middleware";
import { Router } from "express";
import { loginSchema, refreshTokenSchema, registerSchema } from "./validation";
import * as authController from "./authController";

const router = Router();


router.get("/health", (req, res) => {
  res.status(200).send("Auth service is healthy");
});

router.post("/register", validateRequest(registerSchema), authController.register)
router.post("/login", validateRequest(loginSchema), authController.login);

router.post("/refresh", validateRequest(refreshTokenSchema), authController.refreshToken);

router.post("/logout", validateRequest(refreshTokenSchema), authController.logout);

router.post("validate", authController.validateToken);

router.get("/profile", authenticateToken, authController.getProfile);

router.delete("/profile", authenticateToken, authController.deleteAccount);

export default router;