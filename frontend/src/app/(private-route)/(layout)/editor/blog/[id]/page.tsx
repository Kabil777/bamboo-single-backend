"use client";

import Editor from "@/components/ui/editorComponent";
import { useParams } from "next/navigation";
import { toast } from "sonner";

function getCollabHttpBaseUrl() {
    const wsUrl =
        process.env.NEXT_PUBLIC_COLLAB_WS_URL || "ws://localhost:1234/collab";
    const normalized = wsUrl.replace(/\/+$/, "");
    const withoutPath = normalized.replace(/\/collab$/, "");

    if (withoutPath.startsWith("wss://")) {
        return withoutPath.replace("wss://", "https://");
    }
    if (withoutPath.startsWith("ws://")) {
        return withoutPath.replace("ws://", "http://");
    }
    return withoutPath;
}

export default function BlogEditor() {
    const { id } = useParams<{ id: string }>();

    const save = async (_visibility: "PUBLIC" | "PRIVATE") => {
        if (!id) return;

        try {
            const baseUrl = getCollabHttpBaseUrl();
            const response = await fetch(`${baseUrl}/api/blog/save/${id}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    visibility: _visibility,
                    status: "PUBLISHED",
                }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                const message =
                    (data as { message?: string } | null)?.message ||
                    "Failed to save blog";
                throw new Error(message);
            }

        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "Failed to save blog";
            toast.error(message);
            throw error;
        }
    };

    if (!id) return null;

    return (
        <div className="w-full">
            <Editor
                idContent={id}
                save={save}
                resourceType="blog"
                resourceId={id}
            />
        </div>
    );
}
