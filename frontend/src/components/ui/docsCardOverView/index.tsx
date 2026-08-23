"use client";
import { useState } from "react";
import { Button } from "@/components/shadcnUI/button";
import { DocsCard } from "@/components/atomsComponents";
import type { DocsHomeCard } from "@/types/docs/docs-base";
import Link from "next/link";

interface DocsHomeProps {
    docs: DocsHomeCard[];
}

export const DocsHome = ({ docs }: DocsHomeProps) => {
    const [activeCard, setActiveCard] = useState<string>(docs[0]?.id ?? "");
    return (
        <div className="flex flex-col gap-4">
            <span className="flex items-center justify-between px-2">
                <p className="font-semibold">Docs...</p>
                <Link href="/docs">
                    <Button variant={"outline"} className="text-sm rounded-lg">
                        View all
                    </Button>
                </Link>
            </span>
            {
                docs.length === 0 ? (
                    <p className="text-sm text-muted-foreground px-2">
                        No docs available
                    </p>
            ) : (
                docs.map((card) => {
                    return (
                        <DocsCard
                            key={card.id}
                            doc={card}
                            hoverOpen
                            active={activeCard}
                            setActiveCard={setActiveCard}
                        />
                    );
                })
            )
            }
        </div>
    );
};

