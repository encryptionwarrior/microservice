import { asyncHandler } from "@shared/middleware";
import { createErrorResponse, createSuccessResponse } from "@shared/utils";
import { Request, Response } from "express";
import { TagsService } from "./tagsService";

const tagService = new TagsService();

export const createTag = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json(createErrorResponse("Unauthorized"));
  }

  const tag = await tagService.createTag(userId, req.body);

  return res
    .status(201)
    .json(createSuccessResponse(tag, "Tag created successfully"));
});
