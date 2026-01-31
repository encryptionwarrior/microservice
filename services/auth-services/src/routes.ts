import { validateRequest } from "@shared/middleware";
import { Router } from "express";
import { registerSchema } from "./validation";
import * as authController from "./authController";

const router = Router();


router.get("/health", (req, res) => {
  res.status(200).send("Auth service is healthy");
});

router.post("/register", validateRequest(registerSchema), authController.register)

export default router;