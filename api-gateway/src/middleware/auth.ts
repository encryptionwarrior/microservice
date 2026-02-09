import { createErrorResponse } from "@shared/utils";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const publicRoutes = [
  "/health",
  "/status",
  "/",
  "/api/auth/register",
  "/api/auth/login",
  "/api/auth/refresh",
];

export function isPublicRoute(path: string): boolean {
  return publicRoutes.some((route) => {
    if (route.endsWith("*")) {
      return path.startsWith(route.slice(0, -1));
    }

    return path === route || path.startsWith(route + "/");
  });
}

export function gatewayAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (isPublicRoute(req.path)) {
    next();
    return;
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json(createErrorResponse("Access token is required!"));
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("JWT_SECRET not configured in API Gateway");
    res.status(500).json(createErrorResponse("Service configuration error"));
    return;
  }

  jwt.verify(token, jwtSecret, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json(createErrorResponse("Invalid or expired token"));

      return;
    }

    req.user = decoded;

    req.headers["x-user-id"] = decoded.userId;
    req.headers["x-user-email"] = decoded.email;

    next();
  });
}
