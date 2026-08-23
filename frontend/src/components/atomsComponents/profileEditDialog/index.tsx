"use client";

import { useCallback, useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "@/api/userApi";
import { AccountSettingsDialog } from "@/components/atomsComponents/accountSettingsDialog";
import type { userUpdatePayload } from "@/types/user/user-base";

interface ProfileFormData {
	firstName: string;
	lastName: string;
	designation: string;
	handle: string;
	description: string;
	tags: string[];
	socialLinks: Array<{
		id: string;
		platform: string;
		url: string;
		icon: string;
	}>;
	profileImage: string;
}

interface ProfileEditDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSaved?: () => void;
}

export function ProfileEditDialog({
	open,
	onOpenChange,
	onSaved,
}: ProfileEditDialogProps) {
	const [profileData, setProfileData] = useState<ProfileFormData | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchUserProfile = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const data = await getUserProfile();

			const socialLinks = data.profile?.social
				? Object.entries(data.profile.social).map(([platform, url], index) => ({
						id: `${platform}-${index}`,
						platform,
						url,
						icon: platform,
					}))
				: [];

			const formattedData: ProfileFormData = {
				firstName: data.name.split(" ")[0] || "",
				lastName: data.name.split(" ").slice(1).join(" ") || "",
				designation: data.designation || "",
				handle: data.handle || "",
				description: data.description || "",
				tags: data.profile?.tags || [],
				socialLinks,
				profileImage: data.coverUrl || "https://github.com/shadcn.png",
			};

			setProfileData(formattedData);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to load profile data",
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		if (!open) return;
		fetchUserProfile();
	}, [open, fetchUserProfile]);

	const handleSave = async (data: ProfileFormData) => {
		try {
			setIsLoading(true);
			setError(null);

			const socialObject = data.socialLinks.reduce(
				(acc, link) => {
					acc[link.platform] = link.url;
					return acc;
				},
				{} as Record<string, string>,
			);

			const updateData: userUpdatePayload = {
				name: `${data.firstName} ${data.lastName}`.trim(),
				handle: data.handle,
				description: data.description,
				designation: data.designation,
				coverUrl: data.profileImage,
				userProfile: {
					tags: data.tags,
					social: socialObject,
				},
			};

			await updateUserProfile(updateData);
			onOpenChange(false);
			onSaved?.();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to save profile");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		onOpenChange(false);
	};

	if (!open) return null;

	if (error && !profileData) {
		return (
			<div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/90 p-4 backdrop-blur-sm">
				<div className="max-w-sm rounded-lg border border-red-500/30 bg-card p-6 text-center">
					<p className="font-medium text-red-500">Error loading profile</p>
					<p className="mt-2 text-sm text-muted-foreground">{error}</p>
					<button
						type="button"
						onClick={fetchUserProfile}
						className="mt-4 rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
					>
						Retry
					</button>
					<button
						type="button"
						onClick={handleCancel}
						className="ml-2 mt-4 rounded border px-4 py-2 text-sm"
					>
						Close
					</button>
				</div>
			</div>
		);
	}

	if (!profileData) return null;

	return (
		<AccountSettingsDialog
			profileData={profileData}
			onSave={handleSave}
			onCancel={handleCancel}
			isOpen={open}
		/>
	);
}
