import { Router } from "express";
import { authOptional, authRequired } from "../../common/middleware/authMiddleware.js";
import { postsController } from "./posts.controller.js";

const router = Router();
router.get("/", postsController.list);
router.get("/:id", authOptional, postsController.get);
router.post("/", authRequired, postsController.create);
router.patch("/:id", authRequired, postsController.update);
router.delete("/:id", authRequired, postsController.delete);
router.put("/:id/like", authRequired, postsController.like);
router.delete("/:id/like", authRequired, postsController.unlike);
router.put("/:id/bookmark", authRequired, postsController.bookmark);
router.delete("/:id/bookmark", authRequired, postsController.unbookmark);
export default router;
