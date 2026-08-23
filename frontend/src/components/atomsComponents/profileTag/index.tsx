"use client";
import { motion } from "framer-motion";
import {
    Bookmark,
    BookOpen,
    Calendar,
    Ellipsis,
    Eye,
    Pencil,
    Share2,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/shadcnUI/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/shadcnUI/dialog";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    AvatarGroup,
    AvatarGroupCount,
} from "@/components/shadcnUI/avatar";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/shadcnUI/tooltip";
import { BlogUpdateDetails, VisibilityPopover } from "../blogUpdateDetials";
import { ProfileHoverTag } from "../profileHoverTag";
import { SharePopover } from "../sharePopover";
import { Button } from "@/components/shadcnUI/button";
import { UUID } from "@/types/blog/blog-base";
import api from "@/api/axios";
import { toast } from "sonner";
import { bookmarkPost, unbookmarkPost } from "@/api/postsApi";

export type Author = {
    id: string;
    name: string;
    handle?: string;
    avatarUrl?: string | null;
};

const MAX_VISIBLE_AVATARS = 3;

/**
 * Multi-user avatar stack — shows overlapping avatars with a "+N" overflow.
 * Each avatar has a tooltip and wraps a ProfileHoverTag on click/hover.
 */
const AuthorAvatarGroup = ({
    authors,
    size = "sm",
}: {
    authors: Author[];
    size?: "sm" | "default";
}) => {
    const visible = authors.slice(0, MAX_VISIBLE_AVATARS);
    const overflow = authors.length - MAX_VISIBLE_AVATARS;

    const avatarSizeClass = size === "sm" ? "w-6 h-6" : "w-7 h-7";
    const fallbackTextClass = size === "sm" ? "text-[10px]" : "text-xs";
    return (
        <AvatarGroup className="items-center">
            {visible.map((author) => (
                <Tooltip key={author.id}>
                    <TooltipTrigger asChild>
                        <Avatar
                            className={`${avatarSizeClass} border-2 border-background cursor-pointer transition-transform hover:scale-110 hover:z-10`}
                        >
                            <AvatarImage
                                src={
                                    author.avatarUrl ||
                                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(author.name)}`
                                }
                                alt={author.name}
                            />
                            <AvatarFallback
                                className={`${fallbackTextClass} font-semibold bg-muted text-muted-foreground`}
                            >
                                {author.name
                                    .split(" ")
                                    .map((w) => w[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                        {author.name}
                    </TooltipContent>
                </Tooltip>
            ))}
            {overflow > 0 && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <AvatarGroupCount
                            className={`${avatarSizeClass} text-[10px] font-semibold cursor-default`}
                        >
                            +{overflow}
                        </AvatarGroupCount>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                        {authors
                            .slice(MAX_VISIBLE_AVATARS)
                            .map((a) => a.name)
                            .join(", ")}
                    </TooltipContent>
                </Tooltip>
            )}
        </AvatarGroup>
    );
};

export const ProfileTag = ({
    profileId,
    idBlog,
    contentType = "blog",
    createdAt,
    authorName,
    authorAvatarUrl,
    authors,
    variant = "default",
    visibility,
    status,
    isOwner = false,
    resourceId,
    showMenu = true,
    onVisibilityUpdated,
    onDeleteCompleted,
    initialBookmarked,
}: {
    profileId?: string;
    idBlog?: string;
    contentType?: "blog" | "docs";
    createdAt?: string | number | Date;
    authorName?: string | null;
    authorAvatarUrl?: string | null;
    authors?: Author[];
    variant?: "default" | "compact" | "view";
    visibility?: "PUBLIC" | "UNLISTED" | "PRIVATE";
    status?: "PUBLISHED" | "ARCHIVED" | "DRAFT";
    isOwner?: boolean;
    resourceId?: string;
    showMenu?: boolean;
    onVisibilityUpdated?: (payload: {
        visibility: "PUBLIC" | "UNLISTED" | "PRIVATE";
        status: "PUBLISHED" | "ARCHIVED" | "DRAFT";
    }) => void;
    onDeleteCompleted?: () => void;
    initialBookmarked?: boolean;
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const [bookmark, setBookmark] = useState(initialBookmarked ?? false);
    useEffect(() => {
        setBookmark(initialBookmarked ?? false);
    }, [initialBookmarked]);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [copyPopoverOpen, setCopyPopoverOpen] = useState(false);
    const [visibilityPopoverOpen, setVisibilityPopoverOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleVisibilityPopoverOpen = () => {
        setDropdownOpen(false);
        setTimeout(() => {
            setVisibilityPopoverOpen(true);
        }, 100);
    };
    const handleCopyPopoverOpen = () => {
        setDropdownOpen(false);
        setTimeout(() => {
            setCopyPopoverOpen(true);
        }, 100);
    };
    const handleEditClick = () => {
        setDropdownOpen(false);
        const id = resourceId || idBlog;
        if (contentType === "docs") {
            if (id) router.push(`/editor/docs/${id}`);
            return;
        }
        if (id) router.push(`/editor/blog/${id}`);
    };
    const toggleBookmark = async () => {
        const id = resourceId || idBlog;
        if (!id || contentType !== "blog") return;
        try {
            if (bookmark) await unbookmarkPost(id); else await bookmarkPost(id);
            setBookmark((value) => !value);
        } catch { toast.error("Log in to bookmark posts"); }
    };

    const getFormattedDate = (dateInput?: string | number | Date) => {
        if (!dateInput) return "";
        const date =
            dateInput instanceof Date ? dateInput : new Date(dateInput);
        if (Number.isNaN(date.getTime())) return "";
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getRelativeTime = (dateInput?: string | number | Date) => {
        if (!dateInput) return "just now";
        const date =
            dateInput instanceof Date ? dateInput : new Date(dateInput);
        if (Number.isNaN(date.getTime())) return "just now";
        const diffMs = Date.now() - date.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        if (diffSec < 60) return "just now";
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return `${diffMin} min ago`;
        const diffHr = Math.floor(diffMin / 60);
        if (diffHr < 24) return `${diffHr} hr${diffHr > 1 ? "s" : ""} ago`;
        const diffDay = Math.floor(diffHr / 24);
        if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
        const diffMonth = Math.floor(diffDay / 30);
        if (diffMonth < 12)
            return `${diffMonth} month${diffMonth > 1 ? "s" : ""} ago`;
        const diffYear = Math.floor(diffMonth / 12);
        return `${diffYear} year${diffYear > 1 ? "s" : ""} ago`;
    };

    const relativeTime = getRelativeTime(createdAt);
    const showPrivate = isOwner && visibility === "PRIVATE";
    const showUnpublished = isOwner && status && status !== "PUBLISHED";
    const showVisibilityBadge =
        isOwner && (visibility || status || showPrivate || showUnpublished);
    const canManage = showMenu && isOwner;
    const statusLabel = status ? status.toLowerCase() : undefined;
    const visibilityLabel = visibility ? visibility.toLowerCase() : undefined;

    const hasMultipleAuthors = authors && authors.length > 1;

    const resourceLabel = contentType === "docs" ? "document" : "blog";
    const resourceRoute = contentType === "docs" ? "docs" : "posts";
    const resourceTitle = contentType === "docs" ? "Docs" : "Blog";

    const getDeleteErrorMessage = (error: unknown) => {
        if (
            typeof error === "object" &&
            error !== null &&
            "response" in error &&
            typeof (error as { response?: unknown }).response === "object" &&
            (error as { response?: { data?: { message?: string; error?: string } } })
                .response?.data
        ) {
            const response = (error as {
                response?: { data?: { message?: string; error?: string } };
            }).response;
            return (
                response?.data?.message ||
                response?.data?.error ||
                `Failed to delete ${resourceLabel}`
            );
        }
        if (error instanceof Error && error.message) {
            return error.message;
        }
        return `Failed to delete ${resourceLabel}`;
    };

    const openDeleteDialog = () => {
        setDropdownOpen(false);
        setTimeout(() => {
            setDeleteDialogOpen(true);
        }, 100);
    };

    const handleDelete = async (resourceId?: UUID) => {
        if (!resourceId || isDeleting) return;
        setIsDeleting(true);
        try {
            const apiVersion = process.env.NEXT_PUBLIC_API_VERSION ?? "/api/v1";
            await api.delete(`${apiVersion}/${resourceRoute}/${resourceId}`);
            toast.success(`${resourceTitle} deleted successfully`);
            onDeleteCompleted?.();
            setDeleteDialogOpen(false);

            if (
                pathname?.startsWith(`/${resourceRoute}/${resourceId}`) ||
                pathname?.startsWith(`/editor/${resourceRoute}/${resourceId}`)
            ) {
                router.replace("/");
                return;
            }

            router.refresh();
        } catch (error) {
            toast.error(getDeleteErrorMessage(error));
        } finally {
            setIsDeleting(false);
        }
    };

    // ─── Compact variant (for docs cards) ───
    if (variant === "compact") {
        return (
            <div className="flex items-center gap-2 mt-1.5">
                {hasMultipleAuthors ? (
                    <AuthorAvatarGroup authors={authors} size="sm" />
                ) : (
                    <ProfileHoverTag profileId={profileId} />
                )}
                <span className="text-xs text-muted-foreground font-medium">
                    ~ {relativeTime}
                </span>
                {hasMultipleAuthors && (
                    <span className="text-[11px] text-muted-foreground/70 hidden sm:inline">
                        {authors.length} contributors
                    </span>
                )}
            </div>
        );
    }

    // ─── View variant (for blog/docs rendering) ───
    if (variant === "view") {
        return (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 mb-8">
                <div className="flex items-center gap-3">
                    {hasMultipleAuthors ? (
                        <AuthorAvatarGroup authors={authors} size="default" />
                    ) : (
                        <Avatar className="w-11 h-11">
                            <AvatarImage
                                src={
                                    authorAvatarUrl ||
                                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName || profileId || "U")}`
                                }
                            />
                            <AvatarFallback className="text-sm font-semibold bg-muted text-muted-foreground">
                                {(authorName ||
                                    profileId ||
                                    "U")[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    )}

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            {hasMultipleAuthors ? (
                                <span className="text-sm font-bold text-foreground">
                                    Multiple Authors
                                </span>
                            ) : (
                                <ProfileHoverTag profileId={profileId} name={authorName ?? undefined} />
                            )}
                            {showVisibilityBadge && (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize flex items-center gap-1">
                                    {visibilityLabel}
                                    {visibilityLabel && statusLabel && " • "}
                                    {statusLabel}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 font-medium">
                            {getFormattedDate(createdAt) && (
                                <>
                                    <span>{getFormattedDate(createdAt)}</span>
                                    <span className="w-1 h-1 rounded-full bg-muted-foreground/40"></span>
                                </>
                            )}
                            <span>{relativeTime}</span>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/40 hidden sm:inline-block"></span>
                            <span className="hidden sm:flex items-center gap-1">
                                <BookOpen size={12} />
                                165k reads
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto">
                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={toggleBookmark} className="h-9 w-9 rounded-full hover:bg-muted/50"><Bookmark className={bookmark ? "fill-current text-primary" : ""} size={18} /></Button></TooltipTrigger><TooltipContent side="top" className="text-xs">Bookmark</TooltipContent></Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCopyPopoverOpen}
                                className="h-9 w-9 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Share2 size={18} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                            Share
                        </TooltipContent>
                    </Tooltip>

                    {canManage && (
                        <DropdownMenu
                            open={dropdownOpen}
                            onOpenChange={setDropdownOpen}
                        >
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                >
                                    <Ellipsis size={18} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-40 border-border/50 shadow-xl rounded-xl"
                            >
                                <DropdownMenuItem
                                    onClick={handleEditClick}
                                    className="cursor-pointer"
                                >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={handleVisibilityPopoverOpen}
                                    className="cursor-pointer"
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    <span>Visibility</span>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    variant="destructive"
                                    className="cursor-pointer"
                                    disabled={isDeleting}
                                    onClick={openDeleteDialog}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {/* Modals placed at the end */}
                <SharePopover
                    text={`https://bamboo.dev/${
                        contentType === "docs" ? "docs" : "blog"
                    }/${profileId ? `?ref=${profileId}` : ""}`}
                    open={copyPopoverOpen}
                    setOpen={setCopyPopoverOpen}
                >
                    {""}
                </SharePopover>
                {canManage && (
                    <>
                        <VisibilityPopover
                            open={visibilityPopoverOpen}
                            setOpen={setVisibilityPopoverOpen}
                            contentType={contentType}
                            resourceId={resourceId || idBlog}
                            initialStatus={status}
                            initialVisibility={visibility}
                            onUpdated={onVisibilityUpdated}
                        />
                        <BlogUpdateDetails
                            open={isEditDialogOpen}
                            setOpen={setIsEditDialogOpen}
                        />
                    </>
                )}
            </div>
        );
    }

    // ─── Default variant (full layout) ───
    return (
        <>
            <div className="flex flex-wrap gap-2 mt-2 items-center justify-start gap-x-3">
                {hasMultipleAuthors ? (
                    <AuthorAvatarGroup authors={authors} />
                ) : (
                    <ProfileHoverTag profileId={profileId} name={authorName ?? undefined} />
                )}

                <p className="text-sm text-muted-foreground italic flex items-center gap-1 font-medium">
                    ~ {relativeTime}
                </p>

                <p className="text-sm text-muted-foreground italic flex items-center gap-1 font-medium ">
                    <BookOpen size={14} />
                    165k
                </p>

                {showVisibilityBadge && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground flex items-center gap-1 capitalize">
                        {visibilityLabel}
                        {visibilityLabel && statusLabel && " • "}
                        {statusLabel}
                    </span>
                )}
                {canManage && (
                    <DropdownMenu
                        open={dropdownOpen}
                        onOpenChange={setDropdownOpen}
                    >
                        <DropdownMenuTrigger
                            className="text-sm text-muted-foreground italic flex items-center gap-1 font-medium cursor-pointer"
                            asChild
                        >
                            <p>
                                <Ellipsis size={14} />
                            </p>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-40">
                            <DropdownMenuItem onClick={handleEditClick}>
                                <Pencil className="h-4 w-4" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={handleVisibilityPopoverOpen}
                            >
                                <Eye className="h-4 w-4" />
                                <span>Visibility</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleCopyPopoverOpen}>
                                <Share2 className="h-4 w-4" />
                                <span>Share</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                variant="destructive"
                                disabled={isDeleting}
                                onClick={openDeleteDialog}
                            >
                                <Trash2 className="h-4 w-4" />
                                <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
            {canManage && (
                <>
                    <SharePopover
                        text={`https://bamboo.dev/${
                            contentType === "docs" ? "docs" : "blog"
                        }/${profileId ? `?ref=${profileId}` : ""}`}
                        open={copyPopoverOpen}
                        setOpen={setCopyPopoverOpen}
                    >
                        {""}
                    </SharePopover>
                    <VisibilityPopover
                        open={visibilityPopoverOpen}
                        setOpen={setVisibilityPopoverOpen}
                        contentType={contentType}
                        resourceId={resourceId || idBlog}
                        initialStatus={status}
                        initialVisibility={visibility}
                        onUpdated={onVisibilityUpdated}
                    />
                    <BlogUpdateDetails
                        open={isEditDialogOpen}
                        setOpen={setIsEditDialogOpen}
                    />
                    <Dialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                    >
                        <DialogContent className="sm:max-w-md border-border/60 shadow-xl rounded-none p-7">
                            <DialogHeader className="space-y-4">
                                <div className="space-y-1">
                                    <DialogTitle>{`Delete this ${resourceLabel}?`}</DialogTitle>
                                    <DialogDescription>
                                        {`This permanently removes the ${resourceLabel} and its access data. This action cannot be undone.`}
                                    </DialogDescription>
                                </div>
                            </DialogHeader>

                            <div className="border border-foreground/10 bg-foreground/[0.03] px-4 py-3 text-sm text-muted-foreground">
                                {`The ${resourceLabel} will disappear from your profile and public feeds immediately after deletion.`}
                            </div>

                            <DialogFooter className="gap-3 pt-1 sm:justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setDeleteDialogOpen(false)}
                                    disabled={isDeleting}
                                    className="rounded-none"
                                >
                                    {`Keep ${resourceLabel}`}
                                </Button>
                                <Button
                                    onClick={() => handleDelete(idBlog)}
                                    disabled={isDeleting}
                                    className="rounded-none bg-foreground text-background hover:bg-foreground/90"
                                >
                                    {isDeleting ? "Deleting..." : `Delete ${resourceLabel}`}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </>
    );
};
