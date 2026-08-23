import { Router } from "express";
import { adminRequired, authRequired } from "../../common/middleware/authMiddleware.js";
import { readingPlatformsService } from "./reading-platforms.service.js";

const router = Router();

router.get("/", async (_req, res, next) => {
    try { res.json({ data: await readingPlatformsService.list() }); }
    catch (error) { next(error); }
});

router.post("/bootstrap", authRequired, adminRequired, async (req, res, next) => {
    try { res.status(201).json({ data: await readingPlatformsService.bootstrap(req.headers["x-user-id"] as string) }); }
    catch (error) { next(error); }
});

router.post("/", authRequired, adminRequired, async (req, res, next) => {
    try { res.status(201).json({ data: await readingPlatformsService.create(req.headers["x-user-id"] as string, req.body) }); }
    catch (error) { next(error); }
});

router.delete("/:id", authRequired, adminRequired, async (req, res, next) => {
    try { await readingPlatformsService.remove(String(req.params.id)); res.status(204).end(); }
    catch (error) { next(error); }
});

export default router;
