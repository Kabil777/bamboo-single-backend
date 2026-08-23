import { PlusIcon } from "lucide-react";

import { useEditorModal } from "@/components/editor/editor-hooks/use-modal";
import { Button } from "@/components/shadcnUI/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/shadcnUI/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcnUI/tooltip";

export function BlockInsertPlugin({ children }: { children: React.ReactNode }) {
  const [modal] = useEditorModal();

  return (
    <>
      {modal}
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 px-2">
                <PlusIcon className="size-4" />
                <span className="text-sm">Insert</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Insert Block</TooltipContent>
        </Tooltip>
        <DropdownMenuContent className="w-fit">{children}</DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
