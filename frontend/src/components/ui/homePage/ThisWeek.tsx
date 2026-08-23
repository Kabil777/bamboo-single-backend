"use client";

interface ThisWeekProps {
    storiesCount: number;
    docsCount: number;
    topicsCount: number;
}

// Derive a simple "activity" bar width % from the count (capped at 100)
function barWidth(value: number, max: number) {
    return `${Math.min(100, Math.round((value / Math.max(max, 1)) * 100))}%`;
}

export function ThisWeek({
    storiesCount,
    docsCount,
    topicsCount,
}: ThisWeekProps) {
    const max = Math.max(storiesCount, docsCount, topicsCount, 1);

    const stats = [
        {
            value: storiesCount,
            label: "Stories live",
            sub: "published & indexed",
            icon: "✦",
        },
        {
            value: docsCount,
            label: "Docs ready",
            sub: "reference articles",
            icon: "◈",
        },
        {
            value: topicsCount,
            label: "Hot topics",
            sub: "trending this week",
            icon: "◎",
        },
    ];

    return (
        <div className="overflow-hidden rounded-2xl border border-foreground/[0.09] bg-background">
            {/* header — white bg, black text */}
            <div className="border-b border-foreground/[0.08] px-5 py-3.5">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/75">
                        This week on Bamboo
                    </p>
                    {/* live pulse dot */}
                    <span className="flex items-center gap-1.5">
                        <span className="relative flex size-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                        </span>
                        <span className="text-[10px] text-foreground/30">
                            live
                        </span>
                    </span>
                </div>
            </div>

            {/* stat rows */}
            <div className="divide-y divide-foreground/[0.05] px-5">
                {stats.map(({ value, label, sub, icon }) => (
                    <div key={label} className="flex items-center gap-4 py-4">
                        {/* icon badge */}
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-foreground/[0.07] bg-foreground/[0.03] text-base text-foreground/40">
                            {icon}
                        </div>

                        {/* text + bar */}
                        <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex items-baseline justify-between gap-2">
                                <p className="text-xs font-medium text-foreground/60">
                                    {label}
                                </p>
                                <p className="text-lg font-semibold tabular-nums tracking-tight text-foreground">
                                    {value}
                                </p>
                            </div>
                            {/* activity bar */}
                            <div className="h-1 w-full overflow-hidden rounded-full bg-foreground/[0.06]">
                                <div
                                    className="h-full rounded-full bg-foreground/25 transition-all duration-700"
                                    style={{ width: barWidth(value, max) }}
                                />
                            </div>
                            <p className="text-[10px] text-foreground/30">
                                {sub}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
