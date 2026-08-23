"use client";

import { ArrowRight, BookOpen, FileText, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import api from "@/api/axios";
import { Button } from "@/components/shadcnUI/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/shadcnUI/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/shadcnUI/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcnUI/select";
import { Skeleton } from "@/components/shadcnUI/skeleton";

export const searchPaletteEvent = "bamboo:open-search";

export function openSearchPalette(query = "") {
    window.dispatchEvent(new CustomEvent<{ query: string }>(searchPaletteEvent, { detail: { query } }));
}

type ContentFilter = "ALL" | "PEOPLE" | "BLOG" | "DOC";
type SearchResult = { id: string; type: Exclude<ContentFilter, "ALL">; title: string; description?: string; topic: string; meta: string; href: string };
type ContentResponse = { data: Array<{ id: string; title: string; description?: string | null; content?: string; createdAt: string; author: { id: string; name: string } }> };

const topics = ["Engineering", "Design", "Writing", "Data", "Product"];
const filters: { value: ContentFilter; label: string }[] = [{ value: "ALL", label: "All" }, { value: "PEOPLE", label: "People" }, { value: "BLOG", label: "Blogs" }, { value: "DOC", label: "Docs" }];
const plainText = (value?: string) => value?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 140) ?? "";

export function SearchCommandPalette({ initialOpen = false, initialQuery = "" }: { initialOpen?: boolean; initialQuery?: string }) {
    const router = useRouter();
    const [open, setOpen] = React.useState(initialOpen);
    const [query, setQuery] = React.useState(initialQuery);
    const [contentFilter, setContentFilter] = React.useState<ContentFilter>("ALL");
    const [topicFilter, setTopicFilter] = React.useState("ALL");
    const [results, setResults] = React.useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const focusSearchInput = () => window.requestAnimationFrame(() => (document.querySelector("[data-slot=command-input]") as HTMLInputElement | null)?.focus());

    React.useEffect(() => {
        const handleOpen = (event: Event) => {
            const nextQuery = (event as CustomEvent<{ query?: string }>).detail?.query ?? "";
            setQuery(nextQuery);
            setOpen(true);
            focusSearchInput();
        };
        window.addEventListener(searchPaletteEvent, handleOpen);
        return () => window.removeEventListener(searchPaletteEvent, handleOpen);
    }, []);

    React.useEffect(() => {
        if (initialOpen) {
            setQuery(initialQuery);
            setOpen(true);
        }
    }, [initialOpen, initialQuery]);

    React.useEffect(() => {
        if (!open) return;
        let cancelled = false;
        setIsLoading(true);

        Promise.all([api.get<ContentResponse>("/api/v1/posts"), api.get<ContentResponse>("/api/v1/docs")])
            .then(([postsResponse, docsResponse]) => {
                if (cancelled) return;
                const posts = postsResponse.data.data.map((post) => ({ id: post.id, type: "BLOG" as const, title: post.title, description: post.description?.trim() || plainText(post.content), topic: "Blog", meta: post.author.name, href: `/blog/${post.id}` }));
                const docs = docsResponse.data.data.map((doc) => ({ id: doc.id, type: "DOC" as const, title: doc.title, description: plainText(doc.content), topic: "Docs", meta: doc.author.name, href: `/docs/${doc.id}` }));
                const people = [...postsResponse.data.data, ...docsResponse.data.data].reduce<SearchResult[]>((authors, item) => authors.some((author) => author.id === item.author.id) ? authors : [...authors, { id: item.author.id, type: "PEOPLE", title: item.author.name, topic: "Member", meta: "View profile", href: `/profile/${item.author.id}` }], []);
                setResults([...people, ...posts, ...docs]);
            })
            .catch(() => { if (!cancelled) setResults([]); })
            .finally(() => { if (!cancelled) setIsLoading(false); });

        return () => { cancelled = true; };
    }, [open]);

    React.useEffect(() => {
        const handleFilterShortcut = (event: KeyboardEvent) => {
            if (open && (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                focusSearchInput();
                return;
            }
            if (!open || !event.altKey) return;
            const shortcuts: Record<string, ContentFilter> = { a: "ALL", p: "PEOPLE", b: "BLOG", d: "DOC" };
            const filter = shortcuts[event.key.toLowerCase()];
            if (filter) { event.preventDefault(); setContentFilter(filter); }
        };
        window.addEventListener("keydown", handleFilterShortcut);
        return () => window.removeEventListener("keydown", handleFilterShortcut);
    }, [open]);

    const filteredResults = React.useMemo(() => results.filter((result) => (contentFilter === "ALL" || result.type === contentFilter) && (topicFilter === "ALL" || result.topic === topicFilter)), [contentFilter, results, topicFilter]);
    const ResultIcon = ({ type }: Pick<SearchResult, "type">) => type === "BLOG" ? <BookOpen aria-hidden="true" /> : type === "DOC" ? <FileText aria-hidden="true" /> : <UserRound aria-hidden="true" />;
    const selectResult = (result: SearchResult) => { setOpen(false); router.push(result.href); };
    const resultItem = (result: SearchResult) => <CommandItem key={`${result.type}-${result.id}`} value={`${result.title} ${result.description ?? ""} ${result.meta} ${result.type}`} className="group flex min-h-16 cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 data-[selected=true]:bg-muted/70" onSelect={() => selectResult(result)}><span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-data-[selected=true]:bg-background group-data-[selected=true]:text-foreground"><ResultIcon type={result.type} /></span><span className="flex min-w-0 flex-1 flex-col gap-0.5"><span className="truncate text-sm font-medium text-foreground">{result.title}</span><span className="truncate text-xs text-muted-foreground">{result.type === "PEOPLE" ? "Person" : `${result.type === "BLOG" ? "Blog" : "Document"} · ${result.meta}`}{result.description ? ` · ${result.description}` : ""}</span></span><ArrowRight size={15} className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-data-[selected=true]:opacity-100" aria-hidden="true" /></CommandItem>;
    const groupedResults: { type: Exclude<ContentFilter, "ALL">; label: string }[] = [{ type: "PEOPLE", label: "People" }, { type: "BLOG", label: "Blogs" }, { type: "DOC", label: "Docs" }];
    const visibleGroups = groupedResults.map((group) => ({ ...group, results: filteredResults.filter((result) => result.type === group.type) })).filter((group) => group.results.length > 0);
    const renderGroupItems = (items: SearchResult[]) => items.map(resultItem);

    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-[min(72dvh,42rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden p-0 shadow-lg duration-200 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 sm:w-[42rem] sm:max-w-[42rem]">
            <DialogHeader className="sr-only"><DialogTitle>Search Bamboo</DialogTitle><DialogDescription>Search public blogs and documents.</DialogDescription></DialogHeader>
            <Command className="h-full overflow-hidden rounded-none [&_[data-slot=command-input-wrapper]]:h-14 [&_[data-slot=command-input-wrapper]]:px-4 [&_[data-slot=command-input]]:text-sm">
                <div className="relative mx-4"><CommandInput autoFocus value={query} onValueChange={setQuery} className="cursor-text caret-foreground pr-16" placeholder="Search Bamboo…" /><kbd className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">⌘ K</kbd></div>
                <div className="mx-4 flex flex-wrap items-center gap-1.5 border-b py-2" aria-label="Content type filters">{filters.map((filter) => <Button key={filter.value} type="button" variant={contentFilter === filter.value ? "default" : "ghost"} size="sm" className="h-7 shrink-0 rounded-md px-2.5 text-xs shadow-none" onClick={() => setContentFilter(filter.value)} aria-pressed={contentFilter === filter.value}>{filter.label}</Button>)}<Select value={topicFilter} onValueChange={setTopicFilter}><SelectTrigger aria-label="Filter by topic" size="sm" className="ml-auto h-7 min-w-32 rounded-md text-xs shadow-none"><SelectValue placeholder="Explore a topic" /></SelectTrigger><SelectContent className="shadow-none"><SelectGroup><SelectItem value="ALL">Explore a topic</SelectItem>{topics.map((topic) => <SelectItem key={topic} value={topic}>{topic}</SelectItem>)}</SelectGroup></SelectContent></Select></div>
                <CommandList className="max-h-none flex-1 px-4 py-2">
                    {!isLoading && <CommandEmpty className="flex min-h-56 flex-col items-center justify-center gap-3 px-4 text-center"><span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground"><BookOpen size={18} aria-hidden="true" /></span><span className="space-y-1"><span className="block text-sm font-medium text-foreground">No results found</span><span className="block text-xs text-muted-foreground">Try another title, author, or topic.</span></span></CommandEmpty>}
                    {isLoading ? <div className="space-y-2 py-1" aria-label="Loading search suggestions" aria-busy="true">{Array.from({ length: 6 }, (_, index) => <div key={index} className="flex items-center gap-3 px-3 py-2"><Skeleton className="size-9 rounded-md" /><span className="flex flex-1 flex-col gap-2"><Skeleton className="h-3.5 w-2/5" /><Skeleton className="h-3 w-3/5" /></span></div>)}</div> : contentFilter === "ALL" ? visibleGroups.map(({ type, label, results }, index) => <React.Fragment key={type}>{index > 0 && <CommandSeparator className="my-2" />}<CommandGroup heading={<span className="flex items-center gap-2">{label}<span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] leading-none text-foreground">{results.length}</span></span>}>{renderGroupItems(results)}</CommandGroup></React.Fragment>) : filteredResults.length > 0 && <CommandGroup heading={<span className="flex items-center gap-2">{filters.find((filter) => filter.value === contentFilter)?.label}<span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] leading-none text-foreground">{filteredResults.length}</span></span>}>{renderGroupItems(filteredResults)}</CommandGroup>}
                </CommandList>
                <div className="flex h-12 shrink-0 items-center justify-start gap-4 overflow-x-auto border-t border-[#dedede] bg-[#f5f5f5] px-4 py-0 text-xs leading-none text-[#1f1f1f] dark:border-border dark:bg-muted/40 dark:text-foreground [&::-webkit-scrollbar]:hidden">
                    {[["⌘K", "Focus"], ["⌥A", "All"], ["⌥P", "People"], ["⌥B", "Blogs"], ["⌥D", "Docs"], ["↑↓", "Navigate"], ["Esc", "Close"]].map(([shortcut, label]) => <span key={label} className="flex h-12 shrink-0 items-center gap-1.5 whitespace-nowrap"><kbd className="flex size-7 shrink-0 items-center justify-center rounded-md border border-[#d1d1d1] bg-white font-mono text-[10px] font-medium leading-none text-[#1f1f1f] dark:border-border dark:bg-background dark:text-foreground">{shortcut}</kbd><span className="flex h-12 items-center leading-none">{label}</span></span>)}
                </div>
            </Command>
        </DialogContent>
    </Dialog>;
}
