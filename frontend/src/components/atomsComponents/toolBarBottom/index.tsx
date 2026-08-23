import { Upload } from "lucide-react";
import { IoLogoMarkdown } from "react-icons/io";
import { useState } from "react";
import type { Editor } from "@tiptap/react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/shadcnUI/alert-dialog";
import { FloatingActionBar, Popup } from "@/components/atomsComponents";

/**
 * The original bottom editor UI, reduced to local-blog actions only.
 * Markdown import and the publish dialog remain; sharing and presence were
 * collaboration-only features and no longer call the removed API/WebSocket.
 */
export const ToolBarBottom = ({
    editor,
    onSave,
    word,
}: {
    editor: Editor | null;
    onSave: () => void;
    word: number;
}) => {
    const [openMd, setOpenMd] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);

    if (!editor) return null;

    return (
        <>
            <FloatingActionBar
                prefix={<span className="whitespace-nowrap">{word} characters</span>}
                actions={[
                    {
                        icon: IoLogoMarkdown,
                        label: "Import Markdown",
                        onClick: () => setOpenMd(true),
                    },
                    "separator",
                    {
                        icon: Upload,
                        label: "Publish post",
                        onClick: () => setOpenUpload(true),
                    },
                ]}
            />

            <Popup open={openMd} setOpen={setOpenMd} editor={editor} onClick={() => {}} />

            <AlertDialog open={openUpload} onOpenChange={setOpenUpload}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Publish post</AlertDialogTitle>
                        <AlertDialogDescription>
                            Publish the current content to your blog.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onSave}>Publish</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
