"use client";

import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import "highlight.js/styles/tokyo-night-dark.css";
import "@/styles/syntax.css";
import "@/styles/tiptapstyles.scss";

import { EditorContext, useEditor } from "@tiptap/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BubbleMenuEditor } from "@/components/atomsComponents/bubbleMenuEditor";
import { EditorContiner } from "@/components/atomsComponents/editorcontiner";
import MainToolbarContent from "@/components/atomsComponents/ToolBarEditor";
import { ToolBarBottom } from "@/components/atomsComponents/toolBarBottom";
import { Toolbar } from "@/components/tiptap-ui-primitive/toolbar";
import { Skeleton } from "@/components/shadcnUI/skeleton";
import { Check } from "lucide-react";
import extensions from "@/lib/extensions";

// This preserves the established editor UI. Only the old Hocuspocus/Yjs
// provider, live presence, and collaborative save plumbing were removed.
export default function Editor({ initialContent, save, autoSave = false, autoSaveDelay = 700, onManualSaveComplete }: { initialContent: string; save: (content: string) => Promise<void>; autoSave?: boolean; autoSaveDelay?: number; onManualSaveComplete?: () => void }) {
    const [saving, setSaving] = useState(false); const [error, setError] = useState<string>(); const [word, setWord] = useState(0); const toolbarRef = useRef<HTMLDivElement>(null);
    const queuedContentRef = useRef<string | null>(null); const savePromiseRef = useRef<Promise<void> | null>(null); const lastSavedContentRef = useRef(initialContent); const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const flushSave = useCallback(async (content: string) => {
        if (content === lastSavedContentRef.current && !savePromiseRef.current) return;
        queuedContentRef.current = content;
        if (savePromiseRef.current) return savePromiseRef.current;
        const run = async () => {
            setSaving(true); setError(undefined);
            try { while (queuedContentRef.current !== null) { const nextContent = queuedContentRef.current; queuedContentRef.current = null; if (nextContent === lastSavedContentRef.current) continue; await save(nextContent); lastSavedContentRef.current = nextContent; } }
            catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save changes"); throw cause; }
            finally { setSaving(false); savePromiseRef.current = null; }
        };
        savePromiseRef.current = run();
        return savePromiseRef.current;
    }, [save]);
    const scheduleAutoSave = useCallback((content: string) => { if (!autoSave) return; if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current); autoSaveTimerRef.current = setTimeout(() => { void flushSave(content).catch(() => undefined); }, autoSaveDelay); }, [autoSave, autoSaveDelay, flushSave]);
    const editor = useEditor({ immediatelyRender: false, autofocus: "end", extensions, content: initialContent, onCreate: ({ editor }) => setWord(editor.storage.characterCount.characters()), onUpdate: ({ editor }) => { setWord(editor.storage.characterCount.characters()); scheduleAutoSave(editor.getHTML()); } });
    useEffect(() => { if (editor && initialContent !== editor.getHTML()) editor.commands.setContent(initialContent); }, [editor, initialContent]);
    useEffect(() => () => { if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current); }, []);
    useEffect(() => { if (!autoSave || !editor) return; const handleSaveRequest = (event: Event) => { const detail = (event as CustomEvent<{ handled: boolean; resolve: () => void; reject: (reason?: unknown) => void }>).detail; detail.handled = true; void flushSave(editor.getHTML()).then(detail.resolve, detail.reject); }; window.addEventListener("docs-editor-save", handleSaveRequest); return () => window.removeEventListener("docs-editor-save", handleSaveRequest); }, [autoSave, editor, flushSave]);
    useEffect(() => { if (!autoSave || !editor) return; const warnBeforeUnload = (event: BeforeUnloadEvent) => { if (editor.getHTML() === lastSavedContentRef.current && !savePromiseRef.current) return; event.preventDefault(); event.returnValue = ""; }; window.addEventListener("beforeunload", warnBeforeUnload); return () => window.removeEventListener("beforeunload", warnBeforeUnload); }, [autoSave, editor]);
    async function onSave() { if (!editor) return; try { await flushSave(editor.getHTML()); onManualSaveComplete?.(); } catch { /* Error state is rendered below. */ } }
    if (!editor) return <div className="min-h-[calc(100vh-7rem)] space-y-5 p-5" aria-label="Loading editor" role="status"><Skeleton className="h-12 w-full" /><main className="mx-auto max-w-4xl space-y-5 pt-8"><Skeleton className="h-10 w-4/5" /><Skeleton className="h-5 w-2/5" /><Skeleton className="h-72 w-full" /></main></div>;
    return <EditorContext.Provider value={{ editor }}><div className="content-wrapper"><Toolbar ref={toolbarRef}><MainToolbarContent onSave={onSave} usersOnline={[]} totalUsers={1} editor={editor} /></Toolbar>{editor && <BubbleMenuEditor editor={editor} />}<div className="flex min-h-[calc(100vh-7rem)] justify-center p-5" onClick={() => editor.chain().focus().run()}>{editor && <EditorContiner editor={editor} />}</div><ToolBarBottom editor={editor} onSave={onSave} word={word} saving={saving} autoSave={autoSave && !error} />{error && <p className="fixed bottom-20 right-6 z-50 rounded-lg border border-destructive/30 bg-background/95 px-3 py-1.5 text-sm text-destructive shadow-sm backdrop-blur">{error}</p>}</div></EditorContext.Provider>;
}
