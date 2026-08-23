import { PrismaManager } from "../../lib/prisma.js";
import { JwtHelper } from "../../lib/jwt.js";
import * as crypto from "node:crypto";
import { mediaService } from "../media/media.service.js";

const prisma = PrismaManager.getClient();
const jwtHelper = new JwtHelper();

export interface OAuthProfile {
    provider: string;
    providerId: string;
    email: string;
    name: string;
    picture?: string;
}

export class AuthService {
    public async onOAuthSuccess(profile: OAuthProfile) {
        let user = await prisma.user.findFirst({
            where: { email: profile.email, providerId: profile.providerId }
        });

        const isNewUser = !user;
        const bootstrapAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const role = bootstrapAdminEmail === profile.email.toLowerCase() ? "ADMIN" : "USER";
        if (isNewUser) {
            user = await prisma.user.create({
                data: {
                    name: profile.name,
                    email: profile.email,
                    pictureUrl: profile.picture,
                    provider: profile.provider,
                    providerId: profile.providerId,
                    role,
                }
            });
        } else {
            user = await prisma.user.update({
                where: { id: user!.id },
                data: { lastLogin: new Date(), ...(role === "ADMIN" ? { role } : {}) }
            });
        }

        let resolvedUser = user!;
        // Google avatar URLs are transient third-party URLs. Copy the bytes
        // into PostgreSQL once and only expose our own media endpoint.
        if (profile.picture && (!resolvedUser.pictureUrl || resolvedUser.pictureUrl.startsWith("http"))) {
            try {
                const media = await mediaService.createFromUrl(resolvedUser.id, profile.picture);
                const mediaBase = (process.env.PUBLIC_API_URL || "http://localhost:8092").replace(/\/$/, "");
                resolvedUser = await prisma.user.update({
                    where: { id: resolvedUser.id },
                    data: { pictureUrl: `${mediaBase}/api/v1/media/${media.id}` },
                });
            } catch {
                // Login should still work when Google's image cannot be fetched.
            }
        }
        const accessToken = await this.generateAccessToken(resolvedUser);
        const refreshToken = await this.generateRefreshToken(resolvedUser.id);

        return { accessToken, refreshToken, isNewUser, user: resolvedUser };
    }

    public async generateAccessToken(user: any): Promise<string> {
        return jwtHelper.signAccessToken({
            id: user.id,
            email: user.email,
            name: user.name,
            profile_url: user.pictureUrl,
            role: user.role,
        }, "10m");
    }

    public async generateRefreshToken(userId: string): Promise<string> {
        const tokenStr = crypto.randomUUID();
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 10);

        await prisma.refreshToken.upsert({
            where: { userId },
            create: { userId, refreshToken: tokenStr, expiry },
            update: { refreshToken: tokenStr, expiry }
        });

        return tokenStr;
    }

    public async refreshAccessToken(rfToken: string) {
        const record = await prisma.refreshToken.findUnique({
            where: { refreshToken: rfToken },
            include: { user: true }
        });

        if (!record) {
            throw new Error("Invalid refresh token");
        }

        if (record.expiry < new Date()) {
            await prisma.refreshToken.delete({ where: { id: record.id } });
            throw new Error("Refresh token expired");
        }

        const accessToken = await this.generateAccessToken(record.user);
        return accessToken;
    }

    public async logout(rfToken: string) {
        if (!rfToken) return;
        try {
            await prisma.refreshToken.delete({
                where: { refreshToken: rfToken }
            });
        } catch (e) {
            // ignore if not found
        }
    }
}

export const authService = new AuthService();
