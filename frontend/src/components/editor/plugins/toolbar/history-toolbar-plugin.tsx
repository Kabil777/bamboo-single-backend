import { useEffect, useState } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { IS_APPLE, mergeRegister } from "@lexical/utils";
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";

import { RedoIcon, UndoIcon } from "lucide-react";

import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { Button } from "@/components/shadcnUI/button";
import { ButtonGroup } from "@/components/shadcnUI/button-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcnUI/tooltip";

export function HistoryToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const { activeEditor, $updateToolbar } = useToolbarContext();
  const [isEditable, setIsEditable] = useState(editor.isEditable());
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [$updateToolbar, activeEditor, editor]);

  return (
    <ButtonGroup>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            disabled={!canUndo || !isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
            }}
            type="button"
            aria-label="Undo"
            size="icon-sm"
            variant={"ghost"}
          >
            <UndoIcon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{IS_APPLE ? "Undo (⌘Z)" : "Undo (Ctrl+Z)"}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            disabled={!canRedo || !isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(REDO_COMMAND, undefined);
            }}
            type="button"
            aria-label="Redo"
            variant={"ghost"}
            size="icon-sm"
          >
            <RedoIcon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{IS_APPLE ? "Redo (⇧⌘Z)" : "Redo (Ctrl+Y)"}</TooltipContent>
      </Tooltip>
    </ButtonGroup>
  );
}
