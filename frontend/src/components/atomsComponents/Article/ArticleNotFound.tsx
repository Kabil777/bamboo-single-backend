"use client";

import { motion } from "framer-motion";
import { FileQuestion, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/shadcnUI/button";

interface ArticleNotFoundProps {
	type: "post" | "document";
	homePath?: string;
	searchPath?: string;
}

export function ArticleNotFound({
	type,
	homePath = "/",
	searchPath = "/search",
}: ArticleNotFoundProps) {
	return (
		<div className="flex items-center justify-center w-full min-h-[60vh]">
			<motion.div
				initial={{ opacity: 0, y: 30, scale: 0.95 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="flex flex-col items-center justify-center space-y-6 p-6 sm:p-10 max-w-md text-center"
			>
				<div className="relative">
					<div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 blur-2xl scale-[2]" />
					<div className="relative rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 border border-border/50 p-8 backdrop-blur-sm">
						<FileQuestion className="w-12 h-12 text-muted-foreground" />
					</div>
				</div>
				<div className="space-y-2">
					<h2 className="text-2xl font-bold text-foreground">
						{type === "post" ? "Post not found" : "Document not found"}
					</h2>
					<p className="text-sm text-muted-foreground leading-relaxed">
						This {type === "post" ? "blog post" : "document"} doesn&apos;t exist or may have been removed.
					</p>
				</div>
				<div className="flex gap-3 pt-2">
					<Link href={homePath}>
						<Button variant="default" size="sm" className="gap-2 rounded-xl">
							<ArrowLeft className="w-3.5 h-3.5" />
							Home
						</Button>
					</Link>
					<Link href={searchPath}>
						<Button variant="outline" size="sm" className="gap-2 rounded-xl">
							<Search className="w-3.5 h-3.5" />
							Search
						</Button>
					</Link>
				</div>
			</motion.div>
		</div>
	);
}
