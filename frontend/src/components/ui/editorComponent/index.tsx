"use client";

import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import "highlight.js/styles/tokyo-night-dark.css";
import "@/styles/syntax.css";
import "@/styles/tiptapstyles.scss";

import { EditorContext, useEditor } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import { BubbleMenuEditor } from "@/components/atomsComponents/bubbleMenuEditor";
import { EditorContiner } from "@/components/atomsComponents/editorcontiner";
import MainToolbarContent from "@/components/atomsComponents/ToolBarEditor";
import { ToolBarBottom } from "@/components/atomsComponents/toolBarBottom";
import { Toolbar } from "@/components/tiptap-ui-primitive/toolbar";
import { Skeleton } from "@/components/shadcnUI/skeleton";
import extensions from "@/lib/extensions";

// This preserves the established editor UI. Only the old Hocuspocus/Yjs
// provider, live presence, and collaborative save plumbing were removed.
export default function Editor({ initialContent, save }: { initialContent: string; save: (content: string) => Promise<void> }) {
    const [saving, setSaving] = useState(false); const [error, setError] = useState<string>(); const [word, setWord] = useState(0); const toolbarRef = useRef<HTMLDivElement>(null);
    const editor = useEditor({ immediatelyRender: false, autofocus: "end", extensions, content: initialContent, onCreate: ({ editor }) => setWord(editor.storage.characterCount.characters()), onUpdate: ({ editor }) => setWord(editor.storage.characterCount.characters()) });
    useEffect(() => { if (editor && initialContent !== editor.getHTML()) editor.commands.setContent(initialContent); }, [editor, initialContent]);
    async function onSave() { if (!editor) return; setSaving(true); setError(undefined); try { await save(editor.getHTML()); } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save post"); } finally { setSaving(false); } }
    if (!editor) return <div className="min-h-[calc(100vh-7rem)] space-y-5 p-5" aria-label="Loading editor" role="status"><Skeleton className="h-12 w-full" /><main className="mx-auto max-w-4xl space-y-5 pt-8"><Skeleton className="h-10 w-4/5" /><Skeleton className="h-5 w-2/5" /><Skeleton className="h-72 w-full" /></main></div>;
    return <EditorContext.Provider value={{ editor }}><div className="content-wrapper"><Toolbar ref={toolbarRef}><MainToolbarContent onSave={onSave} usersOnline={[]} totalUsers={1} editor={editor} /></Toolbar>{editor && <BubbleMenuEditor editor={editor} />}<div className="flex min-h-[calc(100vh-7rem)] justify-center p-5" onClick={() => editor.chain().focus().run()}>{editor && <EditorContiner editor={editor} />}</div><ToolBarBottom editor={editor} onSave={onSave} word={word} />{saving && <p className="fixed bottom-20 right-6 text-sm text-muted-foreground">Saving…</p>}{error && <p className="fixed bottom-20 right-6 text-sm text-destructive">{error}</p>}</div></EditorContext.Provider>;
}
