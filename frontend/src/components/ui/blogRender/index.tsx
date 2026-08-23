"use client";

import { notFound } from "next/navigation";

import { motion } from "framer-motion";

import {
	Copy,
	FileText,
	Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
	ArticleRender,
	ArticleTocRail,
	FloatingActionBar,
	MarkdownViewDialog,
	AskWithAiDropdown,
	ArticleNotFound,
	ArticleMobileToc,
	ArticleHeader,
	ArticleNavigation,
} from "@/components/atomsComponents";

import { BlogPageSkeleton } from "@/components/atomsComponents/skleton/BlogPageSkleton";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import { extractToc } from "@/lib/utils";
import { BlogPageRtk } from "@/store/reducers/BlogPageReducer";
import type { BlogPage } from "@/types/blog/blog-base";
import { toast } from "sonner";

// ─── Helpers ─────────────────────────────────────────

function estimateReadingTime(text: string): number {
	const words = text.trim().split(/\s+/).length;
	return Math.max(1, Math.ceil(words / 200));
}

// ─── Animations ──────────────────────────────────────

const stagger = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.08, delayChildren: 0.1 },
	},
};

const fadeUp = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
	},
};

export default function BlogRenderPage({ id }: { id: string }) {
	const dispatch = useAppDispatch();
	const { loadingById, errorById } = useAppState((s) => s.blogPageReducer);

	const [accordionValue, setAccordionValue] = useState<string | undefined>(
		undefined,
	);
	const [copied, setCopied] = useState(false);
	const [viewMarkdownOpen, setViewMarkdownOpen] = useState(false);

	useEffect(() => {
		if (!id) return;
		dispatch(BlogPageRtk(id));
	}, [dispatch, id]);

	const blog: BlogPage = useAppState(
		(state) => state.blogPageReducer.entities[id],
	);

	const handleCopyMarkdown = useCallback(async () => {
		if (!blog?.content) return;
		try {
			await navigator.clipboard.writeText(blog.content);
			setCopied(true);
			toast.success("Markdown copied to clipboard!");
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error("Failed to copy to clipboard");
		}
	}, [blog?.content]);

	// ─── Loading / initial render (before dispatch fires) ───────────────
	if ((loadingById[id] && !blog) || (!errorById[id] && !blog)) {
		return <BlogPageSkeleton />;
	}

	// ─── Not Found (explicit API error) ──────────────────────────────────
	if (errorById[id] && !blog) {
		notFound();
	}

	const { content, title, description, tags, coverUrl, author, createdAt, collaborators } = blog;
	const toc = extractToc(content);
	const readingTime = estimateReadingTime(content);

	return (
		<div className="flex flex-1 flex-col w-full justify-center">
			{/* ─── Mobile TOC Toggle ─── */}
			<ArticleMobileToc
				toc={toc}
				accordionValue={accordionValue}
				onAccordionValueChange={setAccordionValue}
			/>

			{/* ─── Main Layout ─── */}
			<div className="flex justify-center relative w-full gap-6">

				{/* ─── Article ─── */}
				<article className="flex-1 min-w-0 w-full max-w-2xl px-4 sm:px-6 lg:px-2">
					<motion.div
						className="flex w-full min-w-0 flex-1 flex-col py-6 lg:py-10 text-neutral-800 dark:text-neutral-300"
						initial="hidden"
						animate="visible"
						variants={stagger}
					>
						<ArticleHeader
							title={title}
							coverUrl={coverUrl}
							description={description}
							tags={tags}
							readingTime={readingTime}
							createdAt={createdAt}
							author={author}
							collaborators={collaborators}
							idBlog={id}
							contentType="blog"
						/>

						{/* ── Article Content ── */}
						<motion.div variants={fadeUp} className="min-w-0 max-w-none">
							<ArticleRender content={content} />
						</motion.div>

						{/* ── Next / Previous Navigation ── */}
						<ArticleNavigation
							prevPage={{ id: "home", title: "Back to Home", url: "/" }}
							nextPage={{ id: "search", title: "Explore More", url: "/search" }}
						/>
					</motion.div>
				</article>

				{/* ─── Right-side heading minimap ─── */}
				<ArticleTocRail toc={toc} />
			</div>

			<FloatingActionBar
				actions={[
					{
						icon: Copy,
						label: "Copy as Markdown",
						onClick: handleCopyMarkdown,
						showCheck: copied,
					},
					"separator",
					{
						icon: FileText,
						label: "View as Markdown",
						onClick: () => setViewMarkdownOpen(true),
					},
					"separator",
					{
						icon: Sparkles,
						label: "Ask with AI",
						variant: "ghost",
						wrapper: (btn) => (
							<AskWithAiDropdown content={content} title={title}>
								{btn}
							</AskWithAiDropdown>
						),
					},
				]}
			/>

			<MarkdownViewDialog
				open={viewMarkdownOpen}
				onOpenChange={setViewMarkdownOpen}
				content={content}
				title={title}
			/>

		</div>
	);
}
