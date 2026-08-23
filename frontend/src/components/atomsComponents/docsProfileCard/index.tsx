"use client";
import Image from "next/image";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardTitle,
    CardDescription,
} from "@/components/shadcnUI/card";
import { ProfileTag } from "@/components/atomsComponents";
import { Skeleton } from "@/components/shadcnUI/skeleton";
import { useState } from "react";
import type { ProfileDoc } from "@/types/Profile/profile-types";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/ReduxHooks";
import {
    removeProfileDocItem,
    updateProfileDocMeta,
} from "@/store/reducers/Profile/profile.read";

export const DocsProfileCard: React.FC<ProfileDoc & { isOwner?: boolean; authorName?: string }> = ({
    id,
    title,
    description,
    coverUrl,
    createdAt,
    authorName,
    visibility,
    status,
    isOwner = false,
}) => {
    const [imageError, setImageError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useAppDispatch();

    const isDraft = status && status !== "PUBLISHED";
    const handleBlockedOpen = (e: React.MouseEvent) => {
        if (isOwner && isDraft) {
            e.preventDefault();
            toast.error("This doc is a draft. Publish it to view.");
        }
    };

    return (
        <div key={id}>
            <Card className="shadow-none rounded-none overflow-hidden items-center p-2 sm:p-4 gap-2 border-none transition duration-200 ease-in-out my-3">
                <CardContent className="p-0 w-full grid grid-cols-5 items-center gap-2 md:gap-5 justify-between">
                    <div className="p-0 col-span-full sm:row-start-1 sm:col-span-3 flex flex-col gap-0 md:gap-2">
                        {isOwner && isDraft ? (
                            <div
                                role="button"
                                tabIndex={0}
                                className="cursor-pointer"
                                onClick={handleBlockedOpen}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        handleBlockedOpen(e as unknown as React.MouseEvent);
                                    }
                                }}
                            >
                                <CardTitle className="text-base md:text-2xl font-semibold line-clamp-2">
                                    {title || "Untitled Document"}
                                </CardTitle>
                                <CardDescription className="text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 text-xs md:text-sm">
                                    {description || "No description available."}
                                </CardDescription>
                            </div>
                        ) : (
                            <Link href={`/docs/${id}`} className="cursor-pointer">
                                <CardTitle className="text-base md:text-2xl font-semibold line-clamp-2">
                                    {title || "Untitled Document"}
                                </CardTitle>
                                <CardDescription className="text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 text-xs md:text-sm">
                                    {description || "No description available."}
                                </CardDescription>
                            </Link>
                        )}
                        <ProfileTag
                            idBlog={id}
                            profileId={undefined}
                            authorName={authorName}
                            contentType="docs"
                            createdAt={createdAt}
                            visibility={visibility}
                            status={status}
                            isOwner={isOwner}
                            showMenu={isOwner}
                            onVisibilityUpdated={(payload) => {
                                if (isOwner) {
                                    dispatch(updateProfileDocMeta({ id, ...payload }));
                                }
                            }}
                            onDeleteCompleted={() => {
                                if (isOwner) {
                                    dispatch(removeProfileDocItem(id));
                                }
                            }}
                        />
                    </div>
                    {coverUrl && !imageError ? (
                        <div className="sm:col-span-2 row-start-1 col-span-full flex items-center justify-center w-full h-full max-h-[160px]">
                            <div className="relative w-full h-[160px]">
                                <Image
                                    src={coverUrl}
                                    loading="eager"
                                    alt="Docs Cover Image"
                                    fill
                                    className={`object-cover rounded-lg border transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
                                    sizes="(max-width: 640px) 100vw, 300px"
                                    onError={() => setImageError(true)}
                                    onLoad={() => setIsLoaded(true)}
                                />
                            </div>
                        </div>
                    ) : (
                        <Skeleton className="sm:col-span-2 h-full row-start-1 col-span-full rounded-lg m-auto max-h-[160px] bg-border dark:bg-border w-full" />
                    )}
                </CardContent>
            </Card>
            <hr />
        </div>
    );
};
