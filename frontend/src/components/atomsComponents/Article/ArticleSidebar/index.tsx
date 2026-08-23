"use client";

import { ChevronDown } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/shadcnUI/sidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/shadcnUI/collapsible";
import { useAppState } from "@/hooks/ReduxHooks";
import Link from "next/link";
import { useParams } from "next/navigation";

export function ArticleSidebar({
    navData,
    activeId,
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    navData?: any[];
    activeId?: string;
}) {
    const { id } = useParams() as { id: string | string[] };
    const docId = typeof id === "string" ? id : Array.isArray(id) ? id[0] : "";
    const NavData = navData ?? useAppState((s) => (docId ? s.docsReducer?.entities[docId]?.tree : []) || []);
    return (
        <Sidebar {...props}>
            <SidebarContent className="custom-scroll scroll-smooth !bg-background px-3">
                <div className="from-background via-background/80 to-background/0 sticky -top-1 z-10 h-6 shrink-0 bg-gradient-to-b"></div>

                <SidebarGroup className="px-0">
                    <SidebarMenu className="gap-2">
                        {/* <SidebarMenuButton
                            asChild
                            isActive={activeId ? activeId === "overview" : id[1] == null}
                        >
                            <Link
                                href={
                                    "/docs/" +
                                    id[0]
                                }
                                className="font-semibold text-sm"
                            >
                                OverView
                            </Link>
                        </SidebarMenuButton> */}
                        {NavData.map((item: any) => {
                            const subItems = item.subPages || item.subTree;
                            const hasChildren = subItems && subItems.length > 0;
                            const isOverviewItem =
                                item.id === id[0] ||
                                item.title?.trim().toLowerCase() === "overview";
                            const itemHref = isOverviewItem
                                ? "/docs/" + id[0]
                                : "/docs/" + id[0] + "/" + item.id;

                            return (
                                <Collapsible
                                    key={item.id}
                                    defaultOpen
                                    className="group/collapsible"
                                >
                                    <SidebarMenuItem>
                                        <div className="flex items-center gap-1">
                                            <SidebarMenuButton
                                                asChild
                                                isActive={activeId ? activeId === item.id : id[1] === item.id}
                                                className="flex-1"
                                            >
                                                <Link
                                                    href={itemHref}
                                                    className="font-semibold text-sm"
                                                >
                                                    {item.title}
                                                </Link>
                                            </SidebarMenuButton>
                                            {hasChildren && (
                                                <CollapsibleTrigger asChild>
                                                    <button className="p-1 rounded-md hover:bg-accent transition-colors">
                                                        <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180 text-muted-foreground" />
                                                    </button>
                                                </CollapsibleTrigger>
                                            )}
                                        </div>
                                        {hasChildren && (
                                            <CollapsibleContent>
                                                <SidebarMenuSub className="ml-2 border-l border-border">
                                                    {subItems.map((subitem: any) => (
                                                        <SidebarMenuSubItem
                                                            key={subitem.id}
                                                            className="my-0.5"
                                                        >
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                isActive={
                                                                    activeId
                                                                        ? activeId === subitem.id
                                                                        : id[2] === subitem.id
                                                                }
                                                                className="text-sm py-1"
                                                            >
                                                                <Link
                                                                    href={
                                                                        "/docs/" +
                                                                        id[0] +
                                                                        "/" +
                                                                        item.id +
                                                                        "/" +
                                                                        subitem.id
                                                                    }
                                                                >
                                                                    {subitem.title}
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        )}
                                    </SidebarMenuItem>
                                </Collapsible>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
                <div className="from-background via-background/80 to-background/0 sticky -bottom-2 z-10 h-12 shrink-0 bg-gradient-to-t"></div>
            </SidebarContent>
        </Sidebar>
    );
}
