import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcnUI/tooltip";


export default function ToolTip({ children, title }: { children: React.ReactNode, title: string }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent side="top" className="rounded-xl">{title}</TooltipContent>
        </Tooltip>

    );
}