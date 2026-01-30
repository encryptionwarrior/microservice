import { logError, ServiceError } from "@shared/types";
import { createErrorResponse } from "@shared/utils";
import { NextFunction, Request, Response } from "express";

export function corsOptions() {
  return {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: process.env.CORS_CREDENTIALS === "true",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
}

export function errorHandler(
  error: ServiceError,
  req: Request,
  res: Response,
  next: NextFunction,
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

export function healthCheck(_req: Request, res: Response) {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
}

export function validateRequest(schema: any) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body);

        if(error){
            const errors: Record<string, string[]> = {};

            error.details.forEach((detail: any) => {
                const field = detail.path.join('.');
                if(!errors[field]){
                    errors[field] = [];
                }
                 errors[field].push(detail.message);
        });

            res.status(400).json({
                success: false,
                message: "Validation Error",
                errors,
            });
            return;
        }

        next();
    }
}


export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}