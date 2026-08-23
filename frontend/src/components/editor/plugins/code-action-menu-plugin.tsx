import { type JSX, useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";

import { $isCodeNode, CodeNode } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNearestNodeFromDOMNode, $getNodeByKey, isHTMLElement } from "lexical";

import { useDebounce } from "@/components/editor/editor-hooks/use-debounce";
import { CopyButton } from "@/components/editor/editor-ui/code-button";
import {
  CODE_LANGUAGE_OPTIONS,
  normalizeLanguageValue,
} from "@/components/editor/utils/code-languages";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcnUI/select";

interface Position {
  top: string;
  left: string;
  width: string;
}

function CodeActionMenuContainer({
  anchorElem,
}: {
  anchorElem: HTMLElement;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  const [lang, setLang] = useState("plain");
  const [isShown, setShown] = useState<boolean>(false);
  const [shouldListenMouseMove, setShouldListenMouseMove] =
    useState<boolean>(false);
  const [position, setPosition] = useState<Position>({
    left: "0",
    top: "0",
    width: "0",
  });
  const isSelectOpenRef = useRef(false);
  const codeSetRef = useRef<Set<string>>(new Set());
  const codeDOMNodeRef = useRef<HTMLElement | null>(null);
  const codeNodeKeyRef = useRef<string | null>(null);

  function getCodeDOMNode(): HTMLElement | null {
    return codeDOMNodeRef.current;
  }

  const debouncedOnMouseMove = useDebounce(
    (event: MouseEvent) => {
      if (isSelectOpenRef.current) {
        return;
      }

      const { codeDOMNode, isOutside } = getMouseInfo(event);
      if (isOutside) {
        setShown(false);
        return;
      }

      if (!codeDOMNode) {
        return;
      }

      codeDOMNodeRef.current = codeDOMNode;

      let codeNode: CodeNode | null = null;
      let _lang = "";
      let _key = "";

      editor.update(() => {
        const maybeCodeNode = $getNearestNodeFromDOMNode(codeDOMNode);

        if ($isCodeNode(maybeCodeNode)) {
          codeNode = maybeCodeNode;
          _lang = codeNode.getLanguage() || "";
          _key = codeNode.getKey();
        }
      });

      if (codeNode) {
        codeNodeKeyRef.current = _key;
        const { y: editorElemY, x: editorElemX } = anchorElem.getBoundingClientRect();
        const { y, x, width } = codeDOMNode.getBoundingClientRect();
        setLang(normalizeLanguageValue(_lang));
        setShown(true);
        setPosition({
          left: `${x - editorElemX}px`,
          top: `${y - editorElemY}px`,
          width: `${width}px`,
        });
      }
    },
    50,
    1000,
  );

  useEffect(() => {
    if (!shouldListenMouseMove) {
      return;
    }

    document.addEventListener("mousemove", debouncedOnMouseMove);

    return () => {
      setShown(false);
      debouncedOnMouseMove.cancel();
      document.removeEventListener("mousemove", debouncedOnMouseMove);
    };
  }, [shouldListenMouseMove, debouncedOnMouseMove]);

  useEffect(() => {
    return editor.registerMutationListener(
      CodeNode,
      (mutations) => {
        editor.getEditorState().read(() => {
          for (const [key, type] of mutations) {
            switch (type) {
              case "created":
                codeSetRef.current.add(key);
                break;

              case "destroyed":
                codeSetRef.current.delete(key);
                break;

              default:
                break;
            }
          }
        });
        setShouldListenMouseMove(codeSetRef.current.size > 0);
      },
      { skipInitialization: false },
    );
  }, [editor]);

  if (!isShown) {
    return null;
  }

  return (
    <div
      className="code-action-menu-container absolute flex items-center justify-between pl-[64px] pr-4 h-[42px] z-[100]"
      style={{ ...position }}
      onMouseEnter={() => setShown(true)}
    >
      <Select
        value={lang || "plain"}
        onOpenChange={(open) => {
          isSelectOpenRef.current = open;
        }}
        onValueChange={(value) => {
          const newLang = value === "plain" ? "" : value;
          editor.update(() => {
            let node: CodeNode | null = null;
            if (codeNodeKeyRef.current) {
              const maybeNode = $getNodeByKey(codeNodeKeyRef.current);
              if ($isCodeNode(maybeNode)) {
                node = maybeNode;
              }
            }
            if (!node && getCodeDOMNode()) {
              const maybeNode = $getNearestNodeFromDOMNode(getCodeDOMNode()!);
              if ($isCodeNode(maybeNode)) {
                node = maybeNode;
              }
            }
            if (node) {
              node.setLanguage(newLang);
            }
          });
          setLang(value);
        }}
      >
        <SelectTrigger className="border-none bg-transparent shadow-none text-[11px] font-medium text-white/60 uppercase tracking-wider hover:text-white/90 focus:ring-0 focus:ring-offset-0 gap-1.5 data-[state=open]:text-white/90">
          <SelectValue placeholder="Plain Text" />
        </SelectTrigger>
        <SelectContent className="z-[110] max-h-[300px] overflow-y-auto">
          {CODE_LANGUAGE_OPTIONS.map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <CopyButton editor={editor} getCodeDOMNode={getCodeDOMNode} />
    </div>
  );
}

function getMouseInfo(event: MouseEvent): {
  codeDOMNode: HTMLElement | null;
  isOutside: boolean;
} {
  const target = event.target;

  if (isHTMLElement(target)) {
    const codeDOMNode = target.closest<HTMLElement>("code.EditorTheme__code");
    const isOutside = !(
      codeDOMNode ||
      target.closest<HTMLElement>(".code-action-menu-container") ||
      target.closest<HTMLElement>("[data-radix-popper-content-wrapper]") ||
      target.closest<HTMLElement>("[role='listbox']") ||
      target.tagName === "SELECT" ||
      target.tagName === "OPTION"
    );

    return { codeDOMNode, isOutside };
  } else {
    return { codeDOMNode: null, isOutside: true };
  }
}

export function CodeActionMenuPlugin({
  anchorElem = document.body,
}: {
  anchorElem: HTMLElement | null;
}): React.ReactPortal | null {
  if (!anchorElem) {
    return null;
  }

  return createPortal(
    <CodeActionMenuContainer anchorElem={anchorElem} />,
    anchorElem,
  );
}

