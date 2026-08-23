import api from "@/api/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { BlogHomeCard } from "@/types/blog/blog-base";
import { toBlogHomeCard } from "./BlogCoverReducer";

export const getFeaturedBlogs = createAsyncThunk<BlogHomeCard[]>(
    "/blog/featured",
    async (_, { rejectWithValue }) => {
        try {
            const apiVersion = process.env.NEXT_PUBLIC_API_VERSION ?? "/api/v1";
            const url = `${apiVersion}/posts`;
            const res = await api.get<{ data: Parameters<typeof toBlogHomeCard>[0][] }>(url);
            return res.data.data.slice(0, 3).map(toBlogHomeCard);
        } catch {
            return rejectWithValue("Failed to fetch featured blogs");
        }
    },
);

interface FeaturedBlogState {
    loading: boolean;
    data: BlogHomeCard[];
    error: string | null;
    fetched: boolean;
}

const initialState: FeaturedBlogState = {
    loading: true,
    data: [],
    error: null,
    fetched: false,
};

const featuredBlogReducer = createSlice({
    name: "featuredBlogReducer",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFeaturedBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFeaturedBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.fetched = true;
            })
            .addCase(getFeaturedBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) ?? "Unknown error";
                state.fetched = true;
            });
    },
});

export default featuredBlogReducer.reducer;
