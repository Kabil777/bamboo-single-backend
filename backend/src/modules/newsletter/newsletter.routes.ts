import { Router } from "express";
import { PrismaManager } from "../../lib/prisma.js";
import { adminRequired, authRequired } from "../../common/middleware/authMiddleware.js";
import { NotFoundError, ValidationError } from "../../common/errors.js";

const router = Router();
const prisma = PrismaManager.getClient();
const author = { id: true, name: true, pictureUrl: true } as const;

function input(body: unknown) {
    if (!body || typeof body !== "object") throw new ValidationError("Body must be a JSON object");
    const value = body as Record<string, unknown>;
    if (typeof value.title !== "string" || typeof value.subject !== "string" || typeof value.content !== "string") throw new ValidationError("title, subject and content are required strings");
    return { title: value.title.trim(), subject: value.subject.trim(), content: value.content };
}

router.get("/", async (_req, res, next) => { try { res.json({ data: await prisma.newsletter.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, include: { author: { select: author } } }) }); } catch (e) { next(e); } });
router.get("/:id", async (req, res, next) => { try { const item = await prisma.newsletter.findFirst({ where: { id: String(req.params.id), status: "PUBLISHED" }, include: { author: { select: author } } }); if (!item) throw new NotFoundError("Newsletter not found"); res.json(item); } catch (e) { next(e); } });
router.post("/", authRequired, adminRequired, async (req, res, next) => { try { res.status(201).json(await prisma.newsletter.create({ data: { ...input(req.body), authorId: req.headers["x-user-id"] as string }, include: { author: { select: author } } })); } catch (e) { next(e); } });
router.patch("/:id", authRequired, adminRequired, async (req, res, next) => { try { res.json(await prisma.newsletter.update({ where: { id: String(req.params.id) }, data: input(req.body), include: { author: { select: author } } })); } catch (e) { next(e); } });
router.post("/:id/publish", authRequired, adminRequired, async (req, res, next) => { try { res.json(await prisma.newsletter.update({ where: { id: String(req.params.id) }, data: { status: "PUBLISHED", publishedAt: new Date() }, include: { author: { select: author } } })); } catch (e) { next(e); } });
export default router;
