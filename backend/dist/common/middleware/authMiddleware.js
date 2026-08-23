import { JwtHelper } from "../../lib/jwt.js";
const jwtHelper = new JwtHelper();
export const authRequired = async (req, res, next) => {
    const authorization = req.headers.authorization;
    const bearerToken = authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : undefined;
    const token = bearerToken || req.cookies?.ac_token;
    if (!token)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        const payload = await jwtHelper.verifyAccessToken(token);
        req.headers["x-user-id"] = payload.id;
        req.headers["x-user-email"] = payload.email;
        next();
    }
    catch {
        return res.status(401).json({ error: "Invalid token" });
    }
};
export const authOptional = async (req, res, next) => {
    const authorization = req.headers.authorization;
    const bearerToken = authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : undefined;
    const token = bearerToken || req.cookies?.ac_token;
    if (token) {
        try {
            const payload = await jwtHelper.verifyAccessToken(token);
            req.headers["x-user-id"] = payload.id;
        }
        catch { /* ignore */ }
    }
    next();
};
export const adminRequired = async (req, res, next) => {
    const userId = req.headers["x-user-id"];
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });
    const { PrismaManager } = await import("../../lib/prisma.js");
    const user = await PrismaManager.getClient().user.findUnique({ where: { id: userId }, select: { role: true } });
    if (user?.role !== "ADMIN")
        return res.status(403).json({ error: "Admin access required" });
    next();
};
//# sourceMappingURL=authMiddleware.js.map