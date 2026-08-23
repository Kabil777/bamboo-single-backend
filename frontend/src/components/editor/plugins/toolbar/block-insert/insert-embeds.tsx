import { INSERT_EMBED_COMMAND } from "@lexical/react/LexicalAutoEmbedPlugin";

import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { EmbedConfigs } from "@/components/editor/plugins/embeds/auto-embed-plugin";
import { Button } from "@/components/shadcnUI/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcnUI/tooltip";

export function InsertEmbeds() {
  const { activeEditor } = useToolbarContext();
  return EmbedConfigs.map((embedConfig) => (
    <Tooltip key={embedConfig.type}>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            activeEditor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type);
          }}
        >
          {embedConfig.icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Insert {embedConfig.contentName}</TooltipContent>
    </Tooltip>
  ));
}
