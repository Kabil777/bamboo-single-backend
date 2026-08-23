import { Router, Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { logger } from "../../lib/logger.js";
import { logMiddlewareCall } from "../../common/middleware/requestLogger.js";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Bamboo Single Backend API",
            version: "1.0.0",
            description: "API Documentation with full request, middleware, and response logging",
        },
        servers: [
            {
                url: "/api/v1",
                description: "V1 Base Server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "ac_token",
                },
            },
        },
    },
    apis: [
        "./src/modules/**/*.ts",
        "./src/http/*.ts",
    ],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerRouter = Router();

swaggerRouter.use(
    "/swagger",
    logMiddlewareCall("SwaggerUiMiddleware"),
    (req: Request, res: Response, next: NextFunction) => {
        logger.info(
            { requestId: req.requestId, path: req.path },
            `[SWAGGER] Serving Swagger UI for ${req.method} ${req.originalUrl || req.url}`
        );
        next();
    },
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

swaggerRouter.get("/swagger.json", (req: Request, res: Response) => {
    logger.info({ requestId: req.requestId }, "[SWAGGER] Fetching Swagger JSON Spec");
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});
