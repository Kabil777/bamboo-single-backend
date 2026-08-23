"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogHomeCard } from "@/types/blog/blog-base";

function formatDateLabel(createdAt: string) {
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    }).format(date);
}

function deriveReason(story: BlogHomeCard): string {
    const tag = story.tags?.[0];
    if (tag) return `A deep dive into ${tag}`;
    return story.description?.split(".")[0] ?? "Worth your time";
}

interface WhatToReadNextProps {
    stories: BlogHomeCard[];
}

export function WhatToReadNext({ stories }: WhatToReadNextProps) {
    if (!stories.length) return null;
    return (
        <div>
            {/* inline title divider */}
            <div className="mb-5 flex items-center gap-3">
                <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
                    What to read next
                </span>
                <div className="h-px flex-1 bg-foreground/[0.08]" />
            </div>

            {/* reading stack */}
            <div className="space-y-1">
                {stories.map((story, i) => (
                    <Link
                        key={story.id}
                        href={`/blog/${story.id}`}
                        className="group flex items-start gap-3.5 rounded-xl px-3 py-3.5 transition-colors hover:bg-foreground/[0.04]"
                    >
                        {/* index glyph */}
                        <span className="mt-0.5 shrink-0 text-xs tabular-nums text-foreground/20 group-hover:text-foreground/40">
                            {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 flex-1 space-y-1">
                            <h3 className="line-clamp-2 text-sm font-semibold leading-[1.45] tracking-tight text-foreground">
                                {story.title}
                            </h3>
                            <p className="line-clamp-1 text-xs leading-relaxed text-foreground/45">
                                {deriveReason(story)}
                            </p>
                        </div>
                        {/* date + arrow */}
                        <div className="flex shrink-0 flex-col items-end gap-1.5 pt-0.5">
                            <span className="text-[11px] text-foreground/25">
                                {formatDateLabel(story.createdAt)}
                            </span>
                            <ArrowRight
                                size={12}
                                className="text-foreground/0 transition-all group-hover:text-foreground/40"
                            />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
