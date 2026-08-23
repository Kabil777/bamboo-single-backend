import { Router } from "express";
import { ValidationError } from "../../common/errors.js";
import { adminRequired, authRequired } from "../../common/middleware/authMiddleware.js";
import { PrismaManager } from "../../lib/prisma.js";

const router = Router();
const prisma = PrismaManager.getClient();

router.get("/collaboration", async (_req, res, next) => {
    try {
        const setting = await prisma.systemSetting.upsert({ where: { id: 1 }, create: { id: 1 }, update: {} });
        res.json({ enabled: setting.collaborationEnabled });
    } catch (error) { next(error); }
});

router.patch("/collaboration", authRequired, adminRequired, async (req, res, next) => {
    try {
        if (typeof req.body?.enabled !== "boolean") throw new ValidationError("enabled must be a boolean");
        const setting = await prisma.systemSetting.upsert({ where: { id: 1 }, create: { id: 1, collaborationEnabled: req.body.enabled }, update: { collaborationEnabled: req.body.enabled } });
        res.json({ enabled: setting.collaborationEnabled });
    } catch (error) { next(error); }
});

router.get("/editor-save", async (_req, res, next) => {
    try {
        const setting = await prisma.systemSetting.upsert({ where: { id: 1 }, create: { id: 1 }, update: {} });
        res.json({ enabled: setting.documentAutosaveEnabled, delay: setting.documentAutosaveDelay });
    } catch (error) { next(error); }
});

router.patch("/editor-save", authRequired, adminRequired, async (req, res, next) => {
    try {
        const { enabled, delay } = req.body ?? {};
        if (typeof enabled !== "boolean") throw new ValidationError("enabled must be a boolean");
        if (typeof delay !== "number" || !Number.isInteger(delay) || delay < 250 || delay > 5000) throw new ValidationError("delay must be an integer from 250 to 5000 milliseconds");
        const setting = await prisma.systemSetting.upsert({ where: { id: 1 }, create: { id: 1, documentAutosaveEnabled: enabled, documentAutosaveDelay: delay }, update: { documentAutosaveEnabled: enabled, documentAutosaveDelay: delay } });
        res.json({ enabled: setting.documentAutosaveEnabled, delay: setting.documentAutosaveDelay });
    } catch (error) { next(error); }
});

export default router;
