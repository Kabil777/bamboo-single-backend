"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Copy, Check } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/shadcnUI/dialog";
import { Button } from "@/components/shadcnUI/button";
import { toast } from "sonner";

interface MarkdownViewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    content: string;
    title?: string;
}

export function MarkdownViewDialog({
    open,
    onOpenChange,
    content,
    title,
}: MarkdownViewDialogProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        if (!content) return;
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            toast.success("Markdown copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy to clipboard");
        }
    }, [content]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[92vw] md:w-[58vw] max-w-none max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl">
                <DialogHeader className="px-5 sm:px-6 pt-5 pb-4 border-b border-border/30 flex-shrink-0 bg-gradient-to-r from-muted/30 to-transparent">
                    <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <DialogTitle className="text-base font-bold flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <FileText className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span className="truncate">Markdown Source</span>
                            </DialogTitle>
                            <DialogDescription className={`text-xs text-muted-foreground/70 mt-1 truncate ${!title ? "sr-only" : ""}`}>
                                {title || "View the markdown source of this document."}
                            </DialogDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs flex-shrink-0 rounded-xl h-8 border-border/30"
                            onClick={handleCopy}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {copied ? (
                                    <motion.span
                                        key="copied"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-1.5"
                                    >
                                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                                        Copied!
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="copy"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-1.5"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                        Copy
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Button>
                    </div>
                </DialogHeader>
                <div className="flex-1 overflow-auto custom-scroll bg-muted/20">
                    <pre className="p-6 text-[13px] leading-relaxed font-mono text-foreground/80 whitespace-pre-wrap break-words selection:bg-primary/20">
                        {content}
                    </pre>
                </div>
            </DialogContent>
        </Dialog>
    );
}
