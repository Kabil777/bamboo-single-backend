"use client";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardTitle,
    CardDescription,
} from "@/components/shadcnUI/card";
import { ProfileTag } from "@/components/atomsComponents";
import type { BlogHomeCard } from "@/types/blog/blog-base";
import { useState } from "react";
import { Skeleton } from "@/components/shadcnUI/skeleton";
import { useAppDispatch } from "@/hooks/ReduxHooks";
import Link from "next/link";
import { toast } from "sonner";
import {
    removeProfileBlogItem,
    updateProfileBlogMeta,
} from "@/store/reducers/Profile/profile.read";

export const BlogCard: React.FC<BlogHomeCard & { isOwner?: boolean }> = ({
    id,
    title,
    description,
    coverUrl,
    author,
    createdAt,
    tags,
    visibility,
    status,
    collaborators,
    isOwner = false,
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const dispatch = useAppDispatch();
    const isDraft = status && status !== "PUBLISHED";

    const handleBlockedOpen = (e: React.MouseEvent) => {
        if (isOwner && isDraft) {
            e.preventDefault();
            toast.error("This blog is a draft. Publish it to view.");
        }
    };

    const textBlock = (
        <>
            {/*
                Title — large, tight tracking, full foreground.
                This is the visual anchor; everything else defers to it.
            */}
            <CardTitle className="text-[1.15rem] md:text-[1.35rem] font-semibold leading-snug tracking-tight text-foreground line-clamp-2">
                {title}
            </CardTitle>
            {/*
                Description — 3 lines, muted, comfortable reading size.
                Matches Image 1 reference: enough context without crowding.
            */}
            <CardDescription className="mt-1.5 line-clamp-3 text-sm leading-[1.7] text-foreground/50">
                {description}
            </CardDescription>
        </>
    );

    return (
        <div key={id}>
            <Card className="shadow-none rounded-none border-none bg-transparent p-0 my-0">
                <CardContent className="p-0 w-full grid grid-cols-5 items-start gap-3 md:gap-6 py-5">
                    <div className="col-span-full sm:col-span-3 sm:row-start-1 flex flex-col gap-2">
                        {/* ProfileTag sits above title — author + domain line like Image 1 */}

                        {/* Title + description — clickable block */}
                        {isOwner && isDraft ? (
                            <div
                                role="button"
                                tabIndex={0}
                                className="cursor-pointer"
                                onClick={handleBlockedOpen}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ")
                                        handleBlockedOpen(
                                            e as unknown as React.MouseEvent,
                                        );
                                }}
                            >
                                {textBlock}
                            </div>
                        ) : (
                            <Link href={`/blog/${id}`}>{textBlock}</Link>
                        )}

                        {/*
                            Tags — pure ghost pills, no color bg.
                            Visually quiet so title stays dominant.
                            Matching Image 1: tags are secondary metadata.
                        */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-foreground/[0.09] px-2.5 py-0.5 text-[11px] capitalize text-foreground/40"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <ProfileTag
                            idBlog={id}
                            profileId={author?.handle}
                            createdAt={createdAt}
                            authorName={author?.name}
                            authorAvatarUrl={author?.avatarUrl}
                            visibility={visibility}
                            status={status}
                            isOwner={isOwner}
                            showMenu={isOwner}
                            onVisibilityUpdated={(payload) => {
                                if (isOwner) {
                                    dispatch(updateProfileBlogMeta({ id, ...payload }));
                                }
                            }}
                            onDeleteCompleted={() => {
                                if (isOwner) {
                                    dispatch(removeProfileBlogItem(id));
                                }
                            }}
                        />
                    </div>

                    {/* ── Right: thumbnail ── */}
                    {/*
                        Image dimensions UNCHANGED: h-[160px], w-full, object-cover.
                        Removed border from image — sits naturally like Image 1 reference.
                        No wrapper padding or inset chrome.
                    */}
                    {coverUrl && !imageError ? (
                        <div className="sm:col-span-2 row-start-1 col-span-full flex items-start justify-center w-full h-full max-h-[160px]">
                            <div className="relative w-full h-[160px]">
                                <Image
                                    src={coverUrl}
                                    loading="eager"
                                    alt="Blog Cover Image"
                                    fill
                                    className={`object-cover rounded-lg transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
                                    sizes="(max-width: 640px) 100vw, 300px"
                                    onLoad={() => setIsLoaded(true)}
                                    onError={() => setImageError(true)}
                                />
                            </div>
                        </div>
                    ) : (
                        <Skeleton className="sm:col-span-2 row-start-1 col-span-full rounded-lg m-auto max-h-[160px] bg-border dark:bg-border w-full h-[160px]" />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
const tagColors = [
    "bg-emerald-100 text-emerald-800 border-emerald-200",
    "bg-sky-100 text-sky-800 border-sky-200",
    "bg-amber-100 text-amber-800 border-amber-200",
    "bg-rose-100 text-rose-800 border-rose-200",
    "bg-indigo-100 text-indigo-800 border-indigo-200",
];
const getTagClass = (tag: string) => {
    let hash = 0;
    for (let i = 0; i < tag.length; i += 1) {
        hash = (hash * 31 + tag.charCodeAt(i)) % 1000;
    }
    return tagColors[hash % tagColors.length];
};
