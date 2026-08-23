"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ArrowLeft, ArrowRight, BookOpenText } from "lucide-react";
import { BlogCard, DocsCard, FeaturedCarousel, TabChips } from "@/components/atomsComponents";
import { BlogCardSkeleton } from "@/components/atomsComponents/skleton/blogCardSkleton";
import { Skeleton } from "@/components/shadcnUI/skeleton";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import { getCoverBlog } from "@/store/reducers/BlogCoverReducer";
import { DocsCoverRtk } from "@/store/reducers/DocsCoverReducer";
import { getFeaturedBlogs } from "@/store/reducers/FeaturedBlogReducer";
import type { RootState } from "@/store/store";
import type { BlogHomeCard } from "@/types/blog/blog-base";
import type { DocsHomeCard } from "@/types/docs/docs-base";

import { WhatToReadNext } from "@/components/ui/homePage/WhatToReadNext";
import { StartWritingCTA } from "@/components/ui/homePage/StartWritingCta";
import { PlatformsToReadOn } from "@/components/ui/homePage/PlatformsToReadOn";
import { RecentlyUpdatedDocs } from "@/components/ui/homePage/RecentlyUpdatedDocs";
import { useTagCatalog } from "@/hooks/useTagCatalog";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pickCuratedDocs(docs: DocsHomeCard[] | unknown, size: number) {
    const safeDocs = Array.isArray(docs) ? docs : [];
    return safeDocs.slice(0, Math.min(size, safeDocs.length));
}

function formatDateLabel(createdAt: string) {
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return "Fresh today";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    }).format(date);
}


function DocsShelf({ docs }: { docs: DocsHomeCard[] }) {
    const safeDocs = Array.isArray(docs) ? docs : [];

    if (safeDocs.length === 0) {
        return (
            <section className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground/55">
                        Reference shelf
                    </span>
                    <div className="h-px flex-1 bg-foreground/[0.10]" />
                    <Link
                        href="/docs"
                        className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/55 transition-colors hover:text-foreground"
                    >
                        Browse docs
                    </Link>
                </div>
                <p className="py-8 text-center text-sm text-foreground/35">
                    More docs will appear here soon.
                </p>
            </section>
        );
    }

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-3">
                <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground/55">
                    Reference shelf
                </span>
                <div className="h-px flex-1 bg-foreground/[0.10]" />
                <Link
                    href="/docs"
                    className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/55 transition-colors hover:text-foreground"
                >
                    Browse docs
                </Link>
            </div>
            <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    Continue learning
                </h2>
                <p className="mt-1 text-sm text-foreground/45">
                    Focused docs picked from your latest workspace updates.
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-3">
                {safeDocs.map((doc) => (
                    <DocsCard
                        key={doc.id}
                        doc={doc}
                        hoverOpen={false}
                        active=""
                        setActiveCard={() => {}}
                        cardClassName="border border-foreground/[0.10]"
                    />
                ))}
            </div>
        </section>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
    const router = useRouter();
    const { interests } = useTagCatalog();
    const tabs = [{ label: "All", value: "all" }, ...interests.map((topic) => ({ label: topic, value: topic }))];
    const {
        blogLoading,
        data,
        fetched: blogFetched,
    } = useSelector((s: RootState) => s.blogReducer);
    const {
        loading: featuredLoading,
        data: featuredStories,
        fetched: featuredFetched,
    } = useAppState((s) => s.featuredBlogReducer);
    const {
        isDocsLoading,
        docs,
        fetched: docsFetched,
    } = useAppState((s) => s.docsHomeReducer);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!blogFetched)
            dispatch(getCoverBlog({ cursor: null, mode: "init" }));
    }, [dispatch, blogFetched]);

    useEffect(() => {
        if (!featuredFetched) {
            dispatch(getFeaturedBlogs());
        }
    }, [dispatch, featuredFetched]);

    useEffect(() => {
        if (!docsFetched) dispatch(DocsCoverRtk());
    }, [dispatch, docsFetched]);

    const blogList = data ?? [];
    const docsList = Array.isArray(docs) ? docs : [];

    const carouselStories = Array.isArray(featuredStories) ? featuredStories : [];
    const featuredIds = new Set(carouselStories.map((story) => story.id));
    const nonFeaturedStories = blogList.filter(
        (story) => !featuredIds.has(story.id),
    );
    // feed: next posts after featured selection
    const recentStories = nonFeaturedStories.slice(0, 6);
    // What to read next: posts 9–13 — genuinely beyond what's already visible
    const whatToReadNext = nonFeaturedStories.slice(6, 9);
    // docs shelf in main: first 4
    const curatedDocs = pickCuratedDocs(docsList, 4);
    // recently updated docs in sidebar: next 5 (skip the 4 already in shelf)
    const sidebarDocs = pickCuratedDocs(docsList.slice(1), 2);

    return (
        <main className="w-full">
            <div className="mx-auto w-full md:max-w-6xl 2xl:max-w-[1400px] px-3 sm:px-5 lg:px-8">
                {/* sticky tab bar */}
                <div className="sticky top-[58px] z-20 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/30">
                    {blogLoading ? (
                        <Skeleton className="mt-3 h-9 w-full rounded-full" />
                    ) : (
                        <TabChips
                            key={tabs.map((tab) => tab.value).join("|")}
                            tabs={tabs}
                            onTabChange={(topic) => {
                                if (topic !== "all") router.push(`/search?query=${encodeURIComponent(topic)}`);
                            }}
                        />
                    )}
                    <hr className="border-foreground/[0.06]" />
                </div>

                <div className="space-y-0 pt-6">
                    {/* ROW 1 — full-width carousel */}
                    {featuredLoading ? (
                        <div className="overflow-hidden rounded-[28px] border border-border/60 bg-card">
                            <div className="flex flex-col md:grid md:grid-cols-[1fr_minmax(260px,0.65fr)] lg:grid-cols-[1fr_minmax(300px,0.7fr)]">
                                <div className="order-first h-52 border-b border-border/50 md:order-last md:h-auto md:min-h-[340px] md:border-b-0 md:border-l">
                                    <Skeleton className="h-full w-full rounded-none" />
                                </div>
                                <div className="order-last flex flex-col gap-4 p-5 sm:p-7 lg:p-8 md:order-first">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-5 w-20 rounded-full" />
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="ml-auto h-3 w-10" />
                                    </div>
                                    <div className="space-y-3">
                                        <Skeleton className="h-9 w-[82%]" />
                                        <Skeleton className="h-9 w-[56%]" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-[88%]" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                        <Skeleton className="h-6 w-20 rounded-full" />
                                        <Skeleton className="h-6 w-14 rounded-full" />
                                    </div>
                                    <div className="mt-auto flex items-center justify-between gap-4 pt-4">
                                        <div className="space-y-2">
                                            <Skeleton className="h-3 w-16" />
                                            <Skeleton className="h-4 w-28" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <Skeleton className="h-8 w-20 rounded-lg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <FeaturedCarousel stories={carouselStories} />
                    )}

                    {/* ROW 2 — 9-col main + 3-col sidebar */}
                    <div className="grid grid-cols-12 gap-x-8 pt-8">
                        {/* ── Main ── */}
                        <section className="col-span-12 min-w-0 xl:col-span-9">
                            {blogLoading ? (
                                <div className="space-y-4">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <BlogCardSkeleton key={i} />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-0">
                                    {/* Recent stories */}
                                    <section>
                                        <div className="space-y-2 pb-5">
                                            <div className="flex items-center gap-3">
                                                <p className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/60">
                                                    Latest dispatches
                                                </p>
                                                <div className="h-px flex-1 bg-foreground/[0.08]" />
                                                <Link
                                                    href="/search"
                                                    className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/55 transition-colors hover:text-foreground"
                                                >
                                                    Explore all
                                                </Link>
                                            </div>
                                            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                                                Fresh writing from the network
                                            </h2>
                                        </div>
                                        {recentStories.length === 0 ? (
                                            <p className="py-8 text-center text-sm text-foreground/35">
                                                More posts will appear here
                                                soon.
                                            </p>
                                        ) : (
                                            <div>
                                                {recentStories.map(
                                                    (blog, i) => (
                                                        <div key={blog.id}>
                                                            {i > 0 && (
                                                                <hr className="border-foreground/[0.06]" />
                                                            )}
                                                            <BlogCard
                                                                {...blog}
                                                                isOwner={false}
                                                            />
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </section>

                                    <div className="pt-10">
                                        <DocsShelf docs={curatedDocs} />
                                    </div>
                                </div>
                            )}
                        </section>

                        <aside className="col-span-12 xl:col-span-3">
                            <div className="flex flex-col gap-4 xl:sticky xl:top-[132px]">
                                <WhatToReadNext stories={whatToReadNext} />
                                <StartWritingCTA />
                                <PlatformsToReadOn />
                                <RecentlyUpdatedDocs docs={sidebarDocs} />
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </main>
    );
}
