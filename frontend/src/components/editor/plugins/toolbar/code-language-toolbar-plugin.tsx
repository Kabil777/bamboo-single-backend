import { useCallback, useState } from "react";

import { $isCodeNode } from "@lexical/code";
import { $isListNode } from "@lexical/list";
import { $findMatchingParent } from "@lexical/utils";
import {
  $getNodeByKey,
  $isRangeSelection,
  $isRootOrShadowRoot,
  type BaseSelection,
} from "lexical";

import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { useUpdateToolbarHandler } from "@/components/editor/editor-hooks/use-update-toolbar";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcnUI/tooltip";

export function CodeLanguageToolbarPlugin() {
  const { activeEditor } = useToolbarContext();
  const [codeLanguage, setCodeLanguage] = useState<string>("plain");
  const [selectedElementKey, setSelectedElementKey] = useState<string | null>(
    null,
  );

  const $updateToolbar = (selection: BaseSelection) => {
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
        setSelectedElementKey(elementKey);

        if (!$isListNode(element) && $isCodeNode(element)) {
          const language = element.getLanguage();
          setCodeLanguage(normalizeLanguageValue(language));
          return;
        }
      }
    }
  };

  useUpdateToolbarHandler($updateToolbar);

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            const newLang = value === "plain" ? "" : value;
            node.setLanguage(newLang);
          }
        }
      });
      setCodeLanguage(value);
    },
    [activeEditor, selectedElementKey],
  );

  return (
    <Select value={codeLanguage} onValueChange={onCodeLanguageSelect}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SelectTrigger onMouseDown={(e) => e.stopPropagation()}>
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
        </TooltipTrigger>
        <TooltipContent>Code Language</TooltipContent>
      </Tooltip>
      <SelectContent className="max-h-[300px] overflow-y-auto" onCloseAutoFocus={(e) => e.preventDefault()}>
        {CODE_LANGUAGE_OPTIONS.map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

