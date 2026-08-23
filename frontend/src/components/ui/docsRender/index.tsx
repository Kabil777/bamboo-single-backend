"use client";

import { motion } from "framer-motion";
import {
	Copy,
	Sparkles,
	FileText,
	ChevronDown,
	Terminal,
} from "lucide-react";

import { useCallback, useEffect, useState } from "react";
import {
	ArticleRender,
	ArticleSidebar,
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
import { useApiLoading } from "@/hooks/useApiLoading";
import { usePathResolver } from "@/hooks/usePathResolver";
import { extractToc } from "@/lib/utils";
import { DocsRTK } from "@/store/reducers/DocsReducer";
import { toast } from "sonner";
import type { DocsTreeNode } from "@/types/docs/docs-base";
import { BreadcrumbsArticle } from "@/components/atomsComponents/Article/BreadcrumbsArticle";
import { Dialog } from "@/components/shadcnUI/dialog";

// ─── Helpers ─────────────────────────────────────────

function estimateReadingTime(text: string | null | undefined): number {
	if (!text) return 1;
	const words = text.trim().split(/\s+/).length;
	return Math.max(1, Math.ceil(words / 200));
}

/** Flatten a docs tree into an ordered list of {id, title} for prev/next nav */
function flattenTree(
	nodes: DocsTreeNode[],
): { id: string; title: string }[] {
	const result: { id: string; title: string }[] = [];
	for (const node of nodes) {
		result.push({ id: node.id, title: node.title });
		if (node.subTree?.length) {
			result.push(...flattenTree(node.subTree));
		}
	}
	return result;
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

// ─── Component ───────────────────────────────────────

export default function DocsRenderPage({ id }: { id: string[] }) {
	const dispatch = useAppDispatch();
	const docId = id[0];

	const [accordionValue, setAccordionValue] = useState<string | undefined>(
		undefined,
	);
	const [copied, setCopied] = useState(false);
	const [viewMarkdownOpen, setViewMarkdownOpen] = useState(false);

	const { entities, loadingById, errorById } = useAppState(
		(s) => s.docsReducer,
	);
	const doc = entities[docId];
	const isDocsLoading = useApiLoading(loadingById[docId]);

	useEffect(() => {
		if (!docId) return;
		dispatch(DocsRTK(docId));
	}, [docId, dispatch]);

	// ─── Derived State & Hooks (Must be before early returns) ───
	const { title, content: md, isOverview } = usePathResolver(
		doc || ({ title: "", content: "", tree: [] } as any),
		id,
	);
	// Overview is a navigation-only item. Its content always comes from
	// Document.content via usePathResolver, never from a copied tree node.
	const tree: DocsTreeNode[] = doc
		? [{ id: docId, title: "Overview", content: "", subTree: [] }, ...doc.tree]
		: [];
	const toc = extractToc(md);
	const readingTime = estimateReadingTime(md);

	const handleCopyMarkdown = useCallback(async () => {
		if (!md) return;
		try {
			await navigator.clipboard.writeText(md);
			setCopied(true);
			toast.success("Markdown copied to clipboard!");
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error("Failed to copy to clipboard");
		}
	}, [md]);

	// ─── Loading ─────────────────────────────────
	if (isDocsLoading && !doc) {
		return <BlogPageSkeleton showCover={false} />;
	}

	// ─── Not Found ───────────────────────────────
	if (errorById[docId] || !doc) {
		return <ArticleNotFound type="document" />;
	}

	const { description, tags } = doc;

	// ─── Prev/Next from Docs Tree ────────────────
	const flatPages = flattenTree(tree);
	const currentPageId = id.length === 1 ? docId : id[id.length - 1];
	const currentIdx = flatPages.findIndex((p) => p.id === currentPageId);
	const prevPage = currentIdx > 0 ? flatPages[currentIdx - 1] : null;
	const nextPage =
		currentIdx >= 0 && currentIdx < flatPages.length - 1
			? flatPages[currentIdx + 1]
			: null;

	return (
		<div className="flex flex-1 flex-col w-full">
			{/* ─── Mobile TOC Toggle ─── */}
			<ArticleMobileToc
				toc={toc}
				accordionValue={accordionValue}
				onAccordionValueChange={setAccordionValue}
				showSidebarTrigger
			/>

			{/* ─── Main Layout ─── */}
			<div className="relative flex w-full justify-center gap-3 lg:justify-start lg:pl-[21rem] xl:gap-4 xl:pl-[22rem]">
				<ArticleSidebar
					docId={docId}
					documentTitle={doc.title}
					navData={tree}
					activeId={id.length === 1 ? docId : id[id.length - 1]}
				/>

				{/* ─── Article ─── */}
				<article className="flex-1 min-w-0 w-full max-w-[49rem] px-4 sm:px-6 lg:px-6">
					<motion.div
						className="flex w-full min-w-0 flex-1 flex-col py-6 lg:py-10 text-neutral-800 dark:text-neutral-300"
						initial="hidden"
						animate="visible"
						variants={stagger}
					>
						{/* ── Breadcrumbs & Action ── */}
						<div
							className="flex items-center justify-between mb-8"
						>
							<BreadcrumbsArticle docId={docId} doc={doc} id={id} />
						</div>

						<ArticleHeader
							title={title}
							coverUrl={doc.coverUrl}
							description={description}
							tags={tags}
							readingTime={readingTime}
							createdAt={doc.createdAt}
							author={doc.author}
							idBlog={docId}
							contentType="docs"
							isOverview={isOverview}
						/>


						{/* ── Article Content ── */}
						<motion.div variants={fadeUp} className="min-w-0">
							<ArticleRender content={md} />
						</motion.div>

						{/* ── Next / Previous Navigation ── */}
						<ArticleNavigation
							prevPage={prevPage}
							nextPage={nextPage}
							baseUrl={`/docs/${docId}`}
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
							<AskWithAiDropdown content={md} title={title}>
								{btn}
							</AskWithAiDropdown>
						),
					},
				]}
			/>

			<MarkdownViewDialog
				open={viewMarkdownOpen}
				onOpenChange={setViewMarkdownOpen}
				content={md}
				title={title}
			/>
		</div>
	);
}
