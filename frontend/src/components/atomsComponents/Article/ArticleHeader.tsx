"use client";

import { motion } from "framer-motion";
import { Hash, Clock, CalendarDays, MessageCircle } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { ProfileTag } from "@/components/atomsComponents";
import CommentsDrawer from "../commentsDrawer";
import { Button } from "@/components/shadcnUI/button";

interface ArticleHeaderProps {
	title: string;
	coverUrl?: string;
	description?: string;
	tags?: string[];
	readingTime: number;
	createdAt: string;
	author?: {
		id?: string;
		handle?: string;
		name?: string;
		avatarUrl?: string | null;
	};
	collaborators?: any[];
	idBlog: string;
	contentType: "blog" | "docs";
	isOverview?: boolean;
	ownerEditHref?: string;
}

const fadeUp = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
	},
};

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

export function ArticleHeader({
	title,
	coverUrl,
	description,
	tags,
	readingTime,
	createdAt,
	author,
	collaborators,
	idBlog,
	contentType,
	isOverview = true,
	ownerEditHref,
}: ArticleHeaderProps) {
	return (
		<>
			{/* ── Hero Cover ── */}
			{coverUrl && (isOverview || contentType === "blog") && (
				<motion.figure className="w-full mb-8 lg:mb-10" variants={fadeUp}>
					<div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
						<NextImage
							width={1200}
							height={400}
							src={coverUrl}
							alt={title || "Article cover"}
							className="max-h-[280px] sm:max-h-[380px] md:max-h-[420px] w-full object-cover"
							loading="eager"
							decoding="async"
						/>
					</div>
				</motion.figure>
			)}

			{/* ── Title ── */}
			<motion.h1
				className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-foreground leading-[1.15] mb-3"
				variants={fadeUp}
			>
				{title || "Untitled Article"}
			</motion.h1>

			{/* ── ProfileTag ── */}
			<motion.div variants={fadeUp}>
				<ProfileTag
					idBlog={idBlog}
					profileId={author?.id}
					authorName={author?.name}
					authorAvatarUrl={author?.avatarUrl}
					createdAt={createdAt}
					variant="view"
					contentType={contentType}
					authors={collaborators}
				/>
			</motion.div>

			{/* ── Tags · Reading Time · Date ── */}
			<motion.div
				className="flex flex-wrap items-center gap-x-2.5 gap-y-2 mb-6"
				variants={fadeUp}
			>
				{tags && tags.length > 0 &&
					tags.map((tag, index) => (
						<span
							key={index}
							className="inline-flex items-center gap-1 capitalize px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/15 hover:border-primary/30 hover:shadow-sm hover:shadow-primary/5 transition-all duration-200 cursor-default"
						>
							<Hash className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-60" />
							{tag}
						</span>
					))}

				{tags && tags.length > 0 && (
					<span className="w-1 h-1 rounded-full bg-muted-foreground/30 hidden sm:block" />
				)}

				<span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground/80">
					<Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
					{readingTime} min read
				</span>

				<span className="w-1 h-1 rounded-full bg-muted-foreground/30" />

				<span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground/80">
					<CalendarDays className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
					{formatDate(createdAt)}
				</span>
				<CommentsDrawer contentId={idBlog} contentType={contentType}>
					<Button
						variant="ghost"
						className="h-auto px-1.5 py-0 text-[11px] sm:text-xs gap-1.5 text-muted-foreground/80 hover:text-foreground hover:bg-transparent"
					>
						<MessageCircle size={14} />
						Comments
					</Button>
				</CommentsDrawer>
				{ownerEditHref && (
					<Link
						href={ownerEditHref}
						className="ml-0 inline-flex h-7 items-center rounded-md px-2 text-[11px] font-medium text-primary underline-offset-4 transition-colors hover:bg-primary/10 hover:text-primary hover:underline sm:ml-auto sm:text-xs"
					>
						Edit post
					</Link>
				)}
			</motion.div>

			{/* ── Description ── */}
			{description && (
				<motion.div
					className="relative mb-8 rounded-2xl overflow-hidden"
					variants={fadeUp}
				>
					<div className="bg-gradient-to-r from-muted/60 to-muted/20 border border-border/30 rounded-2xl p-5 sm:p-6 pl-5 sm:pl-7">
						<svg
							className="absolute top-4 right-4 w-7 h-7 text-primary/8"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
						</svg>
						<p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed italic relative z-10">
							{description}
						</p>
					</div>
				</motion.div>
			)}
		</>
	);
}
