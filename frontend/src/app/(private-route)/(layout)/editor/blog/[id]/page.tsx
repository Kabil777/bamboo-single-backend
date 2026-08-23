"use client";

import Editor from "@/components/ui/editorComponent/index";
import { BlogPageSkeleton } from "@/components/atomsComponents/skleton/BlogPageSkleton";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Post = { id: string; title: string; content: string };
const apiBase = `${(process.env.NEXT_PUBLIC_API_SERVER_URL ?? "http://localhost:8092").replace(/\/$/, "")}/api/v1`;

export default function BlogEditor() {
    const { id } = useParams<{ id: string }>(); const router = useRouter(); const [post, setPost] = useState<Post>(); const [error, setError] = useState<string>();
    useEffect(() => { fetch(`${apiBase}/posts/${id}`, { credentials: "include" }).then(async response => { if (!response.ok) throw new Error("Post not found"); return response.json() as Promise<Post>; }).then(setPost).catch((cause: Error) => setError(cause.message)); }, [id]);
    async function save(content: string) { const response = await fetch(`${apiBase}/posts/${id}`, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: post?.title, content }) }); if (!response.ok) throw new Error(response.status === 401 ? "Log in before publishing." : "Could not save post."); router.replace(`/blog/${id}`); }
    if (error) return <main className="p-10"><p className="text-destructive">{error}</p></main>;
    if (!post) return <BlogPageSkeleton />;
    return <Editor initialContent={post.content} save={save} />;
}
