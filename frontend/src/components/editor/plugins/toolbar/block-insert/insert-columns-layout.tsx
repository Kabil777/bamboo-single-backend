import { Columns3Icon } from "lucide-react";

import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { InsertLayoutDialog } from "@/components/editor/plugins/layout-plugin";
import { Button } from "@/components/shadcnUI/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcnUI/tooltip";

export function InsertColumnsLayout() {
  const { activeEditor, showModal } = useToolbarContext();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() =>
            showModal("Insert Columns Layout", (onClose) => (
              <InsertLayoutDialog activeEditor={activeEditor} onClose={onClose} />
            ))
          }
        >
          <Columns3Icon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Insert Columns Layout</TooltipContent>
    </Tooltip>
  );
}
