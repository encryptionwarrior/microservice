import { authenticateToken, validateRequest } from "@shared/middleware";
import { Router } from "express";
import { createNoteSchema } from "./validation";
// import * as noteController from "./noteController";

const router = Router();

router.use(authenticateToken);

router.post("/", validateRequest(createNoteSchema), noteController);

export default router;

