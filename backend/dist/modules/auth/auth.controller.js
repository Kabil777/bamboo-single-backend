import { authService } from "./auth.service.js";
import { PrismaManager } from "../../lib/prisma.js";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const cookieOptions = {
    domain: "localhost",
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "lax"
};
export class AuthController {
    async handleMe(req, res) {
        const id = req.headers["x-user-id"];
        let user = await PrismaManager.getClient().user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true, pictureUrl: true, role: true },
        });
        if (!user)
            return res.status(401).json({ error: "User no longer exists" });
        const bootstrapAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        if (bootstrapAdminEmail === user.email.toLowerCase() && user.role !== "ADMIN") {
            user = await PrismaManager.getClient().user.update({
                where: { id: user.id },
                data: { role: "ADMIN" },
                select: { id: true, name: true, email: true, pictureUrl: true, role: true },
            });
        }
        return res.json(user);
    }
    async handleGoogleCallback(req, res) {
        try {
            const profile = req.user;
            if (!profile) {
                return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
            }
            const { accessToken, refreshToken } = await authService.onOAuthSuccess(profile);
            res.cookie("ac_token", accessToken, { ...cookieOptions, maxAge: 10 * 60 * 1000 }); // 10 minutes
            res.cookie("rf_token", refreshToken, { ...cookieOptions, maxAge: 10 * 24 * 60 * 60 * 1000 }); // 10 days
            return res.redirect(`${FRONTEND_URL}/`);
        }
        catch (e) {
            console.error("OAuth callback error", e);
            return res.redirect(`${FRONTEND_URL}/login?error=internal_error`);
        }
    }
    async handleRefresh(req, res) {
        try {
            const rfToken = req.cookies.rf_token;
            if (!rfToken) {
                return res.status(401).json({ error: "No refresh token provided" });
            }
            const accessToken = await authService.refreshAccessToken(rfToken);
            res.cookie("ac_token", accessToken, { ...cookieOptions, maxAge: 10 * 60 * 1000 });
            return res.status(200).json({ success: true });
        }
        catch (e) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }
    }
    async handleLogout(req, res) {
        try {
            const rfToken = req.cookies.rf_token;
            if (rfToken) {
                await authService.logout(rfToken);
            }
            res.clearCookie("ac_token", { ...cookieOptions });
            res.clearCookie("rf_token", { ...cookieOptions });
            return res.status(200).json({ success: true });
        }
        catch (e) {
            return res.status(500).json({ error: "Logout failed" });
        }
    }
}
export const authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map