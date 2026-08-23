"use client";

import { X, Moon, Sun, Bell, Github, Twitter, Monitor, Lock, Shield, Eye, Settings, Heart, Plus, Upload, Loader2, Check } from "lucide-react";
import { FaDiscord, FaGithub, FaGlobe, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/shadcnUI/button";
import { useTheme } from "next-themes";
import { Input } from "@/components/shadcnUI/input";
import { Label } from "@/components/shadcnUI/label";

// Simple custom switch component to replace missing shadcn switch
const CustomSwitch = ({ checked = true }: { checked?: boolean }) => {
	const [isOn, setIsOn] = useState(checked);
	return (
		<button
			type="button"
			onClick={() => setIsOn(!isOn)}
			className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
				isOn ? "bg-primary" : "bg-muted-foreground/30"
			}`}
		>
			<div
				className={`bg-background w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
					isOn ? "translate-x-4" : "translate-x-0"
				}`}
			/>
		</button>
	);
};

const platformIcons = {
	GITHUB: FaGithub,
	LINKEDIN: FaLinkedin,
	YOUTUBE: FaYoutube,
	TWITTER: FaTwitter,
	DISCORD: FaDiscord,
	WEBSITE: FaGlobe,
};

const socialPlatforms = [
	{ value: "GITHUB", label: "Github" },
	{ value: "LINKEDIN", label: "LinkedIn" },
	{ value: "YOUTUBE", label: "YouTube" },
	{ value: "TWITTER", label: "Twitter" },
	{ value: "DISCORD", label: "Discord" },
	{ value: "WEBSITE", label: "Website" },
];

interface SocialLink {
	id: string;
	platform: string;
	url: string;
	icon: string;
}

interface ProfileData {
	firstName: string;
	lastName: string;
	designation: string;
	handle: string;
	description: string;
	tags: string[];
	socialLinks: SocialLink[];
	profileImage: string;
}

interface AccountSettingsDialogProps {
	profileData: ProfileData;
	onSave: (data: ProfileData) => void | Promise<void>;
	onCancel: () => void;
	isOpen?: boolean;
}

export const AccountSettingsDialog = ({
	profileData,
	onSave,
	onCancel,
	isOpen = true,
}: AccountSettingsDialogProps) => {
	const [activeTab, setActiveTab] = useState("My Account");
	const { theme, setTheme } = useTheme();

	// Edit Profile States
	const [editData, setEditData] = useState<ProfileData>(profileData);
	const [isSaving, setIsSaving] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	if (!isOpen) return null;

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onCancel();
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [onCancel]);

	const sidebarItems = [
		{
			section: "User Settings",
			items: [
				"My Account",
				"Profiles",
				// Kept in renderTabContent for the upcoming settings work:
				// "Content & Social", "Data & Privacy", "Authorised Apps", "Devices", "Connections",
				"Notifications",
			],
		},
		{ section: "App Settings", items: ["Appearance"] },
	];

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file?.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setEditData({ ...editData, profileImage: reader.result as string });
			};
			reader.readAsDataURL(file);
		}
	};

	const saveChanges = async () => {
		setIsSaving(true);
		try {
			await onSave(editData);
			setIsSaved(true);
			setTimeout(() => setIsSaved(false), 2000);
		} catch (error) {
			console.error("Failed to save profile", error);
		} finally {
			setIsSaving(false);
		}
	};

	const renderTabContent = () => {
		switch (activeTab) {
			case "Profiles":
				const predefinedTags = [
					"DEVELOPER", "DESIGNER", "WRITER", "PHOTOGRAPHER", "CREATOR", "ARTIST", 
					"ENGINEER", "ENTREPRENEUR", "STUDENT", "TEACHER", "MANAGER", "FREELANCER", 
					"PRODUCT_MANAGER", "DATA_SCIENTIST", "DEVOPS", "QA_ENGINEER", "BACKEND", 
					"FRONTEND", "FULL_STACK", "MOBILE_DEV", "UI_UX", "CONTENT_CREATOR"
				];
				const designations = [
					"DEVELOPER", "DESIGNER", "PRODUCT_MANAGER", "DATA_SCIENTIST", "DEVOPS_ENGINEER", 
					"QA_ENGINEER", "STUDENT", "EDUCATOR", "FOUNDER", "ENTREPRENEUR", "WRITER", 
					"CREATOR", "OTHER"
				];
				return (
					<div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-bold">Profiles</h2>
							<div className="flex gap-3">
								<Button variant="outline" size="sm" onClick={() => setEditData(profileData)}>Reset</Button>
								<Button size="sm" onClick={saveChanges} disabled={isSaving || isSaved}>
									{isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : isSaved ? <Check className="w-4 h-4 mr-2" /> : null}
									{isSaved ? "Saved" : "Save Changes"}
								</Button>
							</div>
						</div>

						<div className="bg-card rounded-lg border p-6 space-y-8">
							{/* Profile Picture */}
							<div className="space-y-4">
								<h3 className="text-sm font-bold text-muted-foreground uppercase">Avatar</h3>
								<div className="flex items-center gap-6">
									<div className="relative w-24 h-24 rounded-full border-4 border-muted overflow-hidden bg-background">
										{editData.profileImage ? (
											<Image src={editData.profileImage} alt="Avatar" fill className="object-cover" />
										) : (
											<div className="w-full h-full bg-primary" />
										)}
									</div>
									<div className="space-y-2">
										<p className="text-sm text-muted-foreground">We recommend an image of at least 512x512 for the profile.</p>
										<Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
											<Upload className="w-4 h-4 mr-2" /> Change Avatar
										</Button>
										<input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
									</div>
								</div>
							</div>
							
							<div className="h-px bg-border my-2" />

							{/* Personal Info */}
							<div className="grid gap-6 sm:grid-cols-2">
								<div className="space-y-2">
									<Label>First Name</Label>
									<Input value={editData.firstName} onChange={(e) => setEditData({...editData, firstName: e.target.value})} className="bg-muted" />
								</div>
								<div className="space-y-2">
									<Label>Last Name</Label>
									<Input value={editData.lastName} onChange={(e) => setEditData({...editData, lastName: e.target.value})} className="bg-muted" />
								</div>
							</div>

							<div className="space-y-2">
								<Label>Username / Handle</Label>
								<Input value={editData.handle} onChange={(e) => setEditData({...editData, handle: e.target.value})} className="bg-muted" />
							</div>

							<div className="space-y-2">
								<Label>About Me</Label>
								<textarea 
									className="w-full h-24 p-3 rounded-md bg-muted border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50" 
									value={editData.description} 
									onChange={(e) => setEditData({...editData, description: e.target.value})}
									placeholder="Tell people about yourself..."
								/>
							</div>

							<div className="grid gap-8">
								<div className="space-y-4">
									<div>
										<Label className="text-base font-semibold">
											What best describes you?
										</Label>
									</div>
									<div className="flex flex-wrap gap-2.5">
										{designations.map((desig) => (
											<button
												key={desig}
												type="button"
												onClick={() => setEditData({...editData, designation: desig})}
												className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
													editData.designation === desig
														? "bg-foreground text-background border-foreground shadow-md"
														: "bg-background text-foreground border-border hover:border-foreground/60 hover:shadow-sm"
												}`}
											>
												{desig.split("_").map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ")}
											</button>
										))}
									</div>
								</div>

								<div className="space-y-4">
									<div className="space-y-1">
										<Label className="text-base font-semibold">Select your interests</Label>
										<p className="text-sm text-muted-foreground">
											Choose one or more tags that represent your skills and passions
										</p>
									</div>
									<div className="flex flex-wrap gap-2.5 mb-3">
										{predefinedTags.map((tag) => (
											<button
												key={tag}
												type="button"
												onClick={() => {
													const newTags = editData.tags.includes(tag) 
														? editData.tags.filter(t => t !== tag)
														: [...editData.tags, tag];
													setEditData({...editData, tags: newTags});
												}}
												className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
													editData.tags.includes(tag)
														? "bg-foreground text-background border-foreground shadow-md"
														: "bg-background text-foreground border-border hover:border-foreground/60 hover:shadow-sm"
												}`}
											>
												{tag.split("_").map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ")}
											</button>
										))}
									</div>
								</div>
							</div>

							<div className="h-px bg-border my-2" />

							{/* Social Links */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label className="text-lg font-semibold">
										Social Links ({editData.socialLinks.length}/5)
									</Label>
									<Button 
										type="button" 
										variant="outline" 
										size="sm" 
										className="h-9 px-4 transition-transform"
										onClick={() => {
											if (editData.socialLinks.length < 5) {
												setEditData({
													...editData, 
													socialLinks: [...editData.socialLinks, { id: Date.now().toString(), platform: "GITHUB", url: "", icon: "GITHUB" }]
												});
											}
										}}
										disabled={editData.socialLinks.length >= 5}
									>
										<Plus className="w-4 h-4 mr-2" /> Add Link
									</Button>
								</div>
								
								{editData.socialLinks.length === 0 ? (
									<div className="text-sm text-muted-foreground text-center py-10 border-2 border-dashed rounded-xl bg-muted/20">
										No social links added yet. Click &quot;Add Link&quot; to add one.
									</div>
								) : (
									<div className="space-y-4">
										{editData.socialLinks.map((link, index) => {
											const IconComponent = platformIcons[link.icon as keyof typeof platformIcons] || FaGlobe;
											return (
												<div key={link.id || index} className="flex items-end gap-3 p-4 border-2 rounded-xl bg-muted/40 hover:bg-muted/60 hover:border-border/80 transition-all shadow-sm">
													<div className="grid flex-1 gap-3">
														<Label className="text-sm font-semibold">Platform</Label>
														<div className="relative">
															<div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
																<IconComponent className="h-4 w-4 text-muted-foreground" />
															</div>
															<select 
																value={link.platform} 
																onChange={(e) => {
																	const newLinks = [...editData.socialLinks];
																	newLinks[index].platform = e.target.value;
																	newLinks[index].icon = e.target.value;
																	setEditData({...editData, socialLinks: newLinks});
																}}
																className="h-11 w-full pl-9 pr-3 py-2 bg-transparent border border-border rounded-md text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary appearance-none box-border m-0 max-w-full truncate"
																style={{ width: '130px' }}
															>
																{socialPlatforms.map(platform => (
																	<option key={platform.value} value={platform.value}>
																		{platform.label}
																	</option>
																))}
															</select>
														</div>
													</div>
													<div className="grid flex-[2] gap-3">
														<Label className="text-sm font-semibold">URL</Label>
														<Input 
															value={link.url}
															placeholder={`https://${link.platform.toLowerCase()}.com/username`}
															onChange={(e) => {
																const newLinks = [...editData.socialLinks];
																newLinks[index].url = e.target.value;
																setEditData({...editData, socialLinks: newLinks});
															}}
															className="h-11 transition-all"
														/>
													</div>
													<Button 
														type="button" 
														variant="destructive" 
														size="icon" 
														className="h-11 px-3 transition-transform shrink-0"
														onClick={() => {
															const newLinks = [...editData.socialLinks];
															newLinks.splice(index, 1);
															setEditData({...editData, socialLinks: newLinks});
														}}
													>
														<X className="w-4 h-4" />
													</Button>
												</div>
											);
										})}
									</div>
								)}
							</div>
						</div>
					</div>
				);

			case "Content & Social":
				return (
					<div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<h2 className="text-xl font-bold mb-6">Content & Social</h2>
						<div className="bg-card rounded-lg border p-6 space-y-6">
							<div className="space-y-2">
								<h3 className="font-semibold text-lg flex items-center gap-2"><Lock className="w-4 h-4" /> Who can message you?</h3>
								<p className="text-sm text-muted-foreground">Manage who can send you direct messages.</p>
								<div className="flex items-center justify-between pt-2">
									<span className="text-sm font-medium">Allow server members to DM you</span>
									<CustomSwitch checked={true} />
								</div>
							</div>
							<div className="h-px bg-border my-4" />
							<div className="space-y-4">
								<h3 className="font-semibold text-lg flex items-center gap-2"><Eye className="w-4 h-4" /> Content Filters</h3>
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">Filter Explicit Media</span>
									<select defaultValue="safe" className="bg-muted border-border border rounded-md px-3 py-1.5 text-sm">
										<option value="safe">Safe Search</option>
										<option value="blur">Blur Sensitive</option>
										<option value="off">Off</option>
									</select>
								</div>
							</div>
						</div>
					</div>
				);

			case "Data & Privacy":
				return (
					<div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<h2 className="text-xl font-bold mb-6">Data & Privacy</h2>
						<div className="bg-card border rounded-lg p-6 space-y-6">
							<div className="space-y-2">
								<h3 className="font-semibold text-lg flex items-center gap-2"><Shield className="w-4 h-4" /> How We Use Your Data</h3>
								<p className="text-sm text-muted-foreground">We use your data to improve our services and suggest relevant content.</p>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Use data to improve our products</span>
								<CustomSwitch checked={true} />
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Personalised recommendations</span>
								<CustomSwitch checked={true} />
							</div>
							<div className="h-px bg-border my-4" />
							<Button variant="destructive" className="w-full sm:w-auto">Request Data Archive</Button>
						</div>
					</div>
				);

			case "Appearance":
				return (
					<div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<h2 className="text-xl font-bold mb-6">Appearance</h2>
						<div className="bg-card rounded-lg border p-6 space-y-6">
							<div>
								<h3 className="text-sm font-bold text-muted-foreground uppercase mb-4">Theme</h3>
								<div className="flex gap-4">
									<button 
										onClick={() => setTheme('light')}
										className={`flex-1 p-4 rounded-lg flex flex-col items-center gap-3 border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground/50'}`}
									>
										<div className="w-12 h-12 bg-[#e2e8f0] rounded-full flex items-center justify-center">
											<Sun className="w-6 h-6 text-yellow-600" />
										</div>
										<span className="font-medium text-sm">Light</span>
									</button>
									<button 
										onClick={() => setTheme('dark')}
										className={`flex-1 p-4 rounded-lg flex flex-col items-center gap-3 border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground/50'}`}
									>
										<div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
											<Moon className="w-6 h-6 text-white" />
										</div>
										<span className="font-medium text-sm">Dark</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				);
				
			case "Authorised Apps":
				return (
					<div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<h2 className="text-xl font-bold mb-6">Authorised Apps</h2>
						<div className="bg-card rounded-lg border p-6 space-y-6">
							<p className="text-sm text-muted-foreground">Here are the apps that have access to your account. You can deauthorize any of them at any time.</p>
							<div className="space-y-4">
								<div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
									<div className="flex items-center gap-4">
										<div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
											<Settings className="w-5 h-5 text-primary" />
										</div>
										<div>
											<h4 className="font-semibold text-sm">Example Bot</h4>
											<p className="text-xs text-muted-foreground">Authorized on Oct 12, 2023</p>
										</div>
									</div>
									<Button variant="destructive" size="sm">Deauthorize</Button>
								</div>
							</div>
						</div>
					</div>
				);

			case "Connections":
				return (
					<div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<h2 className="text-xl font-bold mb-6">Connections</h2>
						<div className="bg-card rounded-lg border p-6 space-y-6">
							<p className="text-sm text-muted-foreground">Connect your accounts to unlock special integrations on your profile.</p>
							<div className="grid gap-4 sm:grid-cols-2">
								<Button variant="outline" className="h-16 flex justify-start items-center gap-4 px-4 bg-muted/50 hover:bg-muted">
									<Github className="w-6 h-6" />
									<div className="flex flex-col items-start leading-tight">
										<span className="font-semibold">GitHub</span>
										<span className="text-xs text-muted-foreground">Connect Account</span>
									</div>
								</Button>
								<Button variant="outline" className="h-16 flex justify-start items-center gap-4 px-4 bg-muted/50 hover:bg-muted">
									<Twitter className="w-6 h-6 text-blue-400" />
									<div className="flex flex-col items-start leading-tight">
										<span className="font-semibold">Twitter / X</span>
										<span className="text-xs text-muted-foreground">Connect Account</span>
									</div>
								</Button>
							</div>
						</div>
					</div>
				);

			case "Notifications":
				return (
					<div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<h2 className="text-xl font-bold mb-6">Notifications</h2>
						<div className="bg-card rounded-lg border p-6 space-y-6">
							<div className="flex items-center gap-3 text-lg font-semibold border-b pb-4">
								<Bell className="w-5 h-5 text-primary" />
								Push Notifications
							</div>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div>
										<span className="text-sm font-medium d-block">Enable Push Notifications</span>
										<div className="text-xs text-muted-foreground">Get notified about activity when you&apos;re not active.</div>
									</div>
									<CustomSwitch checked={true} />
								</div>
								<div className="flex items-center justify-between">
									<div>
										<span className="text-sm font-medium d-block">Mentions and Replies</span>
										<div className="text-xs text-muted-foreground">Notify me when someone mentions me.</div>
									</div>
									<CustomSwitch checked={true} />
								</div>
							</div>
						</div>
					</div>
				);

			case "Devices":
				return (
					<div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<h2 className="text-xl font-bold mb-6">Devices</h2>
						<div className="bg-card rounded-lg border p-6">
							<div className="flex items-center justify-between border-b border-border pb-4 mb-4">
								<div className="flex items-center gap-4">
									<div className="bg-primary/20 p-3 rounded-lg"><Monitor className="w-6 h-6 text-primary" /></div>
									<div>
										<h4 className="font-semibold text-sm">Mac - Chrome (Current)</h4>
										<span className="text-xs text-green-500 font-medium tracking-wide">ACTIVE NOW</span> <span className="text-xs text-muted-foreground">&bull; India</span>
									</div>
								</div>
							</div>
							<Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-500/10">Log out of all other devices</Button>
						</div>
					</div>
				);

			case "My Account":
			default:
				return (
					<div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
						{/* Profile Card */}
						<div className="bg-card rounded-xl overflow-hidden border shadow-sm">
							{/* Banner */}
							<div className="h-[120px] w-full bg-gradient-to-r from-emerald-200 to-lime-200 dark:from-emerald-900 dark:to-lime-900" />

							{/* Info Section */}
							<div className="px-6 pb-6 pt-3 relative">
								{/* Avatar */}
								<div className="absolute -top-16 left-6 w-28 h-28 rounded-full border-[6px] border-card overflow-hidden bg-muted flex items-center justify-center shadow-sm">
									{profileData.profileImage ? (
										<Image
											src={profileData.profileImage}
											alt="Profile"
											fill
											className="object-cover"
										/>
									) : (
										<div className="w-full h-full bg-primary" />
									)}
								</div>

								{/* Header Controls */}
								<div className="flex justify-between items-start mb-6 w-full pl-32">
									<h3 className="text-2xl font-bold leading-tight">
										{profileData.firstName} {profileData.lastName}
									</h3>
									<Button size="sm" className="font-medium rounded-md" onClick={() => setActiveTab("Profiles")}>
										Edit User Profile
									</Button>
								</div>

								{/* Details Box */}
								<div className="bg-muted/40 rounded-xl p-5 mt-8 border border-border/50 shadow-inner">
									<div className="space-y-6">
										<div className="flex justify-between items-center group cursor-pointer text-foreground">
											<div>
												<div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Display Name</div>
												<div className="text-sm font-medium">{profileData.firstName} {profileData.lastName}</div>
											</div>
											<Button variant="secondary" size="sm" className="font-medium transition-colors" onClick={() => setActiveTab("Profiles")}>
												Edit
											</Button>
										</div>

										<div className="flex justify-between items-center group cursor-pointer text-foreground">
											<div>
												<div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Username</div>
												<div className="text-sm font-medium">{profileData.handle || "No username"}</div>
											</div>
											<Button variant="secondary" size="sm" className="font-medium transition-colors" onClick={() => setActiveTab("Profiles")}>
												Edit
											</Button>
										</div>

										{/* Email settings are retained for the later account-management release.
										<div className="flex justify-between items-center group cursor-pointer text-muted-foreground">
											<div>
												<div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Email</div>
												<div className="text-sm">You haven&apos;t added an email yet.</div>
											</div>
											<Button variant="secondary" size="sm" className="font-medium transition-colors" onClick={() => setActiveTab("Profiles")}>
												Add
											</Button>
										</div>
										*/}

										{/* Phone settings are retained for the later account-management release.
										<div className="flex justify-between items-center group cursor-pointer">
											<div>
												<div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Phone Number</div>
												<div className="text-sm font-medium flex items-center">
													*********8410 <span className="text-primary cursor-pointer hover:underline ml-3 text-xs">Reveal</span>
												</div>
											</div>
											<Button variant="secondary" size="sm" className="font-medium transition-colors" onClick={() => setActiveTab("Profiles")}>
												Edit
											</Button>
										</div>
										*/}
									</div>
								</div>
							</div>
						</div>

						{/* Password and authentication controls are retained for a future release.
						<div className="mt-10 border-t pt-8">
							<h3 className="text-xl font-bold mb-5 flex items-center gap-2">
								<Lock className="w-5 h-5 text-muted-foreground" />
								Password and Authentication
							</h3>
							<Button size="sm" className="font-medium">
								Change Password
							</Button>
							<div className="mt-8">
								<h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Authenticator App</h4>
								<div className="p-5 rounded-xl border border-yellow-500/30 bg-yellow-500/5 dark:bg-yellow-500/10 flex flex-col gap-3 shadow-inner">
									<div className="flex items-start gap-4">
										<Shield className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
										<div className="flex flex-col gap-3">
											<p className="text-sm text-muted-foreground leading-relaxed">Protect your account with an extra layer of security. Once configured you&apos;ll be required to enter both your password and an authentication code from your mobile phone in order to sign in.</p>
											<Button size="sm" className="w-fit">
												Enable Authenticator App
											</Button>
										</div>
									</div>
								</div>
							</div>
						</div>
						*/}
					</div>
				);
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-3 backdrop-blur-sm animate-in fade-in duration-200 md:p-6">
			<div className="flex h-[85vh] w-[92vw] overflow-hidden rounded-2xl border border-border bg-card text-foreground shadow-2xl md:w-[58vw]">
				<div className="flex h-full w-full flex-col md:flex-row">
					{/* Left Sidebar */}
					<aside className="w-full shrink-0 border-b border-border bg-muted/40 md:h-full md:w-[270px] md:border-b-0 md:border-r">
						<div className="h-full p-3 md:p-4">
							<div className="h-[190px] overflow-y-auto pr-1 custom-scroll md:h-full">
								{sidebarItems.map((group, i) => (
									<div key={i} className="mb-5">
										<h3 className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
											{group.section}
										</h3>
										<div className="space-y-0.5">
											{group.items.map((item) => (
												<button
													key={item}
													type="button"
													onClick={() => setActiveTab(item)}
													className={`w-full rounded-md px-2 py-2 text-left text-sm font-medium transition-colors ${
														activeTab === item
															? "bg-accent text-accent-foreground"
															: "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
													}`}
												>
													{item}
													{item === "Family Centre" && (
														<span className="ml-2 rounded-sm bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
															New
														</span>
													)}
												</button>
											))}
										</div>
										{i < sidebarItems.length - 1 && (
											<div className="mx-2 my-4 h-px bg-border" />
										)}
									</div>
								))}
							</div>
						</div>
					</aside>

					{/* Main Content */}
					<section className="relative min-h-0 flex-1 bg-background">
						<div className="flex h-12 items-center justify-between border-b border-border px-4 md:h-14 md:px-6">
							<div className="flex items-center gap-2">
								<button
									type="button"
									onClick={onCancel}
									className="group flex h-3 w-3 items-center justify-center rounded-full bg-red-500"
									aria-label="Close settings"
									title="Close (Esc)"
								>
									<X className="h-2.5 w-2.5 text-black/70 opacity-0 transition-opacity group-hover:opacity-100" />
								</button>
								<span className="h-3 w-3 rounded-full bg-yellow-400" />
								<span className="h-3 w-3 rounded-full bg-green-500" />
							</div>
							<h2 className="text-sm font-semibold md:text-base">{activeTab}</h2>
							<div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
								Esc
							</div>
						</div>
						<div className="h-[calc(100%-48px)] overflow-y-auto px-4 py-5 custom-scroll md:h-[calc(100%-56px)] md:px-8 md:py-8">
							<div className="max-w-[760px]">{renderTabContent()}</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};
