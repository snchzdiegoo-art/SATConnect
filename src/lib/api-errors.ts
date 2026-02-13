/**
 * SAT Connect - API Error Handling Utilities
 * Standardized error responses for consistent API behavior
 */

import { NextResponse } from 'next/server';

/**
 * Standard API error response structure
 */
export interface APIErrorResponse {
    success: false;
    error: string;
    details?: string;
    code?: string;
}

/**
 * Standard API success response structure
 */
export interface APISuccessResponse<T = unknown> {
    success: true;
    data?: T;
    message?: string;
}

/**
 * HTTP Status Codes for consistent usage
 */
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Standard error handler for API routes
 * Logs the error server-side and returns user-friendly message
 */
export function handleAPIError(
    error: unknown,
    context: string,
    status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
): NextResponse<APIErrorResponse> {
    // Log full error server-side for debugging
    console.error(`[${context}] Error:`, error);

    // Extract error message safely
    let errorMessage = 'An unexpected error occurred';
    let errorDetails: string | undefined;

    if (error instanceof Error) {
        errorMessage = error.message;
        errorDetails = error.stack;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }

    return NextResponse.json(
        {
            success: false,
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
        },
        { status }
    );
}

/**
 * Validation error helper
 */
export function validationError(message: string, details?: string): NextResponse<APIErrorResponse> {
    console.warn(`[Validation Error] ${message}`);
    return NextResponse.json(
        {
            success: false,
            error: message,
            details,
            code: 'VALIDATION_ERROR',
        },
        { status: HTTP_STATUS.BAD_REQUEST }
    );
}

/**
 * Not found error helper
 */
export function notFoundError(resource: string): NextResponse<APIErrorResponse> {
    return NextResponse.json(
        {
            success: false,
            error: `${resource} not found`,
            code: 'NOT_FOUND',
        },
        { status: HTTP_STATUS.NOT_FOUND }
    );
}

/**
 * Success response helper
 */
export function successResponse<T>(
    data?: T,
    message?: string,
    status: number = HTTP_STATUS.OK
): NextResponse<APISuccessResponse<T>> {
    return NextResponse.json(
        {
            success: true,
            data,
            message,
        },
        { status }
    );
}
