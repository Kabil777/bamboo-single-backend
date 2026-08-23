type UUID = string;

interface AuthorSummary {
    id: UUID;
    name: string;
    handle: string;
    avatarUrl?: string | null;
}

interface BlogBase {
    id: UUID;
    title: string;
}

interface BlogHomeCard extends BlogBase {
    coverUrl: string;
    description: string;
    createdAt: string;
    tags: string[];
    author: AuthorSummary;
    visibility?: "PUBLIC" | "UNLISTED" | "PRIVATE";
    status?: "PUBLISHED" | "ARCHIVED" | "DRAFT";
    collaborators?: AuthorSummary[];
}

interface BlogPage extends BlogHomeCard {
    content: string;
    viewerHasBookmarked?: boolean;
    viewerCanEdit?: boolean;
}

interface BlogContentState {
    entities: Record<UUID, BlogPage>;
    loadingById: Record<UUID, boolean>;
    errorById: Record<UUID, string | null>;
}
interface BlogCursorResponse {
    blogLoading: boolean;
    blogLoadMore: boolean;
    error: string | null;
    data: BlogHomeCard[];
    cursor: string | null;
    hasNext: boolean;
}

interface BlogEditorState extends BlogPage {}

export type {
    UUID,
    AuthorSummary,
    BlogBase,
    BlogHomeCard,
    BlogPage,
    BlogCursorResponse,
    BlogContentState,
    BlogEditorState,
};
