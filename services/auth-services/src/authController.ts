import { asyncHandler } from "@shared/middleware";
import { Request, Response } from "express";

const authService = new AuthService();

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const token = await authService.registerUser(email, password);

    res.status(201).json(crreateSuccessResponse(token, "User registered successfully"));
})