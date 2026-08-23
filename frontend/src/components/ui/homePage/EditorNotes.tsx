"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { BlogHomeCard } from "@/types/blog/blog-base";

function formatDateLabel(createdAt: string) {
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return "Fresh today";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    }).format(date);
}

export function EditorNotes({ stories }: { stories: BlogHomeCard[] }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-foreground/[0.09] bg-background">
            {/* header — white bg, black text */}
            <div className="border-b border-foreground/[0.08] px-5 py-3.5">
                <div className="flex items-center gap-2">
                    <Sparkles className="size-3.5 text-foreground/40" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground">
                        Editors&apos; notes
                    </p>
                </div>
            </div>

            {/* story rows — hr separators */}
            <div className="flex flex-col px-5">
                {stories.map((story, i) => (
                    <>
                        {i > 0 && (
                            <hr
                                key={`sep-${story.id}`}
                                className="border-foreground/[0.06]"
                            />
                        )}
                        <Link
                            key={story.id}
                            href={`/blog/${story.id}`}
                            className="group block py-4 transition-opacity hover:opacity-55"
                        >
                            <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/30">
                                {formatDateLabel(story.createdAt)}
                            </p>
                            <h2 className="mt-2 line-clamp-2 text-[1.05rem] font-semibold leading-snug tracking-tight text-foreground">
                                {story.title}
                            </h2>
                            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-foreground/45">
                                {story.description}
                            </p>
                        </Link>
                    </>
                ))}
            </div>
        </div>
    );
}
