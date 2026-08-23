"use client";

import {
    ChevronDown,
    ChevronRight,
    FileText,
    Home,
    Plus,
    Trash2,
    Pencil,
    BookOpen,
    Layers,
} from "lucide-react";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
} from "@/components/shadcnUI/sidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/shadcnUI/collapsible";
import { Input } from "@/components/shadcnUI/input";
import { Button } from "@/components/shadcnUI/button";

import { useDocsMetaProvider } from "@/hooks/useDocsMetaProvider";
import { useDocsTree } from "@/hooks/useDocsTree";
import { useAppState, useAppDispatch } from "@/hooks/ReduxHooks";
import { DocsRTK } from "@/store/reducers/DocsReducer";
import * as Y from "yjs";



export function EditorSidebar() {
    const { id } = useParams() as { id: string | string[] };
    const docId = Array.isArray(id) ? id[0] : id;
    const provider = useDocsMetaProvider(docId, {
        enabled: typeof id === "string" ? id.length > 0 : Array.isArray(id) && id.length > 0,
    });
    const { tree, addPage, deletePage } = useDocsTree(provider);
    const sections = tree.filter(
        (item) =>
            item.id !== docId &&
            item.title?.trim().toLowerCase() !== "overview",
    );
    const dispatch = useAppDispatch();
    const doc = useAppState((s) => s.docsReducer?.entities?.[docId]);

    useEffect(() => {
        if (docId) dispatch(DocsRTK(docId));
    }, [docId, dispatch]);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    // Track open collapsible items locally for AnimatePresence
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

    const isActiveSectionFn = (itemId: string) => {
        return (id.length === 2 && id[1] === itemId) || (id.length === 3 && id[1] === itemId);
    };

    if (!provider) return null;

    const toggleItem = (itemId: string, defaultOpen: boolean) => {
        setOpenItems((prev) => ({
            ...prev,
            [itemId]: itemId in prev ? !prev[itemId] : !defaultOpen,
        }));
    };

    const isItemOpen = (itemId: string, defaultOpen: boolean) => {
        return itemId in openItems ? openItems[itemId] : defaultOpen;
    };

    const updateTitle = (pageId: string, title: string) => {
        const ydoc = provider.document;
        const pages = ydoc.getArray<Y.Map<any>>("pages");

        ydoc.transact(() => {
            const page = pages.toArray().find((p) => p.get("id") === pageId);
            if (page) {
                page.set("title", title);
            }
        });
    };

    const sectionCount = tree.length;

    return (
        <SidebarProvider className="!w-0">
            <div className="fixed bottom-4 left-4 z-49 flex flex-col drop-shadow-2xl" style={{ width: "300px", pointerEvents: "none" }}>
                <motion.div
                    initial={false}
                    animate={{
                        height: isSidebarOpen ? "calc(100svh - 84px)" : "60px",
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="group/card flex flex-col w-full overflow-hidden pointer-events-auto rounded-2xl bg-card/90 backdrop-blur-xl ring-1 ring-foreground/10 text-card-foreground shadow-sm"
                >
                    {/* ── Header ── */}
                    <Button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        variant={"ghost"}
                        className="group flex items-center gap-3 px-4 !py-3 h-fit cursor-pointer shrink-0 w-full text-left select-none border-b border-border"
                        style={{ outline: "none" }}
                    >
                        {/* Coloured icon badge */}
                        <span
                            className="flex items-center justify-center shrink-0 rounded-lg"
                            style={{
                                width: 30,
                                height: 30,
                                background: "linear-gradient(135deg, hsl(var(--primary) / 0.18) 0%, hsl(var(--primary) / 0.06) 100%)",
                                border: "1px solid hsl(var(--primary) / 0.2)",
                            }}
                        >
                            <BookOpen className="h-3.5 w-3.5" style={{ color: "hsl(var(--primary))" }} />
                        </span>

                        {/* Title + meta */}
                        <div className="flex flex-col flex-1 min-w-0">
                            <span
                                className="font-semibold truncate leading-tight"
                                style={{ fontSize: "13px", color: "hsl(var(--foreground))" }}
                            >
                                {doc?.title || "Document"}
                            </span>
                            <span
                                className="text-[10.5px] leading-tight mt-0.5 flex items-center gap-1"
                                style={{ color: "hsl(var(--muted-foreground))" }}
                            >
                                <Layers className="h-2.5 w-2.5 opacity-70" />
                                {sectionCount} {sectionCount === 1 ? "section" : "sections"}
                            </span>
                        </div>

                        {/* Chevron */}
                        <motion.div
                            animate={{ rotate: isSidebarOpen ? 180 : 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 28 }}
                            className="shrink-0 flex"
                        >
                            <ChevronDown
                                className="h-4 w-4 transition-colors"
                                style={{ color: "hsl(var(--muted-foreground) / 0.7)" }}
                            />
                        </motion.div>
                    </Button>

                    {/* Divider */}
                    <div
                        className="shrink-0 mx-3"
                        style={{ height: "1px", background: "hsl(var(--border) / 0.5)" }}
                    />

                    {/* ── Content ── */}
                    <AnimatePresence initial={false}>
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.18, ease: "easeOut" }}
                                className="flex flex-1 flex-col min-h-0 overflow-hidden"
                            >
                                <div className="custom-scroll px-2 flex-1 overflow-y-auto pb-16 pt-2">
                                    {/* Overview */}
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={id.length === 1}
                                                tooltip="Overview"
                                                className="h-9 rounded-xl text-muted-foreground data-[active=true]:text-foreground data-[active=true]:bg-muted/60 transition-colors"
                                            >
                                                <Link href={`/editor/docs/${docId}`}>
                                                    <Home className="h-4 w-4 mr-2 opacity-70" />
                                                    <span className="font-medium text-[13px]">Overview</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>

                                    {/* Section label */}
                                    {tree.length > 0 && (
                                        <div className="flex items-center gap-2 px-2 pt-3 pb-1.5">
                                            <span
                                                className="text-[10px] font-semibold uppercase tracking-widest"
                                                style={{ color: "hsl(var(--muted-foreground) / 0.6)" }}
                                            >
                                                Sections
                                            </span>
                                            <div
                                                className="flex-1"
                                                style={{ height: "1px", background: "hsl(var(--border) / 0.4)" }}
                                            />
                                        </div>
                                    )}

                                    {/* Tree */}
                                    <SidebarMenu className="gap-0.5 pb-2">
                                        {tree.map((item: { id: string; title: string; children?: { id: string; title: string }[] }) => {
                                            const hasChildren = item.children && item.children.length > 0;
                                            const isActiveSection = isActiveSectionFn(item.id);
                                            const itemOpen = isItemOpen(item.id, isActiveSection);

                                            return (
                                                <Collapsible
                                                    key={item.id}
                                                    open={itemOpen}
                                                    onOpenChange={() => toggleItem(item.id, isActiveSection)}
                                                    className="group/collapsible"
                                                >
                                                    <SidebarMenuItem>
                                                        <div className="flex items-center w-full group/item relative rounded-xl hover:bg-muted/40 transition-colors">
                                                            {editingId === item.id ? (
                                                                <Input
                                                                    autoFocus
                                                                    defaultValue={item.title}
                                                                    onBlur={(e) => {
                                                                        updateTitle(item.id, e.target.value);
                                                                        setEditingId(null);
                                                                    }}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === "Enter") {
                                                                            updateTitle(item.id, e.currentTarget.value);
                                                                            setEditingId(null);
                                                                        }
                                                                        if (e.key === "Escape") setEditingId(null);
                                                                    }}
                                                                    className="h-8 px-2 mx-1 w-[calc(100%-8px)] text-sm bg-background mt-0.5 mb-0.5"
                                                                />
                                                            ) : (
                                                                <div className="flex w-full items-center">
                                                                    {hasChildren && (
                                                                        <CollapsibleTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-6 w-6 shrink-0 ml-0.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-transparent"
                                                                            >
                                                                                <motion.span
                                                                                    animate={{ rotate: itemOpen ? 90 : 0 }}
                                                                                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                                                                                    className="flex items-center justify-center"
                                                                                >
                                                                                    <ChevronRight className="h-3.5 w-3.5" />
                                                                                </motion.span>
                                                                            </Button>
                                                                        </CollapsibleTrigger>
                                                                    )}
                                                                    <SidebarMenuButton
                                                                        asChild
                                                                        isActive={id.length === 2 && id[1] === item.id}
                                                                        tooltip={item.title}
                                                                        className={`h-8 w-full rounded-xl text-[13px] text-muted-foreground data-[active=true]:text-foreground data-[active=true]:font-medium data-[active=true]:bg-muted/60 ${hasChildren ? "pl-1.5 pr-16" : "pl-3 pr-16"}`}
                                                                    >
                                                                        <Link href={`/editor/docs/${docId}/${item.id}`} className="flex items-center w-full">
                                                                            {!hasChildren && <FileText className="h-3.5 w-3.5 mr-2 opacity-50 shrink-0" />}
                                                                            <span className="truncate">{item.title}</span>
                                                                        </Link>
                                                                    </SidebarMenuButton>
                                                                </div>
                                                            )}

                                                            {/* Actions */}
                                                            {!editingId && (
                                                                <div className="absolute right-1 flex items-center opacity-0 group-hover/item:opacity-100 transition-opacity pl-4">
                                                                    <Button
                                                                        onClick={(e) => { e.preventDefault(); addPage(item.id); }}
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-6 w-6 rounded-lg hover:bg-muted text-muted-foreground/80 hover:text-foreground"
                                                                    >
                                                                        <Plus className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                    <Button
                                                                        onClick={(e) => { e.preventDefault(); setEditingId(item.id); }}
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-6 w-6 rounded-lg hover:bg-muted text-muted-foreground/80 hover:text-foreground"
                                                                    >
                                                                        <Pencil className="h-3 w-3" />
                                                                    </Button>
                                                                    <Button
                                                                        onClick={(e) => { e.preventDefault(); deletePage(item.id); }}
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-6 w-6 rounded-lg hover:bg-destructive/10 text-muted-foreground/80 hover:text-destructive"
                                                                    >
                                                                        <Trash2 className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Animated children */}
                                                        {hasChildren && (
                                                            <AnimatePresence initial={false}>
                                                                {itemOpen && (
                                                                    <motion.div
                                                                        key="children"
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{
                                                                            height: "auto",
                                                                            opacity: 1,
                                                                            transition: {
                                                                                height: { type: "spring", stiffness: 380, damping: 30 },
                                                                                opacity: { duration: 0.18, delay: 0.06 },
                                                                            },
                                                                        }}
                                                                        exit={{
                                                                            height: 0,
                                                                            opacity: 0,
                                                                            transition: {
                                                                                height: { type: "spring", stiffness: 380, damping: 30 },
                                                                                opacity: { duration: 0.12 },
                                                                            },
                                                                        }}
                                                                        style={{ overflow: "hidden" }}
                                                                    >
                                                                        <SidebarMenuSub className="ml-4 border-l border-border/30 pr-0 mr-0 pt-1 pb-1 gap-0.5">
                                                                            {item.children?.map((sub: { id: string; title: string }) => {
                                                                                const isActiveSub = id.length === 3 && id[1] === item.id && id[2] === sub.id;
                                                                                return (
                                                                                    <SidebarMenuSubItem key={sub.id}>
                                                                                        <div className="flex items-center w-full group/sub relative rounded-xl hover:bg-muted/40 transition-colors">
                                                                                            {editingId === sub.id ? (
                                                                                                <Input
                                                                                                    autoFocus
                                                                                                    defaultValue={sub.title}
                                                                                                    onBlur={(e) => {
                                                                                                        updateTitle(sub.id, e.target.value);
                                                                                                        setEditingId(null);
                                                                                                    }}
                                                                                                    onKeyDown={(e) => {
                                                                                                        if (e.key === "Enter") {
                                                                                                            updateTitle(sub.id, e.currentTarget.value);
                                                                                                            setEditingId(null);
                                                                                                        }
                                                                                                        if (e.key === "Escape") setEditingId(null);
                                                                                                    }}
                                                                                                    className="h-7 px-2 text-sm mx-1 w-[calc(100%-8px)] bg-background"
                                                                                                />
                                                                                            ) : (
                                                                                                <SidebarMenuSubButton
                                                                                                    asChild
                                                                                                    isActive={isActiveSub}
                                                                                                    className="h-8 rounded-xl pr-12 text-[12.5px] text-muted-foreground data-[active=true]:text-foreground data-[active=true]:font-medium data-[active=true]:bg-muted/60"
                                                                                                >
                                                                                                    <Link href={`/editor/docs/${docId}/${item.id}/${sub.id}`}>
                                                                                                        <FileText className="h-3 w-3 mr-2 opacity-50 shrink-0" />
                                                                                                        <span className="truncate">{sub.title}</span>
                                                                                                    </Link>
                                                                                                </SidebarMenuSubButton>
                                                                                            )}

                                                                                            {!editingId && (
                                                                                                <div className="absolute right-1 flex items-center opacity-0 group-hover/sub:opacity-100 transition-opacity pl-4">
                                                                                                    <Button
                                                                                                        onClick={(e) => { e.preventDefault(); setEditingId(sub.id); }}
                                                                                                        variant="ghost"
                                                                                                        size="icon"
                                                                                                        className="h-6 w-6 rounded-lg text-muted-foreground/80 hover:text-foreground"
                                                                                                    >
                                                                                                        <Pencil className="h-3 w-3" />
                                                                                                    </Button>
                                                                                                    <Button
                                                                                                        onClick={(e) => { e.preventDefault(); deletePage(sub.id); }}
                                                                                                        variant="ghost"
                                                                                                        size="icon"
                                                                                                        className="h-6 w-6 rounded-lg text-muted-foreground/80 hover:text-destructive"
                                                                                                    >
                                                                                                        <Trash2 className="h-3.5 w-3.5" />
                                                                                                    </Button>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </SidebarMenuSubItem>
                                                                                );
                                                                            })}
                                                                        </SidebarMenuSub>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        )}
                                                    </SidebarMenuItem>
                                                </Collapsible>
                                            );
                                        })}
                                    </SidebarMenu>

                                    {/* Footer add button */}
                                    <div className="fixed bottom-0 left-0 right-0 mt-auto p-3" style={{ background: "hsl(var(--background) / 0.95)", borderTop: "1px solid hsl(var(--border) / 0.4)" }}>
                                        <Button
                                            onClick={() => addPage(null)}
                                            variant="outline"
                                            className="w-full h-9 rounded-xl gap-2 text-[13px] font-medium border-dashed border-border hover:bg-muted hover:border-primary/30 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" /> Add Section
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </SidebarProvider>
    );
}
