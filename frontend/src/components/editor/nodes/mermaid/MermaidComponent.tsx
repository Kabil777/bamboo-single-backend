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
import { $isMermaidNode } from "./MermaidNode";
import { Mermaid } from "../../../atomsComponents/Article/articleRender/Mermaid";

type MermaidComponentProps = {
  chart: string;
  nodeKey: NodeKey;
  format: string;
};

export default function MermaidComponent({
  chart,
  nodeKey,
  format,
}: MermaidComponentProps): React.JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value;
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isMermaidNode(node)) {
          node.setChart(value);
        }
      });
    },
    [editor, nodeKey]
  );

  return (
    <div
      className={`relative flex justify-center w-full my-4 rounded-xl border-2 transition-colors ${
        isSelected ? "border-primary shadow-sm" : "border-transparent"
      } cursor-pointer`}
      onClick={onClick}
    >
      {isEditing ? (
        <textarea
          ref={inputRef}
          className="w-full p-4 font-mono text-sm bg-muted rounded-xl min-h-[150px] outline-none focus:ring-2 focus:ring-primary"
          value={chart}
          onChange={onChange}
          autoFocus
        />
      ) : (
        <div className="w-full relative pointer-events-none p-4 bg-muted/30 rounded-xl">
          {chart ? (
            <Mermaid chart={chart} />
          ) : (
            <div className="text-muted-foreground text-center text-sm py-8">
              Click to edit Mermaid Diagram
            </div>
          )}
        </div>
      )}
    </div>
  );
}
