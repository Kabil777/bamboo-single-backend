"use client";
import React from "react";
import { useTabs, type Tab } from "@/hooks/UseTabs";
import { cn } from "@/lib/utils";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/shadcnUI/carousel";

interface TabsProps {
    tabs: Tab[];
    onTabChange?: (value: string) => void;
}
const Tabs = ({
    tabs,
    selectedTabIndex,
    setSelectedTab,
}: {
    tabs: Tab[];
    selectedTabIndex: number;
    setSelectedTab: (input: [number, number]) => void;
}): React.ReactElement => {
    return (
        <CarouselContent className="ml-0 sm:mx-10">
            {tabs.map((item, i) => {
                const isActive = selectedTabIndex === i;
                return (
                    <CarouselItem
                        key={item.value}
                        className={cn(
                            "text-sm font-semibold sm:text-base relative rounded-md flex items-center h-7 sm:h-8 px-4 sm:px-4 cursor-pointer select-none transition-all duration-1000 ease-in-out basis-auto mx-0.5",
                            {
                                "bg-foreground text-background": isActive,
                                "hover:bg-accent text-foreground": !isActive,
                            },
                        )}
                        onClick={() =>
                            setSelectedTab([i, i > selectedTabIndex ? 1 : 1])
                        }
                        title={item.label}
                    >
                        <div>
                            <small
                                className={
                                    item.value === "danger-zone"
                                        ? "text-red-500"
                                        : ""
                                }
                            >
                                {item.label}
                            </small>
                        </div>
                    </CarouselItem>
                );
            })}
        </CarouselContent>
    );
};

export function TabChips({ tabs, onTabChange }: TabsProps) {
    const [hookProps] = React.useState(() => {
        const initialTabId = tabs[0].value;
        return {
            tabs: tabs.map(({ label, value, subRoutes }) => ({
                label,
                value,
                subRoutes,
            })),
            initialTabId,
        };
    });

    const framer = useTabs(hookProps);

    React.useEffect(() => {
        if (onTabChange) {
            onTabChange(framer.selectedTab.value);
        }
    }, [framer.selectedTab, onTabChange]);

    return (
        <div className="w-full">
            <Carousel
                className="relative w-full p-2 gap-2"
                opts={{
                    align: "start",
                    loop: false,
                    dragFree: true,
                }}
            >
                <CarouselPrevious className="hidden sm:flex absolute left-0 z-10 border-border bg-background text-foreground shadow-sm hover:bg-accent dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800" />
                <Tabs {...framer.tabProps} />
                <CarouselNext className="hidden sm:flex absolute right-0 z-10 border-border bg-background text-foreground shadow-sm hover:bg-accent dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800" />
            </Carousel>
        </div>
    );
}
