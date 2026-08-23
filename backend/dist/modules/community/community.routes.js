import { Router } from "express";
import { PrismaManager } from "../../lib/prisma.js";
import { authOptional, authRequired } from "../../common/middleware/authMiddleware.js";
import { NotFoundError } from "../../common/errors.js";
const router = Router();
const prisma = PrismaManager.getClient();
const author = { id: true, name: true, pictureUrl: true };
router.get("/me/stats", authRequired, async (req, res, next) => {
    try {
        const userId = req.headers["x-user-id"];
        const [posts, docs, bookmarks] = await Promise.all([
            prisma.post.groupBy({ by: ["visibility"], where: { authorId: userId }, _count: { _all: true } }),
            prisma.document.groupBy({ by: ["visibility"], where: { authorId: userId }, _count: { _all: true } }),
            prisma.postBookmark.count({ where: { userId } }),
        ]);
        res.json({ posts: countByVisibility(posts), docs: countByVisibility(docs), bookmarks });
    }
    catch (error) {
        next(error);
    }
});
router.get("/users/:id", authOptional, async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: String(req.params.id) }, select: { id: true, name: true, pictureUrl: true } });
        if (!user)
            throw new NotFoundError("User not found");
        const isOwner = await canManage(user.id, req.headers["x-user-id"]);
        const [posts, docs] = await Promise.all([
            prisma.post.groupBy({ by: ["visibility"], where: { authorId: user.id, ...(isOwner ? {} : { visibility: "PUBLIC" }) }, _count: { _all: true } }),
            prisma.document.groupBy({ by: ["visibility"], where: { authorId: user.id, ...(isOwner ? {} : { visibility: "PUBLIC" }) }, _count: { _all: true } }),
        ]);
        res.json({ id: user.id, name: user.name, coverUrl: user.pictureUrl, designation: "", profile: { tags: [], social: {} }, stats: { posts: countByVisibility(posts), docs: countByVisibility(docs) } });
    }
    catch (error) {
        next(error);
    }
});
router.get("/users/:id/posts", authOptional, async (req, res, next) => {
    try {
        const authorId = String(req.params.id);
        const isOwner = await canManage(authorId, req.headers["x-user-id"]);
        const data = await prisma.post.findMany({
            where: { authorId, ...(isOwner ? {} : { visibility: "PUBLIC" }) },
            orderBy: { createdAt: "desc" },
            include: { author: { select: author }, _count: { select: { likes: true, bookmarks: true } } },
        });
        res.json({ data });
    }
    catch (error) {
        next(error);
    }
});
router.get("/users/:id/docs", authOptional, async (req, res, next) => {
    try {
        const authorId = String(req.params.id);
        const isOwner = await canManage(authorId, req.headers["x-user-id"]);
        const data = await prisma.document.findMany({
            where: { authorId, ...(isOwner ? {} : { visibility: "PUBLIC" }) },
            orderBy: { createdAt: "desc" },
            include: { author: { select: author } },
        });
        res.json({ data });
    }
    catch (error) {
        next(error);
    }
});
router.get("/me", authRequired, async (req, res, next) => {
    try {
        const id = req.headers["x-user-id"];
        const user = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, pictureUrl: true, role: true, createdAt: true } });
        if (!user)
            throw new NotFoundError("User not found");
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
router.get("/me/posts", authRequired, async (req, res, next) => {
    try {
        const userId = req.headers["x-user-id"];
        const data = await prisma.post.findMany({ where: { authorId: userId }, orderBy: { createdAt: "desc" }, include: { author: { select: author }, _count: { select: { likes: true, bookmarks: true } } } });
        res.json({ data });
    }
    catch (error) {
        next(error);
    }
});
router.get("/me/bookmarks/count", authRequired, async (req, res, next) => {
    try {
        const userId = req.headers["x-user-id"];
        const count = await prisma.postBookmark.count({ where: { userId } });
        res.json({ count });
    }
    catch (error) {
        next(error);
    }
});
router.get("/me/bookmarks", authRequired, async (req, res, next) => {
    try {
        const userId = req.headers["x-user-id"];
        const rows = await prisma.postBookmark.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { post: { include: { author: { select: author }, _count: { select: { likes: true, bookmarks: true } } } } } });
        const data = rows.map((row) => row.post);
        res.json({ data, count: data.length });
    }
    catch (error) {
        next(error);
    }
});
export default router;
function countByVisibility(rows) {
    const counts = new Map(rows.map((row) => [row.visibility, row._count._all]));
    const publicCount = counts.get("PUBLIC") ?? 0;
    const unlistedCount = counts.get("UNLISTED") ?? 0;
    const privateCount = counts.get("PRIVATE") ?? 0;
    return { total: publicCount + unlistedCount + privateCount, publicCount, unlistedCount, privateCount };
}
async function canManage(authorId, actorId) {
    if (!actorId)
        return false;
    if (authorId === actorId)
        return true;
    const user = await prisma.user.findUnique({ where: { id: actorId }, select: { role: true } });
    return user?.role === "ADMIN";
}
//# sourceMappingURL=community.routes.js.map