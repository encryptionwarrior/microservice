import { ApiResponse } from "../types";

export function createApiResponse<T>(
    success: boolean,
    data?: T,
    message?: string,
    error?: string
): ApiResponse<T> {
    return {
        success,
        data,
        message,
        error,
    };
}


export function createErrorResponse(error: string): ApiResponse {
    return createApiResponse(false, undefined, undefined, error);
}


export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
    return createApiResponse(true, data, message);
}
