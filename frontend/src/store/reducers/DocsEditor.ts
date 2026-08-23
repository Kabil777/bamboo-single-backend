import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface DocsPage {
    id: string;
    title: string;
    content: string;
    subPages?: DocsPage[];
}

interface Docs {
    id: string;
    title: string;
    type: "docs";
    description: string;
    tags: string[];
    content: string;
    Pages: DocsPage[];
}

const DocsSlice = createSlice({
    name: "Docs",
    initialState: {
        id: "1",
        type: "docs",
        title: "Hello World",
        description: "Hello World",
        tags: ["Hello World", "diuy"],
        content:
            '# Hibernate One-to-One Mapping\n\nThis article explains **why BlogContent is the owning side**.\n\n## Key Takeaways\n\n- Owning side holds the foreign key\n- `@MapsId` shares primary key\n- Cascade controls lifecycle\n\n```java\n@OneToOne(mappedBy = "post", cascade = CascadeType.ALL)\nprivate BlogContent content;\n```\n\n---\n\nWritten for Spring Boot + Hibernate users',
        Pages: [
            {
                id: "1",
                title: "Hello",
                content: "hello main",
                subPages: [
                    {
                        id: "1-1",
                        title: "Hello Subpage",
                        content: "hello 2-1",
                    },
                    {
                        id: "1-2",
                        title: "Hello Subpage 2",
                        content: "hello 2-2",
                    },
                ],
            },
            {
                id: "2",
                title: "Hello giy",
                content: "HEllo",
            },
        ],
    } as Docs,
    reducers: {
        setAll: (state, action: PayloadAction<Docs>) => {
            return action.payload;
        },
        setTitleAndDescription: (
            state,
            action: PayloadAction<
                Pick<Docs, "title" | "description" | "tags" | "type">
            >,
        ) => {
            state.type = action.payload.type;
            state.title = action.payload.title;
            state.description = action.payload.description;
            state.tags = action.payload.tags;
        },
        setContent: (state, action: PayloadAction<Pick<Docs, "content">>) => {
            state.content = action.payload.content;
        },
        setPageContent: (
            state,
            action: PayloadAction<{ pageId: string; content: string }>,
        ) => {
            const { pageId, content } = action.payload;
            const page = state.Pages.find((p) => p.id === pageId);
            if (page) {
                page.content = content;
            }
        },
        setSubPageContent: (
            state,
            action: PayloadAction<{
                pageId: string;
                subPageId: string;
                content: string;
            }>,
        ) => {
            const { pageId, subPageId, content } = action.payload;
            const page = state.Pages.find((p) => p.id === pageId);
            if (page?.subPages) {
                const subPage = page.subPages.find((sp) => sp.id === subPageId);
                if (subPage) {
                    subPage.content = content;
                }
            }
        },
        setPages: (state, action: PayloadAction<DocsPage[]>) => {
            state.Pages = action.payload;
        },
        updatePageTitle: (
            state,
            action: PayloadAction<{ pageIndex: number; title: string }>,
        ) => {
            const { pageIndex, title } = action.payload;
            if (state.Pages[pageIndex]) {
                state.Pages[pageIndex].title = title;
            }
        },
        updateSubPageTitle: (
            state,
            action: PayloadAction<{
                pageIndex: number;
                subPageIndex: number;
                title: string;
            }>,
        ) => {
            const { pageIndex, subPageIndex, title } = action.payload;
            if (state.Pages[pageIndex]?.subPages?.[subPageIndex]) {
                state.Pages[pageIndex].subPages![subPageIndex].title = title;
            }
        },
        addMainSection: (state) => {
            state.Pages.push({
                id: crypto.randomUUID(),
                title: "New Section",
                content: "",
                subPages: [],
            });
        },
        addSubItem: (state, action: PayloadAction<number>) => {
            const sectionIndex = action.payload;
            if (state.Pages[sectionIndex]) {
                if (!state.Pages[sectionIndex].subPages) {
                    state.Pages[sectionIndex].subPages = [];
                }
                state.Pages[sectionIndex].subPages!.push({
                    id: crypto.randomUUID(),
                    title: "New Sub Page",
                    content: "",
                });
            }
        },
        deleteMainSection: (state, action: PayloadAction<number>) => {
            state.Pages.splice(action.payload, 1);
        },
        deleteSubItem: (
            state,
            action: PayloadAction<{ sectionIndex: number; subIndex: number }>,
        ) => {
            const { sectionIndex, subIndex } = action.payload;
            if (state.Pages[sectionIndex]?.subPages) {
                state.Pages[sectionIndex].subPages!.splice(subIndex, 1);
            }
        },
    },
});

export const {
    setAll,
    setTitleAndDescription,
    setContent,
    setPageContent,
    setSubPageContent,
    setPages,
    updatePageTitle,
    updateSubPageTitle,
    addMainSection,
    addSubItem,
    deleteMainSection,
    deleteSubItem,
} = DocsSlice.actions;

export default DocsSlice.reducer;
