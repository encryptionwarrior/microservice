import { asyncHandler } from "@shared/middleware";
import { Request, Response } from "express";
import { AuthService } from "./authService";
import { createSuccessResponse } from "@shared/utils";


const authService = new AuthService();

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const token = await authService.register(email, password);

    res.status(201).json(createSuccessResponse(token, "User registered successfully"));
})