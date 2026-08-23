"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BlogCard, DocsProfileCard, useProfileTab } from "@/components/atomsComponents";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/shadcnUI/avatar";
import { Button } from "@/components/shadcnUI/button";
import { Separator } from "@/components/shadcnUI/separator";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import api from "@/api/axios";
import {
    getAllProfileBlog,
    getAllProfileDocs,
} from "@/store/reducers/Profile/profile.read";
import { ProfileBlogListSkeleton } from "@/components/atomsComponents/skleton/Profile/profileBlogSkleton";
import { BlogCardSkeleton } from "@/components/atomsComponents/skleton/blogCardSkleton";

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

export default function Profile() {
    const dispatch = useAppDispatch();
    const { profileLoading, blogLoading, blogs, docsLoading, docs, blogError, docsError } = useAppState(
        (s) => s.getProfileReducers,
    );
    const { user } = useAppState((s) => s.userReducer);
    const [activeDocId, setActiveDocId] = useState<string>("");
    const [bookmarks, setBookmarks] = useState<typeof blogs>(null);
    const [bookmarksLoading, setBookmarksLoading] = useState(false);
    const { selectedTab } = useProfileTab();
    const isOwner = true;
    const isFeedLoading =
        (selectedTab === "posts" && (profileLoading || blogLoading || blogs === null)) ||
        (selectedTab === "docs" && (profileLoading || docsLoading || docs === null));
    const showEmptyPosts =
        selectedTab === "posts" &&
        !isFeedLoading &&
        (blogs?.items?.length ?? 0) === 0;
    const showEmptyDocs =
        selectedTab === "docs" &&
        !isFeedLoading &&
        (docs?.items?.length ?? 0) === 0;


    useEffect(() => {
        dispatch(getAllProfileBlog());
        dispatch(getAllProfileDocs());
    }, [dispatch]);

    useEffect(() => {
        if (selectedTab !== "bookmark" || bookmarks !== null) return;
        setBookmarksLoading(true);
        api.get<{ data: Array<{ id: string; title: string; content: string; mediaId: string | null; createdAt: string; author: { id: string; name: string; pictureUrl: string | null } }> }>("/api/v1/community/me/bookmarks")
            .then(({ data }) => {
                const apiBase = ((typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_API_SERVER_URL || "http://localhost:8092"))).replace(/\/$/, "");
                setBookmarks({ items: data.data.map((post) => ({ id: post.id, title: post.title, description: post.content.replace(/<[^>]*>/g, "").slice(0, 180), coverUrl: post.mediaId ? `${apiBase}/api/v1/media/${post.mediaId}` : "", createdAt: post.createdAt, tags: [], author: { id: post.author.id, name: post.author.name, handle: "", avatarUrl: post.author.pictureUrl } })), hasNext: false, cursor: null });
            })
            .finally(() => setBookmarksLoading(false));
    }, [selectedTab, bookmarks]);

    
    return (
        <div className="container grid grid-cols-4 transition-all duration-200 ease-linear gap-4 md:gap-6 relative">
            <div className="col-span-full xl:col-span-3 mx-2 md:mx-0 xl:border-r-1 p-0 sm:p-2 relative">
                <AnimatePresence mode="wait" initial={false}>
                    {selectedTab === "posts" && (
                        isFeedLoading ? (
                            <motion.div key="posts-loading" {...fadePanelProps}>
                                <div className="space-y-4">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <BlogCardSkeleton key={index} />
                                    ))}
                                </div>
                            </motion.div>
                        ) : blogs?.items?.length ? (
                            <motion.div key="posts-content" {...fadePanelProps} className="space-y-4">
                                {blogs.items.map((item) => (
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
                                        isOwner={isOwner}
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div key="posts-empty" {...fadePanelProps} className="min-h-[220px] rounded-xl p-8 flex items-center justify-center text-center text-sm text-muted-foreground">
                                No posts yet.
                            </motion.div>
                        )
                    )}

                    {selectedTab === "docs" && (
                        isFeedLoading ? (
                            <motion.div key="docs-loading" {...fadePanelProps}>
                                <ProfileBlogListSkeleton count={3} />
                            </motion.div>
                        ) : docs?.items?.length ? (
                            <motion.div key="docs-content" {...fadePanelProps} className="space-y-4">
                                {docs.items.map((doc) => (
                                    <DocsProfileCard
                                        key={doc.id}
                                        id={doc.id}
                                        title={doc.title}
                                        description={doc.description}
                                        coverUrl={doc.coverUrl}
                                        createdAt={doc.createdAt}
                                        visibility={doc.visibility}
                                        status={doc.status}
                                        isOwner={isOwner}
                                        authorName={doc.author?.name || user?.name}
                                        author={doc.author!}
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div key="docs-empty" {...fadePanelProps} className="min-h-[220px] rounded-xl p-8 flex items-center justify-center text-center text-sm text-muted-foreground">
                                No docs yet.
                            </motion.div>
                        )
                    )}

                    {selectedTab === "bookmark" && (
                        bookmarksLoading ? <ProfileBlogListSkeleton count={3} /> : bookmarks?.items?.length ? (
                            <motion.div key="bookmarks-content" {...fadePanelProps} className="space-y-4">{bookmarks.items.map((item) => <BlogCard key={item.id} {...item} isOwner={false} />)}</motion.div>
                        ) : <motion.div key="bookmark-empty" {...fadePanelProps} className="min-h-[220px] rounded-xl p-8 flex items-center justify-center text-center text-sm text-muted-foreground">No bookmarks yet.</motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}
