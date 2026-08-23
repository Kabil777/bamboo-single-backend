"use client";

import { ChevronDown, FileText, FolderOpen } from "lucide-react";
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
import Link from "next/link";

type NavigationItem = {
    id: string;
    title: string;
    subPages?: NavigationItem[];
    subTree?: NavigationItem[];
};

export function ArticleSidebar({
    docId,
    documentTitle,
    navData,
    activeId,
}: React.ComponentProps<typeof Sidebar> & {
    docId: string;
    documentTitle: string;
    navData: NavigationItem[];
    activeId?: string;
}) {
    const menu = (
        <SidebarGroup className="px-0">
            <SidebarMenu className="gap-2">
                {navData.map((item) => {
                    const subItems = item.subPages || item.subTree;
                    const hasChildren = subItems && subItems.length > 0;
                    const isOverviewItem =
                        item.id === docId ||
                        item.title?.trim().toLowerCase() === "overview";
                    const itemHref = isOverviewItem
                        ? `/docs/${docId}`
                        : `/docs/${docId}/${item.id}`;

                    return (
                        <Collapsible key={item.id} defaultOpen className="group/collapsible">
                            <SidebarMenuItem>
                                <div className="flex items-center gap-1">
                                    <SidebarMenuButton
                                        asChild
                                        isActive={activeId === item.id}
                                        className="h-auto min-h-8 flex-1 items-start rounded-md px-2.5 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-primary/10 data-[active=true]:font-semibold data-[active=true]:text-primary dark:data-[active=true]:bg-primary/15"
                                    >
                                        <Link href={itemHref} className="flex min-w-0 items-start gap-2 text-sm leading-5">
                                            {hasChildren ? <FolderOpen className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" /> : <FileText className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />}
                                            <span className="min-w-0 whitespace-normal">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                    {hasChildren && (
                                        <CollapsibleTrigger asChild>
                                            <button className="mt-1 rounded-md p-1 transition-colors hover:bg-muted/80">
                                                <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180 text-muted-foreground" />
                                            </button>
                                        </CollapsibleTrigger>
                                    )}
                                </div>
                                {hasChildren && (
                                    <CollapsibleContent>
                                        <SidebarMenuSub className="ml-2 border-l border-border pl-2">
                                            {subItems.map((subitem) => (
                                                <SidebarMenuSubItem key={subitem.id} className="my-0.5">
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={activeId === subitem.id}
                                                        className="h-auto min-h-7 items-start rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-primary/10 data-[active=true]:font-semibold data-[active=true]:text-primary dark:data-[active=true]:bg-primary/15"
                                                    >
                                                        <Link href={`/docs/${docId}/${item.id}/${subitem.id}`} className="flex min-w-0 items-start gap-2 leading-5">
                                                            <FileText className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                                                            <span className="min-w-0 whitespace-normal">{subitem.title}</span>
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
    );

    const tree = (
        <div className="px-2 pb-2 pt-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <FolderOpen className="size-4 shrink-0 text-primary" />
                <span className="truncate">{documentTitle}</span>
            </div>
            <div className="relative ml-2 mt-2 border-l border-border pl-2">
                {menu}
            </div>
        </div>
    );

    return (
        <>
            <Sidebar className="lg:hidden">
                <SidebarContent className="custom-scroll scroll-smooth !bg-background px-3">
                    <div className="from-background via-background/80 to-background/0 sticky -top-1 z-10 h-6 shrink-0 bg-gradient-to-b" />
                    {tree}
                    <div className="from-background via-background/80 to-background/0 sticky -bottom-2 z-10 h-12 shrink-0 bg-gradient-to-t" />
                </SidebarContent>
            </Sidebar>

            <Sidebar
                collapsible="none"
                className="fixed left-12 top-[4.5rem] z-30 hidden h-[calc(100vh-5.25rem)] !w-72 rounded-xl border border-border/70 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70 lg:flex dark:border-border/80 dark:bg-card/75"
            >
                <SidebarContent className="custom-scroll !bg-transparent px-3">
                    <div className="from-card via-card/80 to-card/0 sticky -top-1 z-10 h-6 shrink-0 bg-gradient-to-b" />
                    {tree}
                    <div className="from-card via-card/80 to-card/0 sticky -bottom-2 z-10 h-12 shrink-0 bg-gradient-to-t" />
                </SidebarContent>
            </Sidebar>
        </>
    );
}
