import { ImageIcon } from "lucide-react";

import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { InsertImageDialog } from "@/components/editor/extensions/images-extension";
import { Button } from "@/components/shadcnUI/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcnUI/tooltip";

export function InsertImage() {
  const { activeEditor, showModal } = useToolbarContext();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            showModal("Insert Image", (onClose) => (
              <InsertImageDialog activeEditor={activeEditor} onClose={onClose} />
            ));
          }}
        >
          <ImageIcon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Insert Image</TooltipContent>
    </Tooltip>
  );
}
