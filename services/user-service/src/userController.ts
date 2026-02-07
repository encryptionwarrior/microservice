import { asyncHandler } from "@shared/middleware";
import { createErrorResponse, createServiceError, createSuccessResponse } from "@shared/utils";
import { Request, Response } from "express";
import { UserService } from "./userService";

const userService = new UserService();

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json(createErrorResponse("User not authenticated"));
  }

  const profile = await userService.getProfile(userId);

  res
    .status(200)
    .json(createSuccessResponse(profile, "User profile retrived successfully"));
});

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res
        .status(401)
        .json(createErrorResponse("user not authenticated"));
    }

    const profile = await userService.updateProfile(userId, req.body);

    return res
      .status(200)
      .json(
        createSuccessResponse(profile, "User profile updated successfully"),
      );
  },
);

export const deleteProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if(!userId){
        return res.status(401).json(createServiceError("User not authenticated"));
    }

    await userService.deleteProfile(userId);

    return res.status(204).json(createSuccessResponse(null, "Profile deleted"));

}) 
