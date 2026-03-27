import { type Request, type Response, type NextFunction } from "express";
import { type ZodSchema, ZodError } from "zod";

/**
 * Reusable Zod validation middleware.
 * Validates `req.body`, `req.query`, or `req.params` against the given schema.
 */
export const validate =
    (schema: ZodSchema, source: "body" | "query" | "params" = "body") =>
    (req: Request, res: Response, next: NextFunction): void => {
        try {
            const result = schema.safeParse(req[source]);
            if (!result.success) {
                const errors = result.error.issues.map((e: any) => ({
                    path: (e.path as any[]).join("."),
                    message: e.message,
                }));
                res.status(400).json({ error: "Validation failed", details: errors });
                return;
            }

            // Replace source with parsed (coerced) data
            (req as any)[source] = result.data;
            next();
        } catch (error) {
            next(error);
        }
    };
