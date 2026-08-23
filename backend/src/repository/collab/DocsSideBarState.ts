import { PrismaClient } from "../../generated/prisma/client.js";
import { AuthError } from "../../lib/exceptions/AuthException.js";
import { PrismaManager } from "../../lib/prisma.js";
import { RedisManager } from "../../lib/Redis.js";
import { updateArgs } from "../../types/ws/hocuspocus/collabHookTypes.js";
import * as Y from "yjs";
import { logger } from "../../lib/logger.js";

export class DocsSidebarStateRepository {
    private readonly prismaClient: PrismaClient;

    constructor() {
        this.prismaClient = PrismaManager.getClient();
    }

    public async getDocsSidebarStateById(
        docsId: string,
    ): Promise<Uint8Array | null> {
        const row = await this.prismaClient.docsSidebarState.findUnique({
            where: { docsId },
            select: { yjsState: true },
        });

        return row?.yjsState ? new Uint8Array(row.yjsState) : null;
    }

    public async saveDocsSidebarStateById(
        docsId: string,
        yjsState: Uint8Array,
    ): Promise<void> {
        const bytes = Buffer.from(yjsState);
        await this.prismaClient.docsSidebarState.upsert({
            where: { docsId },
            update: { yjsState: bytes, updatedAt: new Date() },
            create: {
                docsId,
                yjsState: bytes,
                updatedAt: new Date(),
            },
        });
    }

    public async updateDocsPage({ documentName, document, info }: updateArgs) {
        const lock = await RedisManager.acquireLock(documentName, 60);
        if (!lock) return;
        try {
            logger.info(
                {
                    documentName,
                    type: info.type,
                    scheduleKey: "time-set-docs-sidebar",
                },
                "docs-sidebar persistence scheduling check",
            );
            await RedisManager.getOrSetSaveTime(
                "time-set-docs-sidebar",
                documentName,
                async () => {
                    if (info.type !== "docs-sidebar") return;
                    const yJsState = Y.encodeStateAsUpdate(document);
                    logger.info(
                        { documentName, docsId: info.docsId },
                        "docs-sidebar persistence callback due, saving state",
                    );
                    await this.saveDocsSidebarStateById(info.docsId, yJsState);
                },
                5000
            );
        } catch (error: unknown) {
            const msg =
                error instanceof Error ? error.message : "persistance failed";
            throw new AuthError({ message: msg });
        } finally {
            await RedisManager.releaseLock(documentName);
        }
    }
}
