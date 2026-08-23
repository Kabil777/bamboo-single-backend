"use client";

import { Skeleton } from "@/components/shadcnUI/skeleton";

const paragraphWidths = ["w-full", "w-[96%]", "w-[88%]", "w-[93%]", "w-[72%]"];

/** Shared reader skeleton. Documents omit the optional blog cover to prevent layout shift. */
export function BlogPageSkeleton({ showCover = true }: { showCover?: boolean }) {
    return (
        <div className="flex w-full flex-1 flex-col">
            <div className="relative flex w-full justify-center">
                <article className="w-full min-w-0 max-w-[49rem] px-4 sm:px-6 lg:px-2">
                    <div className="flex min-w-0 flex-col py-6 lg:py-10">
                        {showCover && <Skeleton className="mb-8 h-[240px] w-full rounded-xl sm:h-[320px] sm:rounded-2xl lg:mb-10" />}

                        <div className="mb-3 space-y-3">
                            <Skeleton className="h-9 w-[84%] sm:h-11" />
                            <Skeleton className="h-9 w-[56%] sm:h-11" />
                        </div>

                        <div className="mb-5 flex items-center gap-3">
                            <Skeleton className="size-9 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-3.5 w-28" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>

                        <div className="mb-6 flex flex-wrap items-center gap-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                        </div>

                        <Skeleton className="mb-8 h-24 w-full rounded-2xl" />

                        <div className="space-y-7">
                            <div className="space-y-3">
                                {paragraphWidths.map((width, index) => <Skeleton key={`intro-${index}`} className={`h-4 ${width}`} />)}
                            </div>
                            <div className="space-y-3">
                                <Skeleton className="h-7 w-52" />
                                {paragraphWidths.slice(0, 4).map((width, index) => <Skeleton key={`section-${index}`} className={`h-4 ${width}`} />)}
                            </div>
                            <div className="overflow-hidden rounded-xl">
                                <Skeleton className="h-10 w-full rounded-b-none" />
                                <Skeleton className="h-40 w-full rounded-t-none" />
                            </div>
                            <div className="space-y-3">
                                <Skeleton className="h-7 w-40" />
                                {paragraphWidths.slice(0, 4).map((width, index) => <Skeleton key={`outro-${index}`} className={`h-4 ${width}`} />)}
                            </div>
                        </div>
                    </div>
                </article>

                {/* Matches the fixed right-side TOC minimap, not the legacy TOC card. */}
                <aside aria-hidden className="fixed right-5 top-1/2 hidden w-9 -translate-y-1/2 space-y-1.5 lg:block">
                    {["w-7", "w-5", "w-7", "w-3", "w-5", "w-7", "w-3", "w-5"].map((width, index) => (
                        <Skeleton key={index} className={`ml-auto h-px ${width}`} />
                    ))}
                </aside>
            </div>
        </div>
    );
}
