import { Request, Response, NextFunction } from "express";
import { JwtHelper } from "../../lib/jwt.js";

const jwtHelper = new JwtHelper();

export const authRequired = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    const bearerToken = authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : undefined;
    const token = bearerToken || req.cookies?.ac_token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const payload = await jwtHelper.verifyAccessToken(token);
        req.headers["x-user-id"] = payload.id as string;
        req.headers["x-user-email"] = payload.email as string;
        next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
};

export const authOptional = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    const bearerToken = authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : undefined;
    const token = bearerToken || req.cookies?.ac_token;
    if (token) {
        try {
            const payload = await jwtHelper.verifyAccessToken(token);
            req.headers["x-user-id"] = payload.id as string;
        } catch { /* ignore */ }
    }
    next();
};

export const adminRequired = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers["x-user-id"] as string | undefined;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { PrismaManager } = await import("../../lib/prisma.js");
    const user = await PrismaManager.getClient().user.findUnique({ where: { id: userId }, select: { role: true } });
    if (user?.role !== "ADMIN") return res.status(403).json({ error: "Admin access required" });
    next();
};
