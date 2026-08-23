"use client";

import React from "react";

type ProfileTabContextValue = {
    selectedTab: string;
    setSelectedTab: (tab: string) => void;
};

const ProfileTabContext = React.createContext<ProfileTabContextValue | null>(
    null,
);

export function ProfileTabProvider({
    children,
    value,
}: {
    children: React.ReactNode;
    value: ProfileTabContextValue;
}) {
    return (
        <ProfileTabContext.Provider value={value}>
            {children}
        </ProfileTabContext.Provider>
    );
}

export function useProfileTab() {
    const ctx = React.useContext(ProfileTabContext);
    if (!ctx) {
        throw new Error("useProfileTab must be used within ProfileTabProvider");
    }
    return ctx;
}
