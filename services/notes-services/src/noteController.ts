import { asyncHandler } from "@shared/middleware";
import { createErrorResponse, createSuccessResponse } from "@shared/utils";
import { Request, Response } from "express";
import { NotesService } from "./notesService";

const noteService = new NotesService();

export const createNote = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json(createErrorResponse("Unauthorized"));
  }

  const authHeader = req.headers.authorization;
  const authToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;

  // const note = await noteService
  const note = await noteService.createNote(userId, req.body, authToken);

  return res
    .status(201)
    .json(createSuccessResponse(note, "Note created successfully"));
});

export const getNotes = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json(createErrorResponse("Unauthorized"));
  }
});
