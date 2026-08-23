"use client";

import { ArticleNotFound } from "@/components/atomsComponents";
import { useEffect } from "react";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error("[Blog Error]", error);
    }, [error]);

    return <ArticleNotFound type="post" />;
}
