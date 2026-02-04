import { authenticateToken, validateRequest } from "@shared/middleware";
import { Router } from "express";
import { createNoteSchema, getNotesByUserSchema } from "./validation";
import * as noteController from "./noteController";

const router = Router();

router.use(authenticateToken);

router.post("/", validateRequest(createNoteSchema), noteController.createNote);

router.get("/", validateRequest(getNotesByUserSchema), noteController.getNotes)

router.get("/:noteId", noteController.getNoteById)

export default router;

