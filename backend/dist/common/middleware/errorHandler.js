import { AppError } from "../errors.js";
import { logger } from "../../lib/logger.js";
export const errorHandler = (err, req, res, next) => {
    logger.error({ err, path: req.path }, err.message);
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: {
                message: err.message,
            },
        });
    }
    return res.status(500).json({
        success: false,
        error: {
            message: "Internal Server Error",
        },
    });
};
//# sourceMappingURL=errorHandler.js.map