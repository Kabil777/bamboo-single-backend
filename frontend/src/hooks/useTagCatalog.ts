"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/api/axios";

export type ManagedTag = { id: string; label: string; category: "DESIGNATION" | "INTEREST" };

export function useTagCatalog() {
    const [tags, setTags] = useState<ManagedTag[]>([]);
    const refresh = useCallback(async () => {
        try {
            const { data } = await api.get<{ data: ManagedTag[] }>("/api/v1/tags");
            setTags(data.data);
        } catch {
            setTags([]);
        }
    }, []);
    useEffect(() => { void refresh(); }, [refresh]);
    return { tags, refresh, designations: tags.filter((tag) => tag.category === "DESIGNATION").map((tag) => tag.label), interests: tags.filter((tag) => tag.category === "INTEREST").map((tag) => tag.label) };
}
