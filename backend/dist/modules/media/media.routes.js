import { Router } from "express";
import { authRequired } from "../../common/middleware/authMiddleware.js";
import { mediaController } from "./media.controller.js";
const router = Router();
router.post("/", authRequired, mediaController.create);
router.post("/from-url", authRequired, mediaController.createFromUrl);
router.get("/:id", mediaController.get);
export default router;
//# sourceMappingURL=media.routes.js.map