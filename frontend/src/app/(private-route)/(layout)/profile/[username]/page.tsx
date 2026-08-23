"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { BlogCard, DocsProfileCard, useProfileTab } from "@/components/atomsComponents";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/shadcnUI/avatar";
import { Button } from "@/components/shadcnUI/button";
import { Separator } from "@/components/shadcnUI/separator";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import {
    getAllProfileBlogByHandle,
    getAllProfileDocsByHandle,
    resetProfileCollections,
} from "@/store/reducers/Profile/profile.read";
import { BlogCardSkeleton } from "@/components/atomsComponents/skleton/blogCardSkleton";
import { ProfileBlogListSkeleton } from "@/components/atomsComponents/skleton/Profile/profileBlogSkleton";

const cardData = [
    {
        id: 1,
        title: "React",
        description: "A JavaScript library for building user interfaces",
        follower: "112k",
        follow: false,
    },
    {
        id: 2,
        title: "Vue",
        description:
            "A progressive JavaScript framework for building user interfaces",
        follower: "112k",
        follow: false,
    },
    {
        id: 3,
        title: "Angular",
        description:
            "A platform for building mobile and desktop web applications",
        follower: "112k",
        follow: false,
    },
    {
        id: 4,
        title: "Svelte",
        description: "A radical new approach to building user interfaces",
        follower: "112k",
        follow: false,
    },
];

const fadeTransition = { duration: 0.18, ease: "easeOut" as const };

const fadePanelProps = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: fadeTransition,
};

export default function UserProfile() {
    const dispatch = useAppDispatch();
    const {
        profileLoading,
        blogLoading,
        blogs,
        docsLoading,
        docs,
        blogError,
        docsError,
    } = useAppState((s) => s.getProfileReducers);
    const { user } = useAppState((s) => s.userReducer);
    const params = useParams();
    const username = params.username as string;
    const handle = username?.startsWith("@") ? username.slice(1) : username;
    const isOwnProfile =
        !!user?.handle &&
        user.handle.trim().toLowerCase() === handle?.trim().toLowerCase();
    const { selectedTab } = useProfileTab();
    const visibleBlogs = useMemo(() => {
        if (!blogs?.items) return [];
        // The backend is the authority for visibility. It includes private
        // entries only for the owner or an administrator.
        return blogs.items;
    }, [blogs, isOwnProfile]);

    const visibleDocs = useMemo(() => {
        if (!docs?.items) return [];
        return docs.items;
    }, [docs, isOwnProfile]);
    const hasProfileError = !!useAppState((s) => s.getProfileReducers.profileError);
    const showBlogsSection = selectedTab === "posts" || selectedTab === "all";
    const showDocsSection = selectedTab === "docs" || selectedTab === "all";
    const showBookmarksSection = selectedTab === "bookmark";
    const showAllSectionDivider = selectedTab === "all";
    const canLoadCollections = !!handle && !profileLoading && !hasProfileError;
    const isBlogsSectionLoading = showBlogsSection && (profileLoading || (canLoadCollections && (blogLoading || blogs === null)));
    const isDocsSectionLoading = showDocsSection && (profileLoading || (canLoadCollections && (docsLoading || docs === null)));
    const showEmptyBlogs = showBlogsSection && !isBlogsSectionLoading && visibleBlogs.length === 0;
    
    useEffect(() => {
        dispatch(resetProfileCollections());
    }, [dispatch, handle]);

    useEffect(() => {
        if (!canLoadCollections) {
            return;
        }

        const shouldLoadPosts =
            (selectedTab === "posts" || selectedTab === "all") &&
            !blogLoading &&
            (blogs === null || !!blogError);
        const shouldLoadDocs =
            (selectedTab === "docs" || selectedTab === "all") &&
            !docsLoading &&
            (docs === null || !!docsError);

        if (shouldLoadPosts) {
            dispatch(getAllProfileBlogByHandle(handle));
        }

        if (shouldLoadDocs) {
            dispatch(getAllProfileDocsByHandle(handle));
        }
    }, [dispatch, handle, selectedTab, canLoadCollections, blogLoading, blogs, blogError, docsLoading, docs, docsError]);



    return (
        <div className="container grid grid-cols-4 transition-all duration-200 ease-linear gap-4 md:gap-6 relative">
            <div className="col-span-full xl:col-span-3 mx-2 md:mx-0 xl:border-r-1 p-0 sm:p-2 relative">
                
                <AnimatePresence initial={false}>
                    {showBlogsSection && (
                        isBlogsSectionLoading ? (
                            <motion.div key="user-posts-loading" {...fadePanelProps} className="space-y-4">
                                {showAllSectionDivider && (
                                    <div className="flex items-center gap-4 py-2">
                                        <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground/80">
                                            Posts
                                        </span>
                                        <div className="h-px flex-1 bg-border/70" />
                                    </div>
                                )}
                                <div className="space-y-4">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <BlogCardSkeleton key={index} />
                                    ))}
                                </div>
                            </motion.div>
                        ) : visibleBlogs.length ? (
                            <motion.div key="user-posts-content" {...fadePanelProps} className="space-y-4">
                                {showAllSectionDivider && (
                                    <div className="flex items-center gap-4 py-2">
                                        <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground/80">
                                            Posts
                                        </span>
                                        <div className="h-px flex-1 bg-border/70" />
                                    </div>
                                )}
                                {visibleBlogs.map((item) => (
                                    <BlogCard
                                        key={item.id}
                                        title={item.title}
                                        description={item.description}
                                        coverUrl={item.coverUrl}
                                        author={item.author}
                                        id={item.id}
                                        tags={item.tags}
                                        createdAt={item.createdAt}
                                        visibility={item.visibility}
                                        status={item.status}
                                        collaborators={item.collaborators}
                                        isOwner={isOwnProfile}
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div key="user-posts-empty" {...fadePanelProps} className="space-y-4">
                                {showAllSectionDivider && (
                                    <div className="flex items-center gap-4 py-2">
                                        <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground/80">
                                            Posts
                                        </span>
                                        <div className="h-px flex-1 bg-border/70" />
                                    </div>
                                )}
                                <div className="min-h-[220px] rounded-xl p-8 flex items-center justify-center text-center text-sm text-muted-foreground">
                                    No posts yet.
                                </div>
                            </motion.div>
                        )
                    )}

                    {showDocsSection && (
                        isDocsSectionLoading ? (
                            <motion.div key="user-docs-loading" {...fadePanelProps} className="space-y-4">
                                {showAllSectionDivider && (
                                    <div className="flex items-center gap-4 py-2">
                                        <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground/80">
                                            Documents
                                        </span>
                                        <div className="h-px flex-1 bg-border/70" />
                                    </div>
                                )}
                                <ProfileBlogListSkeleton count={3} />
                            </motion.div>
                        ) : visibleDocs.length ? (
                            <motion.div key="user-docs-content" {...fadePanelProps} className="space-y-4">
                                {showAllSectionDivider && (
                                    <div className="flex items-center gap-4 py-2">
                                        <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground/80">
                                            Documents
                                        </span>
                                        <div className="h-px flex-1 bg-border/70" />
                                    </div>
                                )}
                                {visibleDocs.map((doc) => (
                                    <DocsProfileCard
                                        key={doc.id}
                                        id={doc.id}
                                        title={doc.title}
                                        description={doc.description}
                                        coverUrl={doc.coverUrl}
                                        createdAt={doc.createdAt}
                                        visibility={doc.visibility}
                                        status={doc.status}
                                        isOwner={isOwnProfile}
                                        authorName={doc.author?.name}
                                        author={doc.author!}
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div key="user-docs-empty" {...fadePanelProps} className="space-y-4">
                                {showAllSectionDivider && (
                                    <div className="flex items-center gap-4 py-2">
                                        <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground/80">
                                            Documents
                                        </span>
                                        <div className="h-px flex-1 bg-border/70" />
                                    </div>
                                )}
                                <div className="min-h-[220px] rounded-xl p-8 flex items-center justify-center text-center text-sm text-muted-foreground">
                                    No docs yet.
                                </div>
                            </motion.div>
                        )
                    )}

                    {showBookmarksSection && (
                        <motion.div key="user-bookmarks-empty" {...fadePanelProps} className="min-h-[220px] rounded-xl p-8 flex items-center justify-center text-center text-sm text-muted-foreground">
                            No bookmarks yet.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="hidden xl:flex flex-col xl:col-span-1 line-clamp-2 p-2 gap-4 xl:sticky top-[140px] z-8 max-h-[calc(100vh-150px)] overflow-y-auto custom-scroll">
                <div>
                    <p className="font-semibold">Recommended Profiles : </p>
                    {cardData.map((card) => {
                        return (
                            <span key={card.id}>
                                <div className="mb-4 flex flex-row items-center gap-3 justify-between my-5">
                                    <div className="flex flex-row gap-2">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src="https://i.pravatar.cc/150?img=12" />
                                            <AvatarFallback>VC</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col justify-center">
                                            <p>{card.title}</p>
                                            <p
                                                className="text-xs text-muted-foreground line-clamp-1"
                                                title={card.description}
                                            >
                                                {card.description}
                                            </p>
                                        </div>
                                    </div>
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            backgroundColor: card.follow
                                                ? "hsl(var(--accent-foreground))"
                                                : "hsl(var(--foreground))",
                                            scale: 1,
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20,
                                        }}
                                    >
                                        <Button className="p-2 py-1 h-fit text-xs font-normal align-[4px]">
                                            <motion.span
                                                key={
                                                    card.follow
                                                        ? "following"
                                                        : "follow"
                                                }
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {card.follow
                                                    ? "Following"
                                                    : "Follow"}
                                            </motion.span>
                                        </Button>
                                    </motion.div>
                                </div>
                                <Separator orientation="horizontal" />
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
