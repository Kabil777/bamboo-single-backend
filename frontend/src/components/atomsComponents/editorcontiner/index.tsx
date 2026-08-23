import { type Editor, EditorContent } from "@tiptap/react";

export const EditorContiner = ({editor}:{editor : Editor }) => {
	return (
			<EditorContent
				editor={editor}
				role="presentation"
				className="simple-editor-content w-full container max-w-5xl"
			/>
	);
};
