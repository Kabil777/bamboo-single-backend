import { Skeleton } from "@/components/shadcnUI/skeleton";

const tagWidths = ["w-14", "w-20", "w-12"];

export function BlogCardSkeleton() {
    return (
        <div className="grid grid-cols-5 gap-4 border-b border-foreground/[0.06] py-5 md:gap-6">
            <div className="col-span-full flex flex-col gap-3 sm:col-span-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
                <div className="space-y-2.5">
                    <Skeleton className="h-6 w-[88%]" />
                    <Skeleton className="h-6 w-[72%]" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[92%]" />
                    <Skeleton className="h-4 w-[58%]" />
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                    {tagWidths.map((width) => (
                        <Skeleton key={width} className={`h-5 rounded-full ${width}`} />
                    ))}
                </div>
            </div>
            <div className="col-span-full sm:col-span-2 sm:col-start-4 sm:row-start-1">
                <Skeleton className="h-[160px] w-full rounded-xl" />
            </div>
        </div>
    );
}
