"use client";
import {
	AlertCircle,
	Archive,
	CheckCircle,
	Eye,
	EyeOff,
	FileText,
	Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/shadcnUI/button";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxValue,
	useComboboxAnchor,
} from "@/components/shadcnUI/combobox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/shadcnUI/dialog";
import { Input } from "@/components/shadcnUI/input";
import { Label } from "@/components/shadcnUI/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/shadcnUI/select";
import { useAppDispatch } from "@/hooks/ReduxHooks";
import api from "@/api/axios";
import { useTagCatalog } from "@/hooks/useTagCatalog";
import {
	CreateNewBlog,
	CreateNewDocs,
} from "@/store/reducers/CreateCoverDetialsBlogDocs";

interface CreateContentProps {
	title: string;
	coverUrl: string;
	description: string;
	tags: string[];
	visibility?: "public" | "unlisted" | "private";
}

interface BlogUpdateDetailsProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

export const BlogUpdateDetails = ({
	open,
	setOpen,
}: BlogUpdateDetailsProps) => {
	const [tags, setTags] = useState<string[]>([]);
	const { interests: managedTags } = useTagCatalog();
	const predefinedTags = managedTags;

	const router = useRouter();
	const dispatch = useAppDispatch();
	const anchor = useComboboxAnchor();
	const type = "blog";
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [visibility, setVisibility] = useState<"public" | "unlisted" | "private">("public");
	const [status, setStatus] = useState<"draft" | "publish" | "archived">(
		"publish",
	);
	const defaultCoverUrl = "";
	const [coverUrl, setCoverUrl] = useState<string>(defaultCoverUrl);
	const [coverUrlInput, setCoverUrlInput] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});
	const [coverError, setCoverError] = useState<string>("");

	const isLikelyImageUrl = useMemo(
		() => (value: string) => {
			const trimmed = value.trim();
			if (!trimmed) return false;
			if (trimmed.startsWith("data:image/")) return true;
			if (!/^https?:\/\//i.test(trimmed)) return false;
			return /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(trimmed);
		},
		[],
	);

	const setCoverFromFile = (file: File) => {
		if (!file.type.startsWith("image/")) {
			setCoverError("Please select a valid image file.");
			return;
		}
		setCoverError("");
		const reader = new FileReader();
		reader.onloadend = () => {
			setCoverUrl(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	const handleCoverUrlApply = () => {
		const trimmed = coverUrlInput.trim();
		if (!trimmed) {
			setCoverError("Please paste an image URL.");
			return;
		}
		if (!isLikelyImageUrl(trimmed)) {
			setCoverError("Please paste a valid image URL.");
			return;
		}
		setCoverError("");
		setCoverUrl(trimmed);
	};

	const handleCoverPaste = (
		e: React.ClipboardEvent<HTMLDivElement | HTMLInputElement>,
	) => {
		const items = Array.from(e.clipboardData.items || []);
		const imageItem = items.find((item) => item.type.startsWith("image/"));
		if (imageItem) {
			const file = imageItem.getAsFile();
			if (file) {
				e.preventDefault();
				setCoverFromFile(file);
			}
			return;
		}
		const text = e.clipboardData.getData("text");
		if (text && isLikelyImageUrl(text)) {
			setCoverUrlInput(text.trim());
			setCoverUrl(text.trim());
			setCoverError("");
		}
	};

	// Reset form when dialog closes
	useEffect(() => {
		if (!open) {
			const timer = setTimeout(() => {
				setTitle("");
				setDescription("");
				setTags([]);
				setVisibility("public");
				setStatus("publish");
				setFormErrors({});
				setCoverError("");
				setCoverUrl(defaultCoverUrl);
				setCoverUrlInput("");
				setLoading(false);
			}, 150);
			return () => clearTimeout(timer);
		}
	}, [open]);

	// Reset visibility to public when status changes from publish
	useEffect(() => {
		if (status !== "publish") {
			setVisibility("public");
		}
	}, [status]);

	const validateForm = () => {
		const errors: Record<string, string> = {};

		if (!type) errors.type = "Please select a content type.";
		if (!title.trim()) errors.title = "Title is required.";
		if (!(title.length >= 5))
			errors.title = "Title must be at least 5 characters long.";
		if (!(title.length <= 100))
			errors.title = "Title must be at most 100 characters long.";
		if (!description.trim()) errors.description = "Description is required.";
		if (!(description.length >= 10))
			errors.description = "Description must be at least 10 characters long.";
		if (!(description.length <= 300))
			errors.description = "Description must be less than 300 characters long.";
		if (tags.length === 0) {
			errors.tags = "At least one tag is required.";
		}

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleClose = () => {
		if (!loading) {
			setOpen(false);
		}
	};

	const onSummit = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	): Promise<void> => {
		e.preventDefault();

		if (!validateForm()) return;

		setLoading(true);
		const cover: CreateContentProps = {
			title: title.trim(),
			coverUrl: coverUrl,
			description: description.trim(),
			tags: tags,
			visibility,
		};
		console.log("Creating content with details:", cover);
		try {
			let created: { id: string } | undefined;
			if (type === "blog") {
				created = await dispatch(
					CreateNewBlog(cover as CreateContentProps),
					).unwrap();
					if (created?.id) {
						const createdId = created.id;
						handleClose();
						setTimeout(() => {
							router.push(`/editor/blog/${createdId}`);
					}, 100);
				} else {
					toast.error("Failed to create blog. Please try again.");
					setLoading(false);
				}
			} else if (type === "docs") {
				created = await dispatch(
					CreateNewDocs(cover as CreateContentProps),
					).unwrap();
					if (created?.id) {
						const createdId = created.id;
						handleClose();
						setTimeout(() => {
							router.push(`/editor/docs/${createdId}`);
					}, 100);
				} else {
					toast.error("Failed to create docs. Please try again.");
					setLoading(false);
				}
			}
		} catch (error) {
			toast.error("Failed to create content. Please try again.");
			console.error("Error creating content:", error);
			setLoading(false);
		}
	};

	if (!open) return null;

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[500px] max-h-[90vh] ">
				<DialogHeader>
					<DialogTitle>Update Blog</DialogTitle>
					<DialogDescription>
						Fill in the details to update your blog post.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 custom-scroll -mx-4 max-h-[70vh] overflow-y-auto px-4">
					<div className="grid gap-2">
						<Label htmlFor="title">
							Title<span className="text-red-500">*</span>
						</Label>
							<Input
								onChange={(e) => setTitle(e.target.value.slice(0, 100))}
								id="title"
								name="title"
								value={title}
								disabled={loading}
								maxLength={100}
							/>
						{formErrors.title && (
							<p className="text-sm text-red-500">{formErrors.title}</p>
						)}
					</div>

					<div className="grid gap-2">
						<Label htmlFor="description">
							Description<span className="text-red-500">*</span>
						</Label>
						<Input
							onChange={(e) => setDescription(e.target.value)}
							id="description"
							name="description"
							value={description}
							disabled={loading}
						/>
						{formErrors.description && (
							<p className="text-sm text-red-500">{formErrors.description}</p>
						)}
					</div>

					<div className="grid gap-2">
						<Label htmlFor="thumbnail">
							Thumbnail<span className="text-red-500">*</span>
						</Label>
						<div
							role="button"
							tabIndex={0}
							className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-foreground transition-colors hover:bg-foreground/10 bg-border/10 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							onDragOver={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
							onDrop={async (e) => {
								e.preventDefault();
								e.stopPropagation();
								const file = e.dataTransfer.files?.[0];
								if (!file) return;
								setCoverFromFile(file);
							}}
							onPaste={handleCoverPaste}
							onClick={() =>
								document.getElementById("thumbnail-input")?.click()
							}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									document.getElementById("thumbnail-input")?.click();
								}
							}}
						>
							<input
								id="thumbnail-input"
								type="file"
								accept="image/*"
								className="hidden"
								disabled={loading}
								onChange={async (e) => {
									const file = e.target.files?.[0];
									if (!file) return;
									setCoverFromFile(file);
								}}
							/>
							{coverUrl ? (
								<Image
									width={128}
									height={128}
									src={coverUrl}
									alt="cover preview"
									className="object-cover w-full h-full rounded mb-2 border"
								/>
							) : (
								<span className="text-gray-400">
									Drag & drop, click to upload, or paste an image
								</span>
							)}
						</div>
						<div className="grid gap-2">
							<Label htmlFor="thumbnail-url">Paste Image URL</Label>
							<div className="flex flex-col gap-2 sm:flex-row">
								<Input
									id="thumbnail-url"
									name="thumbnail-url"
									placeholder="https://example.com/cover.png"
									value={coverUrlInput}
									onPaste={handleCoverPaste}
									onChange={(e) => {
										setCoverUrlInput(e.target.value);
										if (coverError) setCoverError("");
									}}
									disabled={loading}
								/>
								<Button
									type="button"
									variant="secondary"
									onClick={handleCoverUrlApply}
									disabled={loading}
									className="shrink-0"
								>
									Use URL
								</Button>
								<Button
									type="button"
									variant="ghost"
									onClick={() => {
										setCoverUrl(defaultCoverUrl);
										setCoverUrlInput("");
										setCoverError("");
									}}
									disabled={loading}
									className="shrink-0"
								>
									Reset
								</Button>
							</div>
							{coverError && (
								<p className="text-sm text-red-500">{coverError}</p>
							)}
						</div>
					</div>

					<div className="grid flex-1 gap-3">
						<Label htmlFor="tags" className="text-sm font-medium">
							Tags <span className="text-red-500">*</span>
						</Label>
						<Combobox
							autoHighlight
							multiple
							items={predefinedTags}
							value={tags}
							onValueChange={(value) => setTags(value as string[])}
						>
							<ComboboxChips ref={anchor}>
								<ComboboxValue>
									{(values) => (
										<>
											{values.map((value: string) => (
												<ComboboxChip key={value}>{value}</ComboboxChip>
											))}
											<ComboboxChipsInput />
										</>
									)}
								</ComboboxValue>
							</ComboboxChips>
							<ComboboxContent
								anchor={anchor}
								className="overscroll-contain isolate"
							>
								<ComboboxEmpty>No items found.</ComboboxEmpty>
								<div
									className="overflow-y-auto overscroll-contain"
									onWheel={(e) => e.stopPropagation()}
								>
									<ComboboxList>
										{(item) => (
											<ComboboxItem key={item} value={item}>
												{item}
											</ComboboxItem>
										)}
									</ComboboxList>
								</div>
							</ComboboxContent>
						</Combobox>
						{formErrors.tags && (
							<p className="text-sm text-red-500">{formErrors.tags}</p>
						)}
					</div>
				</div>
				<DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
					{/* Visibility */}
					<div className="flex items-center gap-2 order-1">
						<div className="hidden" aria-hidden="true">
						<Select
							value={status}
							onValueChange={(value: "draft" | "publish" | "archived") =>
								setStatus(value)
							}
							disabled={loading}
						>
							<SelectTrigger id="status" className="w-[130px]">
								<SelectValue placeholder="Select status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="draft">
									<div className="flex items-center">
										<FileText className="mr-2 h-4 w-4 text-yellow-600" />
										<span>Draft</span>
									</div>
								</SelectItem>
								<SelectItem value="publish">
									<div className="flex items-center">
										<CheckCircle className="mr-2 h-4 w-4 text-green-600" />
										<span>Publish</span>
									</div>
								</SelectItem>
								<SelectItem value="archived">
									<div className="flex items-center">
										<Archive className="mr-2 h-4 w-4 text-gray-600" />
										<span>Archived</span>
									</div>
								</SelectItem>
							</SelectContent>
						</Select>
						</div>

						{status === "publish" && (
							<Select
								value={visibility}
							onValueChange={(value: "public" | "unlisted" | "private") =>
									setVisibility(value)
								}
								disabled={loading}
							>
								<SelectTrigger id="visibility" className="w-[120px]">
									<SelectValue placeholder="Visibility" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="public">
										<div className="flex items-center">
											<Eye className="mr-2 h-4 w-4 text-blue-600" />
											<span>Public</span>
										</div>
									</SelectItem>
									<SelectItem value="unlisted">
										<div className="flex items-center">
											<FileText className="mr-2 h-4 w-4 text-amber-700" />
											<span>Unlisted</span>
										</div>
									</SelectItem>
									<SelectItem value="private">
										<div className="flex items-center">
											<EyeOff className="mr-2 h-4 w-4 text-gray-600" />
											<span>Private</span>
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
						)}
					</div>

					{/* Right side - Action Buttons */}
					<div className="flex gap-2 order-2 justify-end">
						<Button variant="outline" onClick={handleClose} disabled={loading}>
							Cancel
						</Button>
						<Button
							onClick={onSummit}
							variant="default"
							type="submit"
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Updating...
								</>
							) : (
								"Update"
							)}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export const VisibilityPopover = ({
	open,
	setOpen,
	contentType = "blog",
	resourceId,
	initialStatus,
	initialVisibility,
	onUpdated,
}: {
	open?: boolean;
	setOpen?: (open: boolean) => void;
	contentType?: "blog" | "docs";
	resourceId?: string;
	initialStatus?: "PUBLISHED" | "ARCHIVED" | "DRAFT";
	initialVisibility?: "PUBLIC" | "UNLISTED" | "PRIVATE";
	onUpdated?: (payload: {
		visibility: "PUBLIC" | "UNLISTED" | "PRIVATE";
		status: "PUBLISHED" | "ARCHIVED" | "DRAFT";
	}) => void;
}) => {
	// State declarations
	const [status, setStatus] = useState<"draft" | "publish" | "archived">(
		"draft",
	);
	const [visibility, setVisibility] = useState<"public" | "unlisted" | "private">("public");
	const [loading, setLoading] = useState<boolean>(false);
	const getCollabHttpBaseUrl = () => {
		const wsUrl =
			process.env.NEXT_PUBLIC_COLLAB_WS_URL || "ws://localhost:1234/collab";
		const normalized = wsUrl.replace(/\/+$/, "");
		const withoutPath = normalized.replace(/\/collab$/, "");

		if (withoutPath.startsWith("wss://")) {
			return withoutPath.replace("wss://", "https://");
		}
		if (withoutPath.startsWith("ws://")) {
			return withoutPath.replace("ws://", "http://");
		}
		return withoutPath;
	};

	// Handler functions
	const handleClose = () => {
		setOpen?.(false);
	};

	const handleSubmit = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	): Promise<void> => {
		e.preventDefault();
		if (!resourceId) {
			return;
		}

		const mappedVisibility = visibility === "public" ? "PUBLIC" : visibility === "unlisted" ? "UNLISTED" : "PRIVATE";

		setLoading(true);
		try {
			const resourcePath = contentType === "docs" ? "docs" : "posts";
			await api.patch(`/api/v1/${resourcePath}/${resourceId}`, { visibility: mappedVisibility });
			onUpdated?.({ visibility: mappedVisibility, status: "PUBLISHED" });
			toast.success(`Visibility updated to ${mappedVisibility.toLowerCase()}`);
			handleClose();
		} catch {
			toast.error("Could not update visibility");
		} finally {
			setLoading(false);
		}
	};

	const handleVisibilityChange = (value: "public" | "unlisted" | "private") => {
		setVisibility(value);
	};

	// Effects
	useEffect(() => {
		if (!open) {
			const timer = setTimeout(() => {
				setVisibility("public");
				setStatus("publish");
				setLoading(false);
			}, 150);
			return () => clearTimeout(timer);
		}
	}, [open]);

	useEffect(() => {
		if (!open) return;
		setStatus("publish");
		if (initialVisibility) {
			setVisibility(initialVisibility === "PUBLIC" ? "public" : initialVisibility === "UNLISTED" ? "unlisted" : "private");
		}
	}, [open, initialStatus, initialVisibility]);

	// Status configuration
	const statusConfig = {
		draft: {
			icon: FileText,
			label: "Draft",
			color: "text-yellow-600",
			bgColor: "bg-yellow-50",
			description: "Save as draft for later",
		},
		publish: {
			icon: CheckCircle,
			label: "Publish",
			color: "text-green-600",
			bgColor: "bg-green-50",
			description: "Make post live",
		},
		archived: {
			icon: Archive,
			label: "Archived",
			color: "text-gray-600",
			bgColor: "bg-gray-50",
			description: "Move to archive",
		},
	};

	// Visibility configuration
	const visibilityConfig = {
		public: {
			icon: Eye,
			label: "Public",
			color: "text-blue-600",
			bgColor: "bg-blue-50",
			description: "Anyone can view",
		},
		unlisted: {
			icon: FileText,
			label: "Unlisted",
			color: "text-amber-700",
			bgColor: "bg-amber-50",
			description: "Available only through its link",
		},
		private: {
			icon: EyeOff,
			label: "Private",
			color: "text-purple-600",
			bgColor: "bg-purple-50",
			description: "Only you can view",
		},
	};

	// Render helpers
	const renderStatusOptions = () => (
		<>
			{Object.entries(statusConfig).map(([key, config]) => {
				const Icon = config.icon;
				return (
					<SelectItem key={key} value={key} className="cursor-pointer">
						<div className="flex items-center gap-2 py-1">
							<div className={`p-1.5 rounded ${config.bgColor}`}>
								<Icon className={`h-4 w-4 ${config.color}`} />
							</div>
							<div className="flex flex-col">
								<span className="font-medium">{config.label}</span>
								<span className="text-xs text-muted-foreground">
									{config.description}
								</span>
							</div>
						</div>
					</SelectItem>
				);
			})}
		</>
	);

	const renderVisibilityOptions = () => (
		<>
			{Object.entries(visibilityConfig).map(([key, config]) => {
				const Icon = config.icon;
				return (
					<SelectItem key={key} value={key} className="cursor-pointer">
						<div className="flex items-center gap-2 py-1">
							<div className={`p-1.5 rounded ${config.bgColor}`}>
								<Icon className={`h-4 w-4 ${config.color}`} />
							</div>
							<div className="flex flex-col">
								<span className="font-medium">{config.label}</span>
								<span className="text-xs text-muted-foreground">
									{config.description}
								</span>
							</div>
						</div>
					</SelectItem>
				);
			})}
		</>
	);

	// Get current selections for display
	const currentVisibility = visibilityConfig[visibility];
	const VisibilityIcon = currentVisibility.icon;

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[550px] w-full h-fit">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">
					Update {contentType === "docs" ? "Document" : "Post"} Visibility
					</DialogTitle>
					<DialogDescription className="text-sm text-muted-foreground">
						Choose who can access this {contentType === "docs" ? "document" : "post"}.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-2 py-2">
					<label className="text-sm font-medium" htmlFor="visibility">
						Visibility
					</label>
					<Select value={visibility} onValueChange={handleVisibilityChange} disabled={loading}>
						<SelectTrigger id="visibility" className="w-full !h-fit py-2">
							<div className="flex items-center gap-2">
								<div className={`p-1.5 rounded ${currentVisibility.bgColor}`}>
									<VisibilityIcon className={`h-4 w-4 ${currentVisibility.color}`} />
								</div>
								<div className="flex flex-col items-start">
									<span className="font-medium">{currentVisibility.label}</span>
									<span className="text-xs text-muted-foreground">{currentVisibility.description}</span>
								</div>
							</div>
						</SelectTrigger>
						<SelectContent className="w-[--radix-select-trigger-width]">
							{renderVisibilityOptions()}
						</SelectContent>
					</Select>
				</div>

				<DialogFooter className="gap-2 pt-2">
					<Button
						variant="outline"
						onClick={handleClose}
						disabled={loading}
						className="min-w-[100px]"
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						variant="default"
						type="submit"
						disabled={loading}
						className="min-w-[100px]"
					>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Updating...
							</>
						) : (
							<>Update</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
