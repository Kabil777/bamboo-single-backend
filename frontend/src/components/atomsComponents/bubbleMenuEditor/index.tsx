import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { RemoveFormatting } from "lucide-react";
import { Button } from "@/components/shadcnUI/button";

export const BubbleMenuEditor = ({
	editor,
}: {
	editor: Editor | undefined;
}) => {
	return (
		<BubbleMenu
			editor={editor}
			className="!z-20 absolute"
			options={{ placement: "bottom-start", offset: 5 }}
			shouldShow={({ from, to }) => {
				return from !== to;
			}}
		>
			<div className="bubble-menu bg-background px-1 py-0.5 gap-1 border-1 border-border/50 text-sm rounded-xl flex shadow-2xl">
				<Button
					variant={"ghost"}
					onClick={() => editor?.chain().focus().toggleBold().run()}
					className={`transition-all delay-75 py-1 px-2 rounded-xl font-semibold text-sm  hover:bg-accent hover:text-foreground ${editor?.isActive("bold") ? "bg-accent text-foreground" : "text-muted-foreground bg-background"}`}
				>
					Bold
				</Button>
				<Button
					onClick={() => editor?.chain().focus().toggleItalic().run()}
					className={`transition-all delay-75 py-1 px-2 font-semibold  rounded-xl text-sm  hover:bg-accent hover:text-foreground ${editor?.isActive("italic") ? "bg-accent text-foreground" : "text-muted-foreground bg-background"}`}
				>
					Italic
				</Button>
				<Button
					onClick={() => {
						editor?.chain().focus().toggleStrike().run();
					}}
					className={`transition-all delay-75 py-1 px-2 font-semibold  rounded-xl text-sm  hover:bg-accent hover:text-foreground ${editor?.isActive("strike") ? "bg-accent text-foreground" : "text-muted-foreground bg-background"}`}
				>
					Strike
				</Button>
				<Button
					onClick={() => {
						editor?.chain().focus().unsetAllMarks().run();
					}}
					className="transition-all delay-75 py-1 px-2 font-semibold rounded-xl text-sm hover:bg-accent hover:text-foreground text-muted-foreground bg-background"
				>
					<RemoveFormatting />
				</Button>
			</div>
		</BubbleMenu>
	);
};
