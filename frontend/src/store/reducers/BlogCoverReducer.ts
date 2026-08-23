import api from "@/api/axios";
import { BlogCursorResponse, UUID } from "@/types/blog/blog-base";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type ApiPost = {
    id: string;
    title: string;
    description?: string | null;
    content: string;
    mediaId: string | null;
    createdAt: string;
    author: { id: string; name: string; pictureUrl: string | null };
};

export const toBlogHomeCard = (post: ApiPost) => {
    const apiBase = (process.env.NEXT_PUBLIC_API_SERVER_URL || "http://localhost:8092").replace(/\/$/, "");
    return {
        id: post.id,
        title: post.title,
        description: post.description?.trim() || post.content.replace(/<[^>]*>/g, "").slice(0, 180),
        coverUrl: post.mediaId ? `${apiBase}/api/v1/media/${post.mediaId}` : "",
        createdAt: post.createdAt,
        tags: [],
        author: { id: post.author.id, name: post.author.name, handle: "", avatarUrl: post.author.pictureUrl },
    };
};

export const getCoverBlog = createAsyncThunk<
    Pick<BlogCursorResponse, "data" | "cursor" | "hasNext">,
    { cursor: UUID | null; mode: "init" | "more" }
>("/blog", async ({ cursor }, { rejectWithValue }) => {
    try {
        const URL = `${process.env.NEXT_PUBLIC_API_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/posts`;

        const res = await api.get(URL, {
            withCredentials: true,
            params: {
                cursor,
                page: 0,
                size: 10,
                sort: "createdAt,desc",
            },
        });
        const posts = (res.data as { data: ApiPost[] }).data;
        return {
            data: posts.map(toBlogHomeCard),
            cursor: null,
            hasNext: false,
        };
    } catch (e) {
        console.log(e);
        return rejectWithValue("Failed to fetch data");
    }
});

interface BlogCoverState extends BlogCursorResponse {
    fetched: boolean;
}

const initialState: BlogCoverState = {
    blogLoading: true,
    blogLoadMore: false,
    data: [],
    cursor: null,
    hasNext: true,
    error: null,
    fetched: false,
};

const homeBlogCoverReducers = createSlice({
    name: "homeBlogCoverReducer",
    initialState: initialState,
    reducers: {
        setData: (state, action) => {
            state.data.push(...action.payload.data);
            (state.cursor = action.payload.cursor),
                (state.hasNext = action.payload.hasNext);
        },
    },
    selectors: {
        selectById: (state, id: UUID) => {
            return state.data.find((b) => b.id === id);
        },
    },
    extraReducers(builder) {
        builder.addCase(getCoverBlog.pending, (s, a) => {
            s.error = null;

            if (a.meta.arg.mode === "init") {
                s.blogLoading = true;
            } else {
                s.blogLoadMore = true;
            }
        });

        builder.addCase(getCoverBlog.fulfilled, (s, a) => {
            const { mode } = a.meta.arg;

            if (mode === "init") {
                s.data = a.payload.data;
                s.blogLoading = false;
            } else {
                s.data.push(...a.payload.data);
                s.blogLoadMore = false;
            }

            s.cursor = a.payload.cursor;
            s.hasNext = a.payload.hasNext;
            s.fetched = true;
        });
        builder.addCase(getCoverBlog.rejected, (s, a) => {
            s.error = a.error.message ?? "Unknown error";
            s.fetched = true;
            s.blogLoading = false;
            s.blogLoadMore = false;
        });
    },
});
const selectBlogCoverState = (state: RootState) => state.blogReducer;
export const blogCoverSelectors =
    homeBlogCoverReducers.getSelectors(selectBlogCoverState);

export const { setData } = homeBlogCoverReducers.actions;
export const { selectById } = homeBlogCoverReducers.selectors;
export default homeBlogCoverReducers.reducer;
