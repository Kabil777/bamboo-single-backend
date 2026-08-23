"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface NavigationPage {
	id: string;
	title: string;
	url?: string; // Optional, if provided will use this instead of default docs path
}

interface ArticleNavigationProps {
	prevPage?: NavigationPage | null;
	nextPage?: NavigationPage | null;
	baseUrl?: string; // e.g., "/docs/some-id"
}

const fadeUp = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
	},
};

export function ArticleNavigation({
	prevPage,
	nextPage,
	baseUrl,
}: ArticleNavigationProps) {
	return (
		<motion.div
			className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 mt-12 pt-8 border-t border-border/30"
			variants={fadeUp}
		>
			{prevPage ? (
				<Link
					href={prevPage.url || `${baseUrl}/${prevPage.id}`}
					className="group relative flex-1 flex items-center gap-3 p-4 sm:p-5 rounded-2xl border border-border/30 bg-gradient-to-br from-muted/30 to-transparent hover:from-muted/50 hover:to-muted/20 hover:border-border/50 transition-all duration-300"
				>
					<div className="min-w-0">
						<span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">
							Previous
						</span>
						<p className="text-sm font-semibold text-foreground truncate mt-0.5 group-hover:text-primary transition-colors duration-300">
							{prevPage.title}
						</p>
					</div>
				</Link>
			) : (
				<div className="flex-1 hidden sm:block" />
			)}
			{nextPage ? (
				<Link
					href={nextPage.url || `${baseUrl}/${nextPage.id}`}
					className="group relative flex-1 flex items-center justify-end gap-3 p-4 sm:p-5 rounded-2xl border border-border/30 bg-gradient-to-bl from-muted/30 to-transparent hover:from-muted/50 hover:to-muted/20 hover:border-border/50 transition-all duration-300 text-right"
				>
					<div className="min-w-0">
						<span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">
							Next
						</span>
						<p className="text-sm font-semibold text-foreground truncate mt-0.5 group-hover:text-primary transition-colors duration-300">
							{nextPage.title}
						</p>
					</div>
				</Link>
			) : (
				<div className="flex-1 hidden sm:block" />
			)}
		</motion.div>
	);
}
