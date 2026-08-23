"use client";

import { Skeleton } from "@/components/shadcnUI/skeleton";

export function ProfileBlogListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 rounded-2xl border border-border/60 bg-background/60 p-4 md:gap-5">
                    <div className="col-span-full space-y-3 sm:col-span-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            <Skeleton className="h-6 w-[78%]" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[86%]" />
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {['w-16', 'w-20', 'w-14'].map((width) => (
                                <Skeleton key={width} className={`h-5 rounded-full ${width}`} />
                            ))}
                        </div>
                    </div>
                    <div className="col-span-full sm:col-span-2">
                        <Skeleton className="h-36 w-full rounded-xl" />
                    </div>
                </div>
            ))}
        </div>
    );
}
