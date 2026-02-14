import { Request, Response } from "express";
import { AuthService } from "./authService";
import { asyncHandler, createErrorResponse, createSuccessResponse } from "@microservices-practice/shared";

const authService = new AuthService();

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await authService.register(email, password);

  res
    .status(201)
    .json(createSuccessResponse(token, "User registered successfully"));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await authService.login(email, password);

  res
    .status(200)
    .json(createSuccessResponse(token, "User logged in successfully"));
});

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const token = await authService.refreshToken(refreshToken);
    res
      .status(200)
      .json(createSuccessResponse(token, "Tokens refreshed successfully"));
  },
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  await authService.logout(refreshToken);
  res
    .status(200)
    .json(createSuccessResponse(null, "User logged out successfully"));
});

export const validateToken = asyncHandler(
  async (req: Request, res: Response) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json(createErrorResponse("No token provided"));
      return;
    }

    const payload = await authService.validateToken(token);

    res.status(200).json(createSuccessResponse(payload, "Token is valid"));
  },
);

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    res
      .status(404)
      .json(createErrorResponse("Unauthenticated: user not found"));
    return;
  }

  const user = await authService.getUserById(userId);

  res
    .status(200)
    .json(createSuccessResponse(user, "User profile fetched successfully"));
});

export const deleteAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      return res
        .status(404)
        .json(createErrorResponse("Unauthenticated: user not found"));
    }

    await authService.deleteUser(userId);

    res
      .status(200)
      .json(createSuccessResponse(null, "User account deleted successfully"));
  },
);
