"use client";

import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import api from "@/api/axios";
import { DocsCard } from "@/components/atomsComponents";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/shadcnUI/carousel";
import { Skeleton } from "@/components/shadcnUI/skeleton";
import type { DocsHomeCard } from "@/types/docs/docs-base";

type ReadingPlatform = {
    slug: string;
    name: string;
    websiteUrl: string;
    coverUrl: string;
    description?: string | null;
};

export function PlatformsToReadOn() {
    const [platforms, setPlatforms] = useState<ReadingPlatform[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        let current = true;
        api.get<{ data: ReadingPlatform[] }>("/api/v1/reading-platforms")
            .then(({ data }) => {
                if (current) setPlatforms(data.data);
            })
            .catch(() => current && setPlatforms([]))
            .finally(() => current && setIsLoading(false));
        return () => { current = false; };
    }, []);

    useEffect(() => {
        if (!carouselApi) return;
        const updateActiveSlide = () => setActiveSlide(carouselApi.selectedScrollSnap());
        updateActiveSlide();
        carouselApi.on("select", updateActiveSlide);
        return () => {
            carouselApi.off("select", updateActiveSlide);
        };
    }, [carouselApi]);

    return (
        <section className="px-1 pt-1">
            <div className="mb-4 flex items-center gap-3">
                <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
                    Platforms to read on
                </span>
                <div className="h-px flex-1 bg-foreground/[0.08]" />
            </div>

            {isLoading ? (
                <div className="overflow-hidden rounded-xl border border-foreground/[0.10]">
                    <Skeleton className="h-48 w-full rounded-none" />
                    <div className="space-y-3 p-5">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="mt-5 h-9 w-full" />
                    </div>
                </div>
            ) : platforms.length ? (
            <Carousel
                opts={{ loop: true, align: "start" }}
                plugins={[Autoplay({ delay: 4500, stopOnInteraction: true })]}
                className="w-full"
                setApi={setCarouselApi}
            >
                <CarouselContent className="ml-0">
                {platforms.map((platform) => (
                    (() => {
                        const doc: DocsHomeCard = {
                            id: platform.slug,
                            title: platform.name,
                            description: platform.description || `Explore the latest writing from ${platform.name}.`,
                            // Covers are curated and stored in PostgreSQL; OpenGraph images are
                            // external and frequently reject browser requests or disappear.
                            coverUrl: platform.coverUrl,
                            createdAt: new Date().toISOString(),
                            author: { id: platform.slug, name: platform.name, handle: "" },
                        };
                        return (
                    <CarouselItem key={platform.slug} className="basis-full pl-0">
                        <DocsCard
                            hoverOpen={false}
                            doc={doc}
                            active=""
                            setActiveCard={() => {}}
                            href={platform.websiteUrl}
                            external
                            actionLabel="Visit platform"
                            cardClassName="min-h-[25rem] border border-foreground/[0.10]"
                            contentClassName="pb-7"
                            coverClassName="!h-48 !aspect-auto"
                            showMeta={false}
                            imageFooter={
                                <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5" aria-label="Platform carousel pagination">
                                    {platforms.map((item, index) => (
                                        <button
                                            key={item.slug}
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                carouselApi?.scrollTo(index);
                                            }}
                                            aria-label={`Show ${item.name}`}
                                            aria-current={activeSlide === index}
                                            className={`h-1.5 rounded-full border border-foreground/30 dark:border-white/25 transition-all duration-300 ${
                                                activeSlide === index
                                                    ? "w-5 bg-foreground dark:bg-white"
                                                    : "w-1.5 bg-foreground/45 hover:bg-foreground/75 dark:bg-white/45 dark:hover:bg-white/75"
                                            }`}
                                        />
                                    ))}
                                </div>
                            }
                        />
                    </CarouselItem>
                        );
                    })()
                ))}
                </CarouselContent>
            </Carousel>
            ) : (
                <p className="rounded-xl border border-dashed border-foreground/[0.12] px-4 py-8 text-center text-sm text-muted-foreground">
                    No reading platforms are available yet.
                </p>
            )}
        </section>
    );
}
