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
	ArticleTableContent,
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
		if (!docId || doc) return;
		dispatch(DocsRTK(docId));
	}, [docId, doc, dispatch]);

	// ─── Derived State & Hooks (Must be before early returns) ───
	const { title, content: md, isOverview } = usePathResolver(
		doc || ({ title: "", content: "", tree: [] } as any),
		id,
	);
	const tree = doc?.description ? doc.tree : []; // Access tree safely
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
		return <BlogPageSkeleton />;
	}

	// ─── Not Found ───────────────────────────────
	if (errorById[docId] || !doc) {
		return <ArticleNotFound type="document" />;
	}

	const { description, tags } = doc;

	// ─── Prev/Next from Docs Tree ────────────────
	const flatPages = flattenTree(doc.tree || []);
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
			<div className="flex justify-center relative w-full gap-6 lg:gap-10">
				<ArticleSidebar
					className="border-none !sticky !top-18 max-h-[calc(100vh-7rem)] gap-4"
					navData={tree}
					activeId={id.length === 1 ? docId : id[id.length - 1]}
				/>

				{/* ─── Article ─── */}
				<article className="flex-1 min-w-0 w-full max-w-3xl px-4 sm:px-6 lg:px-2">
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
						<motion.div variants={fadeUp} className="min-w-0 typeset typeset-docs max-w-none">
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

				{/* ─── Right Sidebar: TOC ─── */}
				<aside className="hidden lg:block shrink-0 w-56 xl:w-64 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pb-8 custom-scroll">
					<div className="px-4 py-0">
						<div className="flex items-center gap-2 sticky top-0 bg-background pt-2 pb-3 z-10">
							<div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
								<svg
									className="w-3 h-3 text-primary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2.5}
										d="M4 6h16M4 12h16M4 18h7"
									/>
								</svg>
							</div>
							<h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
								On This Page
							</h2>
						</div>
						{toc.length > 0 ? (
							<ArticleTableContent toc={toc} />
						) : (
							<p className="text-xs text-muted-foreground/50 italic mt-2 pr-2">
								No headings available
							</p>
						)}
					</div>
					<div className="from-background via-background/80 to-background/50 sticky -bottom-10 z-10 h-15 shrink-0 bg-gradient-to-t" />
				</aside>
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
