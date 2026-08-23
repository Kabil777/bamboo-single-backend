import { useState } from "react";

import { $isCodeNode } from "@lexical/code";
import {
  $getNearestNodeFromDOMNode,
  $getSelection,
  $setSelection,
  type LexicalEditor,
} from "lexical";

import { CircleCheckIcon, CopyIcon } from "lucide-react";

import { useDebounce } from "@/components/editor/editor-hooks/use-debounce";

interface Props {
  editor: LexicalEditor;
  getCodeDOMNode: () => HTMLElement | null;
}

export function CopyButton({ editor, getCodeDOMNode }: Props) {
  const [isCopyCompleted, setCopyCompleted] = useState<boolean>(false);

  const removeSuccessIcon = useDebounce(() => {
    setCopyCompleted(false);
  }, 1000);

  async function handleClick(): Promise<void> {
    const codeDOMNode = getCodeDOMNode();

    if (!codeDOMNode) {
      return;
    }

    let content = "";

    editor.update(() => {
      const codeNode = $getNearestNodeFromDOMNode(codeDOMNode);

      if ($isCodeNode(codeNode)) {
        content = codeNode.getTextContent();
      }

      const selection = $getSelection();
      $setSelection(selection);
    });

    try {
      await navigator.clipboard.writeText(content);
      setCopyCompleted(true);
      removeSuccessIcon();
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }

  return (
    <button
      className="code-block-copy-btn flex items-center justify-center h-7 px-2.5 gap-1.5 text-[11px] text-white/50 hover:text-white/90 border-none shadow-none bg-transparent hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
      onClick={handleClick}
      aria-label="copy"
    >
      {isCopyCompleted ? (
        <>
          <CircleCheckIcon className="w-3 h-3 text-emerald-400" />
          <span className="text-emerald-400 uppercase tracking-wider font-medium">Copied</span>
        </>
      ) : (
        <>
          <CopyIcon className="w-3 h-3" />
          <span className="uppercase tracking-wider font-medium">Copy</span>
        </>
      )}
    </button>
  );
}
