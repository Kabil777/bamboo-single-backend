import express, { Express } from "express";
import { createServer, Server } from "node:http";
import cookieParser from "cookie-parser";
import passport from "passport";
import { logger } from "../lib/logger.js";
import { createCorsMiddleware } from "../common/middleware/cors.js";
import { errorHandler } from "../common/middleware/errorHandler.js";
import { requestLogger, logMiddlewareCall } from "../common/middleware/requestLogger.js";
import { swaggerRouter } from "../modules/swagger/swagger.routes.js";
import { authRouter, rootRouter } from "../modules/auth/auth.routes.js";
import postRouter from "../modules/post/posts.routes.js";
import mediaRouter from "../modules/media/media.routes.js";
import communityRouter from "../modules/community/community.routes.js";
import newsletterRouter from "../modules/newsletter/newsletter.routes.js";
import linkPreviewRouter from "../modules/link-preview/link-preview.routes.js";
import readingPlatformsRouter from "../modules/reading-platforms/reading-platforms.routes.js";
import documentRouter from "../modules/document/document.routes.js";
import tagsRouter from "../modules/tags/tags.routes.js";
import settingsRouter from "../modules/settings/settings.routes.js";

export class HttpServer {
    private readonly app: Express;
    private readonly httpServer: Server;

    constructor() {
        this.app = express();
        this.httpServer = createServer(this.app);
        this.registerHttpRoutes();
    }

    private registerHttpRoutes(): void {
        this.app.use(requestLogger);
        this.app.use(logMiddlewareCall("CorsMiddleware"), createCorsMiddleware());
        this.app.use(logMiddlewareCall("JsonBodyParserMiddleware"), express.json({ limit: "12mb" }));
        this.app.use(logMiddlewareCall("CookieParserMiddleware"), cookieParser());
        this.app.use(logMiddlewareCall("PassportInitMiddleware"), passport.initialize());

        this.app.get("/health", (_, res) => res.status(200).json({ ok: true, service: "blog-api" }));
        this.app.use("/api/v1", swaggerRouter);
        this.app.use(rootRouter);
        this.app.use("/api/v1/auth", authRouter);
        this.app.use("/api/v1/posts", postRouter);
        this.app.use("/api/v1/media", mediaRouter);
        this.app.use("/api/v1/community", communityRouter);
        this.app.use("/api/v1/newsletters", newsletterRouter);
        this.app.use("/api/v1/link-previews", linkPreviewRouter);
        this.app.use("/api/v1/reading-platforms", readingPlatformsRouter);
        this.app.use("/api/v1/docs", documentRouter);
        this.app.use("/api/v1/tags", tagsRouter);
        this.app.use("/api/v1/settings", settingsRouter);
        this.app.use(errorHandler);
    }

    public getHttpServer(): Server {
        return this.httpServer;
    }

    public listen(port: number): void {
        this.httpServer.listen(port, () => logger.info({ port }, "HTTP listening"));
    }
}
