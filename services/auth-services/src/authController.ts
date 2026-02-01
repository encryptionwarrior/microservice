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

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const token = await authService.login(email, password);

    res.status(200).json(createSuccessResponse(token, "User logged in successfully"));
})

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const token = await authService.refreshToken(refreshToken);
    res.status(200).json(createSuccessResponse(token, "Tokens refreshed successfully"));
})

export const logout = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    res.status(200).json(createSuccessResponse(null, "User logged out successfully"));
})