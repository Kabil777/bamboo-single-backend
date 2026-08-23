"use client";

import { motion } from "framer-motion";
import { Bookmark, PencilIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	FaDiscord,
	FaFacebook,
	FaGithub,
	FaGlobe,
	FaInstagram,
	FaLinkedin,
	FaTwitter,
	FaYoutube,
} from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import { IoIosShareAlt } from "react-icons/io";
import { MdOutlineArticle } from "react-icons/md";

import { Badge } from "@/components/shadcnUI/badge";
import { Button } from "@/components/shadcnUI/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
} from "@/components/shadcnUI/dialog";
import { Skeleton } from "@/components/shadcnUI/skeleton";

import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import { useImageColors } from "@/hooks/useImageColors";
import {
	getProfileCounts,
	getProfileCountsByHandle,
	getProfileDetials,
	getUserProfileByHandle,
} from "@/store/reducers/Profile/profile.read";
import { ProfileEditDialog } from "../profileEditDialog";
import { SharePopover } from "../sharePopover";
import { SectionCardsSkeleton } from "../skleton/Profile/profileCardSkleton";
import { followUser, unfollowUser, getFollowersByHandle, getFollowingByHandle } from "@/api/followApi";
import { toast } from "sonner";

const platformIcons = {
	GITHUB: FaGithub,
	LINKEDIN: FaLinkedin,
	TWITTER: FaTwitter,
	WEBSITE: FaGlobe,
	YOUTUBE: FaYoutube,
	FACEBOOK: FaFacebook,
	INSTAGRAM: FaInstagram,
	DISCORD: FaDiscord,
};

const platformNames = {
	GITHUB: "GitHub",
	LINKEDIN: "LinkedIn",
	TWITTER: "Twitter",
	WEBSITE: "Website",
	YOUTUBE: "YouTube",
	FACEBOOK: "Facebook",
	INSTAGRAM: "Instagram",
	DISCORD: "Discord",
};

const platformHoverColors: Record<string, { bg: string; text: string; border: string }> = {
	GITHUB: { bg: "rgba(110, 118, 129, 0.15)", text: "#8b949e", border: "rgba(110, 118, 129, 0.4)" },
	LINKEDIN: { bg: "rgba(10, 102, 194, 0.12)", text: "#0a66c2", border: "rgba(10, 102, 194, 0.35)" },
	TWITTER: { bg: "rgba(29, 155, 240, 0.12)", text: "#1d9bf0", border: "rgba(29, 155, 240, 0.35)" },
	WEBSITE: { bg: "rgba(99, 102, 241, 0.12)", text: "#6366f1", border: "rgba(99, 102, 241, 0.35)" },
	YOUTUBE: { bg: "rgba(255, 0, 0, 0.1)", text: "#ff0000", border: "rgba(255, 0, 0, 0.3)" },
	FACEBOOK: { bg: "rgba(24, 119, 242, 0.12)", text: "#1877f2", border: "rgba(24, 119, 242, 0.35)" },
	INSTAGRAM: { bg: "rgba(225, 48, 108, 0.12)", text: "#e1306c", border: "rgba(225, 48, 108, 0.35)" },
	DISCORD: { bg: "rgba(88, 101, 242, 0.12)", text: "#5865f2", border: "rgba(88, 101, 242, 0.35)" },
};

export function SectionCards({ viewingHandle }: { viewingHandle?: string }) {
	const dispatch = useAppDispatch();
	const router = useRouter();

	const { profileData, profileCounts, blogs, profileLoading, profileCountsLoading } = useAppState(
		(s) => s.getProfileReducers,
	);
	const postCount = blogs?.items?.length ?? profileCounts?.blogs?.total ?? 0;

	// Get current logged-in user's info
	const { user, status } = useAppState((s) => s.userReducer);

	// Determine if viewing own profile
	const isOwnProfile = !viewingHandle || viewingHandle === user?.handle;

	const [follow, setFollow] = useState(false);
	const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
	const [avatarLoaded, setAvatarLoaded] = useState(false);
	const [gradientColors, setGradientColors] = useState({
		start: "transparent",
		middle: "transparent",
	});

	useEffect(() => {
		if (profileData) {
			setFollow(profileData.isFollowing || false);
		}
	}, [profileData]);

	const handleFollowToggle = async () => {
		if (!user) {
			toast.error("You must be logged in to follow users.");
			return;
		}

		const targetHandle = profileData?.handle;
		if (!targetHandle) {
			toast.error("User handle not available to follow.");
			return;
		}

		try {
			if (follow) {
				await unfollowUser(targetHandle);
				setFollow(false);
				toast.success(`Unfollowed @${targetHandle}`);
			} else {
				await followUser(targetHandle);
				setFollow(true);
				toast.success(`Following @${targetHandle}`);
			}
			if (viewingHandle) {
				dispatch(getProfileCountsByHandle(viewingHandle));
			}
		} catch (error) {
			toast.error("Failed to update follow status");
		}
	};

	// Extract colors from profile image, with user handle as fallback for color generation
	const { dominant, isLoading: colorLoading } = useImageColors(
		profileData?.coverUrl,
		profileData?.handle || profileData?.name,
	);

	// Update gradient colors when dominant color changes
	useEffect(() => {
		const match = dominant.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
		if (match) {
			const [, r, g, b] = match;
			const newColors = {
				start: `rgba(${r}, ${g}, ${b}, 0.4)`,
				middle: `rgba(${r}, ${g}, ${b}, 0.15)`,
			};
			setGradientColors(newColors);
		}
	}, [dominant]);



	useEffect(() => {
		if (status !== "authorized") {
			return;
		}

		// Fetch profile data when component mounts or viewingHandle changes
		if (viewingHandle && viewingHandle !== user?.handle) {
			// Viewing another user's profile
			dispatch(getUserProfileByHandle(viewingHandle));
			dispatch(getProfileCountsByHandle(viewingHandle));
		} else if (!viewingHandle || viewingHandle === user?.handle) {
			// Viewing own profile
			dispatch(getProfileDetials());
			dispatch(getProfileCounts());
		}
	}, [dispatch, viewingHandle, user?.handle, status]);

	// Show skeleton while auth is resolving, and during profile fetches.
	const isAuthLoading = status === "loading" || status === "idle";
	const isProfileCardLoading =
		(!profileData && isAuthLoading) ||
		profileLoading ||
		(!profileData && profileCountsLoading);

	if (isProfileCardLoading) {
		return <SectionCardsSkeleton />;
	}

	if (!profileData) {
		return null; // Or some other fallback if totally missing and not loading
	}

	const UserListDialog = ({
		title,
		label,
		type,
		handle,
	}: {
		title: string;
		label: string;
		type: "followers" | "following";
		handle: string;
	}) => {
		const [isOpen, setIsOpen] = useState(false);
		const [users, setUsers] = useState<any[]>([]);
		const [loading, setLoading] = useState(false);

		useEffect(() => {
			if (isOpen && handle) {
				const fetchUsers = async () => {
					setLoading(true);
					try {
						let data;
						if (type === "followers") {
							data = await getFollowersByHandle(handle);
						} else {
							data = await getFollowingByHandle(handle);
						}
						// If the API returns { status, items } or just an array
						const safeList = Array.isArray(data) ? data : (data as any)?.items || (data as any)?.data || [];
						setUsers(safeList);
					} catch (error) {
						toast.error("Failed to load list");
					} finally {
						setLoading(false);
					}
				};
				fetchUsers();
			}
		}, [isOpen, handle, type]);

		return (
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					<Button
						variant="link"
						className="hover:underline p-0 underline-offset-2 cursor-pointer transition-colors hover:text-foreground"
					>
						{label}
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-md rounded-2xl">
					<DialogHeader>
						<DialogTitle className="text-lg">{title}</DialogTitle>
						<DialogDescription className="sr-only">
							List of users who are {type === "followers" ? "following" : "followed by"} this account.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-1 max-h-[400px] overflow-y-auto">
						{loading ? (
							<div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
						) : users.length === 0 ? (
							<div className="p-4 text-center text-sm text-muted-foreground">No {type} found.</div>
						) : (
							users.map((u) => (
								<div
									key={u.id || u.handle}
									className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/80 transition-colors cursor-pointer"
								>
									<Image
										src={u.avatarUrl || u.avatar || u.coverUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.handle}`}
										alt={u.name || u.handle}
										width={40}
										height={40}
										className="rounded-full bg-muted object-cover w-10 h-10"
									/>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-semibold truncate">{u.name || u.handle}</p>
										<p className="text-xs text-muted-foreground truncate">
											@{u.handle}
										</p>
									</div>
									<Button
										size="sm"
										variant="outline"
										className="text-xs h-8 rounded-lg"
										onClick={() => {
											setIsOpen(false);
											router.push(`/profile/${u.handle}`);
										}}
									>
										View
									</Button>
								</div>
							))
						)}
					</div>
				</DialogContent>
			</Dialog>
		);
	};

	return (
		<div className="w-full space-y-3">
			{/* Unified Profile Card */}
			<div className="w-full bg-background rounded-2xl overflow-hidden inset-shadow-sm">
				{/* Gradient Banner with Extended Fade */}
				<div className="-mb-5">
					{colorLoading ? (
						<Skeleton className="h-28 sm:h-32 rounded-none" />
					) : (
						<div
							key={`gradient-${dominant}`}
							className="h-28 sm:h-32 transition-all duration-500 "
							style={{
								backgroundImage: `linear-gradient(to bottom, ${gradientColors.start}, ${gradientColors.middle}, transparent)`,
							}}
						/>
					)}
				</div>
				{/* Main Content */}
				<div className="px-5 sm:px-6 space-y-0.5">
					{/* Profile Picture & Action Buttons Row */}
					<div className="flex items-end justify-between -mt-12 sm:-mt-14 mb-4">
						{/* Profile Picture */}
						<div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-background overflow-hidden bg-background z-5">
							{profileData.coverUrl ? (
								<Image
									src={profileData.coverUrl}
									alt="Profile"
									width={144}
									height={144}
									priority
									className={`w-full h-full object-cover transition-opacity duration-300 ${avatarLoaded ? "opacity-100" : "opacity-0"}`}
									onLoad={() => setAvatarLoaded(true)}
								/>
							) : (
								<div className="w-full h-full bg-muted flex items-center justify-center">
									<span className="text-2xl sm:text-3xl font-bold text-muted-foreground">
										{profileData.name?.charAt(0)?.toUpperCase() || "?"}
									</span>
								</div>
							)}
						</div>

						{/* Action Buttons */}
						<div className="flex items-center gap-2 mb-1">
							{isOwnProfile && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => setIsEditProfileOpen(true)}
									className="rounded-full px-3 h-8 text-xs gap-1.5 font-medium shadow-sm"
								>
									<PencilIcon size={14} />
								</Button>
							)}
							<SharePopover
								text={`https://bamboo.com/user/profile/${profileData.handle}`}
							>
								<Button
									variant="outline"
									size="sm"
									className="rounded-full px-3 h-8 text-xs gap-1.5 font-medium shadow-sm"
								>
									<IoIosShareAlt size={14} />
								</Button>
							</SharePopover>
						</div>
					</div>

					{/* Name & designation */}
					<div className="mb-3">
						<div className="flex items-center gap-3 flex-wrap ">
							<h1 className="text-xl sm:text-2xl font-bold tracking-tight">
								{profileData.name}
							</h1>
							{profileData.designation && (
								<Badge className="bg-gradient-to-br from-foreground to-foreground/80 hover:from-foreground hover:to-foreground border-0 px-3 py-1 text-[10px] sm:text-xs font-semibold">
									{profileData.designation.charAt(0).toUpperCase() +
										profileData.designation.slice(1).toLowerCase()}
								</Badge>
							)}
						</div>
					</div>

					{/* Description */}
					<p className="text-sm sm:text-[15px] leading-relaxed text-foreground/80">
						{profileData.description ||
							"Welcome to my profile! I'm excited to share my work and connect with the community."}
					</p>

					{/* Stats Row */}
					<div className="flex items-center flex-wrap gap-x-1.5 gap-y-2 text-xs sm:text-sm">
						<span className="items-center text-primary inline-flex justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium">
							<Bookmark className="w-3.5 h-3.5" /> {profileCounts?.bookmarks ?? 0} bookmarks
						</span>
						<span className="text-primary text-2xl">·</span>
						<span className="items-center text-primary inline-flex justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive">
							<MdOutlineArticle className="w-3.5 h-3.5" /> {postCount} posts
						</span>
						<span className="text-primary text-2xl">·</span>
						<span className="items-center text-primary inline-flex justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive">
							<HiOutlineDocumentText className="w-3.5 h-3.5" /> {profileCounts?.docs?.total ?? 0} docs
						</span>
					</div>

					{/* Tags */}
					{profileData.profile?.tags?.length > 0 && (
						<div className="mt-2">
							<div className="flex flex-wrap gap-2">
								{profileData.profile.tags.slice(0, 5).map((tag) => (
									<Badge
										key={tag}
										variant="outline"
										className="rounded-full text-muted-foreground text-[10px] sm:text-xs font-medium px-3 py-1"
									>
										{tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()}
									</Badge>
								))}
								{profileData.profile.tags.length > 5 && (
									<Badge
										variant="outline"
										className="rounded-full  text-[8px] sm:text-[10px] font-medium px-3 py-1 text-muted-foreground"
									>
										+{profileData.profile.tags.length - 5} more
									</Badge>
								)}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Social Links Card */}
			{profileData.profile?.social &&
				Object.keys(profileData.profile.social).length > 0 && (
					<div className="w-full bg-background border border-border rounded-2xl px-5 sm:px-6 py-5">
						<p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-4">
							Find me on
						</p>
						<div className="flex flex-wrap gap-3">
							{Object.entries(profileData.profile.social).map(
								([platform, url]) => {
									const Icon =
										platformIcons[platform as keyof typeof platformIcons];
									const name =
										platformNames[platform as keyof typeof platformNames];
									const hoverColor = platformHoverColors[platform];
									return (
										<Link
											key={platform}
											href={url || ""}
											target="_blank"
											className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground border border-border rounded-full px-4 py-2 transition-all duration-200"
											style={
												hoverColor
													? ({
														"--hover-bg": hoverColor.bg,
														"--hover-text": hoverColor.text,
														"--hover-border": hoverColor.border,
													} as React.CSSProperties)
													: undefined
											}
											onMouseEnter={(e) => {
												if (hoverColor) {
													e.currentTarget.style.backgroundColor = hoverColor.bg;
													e.currentTarget.style.color = hoverColor.text;
													e.currentTarget.style.borderColor = hoverColor.border;
												}
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.backgroundColor = "";
												e.currentTarget.style.color = "";
												e.currentTarget.style.borderColor = "";
											}}
										>
											{Icon && <Icon className="w-3.5 h-3.5" />}
											{name}
										</Link>
									);
								},
							)}
						</div>
					</div>
				)}
			<ProfileEditDialog
				open={isEditProfileOpen}
				onOpenChange={setIsEditProfileOpen}
				onSaved={() => {
					dispatch(getProfileDetials());
					dispatch(getProfileCounts());
				}}
			/>
		</div>
	);
}
