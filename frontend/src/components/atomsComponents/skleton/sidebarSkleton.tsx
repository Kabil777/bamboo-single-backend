import { Skeleton } from "@/components/shadcnUI/skeleton";

export function SidebarSkeleton() {
    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-40" />
            </div>

            <div className="rounded-2xl border border-border/60 p-4 space-y-4">
                <Skeleton className="h-32 w-full rounded-xl" />
                <div className="space-y-3">
                    <Skeleton className="h-4 w-[78%]" />
                    <Skeleton className="h-4 w-[92%]" />
                    <Skeleton className="h-4 w-[64%]" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-border/60 p-4">
                <Skeleton className="h-3 w-20" />
                {['w-full', 'w-[88%]', 'w-[72%]', 'w-[82%]'].map((width, index) => (
                    <Skeleton key={index} className={`h-4 ${width}`} />
                ))}
            </div>
        </div>
    );
}
