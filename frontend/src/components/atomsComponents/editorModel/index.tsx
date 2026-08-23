"use client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { toast } from "sonner";
import api from "@/api/axios";
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
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { createPost, uploadMedia } from "@/api/postsApi";
import { useTagCatalog } from "@/hooks/useTagCatalog";

interface CreateContentProps {
    title: string;
    coverUrl: string;
    description: string;
    tags: string[];
}

export const EditorModel = () => {
    const params = usePathname();

    // Disable button for /editor, /editor/blog, /editor/docs, or /editor/docs/<id>
    const disableCreate = (() => {
        if (
            params === "/editor" ||
            params === "/editor/blog" ||
            params === "/editor/docs"
        )
            return true;
        const docsIdMatch = params.match(/^\/editor\/docs\/[^/]+$/);
        return !!docsIdMatch;
    })();

    const router = useRouter();

    const anchor = useComboboxAnchor();
    const [type, setType] = useState<"blog" | "docs">("blog");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState<boolean>(false);
    const [tags, setTags] = useState<string[]>([]);
    const { interests: managedTags } = useTagCatalog();
    const predefinedTags = managedTags;
    const defaultCoverUrl = "";
    const [coverUrl, setCoverUrl] = useState<string>(defaultCoverUrl);
    const [coverUrlInput, setCoverUrlInput] = useState<string>("");
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverSource, setCoverSource] = useState<"default" | "file" | "url">(
        "default",
    );
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
        setCoverFile(file);
        setCoverSource("file");
        setCoverUrlInput("");
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
        setCoverSource("url");
        setCoverFile(null);
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
            setCoverSource("url");
            setCoverFile(null);
            setCoverUrl(text.trim());
            setCoverError("");
        }
    };

    useEffect(() => {
        setOpen(false);
        if (params === "/editor") {
            setLoading(false);
            setOpen(false);
        }
    }, [params]);

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!type) errors.type = "Please select a content type.";
        if (!title.trim()) errors.title = "Title is required.";
        if (!(title.length >= 5))
            errors.title = "Title must be at least 5 characters long.";
        if (!(title.length <= 100))
            errors.title = "Title must be at most 100 characters long.";
        if (!description.trim())
            errors.description = "Description is required.";
        if (!(description.length >= 10))
            errors.description =
                "Description must be at least 10 characters long.";
        if (!(description.length <= 500))
            errors.description =
                "Description must be less than 500 characters long.";
        if (tags.length === 0) {
            errors.tags = "At least one tag is required.";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const onSummit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            let mediaId: string | undefined;
            const hasUrlInput = isLikelyImageUrl(coverUrlInput);
            const urlUploadRequested = coverSource === "url" || hasUrlInput;
            if (coverSource === "file" && coverFile) {
                mediaId = await uploadMedia(coverFile);
            } else if (urlUploadRequested) {
                const rawUrl = (coverUrlInput || coverUrl).trim();
                const response = await api.post<{ id: string }>("/api/v1/media/from-url", null, { params: { url: rawUrl } });
                mediaId = response.data.id;
            }
            if (type !== "blog") throw new Error("Docs are no longer available");
            const initialDescription = description.trim();
            const created = await createPost({ title: title.trim(), description: initialDescription || null, content: initialDescription, mediaId });
            router.push(`/editor/blog/${created.id}`);
        } catch (error) {
            console.error("Failed to create content:", error);
            toast.error("Failed to create content. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild disabled={disableCreate}>
                <Button
                    variant="outline"
                    className="flex items-center transition-all delay-75 justify-between text-sm text-muted-foreground border border-input bg-accent rounded-md hover:bg-accent hover:text-foreground"
                    disabled={disableCreate}
                >
                    <FiEdit3 className="pointer-events-none" />
                </Button>
            </DialogTrigger>
            <DialogContent className="custom-scroll -mx-4 max-h-[90vh] overflow-y-auto px-4 pointer-events-auto">
                <DialogHeader>
                    <DialogTitle>New Blog/Docs</DialogTitle>
                    <DialogDescription>
                        Make new post and share your thoughts with the world.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="type">
                            Type of Content
                            <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            onValueChange={(value) =>
                                setType(value as "blog" | "docs")
                            }
                            defaultValue={type}
                        >
                            <SelectTrigger id="type" className="w-44">
                                <SelectValue
                                    placeholder="Type of Content"
                                    defaultValue={type}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="blog">Blog</SelectItem>
                                <SelectItem value="docs">Docs</SelectItem>
                            </SelectContent>
                        </Select>
                        {formErrors.type && (
                            <p className="text-sm text-red-500">
                                {formErrors.type}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="title">
                            Title<span className="text-red-500">*</span>
                        </Label>
                        <Input
                            onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                            id="title"
                            name="title"
                            maxLength={100}
                        />
                        {formErrors.title && (
                            <p className="text-sm text-red-500">
                                {formErrors.title}
                            </p>
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
                        />
                        {formErrors.description && (
                            <p className="text-sm text-red-500">
                                {formErrors.description}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="thumbnail">
                            Thumbnail<span className="text-red-500">*</span>
                        </Label>
                        <div
                            role="button"
                            tabIndex={0}
                            className="pointer-events-auto flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-foreground transition-colors hover:bg-foreground/10 bg-border/10 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                                document
                                    .getElementById("thumbnail-input")
                                    ?.click()
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    document
                                        .getElementById("thumbnail-input")
                                        ?.click();
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
                                    Drag & drop, click to upload, or paste an
                                    image
                                </span>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="thumbnail-url">
                                Paste Image URL
                            </Label>
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
                                        setCoverFile(null);
                                        setCoverSource("default");
                                    }}
                                    disabled={loading}
                                    className="shrink-0"
                                >
                                    Reset
                                </Button>
                            </div>
                            {coverError && (
                                <p className="text-sm text-red-500">
                                    {coverError}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="tags" className="text-sm font-medium">
                            Tags <span className="text-red-500">*</span>
                        </Label>
                        <Combobox
                            autoHighlight
                            multiple
                            items={predefinedTags}
                            value={tags}
                            onValueChange={(value) =>
                                setTags(value as string[])
                            }
                        >
                            <ComboboxChips ref={anchor}>
                                <ComboboxValue>
                                    {(values) => (
                                        <>
                                            {values.map((value: string) => (
                                                <ComboboxChip key={value}>
                                                    {value}
                                                </ComboboxChip>
                                            ))}
                                            <ComboboxChipsInput />
                                        </>
                                    )}
                                </ComboboxValue>
                            </ComboboxChips>
                            <ComboboxContent
                                anchor={anchor}
                                className="overscroll-contain isolate pointer-events-auto z-[9999]"
                            >
                                <ComboboxEmpty>No items found.</ComboboxEmpty>
                                <div
                                    className="overflow-y-auto overscroll-contain"
                                    onWheel={(e) => e.stopPropagation()}
                                >
                                    <ComboboxList>
                                        {(item) => (
                                            <ComboboxItem
                                                key={item}
                                                value={item}
                                            >
                                                {item}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </div>
                            </ComboboxContent>
                        </Combobox>
                        {formErrors.tags && (
                            <p className="text-sm text-red-500">
                                {formErrors.tags}
                            </p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={loading}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={onSummit}
                        variant="default"
                        type="submit"
                        disabled={loading}
                    >
                        Create {loading && <Loader2 className="animate-spin" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
