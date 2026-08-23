export type CollabRoomType = "blog" | "docs-page" | "docs-sidebar";

export function buildCollabRoomName(
    roomType: CollabRoomType,
    documentId: string,
    parentId?: string,
) {
    if (roomType === "blog") return `blog:${documentId}`;
    if (roomType === "docs-page") {
        if (!parentId) {
            throw new Error("docs-page room requires docsId");
        }
        return `docs:page:${parentId}:${documentId}`;
    }
    return `docs:sidebar:${documentId}`;
}
