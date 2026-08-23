"use client";

import Editor from "@/components/ui/editorComponent";
import { BlogPageSkeleton } from "@/components/atomsComponents/skleton/BlogPageSkleton";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type DocumentPage = { id: string; title: string; content: string };
type Document = { id: string; title: string; content: string; viewerCanEdit: boolean; pages: DocumentPage[] };

const apiBase = `${(process.env.NEXT_PUBLIC_API_SERVER_URL ?? "http://localhost:8092").replace(/\/$/, "")}/api/v1`;

export default function DocsEditor() {
    const params = useParams<{ id: string[] }>();
    const router = useRouter();
    const id = useMemo(() => params.id?.[0], [params.id]);
    const pageId = useMemo(() => params.id?.[1], [params.id]);
    const [document, setDocument] = useState<Document>();
    const [error, setError] = useState<string>();
    const [collaborationEnabled, setCollaborationEnabled] = useState<boolean | null>(null);
    const [autosaveSettings, setAutosaveSettings] = useState<{ enabled: boolean; delay: number } | null>(null);

    useEffect(() => {
        if (!id) {
            setError("Document not found");
            return;
        }

        fetch(`${apiBase}/docs/${id}`, { credentials: "include" })
            .then(async (response) => {
                if (!response.ok) throw new Error(response.status === 401 ? "Log in before editing this document." : "Document not found");
                return response.json() as Promise<Document>;
            })
            .then((data) => {
                if (!data.viewerCanEdit) throw new Error("You do not have permission to edit this document.");
                setDocument(data);
            })
            .catch((cause: Error) => setError(cause.message));
    }, [id]);

    useEffect(() => {
        Promise.all([
            fetch(`${apiBase}/settings/collaboration`).then((response) => response.ok ? response.json() as Promise<{ enabled: boolean }> : Promise.reject()),
            fetch(`${apiBase}/settings/editor-save`).then((response) => response.ok ? response.json() as Promise<{ enabled: boolean; delay: number }> : Promise.reject()),
        ]).then(([collaboration, autosave]) => {
            setCollaborationEnabled(collaboration.enabled);
            setAutosaveSettings(autosave);
        }).catch(() => {
            setCollaborationEnabled(false);
            setAutosaveSettings({ enabled: true, delay: 700 });
        });
    }, []);

    const activePage = pageId ? document?.pages.find((page) => page.id === pageId) : undefined;

    async function save(content: string) {
        if (!id) throw new Error("Document not found");
        if (pageId && !activePage) throw new Error("Document page not found");
        const response = await fetch(pageId ? `${apiBase}/docs/${id}/pages/${pageId}` : `${apiBase}/docs/${id}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
        });
        if (!response.ok) throw new Error(response.status === 401 ? "Log in before saving." : "Could not save document.");
    }

    if (error) return <main className="p-10"><p className="text-destructive">{error}</p></main>;
    if (!document) return <BlogPageSkeleton />;
    if (pageId && !activePage) return <main className="p-10"><p className="text-destructive">Document page not found</p></main>;
    return <Editor key={`${id}:${pageId ?? "overview"}`} initialContent={activePage?.content ?? document.content} save={save} autoSave={collaborationEnabled === false && autosaveSettings?.enabled === true} autoSaveDelay={autosaveSettings?.delay ?? 700} onManualSaveComplete={() => router.replace(pageId ? `/docs/${id}/${pageId}` : `/docs/${id}`)} />;
}
