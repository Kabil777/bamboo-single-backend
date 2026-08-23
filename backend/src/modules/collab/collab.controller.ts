import { Request, Response } from "express";
import { PrismaManager } from "../../lib/prisma.js";
import { JwtHelper } from "../../lib/jwt.js";
import { logger } from "../../lib/logger.js";
import { generateMarkdown } from "../../lib/helpers/yToMarkdown.js";
import { saveDocs } from "../../lib/helpers/saveDocsHelper.js";
import { BlogStateRepository } from "../../repository/collab/BlogStateRepository.js";
import { DocsStateRepository } from "../../repository/collab/DocsStateRepository.js";
import { DocsSidebarStateRepository } from "../../repository/collab/DocsSideBarState.js";
import { CollabServer } from "../../ws/servers/CollabServer.js";
import * as Y from "yjs";

function extractTitleFromMarkdown(markdown: string): string {
    const lines = markdown.split("\n");
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("# ")) {
            return trimmed.slice(2).trim();
        }
    }
    return "Untitled";
}

export class CollabController {
    private readonly prisma = PrismaManager.getClient();
    private readonly jwtHelper = new JwtHelper();
    private readonly blogStateRepository = new BlogStateRepository();
    private readonly docsStateRepository = new DocsStateRepository();
    private readonly docsSidebarRepository = new DocsSidebarStateRepository();

    constructor(private readonly collabServer: CollabServer) {}

    private async getUserFromReq(req: Request) {
        const token = this.jwtHelper.parseJwtFromRequest(req);
        if (!token) throw new Error("Missing access token");
        const payload = await this.jwtHelper.verifyAccessToken(token);
        const userId = (payload.id || payload.sub) as string;
        if (!userId) throw new Error("Invalid token");
        return { userId, payload };
    }

    public handleSaveBlog = async (req: Request<{ id: string }>, res: Response) => {
        try {
            const { id } = req.params;
            const { visibility = "PUBLIC" } = req.body || {};
            const { userId, payload } = await this.getUserFromReq(req);

            const documentName = `blog:${id}`;
            let markdownContent = "";

            const liveDocument = this.collabServer
                .getInstance()
                .hocuspocus.documents.get(documentName);

            if (liveDocument) {
                markdownContent = generateMarkdown(liveDocument);
                await this.blogStateRepository.saveBlogStateById(
                    id,
                    Y.encodeStateAsUpdate(liveDocument),
                );
            } else {
                const state = await this.blogStateRepository.getBlogStateById(id);
                if (state) {
                    const ydoc = new Y.Doc();
                    Y.applyUpdate(ydoc, state);
                    markdownContent = generateMarkdown(ydoc);
                }
            }

            const title = extractTitleFromMarkdown(markdownContent);
            const userRole = (payload as any).role;

            const existingPost = await this.prisma.post.findUnique({
                where: { id },
            });

            if (existingPost) {
                if (existingPost.authorId !== userId && userRole !== "ADMIN") {
                    return res.status(403).json({ ok: false, message: "Forbidden: Not the author" });
                }
                await this.prisma.post.update({
                    where: { id },
                    data: {
                        title: existingPost.title !== "Untitled" && existingPost.title ? existingPost.title : title,
                        content: markdownContent,
                        visibility,
                        updatedAt: new Date(),
                    },
                });
            } else {
                await this.prisma.post.create({
                    data: {
                        id,
                        title,
                        content: markdownContent,
                        visibility,
                        authorId: userId,
                    },
                });
            }

            if (liveDocument) {
                const meta = liveDocument.getMap("meta");
                liveDocument.transact(() => {
                    meta.set("saveStatus", "SAVED");
                    meta.set("lastPersistedAt", Date.now());
                });
            }

            logger.info({ blogId: id, userId }, "Blog saved successfully");
            return res.status(200).json({ ok: true, message: "Blog saved successfully" });
        } catch (error: any) {
            logger.error({ err: error }, "Failed to save blog");
            return res.status(500).json({ ok: false, message: error?.message || "Failed to save blog" });
        }
    };

    public handleSaveDocs = async (req: Request<{ id: string }>, res: Response) => {
        try {
            const { id } = req.params;
            const { visibility = "PUBLIC", status = "PUBLISHED" } = req.body || {};
            const { userId, payload } = await this.getUserFromReq(req);
            const userRole = (payload as any).role;

            const savePayload = await saveDocs({
                docId: id,
                visibility,
                status,
                ownerId: userId,
                collabServer: this.collabServer,
                docsRepository: this.docsStateRepository,
                docsSideBarRepository: this.docsSidebarRepository,
            });

            if (!savePayload) {
                return res.status(400).json({ ok: false, message: "Failed to lookup docs state" });
            }

            const existingDoc = await this.prisma.document.findUnique({
                where: { id },
                include: { pages: true },
            });

            if (existingDoc && existingDoc.authorId !== userId && userRole !== "ADMIN") {
                return res.status(403).json({ ok: false, message: "Only owner can save docs" });
            }

            const rootPage = savePayload.tree[0];
            const title = rootPage?.title || "Untitled Docs";
            const content = rootPage?.content || "";

            let docId = id;
            if (!existingDoc) {
                const created = await this.prisma.document.create({
                    data: {
                        id,
                        title,
                        content,
                        visibility,
                        authorId: userId,
                    },
                });
                docId = created.id;
            } else {
                await this.prisma.document.update({
                    where: { id },
                    data: {
                        title: existingDoc.title !== "Untitled Docs" && existingDoc.title ? existingDoc.title : title,
                        content,
                        visibility,
                        updatedAt: new Date(),
                    },
                });
            }

            // Sync document pages
            for (let i = 0; i < savePayload.pages.length; i++) {
                const page = savePayload.pages[i];
                const matchingNode = savePayload.tree.find((n) => n.id === page.pageId);
                const pageTitle = matchingNode?.title || `Page ${i + 1}`;

                await this.prisma.documentPage.upsert({
                    where: { id: page.pageId },
                    update: {
                        title: pageTitle,
                        content: page.markdown,
                        position: i,
                        updatedAt: new Date(),
                    },
                    create: {
                        id: page.pageId,
                        documentId: docId,
                        title: pageTitle,
                        content: page.markdown,
                        position: i,
                    },
                });
            }

            const liveSidebarDoc = this.collabServer
                .getInstance()
                .hocuspocus.documents.get(`docs:sidebar:${id}`);
            if (liveSidebarDoc) {
                const meta = liveSidebarDoc.getMap("meta");
                liveSidebarDoc.transact(() => {
                    meta.set("saveStatus", "SAVED");
                    meta.set("lastPersistedAt", Date.now());
                });
            }

            logger.info({ docsId: id, userId }, "Docs saved successfully");
            return res.status(200).json({ ok: true, message: "Docs saved successfully" });
        } catch (error: any) {
            logger.error({ err: error }, "Failed to save docs");
            return res.status(500).json({ ok: false, message: error?.message || "Failed to save docs" });
        }
    };

    public handleGetBlogRole = async (req: Request<{ id: string }>, res: Response) => {
        try {
            const { id } = req.params;
            const { userId, payload } = await this.getUserFromReq(req);
            const userRole = (payload as any).role;

            if (userRole === "ADMIN") {
                return res.status(200).json({ ok: true, role: "OWNER", readOnly: false, message: "" });
            }

            const post = await this.prisma.post.findUnique({ where: { id } });
            if (!post || post.authorId === userId) {
                return res.status(200).json({ ok: true, role: "OWNER", readOnly: false, message: "" });
            }

            if (post.visibility === "PUBLIC") {
                return res.status(200).json({ ok: true, role: "VIEWER", readOnly: true, message: "" });
            }

            return res.status(403).json({ ok: false, role: "NONE", readOnly: true, message: "Forbidden" });
        } catch (error: any) {
            return res.status(401).json({ ok: false, message: error?.message || "Unauthorized" });
        }
    };

    public handleGetDocsRole = async (req: Request<{ id: string }>, res: Response) => {
        try {
            const { id } = req.params;
            const { userId, payload } = await this.getUserFromReq(req);
            const userRole = (payload as any).role;

            if (userRole === "ADMIN") {
                return res.status(200).json({ ok: true, role: "OWNER", readOnly: false, message: "" });
            }

            const doc = await this.prisma.document.findUnique({ where: { id } });
            if (!doc || doc.authorId === userId) {
                return res.status(200).json({ ok: true, role: "OWNER", readOnly: false, message: "" });
            }

            if (doc.visibility === "PUBLIC") {
                return res.status(200).json({ ok: true, role: "VIEWER", readOnly: true, message: "" });
            }

            return res.status(403).json({ ok: false, role: "NONE", readOnly: true, message: "Forbidden" });
        } catch (error: any) {
            return res.status(401).json({ ok: false, message: error?.message || "Unauthorized" });
        }
    };

    public handleListBlogRoles = async (req: Request<{ id: string }>, res: Response) => {
        try {
            const { id } = req.params;
            const post = await this.prisma.post.findUnique({
                where: { id },
                include: { author: true, roles: { include: { user: true } } },
            });
            if (!post) {
                return res.status(200).json([]);
            }

            const memberRoles = post.roles.map(r => ({
                userId: r.user.id,
                userEmail: r.user.email,
                userName: r.user.name,
                userHandle: r.user.name,
                userCoverUrl: r.user.pictureUrl,
                role: r.role,
            }));

            return res.status(200).json([
                {
                    userId: post.author.id,
                    userEmail: post.author.email,
                    userName: post.author.name,
                    userHandle: post.author.name,
                    userCoverUrl: post.author.pictureUrl,
                    role: "OWNER",
                },
                ...memberRoles
            ]);
        } catch (error: any) {
            return res.status(200).json([]);
        }
    };

    public handleAddBlogRole = async (req: Request<{ id: string }>, res: Response) => {
        try {
            const { id } = req.params;
            const { userEmail, role } = req.body;
            
            const user = await this.prisma.user.findFirst({ where: { email: userEmail } });
            if (!user) {
                return res.status(404).json({ ok: false, message: "User not found" });
            }
            
            await this.prisma.postRole.upsert({
                where: { postId_userId: { postId: id, userId: user.id } },
                update: { role },
                create: { postId: id, userId: user.id, role }
            });
            return res.status(200).json({ ok: true, message: "Role added" });
        } catch (error: any) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    };

    public handleUpdateBlogRole = async (req: Request<{ id: string }>, res: Response) => {
        try {
            const { id } = req.params;
            const targetEmail = req.query.targetEmail as string;
            const { role } = req.body;

            const user = await this.prisma.user.findFirst({ where: { email: targetEmail } });
            if (!user) return res.status(404).json({ ok: false, message: "User not found" });

            await this.prisma.postRole.update({
                where: { postId_userId: { postId: id, userId: user.id } },
                data: { role }
            });
            return res.status(200).json({ ok: true, message: "Role updated" });
        } catch (error: any) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    };

    public handleDeleteBlogRole = async (req: Request<{ id: string }>, res: Response) => {
        try {
            const { id } = req.params;
            const targetEmail = req.query.targetEmail as string;

            const user = await this.prisma.user.findFirst({ where: { email: targetEmail } });
            if (!user) return res.status(404).json({ ok: false, message: "User not found" });

            await this.prisma.postRole.delete({
                where: { postId_userId: { postId: id, userId: user.id } }
            });
            return res.status(200).json({ ok: true, message: "Role deleted" });
        } catch (error: any) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    };

    public handleListDocsRoles = async (req: Request<{ id: string }>, res: Response) => {
        try {
            const { id } = req.params;
            const doc = await this.prisma.document.findUnique({
                where: { id },
                include: { author: true, roles: { include: { user: true } } },
            });
            if (!doc) {
                return res.status(200).json([]);
            }

            const memberRoles = doc.roles.map(r => ({
                userId: r.user.id,
                email: r.user.email,
                name: r.user.name,
                handle: r.user.name,
                coverUrl: r.user.pictureUrl,
                role: r.role,
            }));

            return res.status(200).json([
                {
                    userId: doc.author.id,
                    email: doc.author.email,
                    name: doc.author.name,
                    handle: doc.author.name,
                    coverUrl: doc.author.pictureUrl,
                    role: "OWNER",
                },
                ...memberRoles
            ]);
        } catch (error: any) {
            return res.status(200).json([]);
        }
    };

    public handleAddDocsRole = async (req: Request<{ id: string }>, res: Response) => {
        try {
            const { id } = req.params;
            const { userEmail, role } = req.body;
            
            const user = await this.prisma.user.findFirst({ where: { email: userEmail } });
            if (!user) {
                return res.status(404).json({ ok: false, message: "User not found" });
            }
            
            await this.prisma.documentRole.upsert({
                where: { documentId_userId: { documentId: id, userId: user.id } },
                update: { role },
                create: { documentId: id, userId: user.id, role }
            });
            return res.status(200).json({ ok: true, message: "Role added" });
        } catch (error: any) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    };

    public handleUpdateDocsRole = async (req: Request<{ id: string }>, res: Response) => {
        try {
            const { id } = req.params;
            const targetEmail = req.query.targetEmail as string;
            const { role } = req.body;

            const user = await this.prisma.user.findFirst({ where: { email: targetEmail } });
            if (!user) return res.status(404).json({ ok: false, message: "User not found" });

            await this.prisma.documentRole.update({
                where: { documentId_userId: { documentId: id, userId: user.id } },
                data: { role }
            });
            return res.status(200).json({ ok: true, message: "Role updated" });
        } catch (error: any) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    };

    public handleDeleteDocsRole = async (req: Request<{ id: string }>, res: Response) => {
        try {
            const { id } = req.params;
            const targetEmail = req.query.targetEmail as string;

            const user = await this.prisma.user.findFirst({ where: { email: targetEmail } });
            if (!user) return res.status(404).json({ ok: false, message: "User not found" });

            await this.prisma.documentRole.delete({
                where: { documentId_userId: { documentId: id, userId: user.id } }
            });
            return res.status(200).json({ ok: true, message: "Role deleted" });
        } catch (error: any) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    };
}
