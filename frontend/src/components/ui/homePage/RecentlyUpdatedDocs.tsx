"use client";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import type { DocsHomeCard } from "@/types/docs/docs-base";

interface RecentlyUpdatedDocsProps {
    docs: DocsHomeCard[];
}

export function RecentlyUpdatedDocs({ docs }: RecentlyUpdatedDocsProps) {
    if (!docs.length) return null;
    return (
        <div>
            {/* inline title divider */}
            <div className="mb-5 flex items-center gap-3">
                <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
                    Recently updated docs
                </span>
                <div className="h-px flex-1 bg-foreground/[0.08]" />
            </div>

            <div className="space-y-px">
                {docs.map((doc) => (
                    <Link
                        key={doc.id}
                        href={`/docs/${doc.id}`}
                        className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-foreground/[0.04]"
                    >
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-foreground/[0.07] bg-foreground/[0.03] transition-colors group-hover:border-foreground/[0.12]">
                            <FileText
                                size={12}
                                className="text-foreground/35"
                            />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/75 group-hover:text-foreground">
                            {doc.title}
                        </span>
                        <ArrowRight
                            size={11}
                            className="shrink-0 text-foreground/0 transition-all group-hover:text-foreground/35"
                        />
                    </Link>
                ))}
            </div>
            <Link
                href="/docs"
                className="mt-4 flex items-center gap-1 pl-3 text-xs font-medium text-foreground/35 transition-colors hover:text-foreground"
            >
                All docs <ArrowRight size={11} />
            </Link>
        </div>
    );
}
