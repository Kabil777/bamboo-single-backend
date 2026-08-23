import { Request, Response, NextFunction } from "express";
import { logger } from "../../lib/logger.js";

declare global {
    namespace Express {
        interface Request {
            startTime?: number;
            requestId?: string;
        }
    }
}

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(2, 9);
    req.startTime = startTime;
    req.requestId = requestId;

    logger.info(
        {
            requestId,
            method: req.method,
            url: req.originalUrl || req.url,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            query: req.query,
        },
        `[REQ] ${req.method} ${req.originalUrl || req.url}`
    );

    res.on("finish", () => {
        const duration = Date.now() - startTime;
        logger.info(
            {
                requestId,
                method: req.method,
                url: req.originalUrl || req.url,
                statusCode: res.statusCode,
                durationMs: duration,
            },
            `[RES] ${req.method} ${req.originalUrl || req.url} ${res.statusCode} - ${duration}ms`
        );
    });

    next();
};

export const logMiddlewareCall = (middlewareName: string) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        logger.info(
            {
                requestId: req.requestId,
                method: req.method,
                url: req.originalUrl || req.url,
                middleware: middlewareName,
            },
            `[MIDDLEWARE] ${middlewareName}`
        );
        next();
    };
};
