"use client"
import { Button } from "@/components/shadcnUI/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/shadcnUI/carousel";
import { BlogHomeCard } from "@/types/blog/blog-base";
import { ArrowLeft, ArrowRight, BookOpenText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type CarouselApi } from "@/components/shadcnUI/carousel";
import { useEffect, useState, useCallback } from "react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
function formatDateLabel(createdAt: string) {
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return "Fresh today";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    }).format(date);
}

export function FeaturedCarousel({
    stories,
    onSlideChange,
    animation = "slide",
}: {
    stories: BlogHomeCard[];
    onSlideChange?: (index: number) => void;
    animation?: "slide" | "scale";
}) {
    const [api, setApi] = useState<CarouselApi>();
    const [active, setActive] = useState(0);

    // Sync Embla API state to our local state
    useEffect(() => {
        if (!api) return;

        setActive(api.selectedScrollSnap());

        api.on("select", () => {
            setActive(api.selectedScrollSnap());
            onSlideChange?.(api.selectedScrollSnap());
        });
    }, [api, onSlideChange]);

    const go = useCallback(
        (index: number) => {
            api?.scrollTo(index);
        },
        [api],
    );

    return (
        <Carousel
            setApi={setApi}
            opts={{
                loop: true,
                align: "start",
            }}
            plugins={[Autoplay({ delay: 5000 })]}
        >
            <CarouselContent className="-ml-1">
                {stories.map((story, index) => {
                    const isScale = animation === "scale";
                    const isSlideActive = index === active;
                    
                    return (
                    <CarouselItem key={index} className="">
                        <div 
                            className={`relative overflow-hidden rounded-xl border border-border bg-card shadow-none dark:ring-1 dark:ring-border/40 transition-all duration-500 ease-out select-none h-[408px] md:h-[340px] ${
                                isScale ? (isSlideActive ? "scale-100 opacity-100" : "scale-[0.93] opacity-60") : ""
                            }`}
                        >

                            <div className="flex flex-col md:grid md:grid-cols-[1fr_minmax(260px,0.65fr)] lg:grid-cols-[1fr_minmax(300px,0.7fr)] h-[408px] md:h-[340px]">
                                {/* ── Image side — top on mobile, right on desktop ── */}
                                <div className="relative h-52 sm:h-64 md:h-full overflow-hidden order-first md:order-last border-b md:border-b-0 md:border-l border-border/50">
                                    {story.coverUrl ? (
                                        <>
                                            <Image
                                                src={story.coverUrl}
                                                alt={story.title}
                                                fill
                                                className="object-cover transition-transform duration-500 "
                                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 40vw, 400px"
                                                priority
                                            />
                                            {/* Bottom-fade on mobile, left-fade on desktop */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent md:bg-gradient-to-r md:from-card/20 md:via-transparent md:to-transparent pointer-events-none" />
                                        </>
                                    ) : (
                                        <div className="flex h-full items-center justify-center bg-muted/50">
                                            <BookOpenText className="size-12 text-muted-foreground/20" />
                                        </div>
                                    )}
                                </div>

                                {/* ── Text side ── */}
                                <div className="flex h-full flex-col overflow-hidden p-5 sm:p-7 lg:p-8 order-last md:order-first">
                                    <div className="flex-1 space-y-3 sm:space-y-4">
                                        {/* Badge row */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                                                Featured
                                            </span>
                                            <span className="text-[11px] text-muted-foreground">
                                                {formatDateLabel(story.createdAt)}
                                            </span>
                                            <span className="ml-auto text-[10px] tabular-nums text-muted-foreground/50">
                                                {active + 1}&thinsp;/&thinsp;{stories.length}
                                            </span>
                                        </div>

                                        {/* Title + description */}
                                        <div className="space-y-2.5 h-[148px] sm:h-[156px] lg:h-[164px] overflow-hidden">
                                            <h1 className="max-w-[26ch] text-xl sm:text-2xl lg:text-[1.85rem] font-bold leading-[1.2] tracking-tight text-foreground line-clamp-3 text-balance min-h-[72px] sm:min-h-[80px] lg:min-h-[88px]">
                                                {story.title}
                                            </h1>
                                            <p className="max-w-[50ch] text-sm leading-[1.72] text-muted-foreground line-clamp-3 min-h-[68px] sm:min-h-[72px] overflow-hidden">
                                                {story.description}
                                            </p>
                                        </div>

                                        {/* Tags */}
                                        {story.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {story.tags.slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="rounded-full border border-border/80 bg-muted/70 px-2.5 py-0.5 text-[11px] capitalize text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* bottom — written by + CTA + controls, all inside the card */}
                                    <div className="mt-auto space-y-3 pt-4 shrink-0">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="min-h-[36px]">
                                                <p className="text-[10px] uppercase tracking-[0.22em] text-foreground/28">
                                                    Written by
                                                </p>
                                                <p className="mt-0.5 text-sm font-semibold text-foreground">
                                                    {story.author?.name?.trim() || "Bamboo Editorial"}
                                                </p>
                                            </div>
                                            <motion.div
                                                whileTap={{ scale: 0.985 }}
                                                transition={{ type: "spring", stiffness: 520, damping: 34 }}
                                                className="origin-center will-change-transform"
                                            >
                                                <Link
                                                    href={`/blog/${story.id}`}
                                                    className="inline-flex shrink-0 items-center gap-1.5 rounded-sm bg-foreground px-3.5 py-2 text-xs font-semibold text-background transition-opacity duration-150 hover:opacity-90"
                                                >
                                                    Read now
                                                    <ArrowRight size={11} />
                                                </Link>
                                            </motion.div>
                                        </div>

                                        {/* Pagination controls */}
                                        <div className="flex items-center gap-2">
                                            <CarouselPrevious className="!translate-y-0 relative left-0" />
                                            <CarouselNext className="translate-y-0 relative right-0" />
                                            <div className="flex items-center gap-1.5 pl-1">
                                                {stories.map((_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => go(i)}
                                                        aria-label={`Go to slide ${i + 1}`}
                                                        className={`!h-1.5  rounded-full transition-all duration-300 ${i === active
                                                            ? "!w-6 bg-foreground"
                                                            : "!w-1.5 bg-muted-foreground/25 hover:bg-muted-foreground/50"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                )})}

            </CarouselContent>

        </Carousel>
    );
}
