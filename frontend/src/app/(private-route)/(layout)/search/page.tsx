"use client";

import { useSearchParams } from "next/navigation";
import { SearchCommandPalette } from "@/components/ui/searchCommandPalette";

export default function Search() {
    const searchParams = useSearchParams();
    return <SearchCommandPalette initialOpen initialQuery={searchParams.get("query")?.trim() ?? ""} />;
}
