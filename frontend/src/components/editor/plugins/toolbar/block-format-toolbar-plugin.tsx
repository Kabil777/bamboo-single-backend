import { $isListNode, ListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, INSERT_CHECK_LIST_COMMAND } from "@lexical/list";
import { $isHeadingNode, $createHeadingNode, $createQuoteNode, type HeadingTagType } from "@lexical/rich-text";
import { $findMatchingParent, $getNearestNodeOfType } from "@lexical/utils";
import { $setBlocksType } from "@lexical/selection";
import { $createCodeNode } from "@lexical/code";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  type BaseSelection,
} from "lexical";

import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { useUpdateToolbarHandler } from "@/components/editor/editor-hooks/use-update-toolbar";
import { blockTypeToBlockName } from "@/components/editor/plugins/toolbar/block-format/block-format-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcnUI/dropdown-menu";
import { Button } from "@/components/shadcnUI/button";
import { ChevronDownIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcnUI/tooltip";

export function BlockFormatDropDown() {
  const { activeEditor, blockType, setBlockType } = useToolbarContext();

  function $updateToolbar(selection: BaseSelection) {
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
        }
      }
    }
  }

  useUpdateToolbarHandler($updateToolbar);

  const handleFormatChange = (value: string) => {
    if (value === blockType) return;
    
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (value === "paragraph") {
          $setBlocksType(selection, () => $createParagraphNode());
        } else if (value === "h1" || value === "h2" || value === "h3") {
          $setBlocksType(selection, () => $createHeadingNode(value as HeadingTagType));
        } else if (value === "quote") {
          $setBlocksType(selection, () => $createQuoteNode());
        } else if (value === "code") {
          $setBlocksType(selection, () => $createCodeNode());
        }
      }
    });

    if (value === "number") {
      activeEditor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else if (value === "bullet") {
      activeEditor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else if (value === "check") {
      activeEditor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    }
  };

  const { icon } = blockTypeToBlockName[blockType] ?? blockTypeToBlockName.paragraph;
  const currentLabel = blockTypeToBlockName[blockType]?.label ?? blockTypeToBlockName.paragraph.label;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-[140px] justify-between h-8 gap-1 px-2 shadow-none" size="sm">
              <div className="flex items-center gap-2 overflow-hidden">
                {icon}
                <span className="truncate text-sm">{currentLabel}</span>
              </div>
              <ChevronDownIcon className="size-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Block Format</TooltipContent>
      </Tooltip>
      <DropdownMenuContent>
        {Object.entries(blockTypeToBlockName).map(([key, { label, icon }]) => (
          <DropdownMenuItem key={key} onClick={() => handleFormatChange(key)} className="cursor-pointer">
            <div className="flex items-center gap-2">
              {icon}
              <span>{label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
