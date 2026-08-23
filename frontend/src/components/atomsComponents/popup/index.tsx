"use client"

import { Button } from "@/components/shadcnUI/button";
import { Textarea } from "@/components/shadcnUI/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/shadcnUI/dialog";
import { useRef, useState } from "react";

import { DialogClose } from "@radix-ui/react-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcnUI/select";
import Image from "next/image";
import { Input } from "@/components/shadcnUI/input";
import { FileText, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { marked, type TokenizerAndRendererExtension } from "marked";
import { emojiMap, emoticonMap } from "@/lib/emoji-map";
import {
    footnoteExtension,
    definitionListExtension,
    abbreviationExtension,
    containerExtension,
} from "@/lib/marked-extensions";

// --- Custom marked extensions for markdown-it-ins (++...++) and markdown-it-mark (==...==) ---
const insExtension: TokenizerAndRendererExtension = {
    name: "ins",
    level: "inline",
    start(src: string) {
        return src.indexOf("++");
    },
    tokenizer(src: string) {
        const match = src.match(/^\+\+([^+]+)\+\+/);
        if (match) {
            return {
                type: "ins",
                raw: match[0],
                text: match[1],
                tokens: [],
            };
        }
        return undefined;
    },
    renderer(token) {
        return `<u>${(token as unknown as { text: string }).text}</u>`;
    },
};

const markExtension: TokenizerAndRendererExtension = {
    name: "mark",
    level: "inline",
    start(src: string) {
        return src.indexOf("==");
    },
    tokenizer(src: string) {
        const match = src.match(/^==([^=]+)==/);
        if (match) {
            return {
                type: "mark",
                raw: match[0],
                text: match[1],
                tokens: [],
            };
        }
        return undefined;
    },
    renderer(token) {
        return `<mark>${(token as unknown as { text: string }).text}</mark>`;
    },
};

const supExtension: TokenizerAndRendererExtension = {
    name: "sup",
    level: "inline",
    start(src: string) {
        return src.indexOf("^");
    },
    tokenizer(src: string) {
        const match = src.match(/^\^([^^]+)\^/);
        if (match) {
            return {
                type: "sup",
                raw: match[0],
                text: match[1],
                tokens: [],
            };
        }
        return undefined;
    },
    renderer(token) {
        return `<sup>${(token as unknown as { text: string }).text}</sup>`;
    },
};

const subExtension: TokenizerAndRendererExtension = {
    name: "sub",
    level: "inline",
    start(src: string) {
        return src.indexOf("~");
    },
    tokenizer(src: string) {
        // single ~ for subscript, avoid ~~ (strikethrough)
        const match = src.match(/^~([^~]+)~/);
        if (match) {
            return {
                type: "sub",
                raw: match[0],
                text: match[1],
                tokens: [],
            };
        }
        return undefined;
    },
    renderer(token) {
        return `<sub>${(token as unknown as { text: string }).text}</sub>`;
    },
};


const emojiExtension: TokenizerAndRendererExtension = {
    name: "emoji",
    level: "inline",
    start(src: string) {
        return src.indexOf(":");
    },
    tokenizer(src: string) {
        const match = src.match(/^:([a-zA-Z0-9_+-]+):/);
        if (match && emojiMap[match[1]]) {
            return {
                type: "emoji",
                raw: match[0],
                text: emojiMap[match[1]],
                tokens: [],
            };
        }
        return undefined;
    },
    renderer(token) {
        return (token as unknown as { text: string }).text;
    },
};


// Build a regex that matches any emoticon shortcut
const escapedEmoticons = Object.keys(emoticonMap)
    .sort((a, b) => b.length - a.length) // longest first
    .map((e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

const emoticonRegex = new RegExp(`^(${escapedEmoticons.join("|")})(?=\\s|$)`);

const emoticonExtension: TokenizerAndRendererExtension = {
    name: "emoticon",
    level: "inline",
    start(src: string) {
        // check for any of the starting chars of emoticons
        const idx = src.search(/[:;8<>OBXx]/);
        return idx >= 0 ? idx : -1;
    },
    tokenizer(src: string) {
        const match = src.match(emoticonRegex);
        if (match && emoticonMap[match[1]]) {
            return {
                type: "emoticon",
                raw: match[0],
                text: emoticonMap[match[1]],
                tokens: [],
            };
        }
        return undefined;
    },
    renderer(token) {
        return (token as unknown as { text: string }).text;
    },
};

marked.use(
    { extensions: [insExtension, markExtension, supExtension, subExtension, emojiExtension, emoticonExtension] },
    containerExtension(),
    footnoteExtension(),
    definitionListExtension(),
    abbreviationExtension(),
);

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;
interface props {
    open: boolean;
    setOpen: Setter<boolean>;
    onClick: () => void;
    editor?: any;
    onImportContent?: (htmlContent: string) => void;
}

const handleupload = (
    e: React.ChangeEvent<HTMLInputElement>,
    saveContent: Setter<string>,
) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        console.log(e.target?.result as string);
        saveContent(e.target?.result as string);
    };
    reader.readAsText(file);
};

const setEditorContent = async (
    editor: any,
    content: string,
    onImportContent?: (htmlContent: string) => void,
) => {
    try {
        const tree = marked.parse(content);
        const data = String(tree);

        if (onImportContent) {
            onImportContent(content);
            toast.success("Content loaded successfully!");
        } else if (editor && editor.commands) {
            editor.commands.setContent(data);
            toast.success("Content loaded successfully!");
        } else {
            toast.error("No editor available to load content.");
        }
    } catch (error) {
        console.error(error);
        toast.error("Failed to load content.");
    }
};
function Popup({ open, setOpen, editor, onImportContent }: props) {
    const [content, saveContent] = useState("");
    const [uploadType, setUploadType] = useState("file");
    const [dragActive, setDragActive] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    function handleDrag(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.name.endsWith(".md")) {
                setFileName(file.name);
                // Create a mock FileList with the required 'item' method
                const fileList = {
                    0: file,
                    length: 1,
                    item: (index: number) => (index === 0 ? file : null),
                    [Symbol.iterator]: function* () {
                        yield file;
                    },
                } as FileList;
                handleupload(
                    {
                        target: { files: fileList },
                    } as React.ChangeEvent<HTMLInputElement>,
                    saveContent,
                );
                if (inputRef.current) inputRef.current.value = "";
            } else {
                toast.warning("Only .md files are allowed!");
            }
        }
    }

    function handleClick() {
        inputRef.current?.click();
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFileName(file.name);
            handleupload(e, saveContent);
            e.target.value = "";
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="md:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Enter your MD file content </DialogTitle>
                    <DialogDescription>
                        Feed your md data to editor
                    </DialogDescription>
                </DialogHeader>
                <Select
                    onValueChange={(value) => {
                        setUploadType(value);
                    }}
                    defaultValue={uploadType}
                >
                    <SelectTrigger className="w-44">
                        <SelectValue placeholder="Type of upload" />
                        <SelectContent>
                            <SelectItem value="file">File Upload</SelectItem>
                            <SelectItem value="content">
                                Content upload
                            </SelectItem>
                        </SelectContent>
                    </SelectTrigger>
                </Select>
                <div className="flex items-center justify-center border-1 flex-col gap-2">
                    {uploadType == "file" ? (
                        <div
                            onDragEnter={handleDrag}
                            onDragOver={handleDrag}
                            onDragLeave={handleDrag}
                            onDrop={handleDrop}
                            onClick={handleClick}
                            className={`relative m-3 border-2 h-70 max-w-80 w-full border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition ${dragActive
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-400"
                                }`}
                        >
                            {dragActive ? (
                                <div className="absolute inset-0 bg-blue-500/20 flex flex-col items-center justify-center rounded-xl pointer-events-none">
                                    <UploadCloud
                                        size={40}
                                        className="text-blue-600 mb-2"
                                    />
                                    <span className="text-blue-600 font-semibold">
                                        Drop file here
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <Image
                                        src="/upload.jpg"
                                        className="object-contain rounded-full mb-3 select-none "
                                        width={80}
                                        height={40}
                                        alt="Upload icon"
                                        draggable={false}
                                    />

                                    {!fileName ? (
                                        <p className="text-sm text-gray-600 mb-2 text-center">
                                            Drag & drop your <code>.md</code>{" "}
                                            file here <br /> or click to browse
                                        </p>
                                    ) : (
                                        <div className="flex items-center space-x-2 mt-2">
                                            <FileText
                                                size={18}
                                                className="text-green-600"
                                            />
                                            <span className="text-sm text-green-700 font-medium">
                                                {fileName}
                                            </span>
                                        </div>
                                    )}

                                    {/* Hidden input */}
                                    <Input
                                        ref={inputRef}
                                        id="picture"
                                        type="file"
                                        accept=".md"
                                        className="hidden"
                                        onChange={handleInputChange}
                                    />
                                </>
                            )}
                        </div>
                    ) : (
                        <Textarea
                            className="w-[100%] h-80 justify-center focus:border-black "
                            onChange={(e) => {
                                saveContent(e.target.value);
                            }}
                        />
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            variant="default"
                            onClick={async () => {
                                setOpen(false);
                                await setEditorContent(editor, content, onImportContent);
                            }}
                        >
                            Submit
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default Popup;
