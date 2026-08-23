import { AnimatePresence, motion } from "framer-motion";
import { UserCheck, UserPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/shadcnUI/avatar";
import { Badge } from "@/components/shadcnUI/badge";
import { Button } from "@/components/shadcnUI/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/shadcnUI/hover-card";
import api from "@/api/axios";
import type { Profile } from "@/types/Profile/profile-types";
import { followUser, unfollowUser } from "@/api/followApi";
import { toast } from "sonner";
import { useAppState } from "@/hooks/ReduxHooks";

const profileCache = new Map<string, Profile | null>();

export function ProfileHoverTag({ profileId, name }: { profileId?: string; name?: string }) {
	const { user } = useAppState((s) => s.userReducer);
	const [follow, setFollow] = useState(false);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [notFound, setNotFound] = useState(false);
	const userId = profileId?.trim() || "";
	const displayName = name?.trim() || "Unknown writer";
	const displayHandle = "";
	const profileName = profile?.name?.trim() || displayName;
	const profileDesignation = profile?.designation?.trim() || "Member";

	useEffect(() => {
		if (!open || !userId) {
			return;
		}

		if (profileCache.has(userId)) {
			const cachedProfile = profileCache.get(userId) ?? null;
			setProfile(cachedProfile);
			setNotFound(cachedProfile === null);
			return;
		}

		let ignore = false;

		const loadProfile = async () => {
			setLoading(true);
			setNotFound(false);
			try {
				const apiVersion = process.env.NEXT_PUBLIC_API_VERSION ?? "/api/v1";
				const url = `${apiVersion}/community/users/${userId}`;
				const response = await api.get<Profile>(url);
				if (!ignore) {
					profileCache.set(userId, response.data);
					setProfile(response.data);
					setFollow(response.data.isFollowing || false);
					setNotFound(false);
				}
			} catch (error: any) {
				if (!ignore) {
					profileCache.set(userId, null);
					setProfile(null);
					setNotFound(error?.response?.status === 404);
				}
			} finally {
				if (!ignore) {
					setLoading(false);
				}
			}
		};

		loadProfile();

		return () => {
			ignore = true;
		};
	}, [userId, open]);

	if (!userId) {
		return (
			<span className="text-sm text-muted-foreground italic flex items-center gap-1 font-medium">
				{displayName}
			</span>
		);
	}

	const handleFollowToggle = async () => {
		if (!user) {
			toast.error("Please log in first");
			return;
		}
		
		const targetHandle = userId;
		if (!targetHandle) {
			toast.error("User profile not found");
			return;
		}
		
		try {
			if (follow) {
				await unfollowUser(targetHandle);
				setFollow(false);
				toast.success(`Unfollowed @${targetHandle}`);
				if (profileCache.has(targetHandle)) {
					const cached = profileCache.get(targetHandle);
					if (cached) cached.isFollowing = false;
				}
			} else {
				await followUser(targetHandle);
				setFollow(true);
				toast.success(`Following @${targetHandle}`);
				if (profileCache.has(targetHandle)) {
					const cached = profileCache.get(targetHandle);
					if (cached) cached.isFollowing = true;
				}
			}
		} catch (error) {
			toast.error("Failed to update follow status");
		}
	};

	return (
		<HoverCard
			key={profileId}
			openDelay={50}
			closeDelay={50}
			open={open}
			onOpenChange={setOpen}
		>
			<HoverCardTrigger asChild>
				<span className="text-sm text-muted-foreground italic flex items-center gap-1 font-medium cursor-default">
					{displayName}
				</span>
			</HoverCardTrigger>
			<HoverCardContent
				className="w-64 border-2 shadow-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-4"
				side="right"
				align="start"
			>
				{notFound ? (
					<div className="space-y-2">
						<h4 className="text-sm font-bold text-foreground">User not found</h4>
						<p className="text-xs text-muted-foreground">
							This profile does not exist or is no longer available.
						</p>
					</div>
				) : (
					<>
						<div className="flex gap-3 mb-3">
							<Avatar className="w-14 h-14 flex-shrink-0">
								<AvatarImage
									src={
										profile?.coverUrl ||
										`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profileName)}`
									}
								/>
								<AvatarFallback>{profileName.slice(0, 2).toUpperCase()}</AvatarFallback>
							</Avatar>

							<div className="flex flex-col flex-1 min-w-0">
								<h4 className="text-sm font-bold text-foreground truncate">
									{loading ? "Loading..." : profileName}
								</h4>
								<p className="text-xs text-muted-foreground mb-1.5">{displayHandle}</p>
								<Badge className="bg-gradient-to-br from-foreground to-foreground/80 hover:from-foreground hover:to-foreground border-0 px-2 py-0.5 text-[10px] font-semibold w-fit">
									{profileDesignation}
								</Badge>
							</div>
						</div>

						<div className="flex items-center justify-around py-2 border-y border-border/50 mb-3">
							<div className="flex flex-col items-center">
								<span className="text-sm font-bold text-foreground">1.2K</span>
								<span className="text-[10px] text-muted-foreground">Followers</span>
							</div>
							<div className="w-px h-8 bg-border"></div>
							<div className="flex flex-col items-center">
								<span className="text-sm font-bold text-foreground">324</span>
								<span className="text-[10px] text-muted-foreground">Following</span>
							</div>
						</div>

						<div className="flex gap-2">
							<motion.div
								className="flex-1"
								whileTap={{ scale: 0.96 }}
								transition={{ type: "spring", stiffness: 400, damping: 17 }}
							>
								<Button
									onClick={handleFollowToggle}
									variant={follow ? "outline" : "default"}
									size="sm"
									className="w-full rounded-full px-4 h-9 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group"
								>
									<AnimatePresence mode="wait">
										<motion.div
											key={follow ? "following" : "follow"}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											transition={{ duration: 0.2 }}
											className="flex items-center gap-2"
										>
											{follow ? (
												<>
													<UserCheck className="w-4 h-4" />
													<span>Following</span>
												</>
											) : (
												<>
													<UserPlus className="w-4 h-4" />
													<span>Follow</span>
												</>
											)}
										</motion.div>
									</AnimatePresence>

									<motion.div
										className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
										initial={{ x: "-100%" }}
										whileHover={{ x: "100%" }}
										transition={{ duration: 0.6 }}
									/>
								</Button>
							</motion.div>

							<Button asChild variant="outline" size="sm" className="rounded-full px-4 h-9">
								<Link href={`/profile/${userId}`}>Show profile</Link>
							</Button>
						</div>
					</>
				)}
			</HoverCardContent>
		</HoverCard>
	);
}
