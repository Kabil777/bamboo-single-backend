
import { Button } from "@/components/shadcnUI/button";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import ToolTip from "../ToolTip";
import React from "react";

export interface FloatingAction {
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
    showCheck?: boolean;
    variant?: "ghost" | "violet";
    wrapper?: (children: React.ReactNode) => React.ReactNode;
}

interface FloatingActionBarProps {
    actions: (FloatingAction | "separator")[];
    prefix?: React.ReactNode;
    children?: React.ReactNode;
}

export default function FloatingActionBar({ actions, prefix, children }: FloatingActionBarProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-5 sm:bottom-6 right-5 sm:right-6 z-50 flex items-center gap-0.5 rounded-2xl border border-border/30 bg-background/60 backdrop-blur-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 px-1.5 py-1.5 ring-1 ring-white/5"
        >
            {prefix && (
                <>
                    <div className="px-2 py-1 text-[11px] font-medium text-muted-foreground/70">
                        {prefix}
                    </div>
                    <div className="w-px h-5 bg-border/20 mx-0.5" />
                </>
            )}
            {actions.map((action, index) => {
                if (action === "separator") {
                    return <div key={`sep-${index}`} className="w-px h-5 bg-border/20 mx-0.5" />;
                }

                const { icon: Icon, label, onClick, showCheck, variant = "ghost", wrapper } = action;

                const buttonEl = (
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-9 w-9 rounded-xl transition-all duration-300 ${
                                variant === "violet" 
                                ? "hover:bg-violet-500/10" 
                                : "hover:bg-foreground/5"
                            }`}
                            onClick={onClick}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {showCheck ? (
                                    <motion.span
                                        key="check"
                                        initial={{ scale: 0, rotate: -90 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        exit={{ scale: 0, rotate: 90 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                    >
                                        <Check className="w-4 h-4 text-emerald-500" />
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="icon"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <Icon className={`w-4 h-4 ${variant === "violet" ? "text-violet-500" : ""}`} />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Button>
                );

                return (
                    <React.Fragment key={label}>
                        {wrapper ? wrapper(buttonEl) : (
                            <ToolTip title={label}>
                                {buttonEl}
                            </ToolTip>
                        )}
                    </React.Fragment>
                );
            })}
            {children}
        </motion.div>
    );
}