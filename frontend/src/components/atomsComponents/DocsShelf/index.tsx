import { DocsHomeCard } from "@/types/docs/docs-base";
import { Link } from "lucide-react";
import { DocsCard } from "../docsCard";

export function DocsShelf({ docs }: { docs: DocsHomeCard[] }) {
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
                {docs.map((doc) => (
                    <DocsCard
                        key={doc.id}
                        doc={doc}
                        hoverOpen={false}
                        active=""
                        setActiveCard={() => { }}
                    />
                ))}
            </div>
        </section>
    );
}
