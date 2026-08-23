"use client";

import { Skeleton } from "@/components/shadcnUI/skeleton";

export function SectionCardsSkeleton() {
    return (
        <div className="w-full space-y-4">
            <div className="overflow-hidden rounded-2xl bg-background shadow-sm ring-1 ring-border/40">
                <div className="relative">
                    <Skeleton className="h-32 rounded-none sm:h-36" />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
                </div>

                <div className="space-y-5 px-5 pb-6 sm:px-6">
                    <div className="-mt-12 flex items-end justify-between gap-4 sm:-mt-14">
                        <Skeleton className="h-24 w-24 rounded-full ring-4 ring-background sm:h-28 sm:w-28" />
                        <div className="flex items-center gap-2 pb-2">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <Skeleton className="h-9 w-24 rounded-full" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <Skeleton className="h-8 w-44 sm:w-52" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-28" />
                    </div>

                    <div className="space-y-2.5">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[88%]" />
                        <Skeleton className="h-4 w-[62%]" />
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
                        {['w-24', 'w-20', 'w-16', 'w-20'].map((width, index) => (
                            <Skeleton key={index} className={`h-4 ${width}`} />
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                        {['w-20', 'w-24', 'w-16', 'w-28', 'w-14'].map((width, index) => (
                            <Skeleton key={index} className={`h-6 rounded-full ${width}`} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-border bg-background px-5 py-5 sm:px-6">
                <Skeleton className="mb-4 h-3 w-24" />
                <div className="flex flex-wrap gap-3">
                    {['w-24', 'w-28', 'w-20', 'w-24'].map((width, index) => (
                        <Skeleton key={index} className={`h-8 rounded-full ${width}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}
