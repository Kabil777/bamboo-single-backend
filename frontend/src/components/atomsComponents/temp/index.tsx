export default function Temp() {
    return (
        <div>
            {/* ── Top Action Bar ── */}
            
            <motion.div
                className="flex flex-wrap items-center gap-0.5 mb-8 p-1 rounded-2xl border border-border/30 bg-gradient-to-r from-muted/40 via-muted/20 to-muted/40 backdrop-blur-sm w-fit shadow-sm"
                variants={fadeUp}
            >
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1.5 rounded-xl text-xs font-medium hover:bg-foreground/5 transition-all duration-300 px-3"
                            onClick={() =>
                                window.open(
                                    "https://github.com",
                                    "_blank",
                                    "noopener,noreferrer",
                                )
                            }
                        >
                            <Github className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">GitHub</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="rounded-xl">View on GitHub</TooltipContent>
                </Tooltip>

                <div className="w-px h-4 bg-border/30 mx-0.5" />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1.5 rounded-xl text-xs font-medium hover:bg-foreground/5 transition-all duration-300 px-3"
                            onClick={handleCopyMarkdown}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {copied ? (
                                    <motion.span
                                        key="check"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="flex items-center gap-1.5"
                                    >
                                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                                        <span className="hidden sm:inline text-emerald-500">Copied!</span>
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="copy"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="flex items-center gap-1.5"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Copy</span>
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="rounded-xl">Copy Markdown</TooltipContent>
                </Tooltip>

                <div className="w-px h-4 bg-border/30 mx-0.5" />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1.5 rounded-xl text-xs font-medium hover:bg-foreground/5 transition-all duration-300 px-3"
                            onClick={() => setViewMarkdownOpen(true)}
                        >
                            <FileText className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Markdown</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="rounded-xl">View Markdown Source</TooltipContent>
                </Tooltip>

                <div className="w-px h-4 bg-border/30 mx-0.5" />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-violet-500/0 to-violet-500/0 hover:from-violet-500/10 hover:to-purple-500/10 text-violet-600 dark:text-violet-400 transition-all duration-300 px-3"
                            onClick={() => setAskLlmOpen(true)}
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Ask AI</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="rounded-xl">Ask with LLM</TooltipContent>
                </Tooltip>
            </motion.div>

        </div>
    );
}