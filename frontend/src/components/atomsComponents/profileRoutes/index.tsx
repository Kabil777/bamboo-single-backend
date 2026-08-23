"use client";
import React from "react";
import { useTabs, type Tab } from "@/hooks/UseTabs";
import { cn } from "@/lib/utils";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
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
        <CarouselContent className=" -ml-0 gap-3">
            {tabs.map((item, i) => {
                const isActive = selectedTabIndex === i;
                return (
                    <CarouselItem
                        key={item.value}
                        className={cn(
                            "font-semibold text-base relative rounded-md flex  items-center h-8 px-4 cursor-pointer select-none transition-all duration-1000 ease-in-out basis-auto",
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

export function ProfileRoutes({ tabs, onTabChange }: TabsProps) {
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
                className="relative w-full p-2"
                opts={{
                    align: "start",
                    loop: false,
                    dragFree: true,
                }}
            >
                <Tabs {...framer.tabProps} />
            </Carousel>
        </div>
    );
}
