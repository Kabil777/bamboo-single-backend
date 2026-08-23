import { Router } from "express";
import { PrismaManager } from "../../lib/prisma.js";
import { NotFoundError } from "../../common/errors.js";
import { authOptional, authRequired } from "../../common/middleware/authMiddleware.js";
import { documentService } from "./document.service.js";
const router = Router();
const prisma = PrismaManager.getClient();
const author = { id: true, name: true, pictureUrl: true };
router.get("/", authOptional, async (_req, res, next) => {
    try {
        const data = await prisma.document.findMany({ where: { visibility: "PUBLIC" }, orderBy: { createdAt: "desc" }, include: { author: { select: author } } });
        res.json({ data });
    }
    catch (error) {
        next(error);
    }
});
router.get("/me", authRequired, async (req, res, next) => {
    try {
        const data = await prisma.document.findMany({
            where: { authorId: req.headers["x-user-id"] },
            orderBy: { createdAt: "desc" },
            include: { author: { select: author } },
        });
        res.json({ data });
    }
    catch (error) {
        next(error);
    }
});
router.post("/", authRequired, async (req, res, next) => {
    try {
        res.status(201).json(await documentService.create(req.headers["x-user-id"], req.body));
    }
    catch (error) {
        next(error);
    }
});
router.get("/:id", authOptional, async (req, res, next) => {
    try {
        const document = await prisma.document.findUnique({
            where: { id: String(req.params.id) },
            include: {
                author: { select: author },
                pages: { orderBy: { position: "asc" } },
            },
        });
        if (!document)
            throw new NotFoundError("Document not found");
        if (document.visibility === "PRIVATE" && !(await canManage(document.authorId, req.headers["x-user-id"])))
            throw new NotFoundError("Document not found");
        res.json({ ...document, viewerCanEdit: await canManage(document.authorId, req.headers["x-user-id"]) });
    }
    catch (error) {
        next(error);
    }
});
router.patch("/:id", authRequired, async (req, res, next) => {
    try {
        res.json(await documentService.update(String(req.params.id), req.headers["x-user-id"], req.body));
    }
    catch (error) {
        next(error);
    }
});
router.delete("/:id", authRequired, async (req, res, next) => {
    try {
        await documentService.delete(String(req.params.id), req.headers["x-user-id"]);
        res.status(204).end();
    }
    catch (error) {
        next(error);
    }
});
router.post("/:id/pages", authRequired, async (req, res, next) => {
    try {
        res.status(201).json(await documentService.createPage(String(req.params.id), req.headers["x-user-id"], req.body));
    }
    catch (error) {
        next(error);
    }
});
router.patch("/:id/pages/:pageId", authRequired, async (req, res, next) => {
    try {
        res.json(await documentService.updatePage(String(req.params.id), String(req.params.pageId), req.headers["x-user-id"], req.body));
    }
    catch (error) {
        next(error);
    }
});
export default router;
async function canManage(authorId, actorId) {
    if (!actorId)
        return false;
    if (authorId === actorId)
        return true;
    const user = await prisma.user.findUnique({ where: { id: actorId }, select: { role: true } });
    return user?.role === "ADMIN";
}
//# sourceMappingURL=document.routes.js.map