import api from "@/api/axios";
import { DocsHomeCard } from "@/types/docs/docs-base";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { RootState } from "../store";

export const DocsCoverRtk = createAsyncThunk<DocsHomeCard[]>(
    "/docs/home",
    async () => {
        const { data } = await api.get<{ data: Array<{
            id: string;
            title: string;
            content: string;
            mediaId: string | null;
            createdAt: string;
            author: { id: string; name: string; pictureUrl: string | null };
        }> }>("/api/v1/docs");
        const apiBase = ((typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_API_SERVER_URL || "http://localhost:8092"))).replace(/\/$/, "");
        return data.data.map((document) => ({
            id: document.id,
            title: document.title,
            description: document.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 180),
            coverUrl: document.mediaId ? `${apiBase}/api/v1/media/${document.mediaId}` : "",
            createdAt: document.createdAt,
            author: {
                id: document.author.id,
                name: document.author.name,
                handle: "",
                avatarUrl: document.author.pictureUrl,
            },
        }));
    },
);

interface initialType {
    isDocsLoading: boolean;
    docs: DocsHomeCard[] | [];
    isError: boolean;
    fetched: boolean;
}
const initialState: initialType = {
    isDocsLoading: true,
    docs: [],
    isError: false,
    fetched: false,
};
const getCoverDocs = createSlice({
    name: "docsHomeReducer",
    initialState,
    reducers: {},
    selectors: {
        selectById: (state, id) => {
            return state.docs.find((d) => d.id === id);
        },
    },
    extraReducers(builder) {
        builder.addCase(DocsCoverRtk.pending, (state, _) => {
            state.isDocsLoading = true;
        });
        builder.addCase(DocsCoverRtk.fulfilled, (state, action) => {
            state.isDocsLoading = false;
            state.docs = action.payload;
            state.fetched = true;
        });
        builder.addCase(DocsCoverRtk.rejected, (state, _) => {
            state.isDocsLoading = false;
            state.isError = true;
            state.fetched = true;
        });
    },
});

const docsState = (state: RootState) => {
    return state.docsHomeReducer;
};
export const docsHomeSelectors = getCoverDocs.getSelectors(docsState);

export const { selectById } = getCoverDocs.selectors;
export default getCoverDocs.reducer;
