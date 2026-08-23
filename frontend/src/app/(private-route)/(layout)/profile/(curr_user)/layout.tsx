"use client";
import React from "react";
import { ProfileRoutes, ProfileTabProvider } from "@/components/atomsComponents";
import { SectionCards } from "@/components/atomsComponents/sectionCard";
import { useAppState } from "@/hooks/ReduxHooks";
import { useSearchParams } from "next/navigation";

const tabs = [
    { label: "Posts", value: "posts" },
    { label: "Docs", value: "docs" },
    { label: "Bookmarks", value: "bookmark" },
];

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user } = useAppState((s) => s.userReducer);
    const searchParams = useSearchParams();
    const requestedTab = searchParams.get("tab");
    const [selectedTab, setSelectedTab] = React.useState(
        requestedTab === "bookmark" ? "bookmark" : "posts",
    );

    React.useEffect(() => {
        if (requestedTab === "bookmark") setSelectedTab("bookmark");
    }, [requestedTab]);

    const handleTabChange = (selecttab: string) => {
        setSelectedTab(selecttab);
    };

    return (
        <div className="min-h-screen">
            <div className="mx-auto py-8 space-y-6 container">
                <SectionCards viewingHandle={user?.handle} />
                <div className="sticky top-[56px] z-10 bg-background/30 backdrop-blur-md -mx-4 px-4 my-0 border-y border-muted">
                    <div>
                        <ProfileRoutes
                            tabs={tabs}
                            onTabChange={handleTabChange}
                        />
                    </div>
                </div>
                <ProfileTabProvider
                    value={{ selectedTab, setSelectedTab: handleTabChange }}
                >
                    <div>{children}</div>
                </ProfileTabProvider>
            </div>
        </div>
    );
}
