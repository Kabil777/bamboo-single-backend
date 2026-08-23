"use client";

import { motion } from "framer-motion";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/shadcnUI/accordion";
import { SidebarTrigger } from "@/components/shadcnUI/sidebar";
import { ArticleTableContent } from "./articleTableContent";

interface ArticleMobileTocProps {
	toc: any[];
	accordionValue: string | undefined;
	onAccordionValueChange: (value: string | undefined) => void;
	showSidebarTrigger?: boolean;
}

export function ArticleMobileToc({
	toc,
	accordionValue,
	onAccordionValueChange,
	showSidebarTrigger = false,
}: ArticleMobileTocProps) {
	return (
		<div className="sticky top-[var(--header-height)] w-full z-20 lg:hidden border-b border-border/30 bg-background/80 backdrop-blur-xl">
			<Accordion
				type="single"
				collapsible
				className="w-full"
				value={accordionValue}
				onValueChange={onAccordionValueChange}
			>
				<AccordionItem value="item-1">
					<div className={`flex items-center gap-2 px-4 ${showSidebarTrigger ? "justify-between" : "justify-end"}`}>
						{showSidebarTrigger && <SidebarTrigger className="-ml-1" />}
						<AccordionTrigger>
							<span className="text-sm font-medium text-muted-foreground">
								On This Page
							</span>
						</AccordionTrigger>
					</div>
					<AccordionContent className="overflow-hidden absolute w-full border-b border-border/30 bg-background/95 backdrop-blur-xl">
						<motion.div
							initial={false}
							animate={{
								height: accordionValue === "item-1" ? "auto" : 0,
								opacity: accordionValue === "item-1" ? 1 : 0,
							}}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							className="overflow-y-auto max-h-[60vh] px-4 pb-4"
						>
							{toc.length > 0 ? (
								<ArticleTableContent toc={toc} />
							) : (
								<p className="text-xs text-muted-foreground italic mt-2 mx-auto">
									No headings available
								</p>
							)}
						</motion.div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
