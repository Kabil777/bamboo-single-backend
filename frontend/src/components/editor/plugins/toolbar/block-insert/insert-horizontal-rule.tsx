import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";

import { ScissorsIcon } from "lucide-react";

import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { Button } from "@/components/shadcnUI/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcnUI/tooltip";

export function InsertHorizontalRule() {
  const { activeEditor } = useToolbarContext();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() =>
            activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
          }
        >
          <ScissorsIcon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Insert Horizontal Rule</TooltipContent>
    </Tooltip>
  );
}
