import { PrismaManager } from "../../lib/prisma.js";
import { ForbiddenError, NotFoundError, ValidationError } from "../../common/errors.js";
const prisma = PrismaManager.getClient();
const MAX_DOCUMENT_CONTENT_BYTES = 10 * 1024 * 1024;
const MAX_PAGE_CONTENT_BYTES = 10 * 1024 * 1024;
function byteLength(value) {
    return Buffer.byteLength(value, "utf8");
}
export class DocumentService {
    async create(authorId, input) {
        const { title, content, mediaId, visibility } = this.validateDocument(input, false);
        if (mediaId)
            await this.assertMediaOwnedBy(mediaId, authorId);
        return prisma.document.create({
            data: { title: title, content: content, authorId, mediaId, visibility },
        });
    }
    async update(id, actorId, input) {
        const existing = await prisma.document.findUnique({ where: { id }, select: { authorId: true } });
        if (!existing)
            throw new NotFoundError("Document not found");
        await this.assertCanManage(existing.authorId, actorId);
        const { title, content, mediaId, visibility } = this.validateDocument(input, true);
        if (mediaId)
            await this.assertMediaOwnedBy(mediaId, actorId);
        return prisma.document.update({
            where: { id },
            data: {
                ...(title !== undefined ? { title } : {}),
                ...(content !== undefined ? { content } : {}),
                ...(mediaId !== undefined ? { mediaId } : {}),
                ...(visibility !== undefined ? { visibility } : {}),
            },
        });
    }
    async delete(id, actorId) {
        const existing = await prisma.document.findUnique({ where: { id }, select: { authorId: true } });
        if (!existing)
            throw new NotFoundError("Document not found");
        await this.assertCanManage(existing.authorId, actorId);
        // DocumentPage rows are removed by the database's cascade relation.
        await prisma.document.delete({ where: { id } });
    }
    async createPage(documentId, actorId, input) {
        const document = await prisma.document.findUnique({ where: { id: documentId }, select: { authorId: true } });
        if (!document)
            throw new NotFoundError("Document not found");
        await this.assertCanManage(document.authorId, actorId);
        const { title, content, position, parentId } = this.validatePage(input, false);
        if (parentId)
            await this.assertPageBelongsToDocument(parentId, documentId);
        return prisma.documentPage.create({ data: { documentId, title: title, content: content, position: position, parentId } });
    }
    async updatePage(documentId, pageId, actorId, input) {
        const document = await prisma.document.findUnique({ where: { id: documentId }, select: { authorId: true } });
        if (!document)
            throw new NotFoundError("Document not found");
        await this.assertCanManage(document.authorId, actorId);
        const page = await prisma.documentPage.findFirst({ where: { id: pageId, documentId }, select: { id: true } });
        if (!page)
            throw new NotFoundError("Document page not found");
        const { title, content, position, parentId } = this.validatePage(input, true);
        if (parentId)
            await this.assertPageBelongsToDocument(parentId, documentId);
        return prisma.documentPage.update({
            where: { id: pageId },
            data: {
                ...(title !== undefined ? { title } : {}),
                ...(content !== undefined ? { content } : {}),
                ...(position !== undefined ? { position } : {}),
                ...(parentId !== undefined ? { parentId } : {}),
            },
        });
    }
    validateDocument(input, partial) {
        if (!input || typeof input !== "object" || Array.isArray(input))
            throw new ValidationError("Body must be a JSON object");
        const data = input;
        const { title, content, mediaId, visibility } = data;
        if (!partial && typeof title !== "string")
            throw new ValidationError("title is required");
        if (title !== undefined && (typeof title !== "string" || !title.trim() || title.length > 200))
            throw new ValidationError("title must be a non-empty string up to 200 characters");
        if (content !== undefined && typeof content !== "string")
            throw new ValidationError("content must be a string");
        if (content !== undefined && byteLength(content) > MAX_DOCUMENT_CONTENT_BYTES)
            throw new ValidationError("content must be at most 10 MiB");
        if (visibility !== undefined && visibility !== "PUBLIC" && visibility !== "UNLISTED" && visibility !== "PRIVATE")
            throw new ValidationError("visibility must be PUBLIC, UNLISTED, or PRIVATE");
        if (!partial && content === undefined)
            return { title: title.trim(), content: "", mediaId: this.validateMediaId(mediaId), visibility: visibility ?? "PUBLIC" };
        return { title: title === undefined ? undefined : title.trim(), content, mediaId: this.validateMediaId(mediaId), visibility: visibility === undefined ? undefined : visibility };
    }
    validatePage(input, partial) {
        if (!input || typeof input !== "object" || Array.isArray(input))
            throw new ValidationError("Body must be a JSON object");
        const data = input;
        const { title, content, position, parentId } = data;
        if (!partial && (typeof title !== "string" || typeof position !== "number" || !Number.isInteger(position)))
            throw new ValidationError("title and integer position are required");
        if (title !== undefined && (typeof title !== "string" || !title.trim() || title.length > 200))
            throw new ValidationError("title must be a non-empty string up to 200 characters");
        if (content !== undefined && typeof content !== "string")
            throw new ValidationError("content must be a string");
        if (content !== undefined && byteLength(content) > MAX_PAGE_CONTENT_BYTES)
            throw new ValidationError("page content must be at most 10 MiB");
        if (position !== undefined && (typeof position !== "number" || !Number.isInteger(position) || position < 0))
            throw new ValidationError("position must be a non-negative integer");
        if (parentId !== undefined && parentId !== null && typeof parentId !== "string")
            throw new ValidationError("parentId must be a UUID or null");
        return { title: title === undefined ? undefined : title.trim(), content: content === undefined ? (partial ? undefined : "") : content, position, parentId };
    }
    validateMediaId(mediaId) {
        if (mediaId !== undefined && mediaId !== null && typeof mediaId !== "string")
            throw new ValidationError("mediaId must be a UUID or null");
        return mediaId;
    }
    async assertCanManage(authorId, actorId) {
        if (authorId === actorId)
            return;
        const user = await prisma.user.findUnique({ where: { id: actorId }, select: { role: true } });
        if (user?.role !== "ADMIN")
            throw new ForbiddenError("Only the document owner or an ADMIN can modify this document");
    }
    async assertMediaOwnedBy(id, ownerId) {
        const media = await prisma.mediaAsset.findUnique({ where: { id }, select: { ownerId: true } });
        if (!media)
            throw new ValidationError("mediaId does not exist");
        if (media.ownerId !== ownerId)
            throw new ForbiddenError("You can only attach your own media");
    }
    async assertPageBelongsToDocument(pageId, documentId) {
        const page = await prisma.documentPage.findFirst({ where: { id: pageId, documentId }, select: { id: true } });
        if (!page)
            throw new ValidationError("parentId must belong to this document");
    }
}
export const documentService = new DocumentService();
//# sourceMappingURL=document.service.js.map