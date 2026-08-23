import api from "@/api/axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Blog {
    title: string;
    coverUrl: string;
    description: string;
    tags: string[];
    visibility?: "public" | "unlisted" | "private";
}
interface Docs {
    title: string;
    coverUrl: string;
    description: string;
    tags: string[];
    visibility?: "public" | "unlisted" | "private";
}
interface CreateCoverDetailsBlogDocsState {
    id: string;
    title: string;
    type: "blog" | "docs";
    description: string;
    tags: string[];
}

export const CreateNewBlog = createAsyncThunk<{ id: string }, Blog>(
    "/blog/createNew",
    async (details, { rejectWithValue }) => {
        try {
            const res = await api.post("/api/v1/posts", {
                title: details.title,
                content: details.description,
                description: details.description,
                visibility: details.visibility?.toUpperCase(),
            });
            return res.data;
        } catch (error) {
            return rejectWithValue("Failed to create blog");
        }
    },
);

export const CreateNewDocs = createAsyncThunk<{ id: string }, Docs>(
    "/docs/createNew",
    async (details, { rejectWithValue }) => {
        try {
            const res = await api.post("/api/v1/docs", {
                title: details.title,
                content: details.description,
                visibility: details.visibility?.toUpperCase(),
            });
            return res.data;
        } catch (error) {
            return rejectWithValue("Failed to create docs");
        }
    },
);

const initialState: CreateCoverDetailsBlogDocsState = {
    id: "",
    type: "blog",
    title: "",
    description: "",
    tags: [],
};

const CreateCoverDetailsBlogDocs = createSlice({
    name: "CreateCoverDetailsBlogDocs",
    initialState: initialState,
    reducers: {
        setAll: (
            state,
            action: PayloadAction<CreateCoverDetailsBlogDocsState>,
        ) => {
            return action.payload;
        },
    },
});

export const { setAll } = CreateCoverDetailsBlogDocs.actions;

export default CreateCoverDetailsBlogDocs.reducer;
