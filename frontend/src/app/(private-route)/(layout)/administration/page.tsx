"use client";

import { Ellipsis, ExternalLink, Globe2, LoaderCircle, PanelLeftClose, PanelLeftOpen, Tags, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/axios";
import { Button } from "@/components/shadcnUI/button";
import { Input } from "@/components/shadcnUI/input";
import { Skeleton } from "@/components/shadcnUI/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/shadcnUI/dropdown-menu";
import { useTagCatalog, type ManagedTag } from "@/hooks/useTagCatalog";
import { useAppState } from "@/hooks/ReduxHooks";

const groups = [
    { category: "DESIGNATION", title: "Profile roles", description: "Options shown under “What best describes you?”" },
    { category: "INTEREST", title: "Interest topics", description: "Options shown under “Select your interests” and when writing." },
] as const;

type ReadingPlatform = { id: string; name: string; websiteUrl: string; coverUrl: string; description: string | null };
type PlatformDraft = { name: string; websiteUrl: string; coverSourceUrl: string; description: string };
const emptyPlatform: PlatformDraft = { name: "", websiteUrl: "", coverSourceUrl: "", description: "" };

function AdministrationSkeleton() {
    return <div className="min-h-[calc(100vh-4rem)] animate-pulse">
        <aside className="fixed left-0 top-16 z-20 hidden h-[calc(100vh-4rem)] w-72 border-r bg-background/95 px-3 py-5 md:flex md:flex-col">
            <div className="flex items-center justify-between px-2">
                <div className="space-y-2"><Skeleton className="h-5 w-32" /><Skeleton className="h-3 w-24" /></div>
                <Skeleton className="size-9 rounded-md" />
            </div>
            <div className="mt-8 flex items-center gap-3 rounded-md border px-3 py-2"><Skeleton className="size-4 rounded-sm" /><Skeleton className="h-4 w-28" /></div>
        </aside>
        <main className="w-full px-5 py-8 md:px-10 md:pl-80">
            <header className="space-y-2"><Skeleton className="h-8 w-52" /><Skeleton className="h-4 w-full max-w-xl" /></header>
            <div className="mt-8 grid gap-6">
                {Array.from({ length: 2 }).map((_, index) => <section key={index} className="rounded-xl border bg-card p-5"><Skeleton className="h-5 w-32" /><Skeleton className="mt-2 h-4 w-72 max-w-full" /><div className="mt-5 flex gap-2"><Skeleton className="h-10 flex-1" /><Skeleton className="h-10 w-14" /></div><div className="mt-5 flex flex-wrap gap-2"><Skeleton className="h-7 w-24" /><Skeleton className="h-7 w-32" /><Skeleton className="h-7 w-20" /></div></section>)}
                <section className="rounded-xl border bg-card p-5"><div className="flex gap-3"><Skeleton className="size-5 rounded" /><div className="space-y-2"><Skeleton className="h-5 w-44" /><Skeleton className="h-4 w-full max-w-lg" /></div></div><div className="mt-5 grid gap-3 md:grid-cols-2"><Skeleton className="h-10" /><Skeleton className="h-10" /><Skeleton className="h-10 md:col-span-2" /><Skeleton className="h-20 md:col-span-2" /></div><Skeleton className="mt-3 h-10 w-28" /><div className="mt-6 space-y-2"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div></section>
            </div>
        </main>
    </div>;
}

export default function AdministrationPage() {
    const router = useRouter();
    const { status } = useAppState((state) => state.userReducer);
    const { tags, refresh: refreshTags } = useTagCatalog();
    const [compact, setCompact] = useState(false);
    const [drafts, setDrafts] = useState<Record<string, string>>({});
    const [platformDraft, setPlatformDraft] = useState<PlatformDraft>(emptyPlatform);
    const [platforms, setPlatforms] = useState<ReadingPlatform[]>([]);
    const [platformsLoading, setPlatformsLoading] = useState(true);
    const [platformSaving, setPlatformSaving] = useState(false);
    const [access, setAccess] = useState<"checking" | "allowed" | "denied">("checking");
    const [error, setError] = useState("");

    const loadPlatforms = async () => {
        setPlatformsLoading(true);
        try {
            const { data } = await api.get<{ data: ReadingPlatform[] }>("/api/v1/reading-platforms");
            setPlatforms(data.data);
        } catch {
            setError("Reading platforms could not be loaded.");
        } finally {
            setPlatformsLoading(false);
        }
    };

    useEffect(() => {
        if (status === "idle" || status === "loading") return;
        let current = true;
        if (status !== "authorized") {
            setAccess("denied");
            return () => { current = false; };
        }
        api.get("/api/v1/tags/manage")
            .then(() => {
                if (!current) return;
                setAccess("allowed");
                void loadPlatforms();
            })
            .catch(() => current && setAccess("denied"));
        return () => { current = false; };
    }, [status]);

    useEffect(() => {
        if (access === "denied") router.replace("/not-found");
    }, [access, router]);

    const addTag = async (category: string) => {
        const label = drafts[category]?.trim();
        if (!label) return;
        try {
            setError("");
            await api.post("/api/v1/tags", { label, category });
            setDrafts((current) => ({ ...current, [category]: "" }));
            await refreshTags();
        } catch {
            setError("A tag could not be saved. It may already exist.");
        }
    };

    const removeTag = async (tag: ManagedTag) => {
        try {
            await api.delete(`/api/v1/tags/${tag.id}`);
            await refreshTags();
        } catch {
            setError("A tag could not be removed.");
        }
    };

    const addPlatform = async () => {
        if (!platformDraft.name.trim() || !platformDraft.websiteUrl.trim() || !platformDraft.coverSourceUrl.trim()) return;
        setPlatformSaving(true);
        try {
            setError("");
            await api.post("/api/v1/reading-platforms", platformDraft);
            setPlatformDraft(emptyPlatform);
            await loadPlatforms();
        } catch (requestError: any) {
            setError(requestError?.response?.data?.message || requestError?.response?.data?.error || "The platform could not be saved. Confirm that the cover URL is a public image.");
        } finally {
            setPlatformSaving(false);
        }
    };

    const removePlatform = async (platform: ReadingPlatform) => {
        try {
            setError("");
            await api.delete(`/api/v1/reading-platforms/${platform.id}`);
            setPlatforms((current) => current.filter((item) => item.id !== platform.id));
        } catch {
            setError("The platform could not be removed.");
        }
    };

    if (access === "checking") {
        return <AdministrationSkeleton />;
    }

    if (access === "denied") {
        return <AdministrationSkeleton />;
    }

    return <div className="min-h-[calc(100vh-4rem)]">
        <aside className={`fixed left-0 top-16 z-20 hidden h-[calc(100vh-4rem)] border-r bg-background/95 py-5 backdrop-blur transition-[width,padding] duration-300 ease-in-out md:flex md:flex-col ${compact ? "w-16 px-2" : "w-72 px-3"}`}>
            <div className={`flex items-center ${compact ? "justify-center" : "justify-between px-2"}`}>
                {!compact && <div><h1 className="text-lg font-semibold">Administration</h1><p className="text-xs text-muted-foreground">Content controls</p></div>}
                <Button variant="ghost" size="icon" className="text-foreground transition-colors hover:bg-accent" onClick={() => setCompact(!compact)} aria-label={compact ? "Expand navigation" : "Compact navigation"}>{compact ? <PanelLeftOpen className="size-4 animate-in zoom-in-75 duration-200" /> : <PanelLeftClose className="size-4 animate-in zoom-in-75 duration-200" />}</Button>
            </div>
            <div className={`mt-8 flex items-center gap-3 rounded-md border bg-background px-3 py-2 text-sm font-medium text-foreground transition-all duration-300 ${compact ? "justify-center px-0" : ""}`}><Tags className="size-4 shrink-0" />{!compact && "Content settings"}</div>
        </aside>

        <main className={`w-full px-5 py-8 transition-[padding] md:px-10 ${compact ? "md:pl-24" : "md:pl-80"}`}>
            <header><h2 className="text-2xl font-semibold">Content settings</h2><p className="mt-1 text-sm text-muted-foreground">Manage profile options, writing topics, and homepage reading platforms.</p></header>
            {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

            <div className="mt-8 grid gap-6">
                <section className="rounded-xl border bg-card p-5">
                    <div className="flex items-start gap-3"><Globe2 className="mt-0.5 size-5 text-muted-foreground" /><div><h3 className="font-semibold">Platforms to read on</h3><p className="mt-1 text-sm text-muted-foreground">Curated external publications shown on the homepage. Cover images are imported and served from your database.</p></div></div>
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                        <Input value={platformDraft.name} onChange={(event) => setPlatformDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Platform name" maxLength={100} />
                        <Input value={platformDraft.websiteUrl} onChange={(event) => setPlatformDraft((current) => ({ ...current, websiteUrl: event.target.value }))} placeholder="Website URL (https://...)" />
                        <Input className="md:col-span-2" value={platformDraft.coverSourceUrl} onChange={(event) => setPlatformDraft((current) => ({ ...current, coverSourceUrl: event.target.value }))} placeholder="Public cover image URL (https://...)" />
                        <textarea className="min-h-20 rounded-md border bg-transparent px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring md:col-span-2" value={platformDraft.description} onChange={(event) => setPlatformDraft((current) => ({ ...current, description: event.target.value }))} placeholder="Short description (optional)" maxLength={1000} />
                    </div>
                    <Button className="mt-3 bg-[#1f1f1f] text-white hover:bg-[#2b2b2b] disabled:opacity-100 disabled:bg-[#1f1f1f] disabled:text-white" onClick={() => void addPlatform()} disabled={platformSaving || !platformDraft.name.trim() || !platformDraft.websiteUrl.trim() || !platformDraft.coverSourceUrl.trim()}>{platformSaving && <LoaderCircle className="size-4 animate-spin" />}Add platform</Button>

                    <div className="mt-6 space-y-2">
                        {platformsLoading ? Array.from({ length: 2 }).map((_, index) => <Skeleton key={index} className="h-16 w-full" />) : platforms.length ? platforms.map((platform) => <div key={platform.id} className="flex items-center gap-3 rounded-lg border p-3"><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{platform.name}</p><p className="truncate text-xs text-muted-foreground">{platform.websiteUrl}</p></div><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="text-foreground hover:bg-accent" aria-label={`Actions for ${platform.name}`}><Ellipsis className="size-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-80 overflow-hidden p-0"><img src={platform.coverUrl} alt={`${platform.name} cover`} className="h-44 w-full object-cover" /><DropdownMenuLabel className="space-y-1.5 whitespace-normal px-3 py-3"><p className="text-sm font-semibold text-foreground">{platform.name}</p><p className="break-all text-xs font-normal text-muted-foreground">{platform.websiteUrl}</p>{platform.description && <p className="pt-1 text-sm font-normal leading-relaxed text-muted-foreground">{platform.description}</p>}</DropdownMenuLabel><DropdownMenuSeparator /><div className="p-1"><DropdownMenuItem asChild><a href={platform.websiteUrl} target="_blank" rel="noreferrer"><ExternalLink />Visit site</a></DropdownMenuItem></div><DropdownMenuSeparator /><div className="p-1"><DropdownMenuItem variant="destructive" onSelect={() => void removePlatform(platform)}><Trash2 />Remove platform</DropdownMenuItem></div></DropdownMenuContent></DropdownMenu></div>) : <p className="text-sm text-muted-foreground">No platforms have been configured.</p>}
                    </div>
                </section>

                {groups.map((group) => {
                    const groupTags = tags.filter((tag) => tag.category === group.category);
                    return <section key={group.category} className="rounded-xl border bg-card p-5"><h3 className="font-semibold">{group.title}</h3><p className="mt-1 text-sm text-muted-foreground">{group.description}</p><div className="mt-5 flex gap-2"><Input value={drafts[group.category] ?? ""} onChange={(event) => setDrafts((current) => ({ ...current, [group.category]: event.target.value }))} onKeyDown={(event) => { if (event.key === "Enter") void addTag(group.category); }} placeholder={`Add ${group.title.toLowerCase().slice(0, -1)}`} maxLength={80} /><Button className="bg-[#1f1f1f] text-white hover:bg-[#2b2b2b] disabled:opacity-100 disabled:bg-[#1f1f1f] disabled:text-white" onClick={() => void addTag(group.category)} disabled={!drafts[group.category]?.trim()}>Add</Button></div><div className="mt-5 flex flex-wrap gap-2">{groupTags.map((tag) => <span key={tag.id} className="inline-flex items-center gap-2 rounded-sm border px-3 py-1 text-sm">{tag.label}<button onClick={() => void removeTag(tag)} aria-label={`Remove ${tag.label}`} className="text-foreground/70 hover:text-destructive">×</button></span>)}</div></section>;
                })}
            </div>
        </main>
    </div>;
}
