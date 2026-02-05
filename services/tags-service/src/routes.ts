import { authenticateToken, validateRequest } from "@shared/middleware";
import { Router } from "express";
import { createTagSchema } from "./validation";
import * as tagController from "./tagsController";

const router = Router();

router.use(authenticateToken);

router.post("/", validateRequest(createTagSchema), tagController.createTag);

export default router;
