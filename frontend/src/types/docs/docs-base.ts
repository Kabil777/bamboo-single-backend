type UUID = string;

interface AuthorSummary {
    id: UUID;
    name: string;
    handle: string;
    avatarUrl?: string | null;
}

interface DocsBase {
    id: UUID;
    title: string;
}

interface DocsHomeCard extends DocsBase {
    coverUrl: string;
    description: string;
    createdAt: string;
    author: AuthorSummary;
    visibility?: "PUBLIC" | "UNLISTED" | "PRIVATE";
    status?: "PUBLISHED" | "ARCHIVED" | "DRAFT";
}

interface DocsTreeNode {
    id: UUID;
    title: string;
    content: string;
    subTree: DocsTreeNode[];
}

interface Docs extends DocsHomeCard {
    content: string;
    tags: string[];
    tree: DocsTreeNode[];
}

interface DocsState {
    entities: Record<UUID, Docs>;
    loadingById: Record<UUID, boolean>;
    errorById: Record<UUID, boolean>;
}

export type { AuthorSummary, DocsHomeCard, Docs, DocsState, DocsTreeNode };
