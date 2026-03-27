import { type Request, type Response, type NextFunction } from "express";

/**
 * Global error handler — catches all unhandled errors and returns a structured JSON response.
 */
export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    console.error("Unhandled error:", err);

    const statusCode = (err as any).statusCode || 500;
    const message = err.message || "Internal server error";

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    });
};

/**
 * Custom error class with a status code.
 */
export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AppError";
    }
}
