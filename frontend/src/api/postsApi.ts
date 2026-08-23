import api from "@/api/axios";

export type Post = {
    id: string;
    title: string;
    description: string | null;
    content: string;
    visibility: "PUBLIC" | "UNLISTED" | "PRIVATE";
    viewerCanEdit: boolean;
    mediaId: string | null;
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    viewerHasLiked: boolean;
    viewerHasBookmarked: boolean;
    author: { id: string; name: string; pictureUrl: string | null };
};

const mediaUrl = (id: string) => {
    const base = (process.env.NEXT_PUBLIC_API_SERVER_URL ?? "http://localhost:8092").replace(/\/$/, "");
    return `${base}/api/v1/media/${id}`;
};

export const getPost = async (id: string) => (await api.get<Post>(`/api/v1/posts/${id}`)).data;

export const createPost = async (data: { title: string; description?: string | null; content: string; mediaId?: string | null }) =>
    (await api.post<Post>("/api/v1/posts", data)).data;

export const updatePost = async (id: string, data: Partial<Pick<Post, "title" | "description" | "content" | "mediaId">>) =>
    (await api.patch<Post>(`/api/v1/posts/${id}`, data)).data;

export const bookmarkPost = async (id: string) =>
    (await api.put<{ viewerHasBookmarked: boolean }>(`/api/v1/posts/${id}/bookmark`)).data;

export const unbookmarkPost = async (id: string) =>
    (await api.delete<{ viewerHasBookmarked: boolean }>(`/api/v1/posts/${id}/bookmark`)).data;

export const uploadMedia = async (file: File) => {
    const base64 = await fileToBase64(file);
    const response = await api.post<{ id: string }>("/api/v1/media", {
        base64,
        mimeType: file.type || "application/octet-stream",
        filename: file.name,
    });
    return response.data.id;
};

export const getMediaUrl = mediaUrl;

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("Could not read image"));
        reader.onload = () => resolve(String(reader.result));
        reader.readAsDataURL(file);
    });
}
