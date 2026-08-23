import { BlogContentState, BlogPage, UUID } from "@/types/blog/blog-base";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import api from "@/api/axios";

export const BlogPageRtk = createAsyncThunk<
    BlogPage,
    UUID,
    { state: RootState }
>("/blog/page", async (id, { getState, rejectWithValue }) => {
    const cachedData = getState().blogPageReducer.entities[id];
    if (cachedData) return cachedData;
    const path = `${process.env.NEXT_PUBLIC_API_VERSION}/posts/${id}`;
    try {
        const res = await api.get(path);
        const post = res.data as {
            id: string;
            title: string;
            description?: string | null;
            content: string;
            visibility?: "PUBLIC" | "UNLISTED" | "PRIVATE";
            viewerCanEdit?: boolean;
            mediaId: string | null;
            createdAt: string;
            author: { id: string; name: string; pictureUrl: string | null };
            viewerHasBookmarked?: boolean;
            viewerHasBookmark?: boolean;
            bookmark?: boolean;
            bookmarked?: boolean;
            isBookmarked?: boolean;
        };
        const apiBase = (process.env.NEXT_PUBLIC_API_SERVER_URL || "http://localhost:8092").replace(/\/$/, "");
        return {
            id: post.id,
            title: post.title,
            content: post.content,
            description: post.description?.trim() ?? "",
            coverUrl: post.mediaId ? `${apiBase}/api/v1/media/${post.mediaId}` : "",
            createdAt: post.createdAt,
            tags: [],
            visibility: post.visibility,
            viewerCanEdit: post.viewerCanEdit ?? false,
            author: {
                id: post.author.id,
                name: post.author.name,
                handle: "",
                avatarUrl: post.author.pictureUrl,
            },
            viewerHasBookmarked: post.viewerHasBookmarked ?? post.viewerHasBookmark ?? post.bookmark ?? post.bookmarked ?? post.isBookmarked ?? false,
        };
    } catch (r) {
        return rejectWithValue("Failed to load blog");
    }
});

const initialState: BlogContentState = {
    entities: {},
    loadingById: {},
    errorById: {},
};

const getBlogPage = createSlice({
    name: "getBlogPage",
    initialState: initialState,
    reducers: {},
    selectors: {},
    extraReducers(builder) {
        builder.addCase(BlogPageRtk.pending, (state, action) => {
            state.loadingById[action.meta.arg] = true;
        });
        builder.addCase(BlogPageRtk.fulfilled, (state, action) => {
            state.entities[action.meta.arg] = action.payload;
            state.loadingById[action.meta.arg] = false;
        });
        builder.addCase(BlogPageRtk.rejected, (state, action) => {
            state.loadingById[action.meta.arg] = false;
            state.errorById[action.meta.arg] = action.error.message ?? null;
        });
    },
});

export default getBlogPage.reducer;
