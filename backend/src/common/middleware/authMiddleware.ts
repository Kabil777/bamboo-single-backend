import { Request, Response, NextFunction } from "express";
import { JwtHelper } from "../../lib/jwt.js";
import { logger } from "../../lib/logger.js";

const jwtHelper = new JwtHelper();

export const authRequired = async (req: Request, res: Response, next: NextFunction) => {
    logger.info({ requestId: req.requestId, url: req.originalUrl || req.url }, "[MIDDLEWARE] Executing authRequired");
    const authorization = req.headers.authorization;
    const bearerToken = authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : undefined;
    const token = bearerToken || req.cookies?.ac_token;
    if (!token) {
        logger.warn({ requestId: req.requestId }, "[MIDDLEWARE] authRequired failed - missing token");
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const payload = await jwtHelper.verifyAccessToken(token);
        req.headers["x-user-id"] = payload.id as string;
        req.headers["x-user-email"] = payload.email as string;
        logger.info({ requestId: req.requestId, userId: payload.id }, "[MIDDLEWARE] authRequired success");
        next();
    } catch {
        logger.warn({ requestId: req.requestId }, "[MIDDLEWARE] authRequired failed - invalid token");
        return res.status(401).json({ error: "Invalid token" });
    }
};

export const authOptional = async (req: Request, res: Response, next: NextFunction) => {
    logger.info({ requestId: req.requestId, url: req.originalUrl || req.url }, "[MIDDLEWARE] Executing authOptional");
    const authorization = req.headers.authorization;
    const bearerToken = authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : undefined;
    const token = bearerToken || req.cookies?.ac_token;
    if (token) {
        try {
            const payload = await jwtHelper.verifyAccessToken(token);
            req.headers["x-user-id"] = payload.id as string;
            logger.info({ requestId: req.requestId, userId: payload.id }, "[MIDDLEWARE] authOptional identified user");
        } catch { /* ignore */ }
    }
    next();
};

export const adminRequired = async (req: Request, res: Response, next: NextFunction) => {
    logger.info({ requestId: req.requestId, url: req.originalUrl || req.url }, "[MIDDLEWARE] Executing adminRequired");
    const userId = req.headers["x-user-id"] as string | undefined;
    if (!userId) {
        logger.warn({ requestId: req.requestId }, "[MIDDLEWARE] adminRequired failed - missing userId");
        return res.status(401).json({ error: "Unauthorized" });
    }
    const { PrismaManager } = await import("../../lib/prisma.js");
    const user = await PrismaManager.getClient().user.findUnique({ where: { id: userId }, select: { role: true } });
    if (user?.role !== "ADMIN") {
        logger.warn({ requestId: req.requestId, userId }, "[MIDDLEWARE] adminRequired failed - user is not admin");
        return res.status(403).json({ error: "Admin access required" });
    }
    logger.info({ requestId: req.requestId, userId }, "[MIDDLEWARE] adminRequired success");
    next();
};
