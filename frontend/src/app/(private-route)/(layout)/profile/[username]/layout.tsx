"use client";
import { UserX } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { ProfileRoutes, ProfileTabProvider } from "@/components/atomsComponents";
import { SectionCards } from "@/components/atomsComponents/sectionCard";
import { Button } from "@/components/shadcnUI/button";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import {
	getUserProfileByHandle,
	resetProfileCollections,
	resetProfileView,
} from "@/store/reducers/Profile/profile.read";
import React from "react";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const params = useParams();
	const username = params.username as string;
	const dispatch = useAppDispatch();
	const { user } = useAppState((s) => s.userReducer);
	const { profileError, profileLoading } = useAppState((s) => s.getProfileReducers);
	const [selectedTab, setSelectedTab] = React.useState("all");

	// Remove @ symbol if present
	const handle = username?.startsWith("@") ? username.slice(1) : username;

	// Determine if viewing own profile
	const isOwnProfile = handle === user?.handle;

	// Conditionally include Bookmarks tab only for own profile
	const tabs = useMemo(() => {
		const baseTabs = [
			{ label: "All", value: "all" },
			{ label: "Posts", value: "posts" },
			{ label: "Docs", value: "docs" },
		];

		if (isOwnProfile) {
			baseTabs.push({ label: "Bookmarks", value: "bookmark" });
		}

		return baseTabs;
	}, [isOwnProfile]);

	const handleTabChange = (selecttab: string) => {
		setSelectedTab(selecttab);
	};

	useEffect(() => {
		if (!handle || handle === user?.handle) {
			return;
		}

		dispatch(resetProfileView());
		dispatch(resetProfileCollections());
		dispatch(getUserProfileByHandle(handle));
	}, [dispatch, handle, user?.handle]);

	// Show error UI if profile not found
	if (!profileLoading && profileError) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
				<UserX className="w-24 h-24 text-muted-foreground" />
				<h2 className="text-3xl font-bold">User Not Found</h2>
				<p className="text-muted-foreground text-center max-w-md">
					The user you're looking for doesn't exist or has been removed.
				</p>
				<div className="flex gap-3 pt-4">
					<Link href="/profile">
						<Button variant="default">Go to Your Profile</Button>
					</Link>
					<Link href="/">
						<Button variant="outline">Back to Home</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			<div className="mx-auto py-8 space-y-6 container">
				<SectionCards viewingHandle={handle} />
				<div className="sticky top-[56px] z-10 bg-background/30 backdrop-blur-md -mx-4 px-4 my-0">
					<div>
						<ProfileRoutes tabs={tabs} onTabChange={handleTabChange} />
					</div>
				</div>
				<ProfileTabProvider
					value={{ selectedTab, setSelectedTab: handleTabChange }}
				>
					<div>{children}</div>
				</ProfileTabProvider>
			</div>
		</div>
	);
}
