import { useState } from "react";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { TableIcon } from "lucide-react";

import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { Button } from "@/components/shadcnUI/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcnUI/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcnUI/tooltip";
import { cn } from "@/lib/utils";

const MAX_ROWS = 10;
const MAX_COLS = 10;

export function TableHoverPlugin() {
  const { activeEditor } = useToolbarContext();
  const [hoveredRow, setHoveredRow] = useState(0);
  const [hoveredCol, setHoveredCol] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const insertTable = (rows: number, cols: number) => {
    activeEditor.dispatchCommand(INSERT_TABLE_COMMAND, {
      rows: String(rows),
      columns: String(cols),
    });
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <TableIcon className="size-4" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Insert Table</TooltipContent>
      </Tooltip>
      <PopoverContent className="w-fit p-3" align="start">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-muted-foreground text-center">
            {hoveredRow > 0 && hoveredCol > 0 ? `${hoveredRow} x ${hoveredCol}` : "Insert Table"}
          </span>
          <div 
            className="grid gap-1" 
            style={{ gridTemplateColumns: `repeat(${MAX_COLS}, minmax(0, 1fr))` }}
            onMouseLeave={() => {
              setHoveredRow(0);
              setHoveredCol(0);
            }}
          >
            {Array.from({ length: MAX_ROWS }).map((_, rowIndex) =>
              Array.from({ length: MAX_COLS }).map((_, colIndex) => {
                const isHovered = rowIndex < hoveredRow && colIndex < hoveredCol;
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={cn(
                      "size-4 rounded-sm border cursor-pointer transition-colors duration-75",
                      isHovered ? "bg-primary border-primary" : "bg-transparent border-border hover:bg-muted"
                    )}
                    onMouseEnter={() => {
                      setHoveredRow(rowIndex + 1);
                      setHoveredCol(colIndex + 1);
                    }}
                    onClick={() => insertTable(rowIndex + 1, colIndex + 1)}
                  />
                );
              })
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
