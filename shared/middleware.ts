import { NextFunction, Request, Response } from "express";
import { logError, ServiceError } from "./types";
import { create } from "node:domain";
import { createErrorResponse } from "./utils";

export function corsOptions() {
  return {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: process.env.CORS_CREDENTIALS === 'true',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
}

export function errorHandler(
    error: ServiceError,
    req: Request,
    res: Response,
    next: NextFunction
) {
logError(error, {
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query,
});

const statusCode = error.statusCode || 500;
const message = error.message || "Internal Server Error";
res.status(statusCode).json(createErrorResponse(message));

next();
}