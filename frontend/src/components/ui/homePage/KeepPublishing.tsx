"use client";

import Link from "next/link";
import { PenSquare } from "lucide-react";
import { Button } from "@/components/shadcnUI/button";

export function KeepPublishing() {
    return (
        <div className="overflow-hidden rounded-2xl border border-foreground/[0.09] bg-background">
            {/* header — white bg, black text */}
            <div className="border-b border-foreground/[0.08] px-5 py-3.5">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground">
                        Keep publishing
                    </p>
                    <PenSquare className="size-3.5 text-foreground/40" />
                </div>
            </div>

            {/* body */}
            <div className="px-5 py-5">
                <div className="space-y-1.5">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                        Turn drafts into a habit.
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground/45">
                        Publish notes, essays, and docs from one place.
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="mt-5 rounded-full border-foreground/10 px-5 text-sm font-medium transition-all hover:border-foreground/25 hover:bg-foreground hover:text-background"
                    asChild
                >
                    <Link href="/editor/blog/new">Start writing</Link>
                </Button>
            </div>
        </div>
    );
}
