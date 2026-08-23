"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchCommandPalette } from "@/components/ui/searchCommandPalette";

function SearchContent() {
    const searchParams = useSearchParams();
    return <SearchCommandPalette initialOpen initialQuery={searchParams.get("query")?.trim() ?? ""} />;
}

export default function Search() {
    return (
        <Suspense fallback={null}>
            <SearchContent />
        </Suspense>
    );
}
