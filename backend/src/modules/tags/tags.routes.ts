import { Router } from "express";
import { ValidationError, NotFoundError } from "../../common/errors.js";
import { adminRequired, authRequired } from "../../common/middleware/authMiddleware.js";
import { PrismaManager } from "../../lib/prisma.js";

const router = Router();
const prisma = PrismaManager.getClient();
const categories = new Set(["DESIGNATION", "INTEREST"]);

router.get("/", async (_req, res, next) => {
    try { res.json({ data: await prisma.tag.findMany({ orderBy: [{ category: "asc" }, { label: "asc" }] }) }); }
    catch (error) { next(error); }
});

// Used by the Administration screen to verify access against the backend,
// rather than trusting a client-side role value.
router.get("/manage", authRequired, adminRequired, async (_req, res, next) => {
    try { res.json({ data: await prisma.tag.findMany({ orderBy: [{ category: "asc" }, { label: "asc" }] }) }); }
    catch (error) { next(error); }
});

router.post("/", authRequired, adminRequired, async (req, res, next) => {
    try {
        const { label, category } = req.body ?? {};
        if (typeof label !== "string" || !label.trim() || label.trim().length > 80) throw new ValidationError("label must be a non-empty string up to 80 characters");
        if (typeof category !== "string" || !categories.has(category)) throw new ValidationError("category must be DESIGNATION or INTEREST");
        const normalized = label.trim();
        const exists = await prisma.tag.findFirst({ where: { category, label: { equals: normalized, mode: "insensitive" } } });
        if (exists) throw new ValidationError("This tag already exists in that category");
        res.status(201).json({ data: await prisma.tag.create({ data: { label: normalized, category } }) });
    } catch (error) { next(error); }
});

router.delete("/:id", authRequired, adminRequired, async (req, res, next) => {
    try {
        const result = await prisma.tag.deleteMany({ where: { id: String(req.params.id) } });
        if (!result.count) throw new NotFoundError("Tag not found");
        res.status(204).send();
    } catch (error) { next(error); }
});

export default router;
