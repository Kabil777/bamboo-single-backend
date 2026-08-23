import { PrismaManager } from "../../lib/prisma.js";
import { ForbiddenError, NotFoundError, ValidationError } from "../../common/errors.js";

const prisma = PrismaManager.getClient();

const authorSelect = { id: true, name: true, pictureUrl: true } as const;

function toPostResponse(post: {
    id: string;
    title: string;
    description: string | null;
    content: string;
    visibility: string;
    authorId: string;
    mediaId: string | null;
    createdAt: Date;
    updatedAt: Date;
    author: { id: string; name: string; pictureUrl: string | null };
    _count: { likes: number };
}, viewerHasLiked = false, viewerHasBookmarked = false, viewerCanEdit = false) {
    return {
        id: post.id,
        title: post.title,
        description: post.description,
        content: post.content,
        visibility: post.visibility,
        authorId: post.authorId,
        mediaId: post.mediaId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: post.author,
        likesCount: post._count.likes,
        viewerHasLiked,
        viewerHasBookmarked,
        viewerCanEdit,
    };
}

export class PostsService {
    async list(viewerId?: string) {
        const posts = await prisma.post.findMany({
            where: { visibility: "PUBLIC" },
            orderBy: { createdAt: "desc" },
            include: { author: { select: authorSelect }, _count: { select: { likes: true } } },
        });
        return { data: posts.map((post) => toPostResponse(post, false, false, post.authorId === viewerId)) };
    }

    async getById(id: string, viewerId?: string) {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                author: { select: authorSelect },
                _count: { select: { likes: true } },
                ...(viewerId ? {
                    likes: { where: { userId: viewerId }, select: { userId: true } },
                    bookmarks: { where: { userId: viewerId }, select: { userId: true } },
                } : {}),
            },
        });
        if (!post) throw new NotFoundError("Post not found");
        const viewerCanEdit = await this.canManage(post.authorId, viewerId);
        if (post.visibility === "PRIVATE" && !viewerCanEdit) throw new NotFoundError("Post not found");
        const viewerHasLiked = "likes" in post && post.likes.length > 0;
        const viewerHasBookmarked = "bookmarks" in post && post.bookmarks.length > 0;
        return toPostResponse(post, viewerHasLiked, viewerHasBookmarked, viewerCanEdit);
    }

    async create(authorId: string, input: unknown) {
        const { title, description, content, mediaId, visibility } = this.validatePostInput(input, false);
        if (mediaId) await this.assertMediaOwnedBy(mediaId, authorId);
        const post = await prisma.post.create({
            data: { title: title!, description, content: content!, authorId, mediaId, visibility },
            include: { author: { select: authorSelect }, _count: { select: { likes: true } } },
        });
        return toPostResponse(post);
    }

    async update(id: string, actorId: string, input: unknown) {
        const existing = await prisma.post.findUnique({ where: { id }, select: { authorId: true } });
        if (!existing) throw new NotFoundError("Post not found");
        await this.assertCanManage(existing.authorId, actorId);
        const { title, description, content, mediaId, visibility } = this.validatePostInput(input, true);
        if (mediaId) await this.assertMediaOwnedBy(mediaId, actorId);
        const post = await prisma.post.update({
            where: { id },
            data: {
                ...(title !== undefined ? { title } : {}),
                ...(description !== undefined ? { description } : {}),
                ...(content !== undefined ? { content } : {}),
                ...(visibility !== undefined ? { visibility } : {}),
                ...(mediaId !== undefined ? { mediaId } : {}),
            },
            include: { author: { select: authorSelect }, _count: { select: { likes: true } } },
        });
        return toPostResponse(post);
    }

    async delete(id: string, actorId: string) {
        const existing = await prisma.post.findUnique({ where: { id }, select: { authorId: true } });
        if (!existing) throw new NotFoundError("Post not found");
        await this.assertCanManage(existing.authorId, actorId);
        await prisma.post.delete({ where: { id } });
    }

    async like(id: string, userId: string, shouldLike: boolean) {
        const post = await prisma.post.findUnique({ where: { id }, select: { id: true } });
        if (!post) throw new NotFoundError("Post not found");
        if (shouldLike) {
            await prisma.postLike.upsert({
                where: { postId_userId: { postId: id, userId } },
                create: { postId: id, userId },
                update: {},
            });
        } else {
            await prisma.postLike.deleteMany({ where: { postId: id, userId } });
        }
        const likesCount = await prisma.postLike.count({ where: { postId: id } });
        return { likesCount, viewerHasLiked: shouldLike };
    }

    async bookmark(id: string, userId: string, shouldBookmark: boolean) {
        const post = await prisma.post.findUnique({ where: { id }, select: { id: true } });
        if (!post) throw new NotFoundError("Post not found");
        if (shouldBookmark) {
            await prisma.postBookmark.upsert({ where: { postId_userId: { postId: id, userId } }, create: { postId: id, userId }, update: {} });
        } else {
            await prisma.postBookmark.deleteMany({ where: { postId: id, userId } });
        }
        return { viewerHasBookmarked: shouldBookmark };
    }

    private validatePostInput(input: unknown, partial: boolean) {
        if (!input || typeof input !== "object" || Array.isArray(input)) throw new ValidationError("Body must be a JSON object");
        const data = input as Record<string, unknown>;
        const title = data.title;
        const description = data.description;
        const content = data.content;
        const mediaId = data.mediaId;
        const visibility = data.visibility;
        if (!partial && (typeof title !== "string" || typeof content !== "string")) {
            throw new ValidationError("title and content are required strings");
        }
        if (title !== undefined && (typeof title !== "string" || !title.trim() || title.length > 200)) {
            throw new ValidationError("title must be a non-empty string up to 200 characters");
        }
        if (description !== undefined && description !== null && (typeof description !== "string" || description.length > 1000)) {
            throw new ValidationError("description must be a string up to 1000 characters");
        }
        if (content !== undefined && typeof content !== "string") throw new ValidationError("content must be a string");
        if (mediaId !== undefined && mediaId !== null && typeof mediaId !== "string") throw new ValidationError("mediaId must be a UUID or null");
        if (visibility !== undefined && visibility !== "PUBLIC" && visibility !== "UNLISTED" && visibility !== "PRIVATE") throw new ValidationError("visibility must be PUBLIC, UNLISTED, or PRIVATE");
        return {
            title: title === undefined ? undefined : title.trim(),
            description: description === undefined ? undefined : typeof description === "string" ? description.trim() || null : null,
            content,
            mediaId: mediaId === undefined ? undefined : mediaId,
            visibility: visibility === undefined ? undefined : visibility,
        };
    }

    private async assertCanManage(authorId: string, actorId: string) {
        if (await this.canManage(authorId, actorId)) return;
        throw new ForbiddenError("Only the post owner or an ADMIN can modify this post");
    }

    private async canManage(authorId: string, actorId?: string) {
        if (!actorId) return false;
        if (authorId === actorId) return true;
        const user = await prisma.user.findUnique({ where: { id: actorId }, select: { role: true } });
        return user?.role === "ADMIN";
    }

    private async assertMediaOwnedBy(id: string, ownerId: string) {
        const media = await prisma.mediaAsset.findUnique({ where: { id }, select: { ownerId: true } });
        if (!media) throw new ValidationError("mediaId does not exist");
        if (media.ownerId !== ownerId) throw new ForbiddenError("You can only attach your own media");
    }
}

export const postsService = new PostsService();
