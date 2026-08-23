import { UUID } from "@/types/blog/blog-base";
import { Docs, DocsState } from "@/types/docs/docs-base";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import api from "@/api/axios";

export const DocsRTK = createAsyncThunk<Docs, UUID, { state: RootState }>(
    "/docs/id",
    async (id, { rejectWithValue }) => {
        const URL = `${process.env.NEXT_PUBLIC_API_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/docs/${id}`;
        try {
            const { data } = await api.get<{
                id: string;
                title: string;
                content: string;
                mediaId: string | null;
                createdAt: string;
                author: { id: string; name: string; pictureUrl: string | null };
                pages: Array<{ id: string; title: string; content: string; parentId: string | null }>;
            }>(URL);
            const apiBase = (process.env.NEXT_PUBLIC_API_SERVER_URL || "http://localhost:8092").replace(/\/$/, "");
            return {
                id: data.id,
                title: data.title,
                content: data.content,
                description: data.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 180),
                coverUrl: data.mediaId ? `${apiBase}/api/v1/media/${data.mediaId}` : "",
                createdAt: data.createdAt,
                author: { id: data.author.id, name: data.author.name, handle: "", avatarUrl: data.author.pictureUrl },
                tags: [],
                tree: (() => {
                    const nodes = new Map(data.pages.map((page) => [page.id, { id: page.id, title: page.title, content: page.content, subTree: [] as Docs["tree"] }]));
                    const roots: Docs["tree"] = [];
                    for (const page of data.pages) {
                        const node = nodes.get(page.id)!;
                        const parent = page.parentId ? nodes.get(page.parentId) : undefined;
                        if (parent) parent.subTree.push(node);
                        else roots.push(node);
                    }
                    return roots;
                })(),
            };
        } catch (e) {
            return rejectWithValue("Unable to fetch docs");
        }
    },
);

const initialState: DocsState = {
    entities: {},
    loadingById: {},
    errorById: {},
};
const getDocs = createSlice({
    name: "docsReducer",
    initialState: initialState,
    reducers: {},
    selectors: {},
    extraReducers(builder) {
        builder.addCase(DocsRTK.pending, (s, a) => {
            s.loadingById[a.meta.arg] = true;
        });
        builder.addCase(DocsRTK.fulfilled, (s, a) => {
            const id = a.meta.arg;
            const doc = a.payload;
            s.entities[id] = doc;
            s.loadingById[id] = false;
        });
        builder.addCase(DocsRTK.rejected, (s, a) => {
            const id = a.meta.arg;
            s.errorById[id] = true;
            s.loadingById[id] = false;
        });
    },
});

export default getDocs.reducer;
