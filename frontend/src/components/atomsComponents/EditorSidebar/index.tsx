"use client";

import api from "@/api/axios";
import { Button } from "@/components/shadcnUI/button";
import { Input } from "@/components/shadcnUI/input";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/shadcnUI/sidebar";
import { FileText, FolderOpen, Pencil, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type DocumentPage = { id: string; title: string; position: number };
type DocumentSummary = { id: string; title: string; pages: DocumentPage[] };

export function EditorSidebar() {
    const params = useParams<{ id: string[] }>();
    const router = useRouter();
    const documentId = params.id?.[0];
    const activePageId = params.id?.[1];
    const [document, setDocument] = useState<DocumentSummary>();
    const [creating, setCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | "document" | null>(null);
    const [draftTitle, setDraftTitle] = useState("");

    const loadDocument = useCallback(async () => {
        if (!documentId) return;
        try {
            const { data } = await api.get<DocumentSummary>(`/api/v1/docs/${documentId}`);
            setDocument(data);
        } catch {
            setDocument(undefined);
        }
    }, [documentId]);

    useEffect(() => {
        void loadDocument();
    }, [loadDocument]);

    const pages = useMemo(
        () => [...(document?.pages ?? [])].sort((a, b) => a.position - b.position),
        [document?.pages],
    );

    async function saveBeforeNavigation() {
        let handled = false;
        const saved = new Promise<void>((resolve, reject) => {
            const event = new CustomEvent("docs-editor-save", { detail: { handled: false, resolve, reject } });
            window.dispatchEvent(event);
            handled = event.detail.handled;
        });
        if (!handled) return;
        try { await saved; } catch { toast.error("Your changes could not be saved. Please try again before leaving this page."); throw new Error("Document save failed"); }
    }

    async function navigateTo(path: string) {
        try { await saveBeforeNavigation(); router.push(path); } catch { /* Keep the editor open when the server save fails. */ }
    }

    async function createPage() {
        if (!documentId) return;
        setCreating(true);
        try {
            await saveBeforeNavigation();
            const { data } = await api.post<DocumentPage>(`/api/v1/docs/${documentId}/pages`, {
                title: "Untitled page",
                content: "",
                position: pages.length,
            });
            await loadDocument();
            await navigateTo(`/editor/docs/${documentId}/${data.id}`);
        } catch {
            toast.error("Could not create a document page.");
        } finally {
            setCreating(false);
        }
    }

    function startRename(id: string | "document", title: string) {
        setEditingId(id);
        setDraftTitle(title);
    }

    function cancelRename() {
        setEditingId(null);
        setDraftTitle("");
    }

    async function saveRename(id: string | "document") {
        const title = draftTitle.trim();
        if (!title || !documentId) return;
        try {
            if (id === "document") {
                await api.patch(`/api/v1/docs/${documentId}`, { title });
                setDocument((current) => current ? { ...current, title } : current);
            } else {
                await api.patch(`/api/v1/docs/${documentId}/pages/${id}`, { title });
                setDocument((current) => current ? {
                    ...current,
                    pages: current.pages.map((page) => page.id === id ? { ...page, title } : page),
                } : current);
            }
            cancelRename();
        } catch {
            toast.error("Could not rename this page.");
        }
    }

    return (
        <Sidebar collapsible="offcanvas" className="top-[3.6rem] h-[calc(100svh-3.6rem)]">
            <SidebarHeader className="border-b border-sidebar-border px-3 py-3">
                <div className="flex min-w-0 items-center gap-2 text-sm font-semibold">
                    <FolderOpen className="size-4 shrink-0 text-primary" aria-hidden="true" />
                    {editingId === "document" ? (
                        <Input
                            aria-label="Document title"
                            autoFocus
                            value={draftTitle}
                            onChange={(event) => setDraftTitle(event.target.value)}
                            onBlur={() => void saveRename("document")}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") void saveRename("document");
                                if (event.key === "Escape") cancelRename();
                            }}
                            className="h-7 min-w-0"
                        />
                    ) : (
                        <>
                            <span className="min-w-0 flex-1 truncate">{document?.title ?? "Document"}</span>
                            <Button type="button" variant="ghost" size="icon" aria-label="Rename document" onClick={() => startRename("document", document?.title ?? "Document")}>
                                <Pencil aria-hidden="true" />
                            </Button>
                        </>
                    )}
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Pages</SidebarGroupLabel>
                    <SidebarGroupAction asChild>
                        <Button type="button" variant="ghost" size="icon" aria-label="Add page" disabled={creating || !documentId} onClick={createPage}>
                            <Plus aria-hidden="true" />
                        </Button>
                    </SidebarGroupAction>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton isActive={!activePageId} onClick={() => void navigateTo(`/editor/docs/${documentId}`)}>
                                <FileText aria-hidden="true" />
                                <span>Overview</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        {pages.map((page) => (
                            <SidebarMenuItem key={page.id}>
                                {editingId === page.id ? (
                                    <Input
                                        aria-label="Page title"
                                        autoFocus
                                        value={draftTitle}
                                        onChange={(event) => setDraftTitle(event.target.value)}
                                        onBlur={() => void saveRename(page.id)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter") void saveRename(page.id);
                                            if (event.key === "Escape") cancelRename();
                                        }}
                                        className="h-8"
                                    />
                                ) : (
                                    <>
                                <SidebarMenuButton isActive={activePageId === page.id} onClick={() => void navigateTo(`/editor/docs/${documentId}/${page.id}`)}>
                                            <FileText aria-hidden="true" />
                                            <span>{page.title}</span>
                                        </SidebarMenuButton>
                                        <SidebarMenuAction type="button" aria-label={`Rename ${page.title}`} onClick={() => startRename(page.id, page.title)}>
                                            <Pencil aria-hidden="true" />
                                        </SidebarMenuAction>
                                    </>
                                )}
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
