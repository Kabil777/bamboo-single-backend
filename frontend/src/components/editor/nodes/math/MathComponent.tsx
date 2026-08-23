import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  COMMAND_PRIORITY_HIGH,
  KEY_ESCAPE_COMMAND,
  NodeKey,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { $isMathNode } from "./MathNode";

type MathComponentProps = {
  equation: string;
  inline: boolean;
  nodeKey: NodeKey;
};

export default function MathComponent({
  equation,
  inline,
  nodeKey,
}: MathComponentProps): React.JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          const activeElement = document.activeElement;
          const inputElem = inputRef.current;
          if (inputElem !== activeElement) {
            setIsEditing(false);
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          const activeElement = document.activeElement;
          const inputElem = inputRef.current;
          if (inputElem === activeElement) {
            setIsEditing(false);
            if (inputElem) {
              inputElem.blur();
            }
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [editor, isSelected]);

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      if (!isEditing) {
        setIsEditing(true);
      }
    },
    [isEditing]
  );

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isMathNode(node)) {
          node.setEquation(value);
        }
      });
    },
    [editor, nodeKey]
  );

  const katexElementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (katexElementRef.current) {
      try {
        katex.render(equation, katexElementRef.current, {
          displayMode: !inline,
          errorColor: "#cc0000",
          output: "html",
          strict: "warn",
          throwOnError: false,
          trust: false,
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [equation, inline]);

  return (
    <span
      className={`relative inline-block ${isSelected ? "ring-2 ring-primary" : ""} cursor-pointer`}
      onClick={onClick}
    >
      {isEditing ? (
        inline ? (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            className="border px-2 py-1 rounded bg-background text-foreground"
            value={equation}
            onChange={onChange}
            autoFocus
          />
        ) : (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            className="border px-2 py-1 rounded w-full bg-background text-foreground min-h-[100px] font-mono"
            value={equation}
            onChange={onChange}
            autoFocus
          />
        )
      ) : (
        <span
          ref={katexElementRef}
          className={`${inline ? "inline-block" : "block my-4 overflow-x-auto text-center"}`}
        />
      )}
    </span>
  );
}
