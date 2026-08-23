"use client";
import Link from "next/link";
export function StartWritingCTA() {
    return (
        <div className="px-1">
            <div className="mb-5 flex items-center gap-3">
                <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
                    Publish
                </span>
                <div className="h-px flex-1 bg-foreground/[0.08]" />
            </div>

            <h3 className="text-xl font-semibold leading-snug tracking-tight text-foreground">
                Got something worth publishing?
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-foreground/45">
                Your next post is one draft away.
            </p>
            <Link
                href="/editor/blog/new"
                className="group mt-5 inline-flex items-center gap-1 rounded-sm bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:bg-foreground/90"
            >
                Start writing
            </Link>
        </div>
    );
}
