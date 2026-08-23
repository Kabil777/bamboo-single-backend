import React from 'react'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/shadcnUI/navigation-menu"
import Link from 'next/link';
interface MenuItem {
    title: string;
    url: string;
    description?: string;
    icon?: React.ReactNode;
    items?: MenuItem[];
}
interface Navbar1Props {
    menu?: MenuItem[];
}


export const NavigationMenuBar = ({ menu }: Navbar1Props) => {

    return (
        <>
            <NavigationMenu >
                <NavigationMenuList>
                    {menu?.map((item) => <span key={item.title}>{renderMenuItem(item)}</span>)}
                </NavigationMenuList>
            </NavigationMenu>
        </>
    )
}

const renderMenuItem = (item: MenuItem) => {
    if (item.items) {
        return (
            <NavigationMenuItem key={item.title}>
                <NavigationMenuTrigger
                    className="group !text-primary !font-semibold inline-flex h-10 w-max items-center justify-center rounded-md bg-none px-4 py-2 text-sm transition-colors hover:bg-muted hover:!text-accent-foreground"
                >
                    {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-popover text-popover-foreground !w-[334px]">
                    {item.items.map((subItem) => (
                        <NavigationMenuLink asChild key={subItem.title} className='w-full'>
                            <SubMenuLink item={subItem} />
                        </NavigationMenuLink>
                    ))}
                </NavigationMenuContent>
            </NavigationMenuItem>
        );
    }

    return (
        <NavigationMenuItem key={item.title}>
            <Link
                href={item.url}
                className="group text-primary !font-semibold inline-flex h-10 w-max items-center justify-center rounded-md bg-none px-4 py-2 text-sm transition-colors hover:bg-muted hover:text-accent-foreground"
            >
                {item.title}
            </Link>
        </NavigationMenuItem>
    );
};
const SubMenuLink = ({ item }: { item: MenuItem }) => {
    return (
        <Link
            className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-foreground"
            href={item.url}
        >

            <div  className="[&_svg:not([class*='text-'])]:!text-foreground">{item.icon}</div>
            <div>
                <div className="text-sm font-semibold">{item.title}</div>
                {item.description && (
                    <p className="text-sm leading-snug text-muted-foreground">
                        {item.description}
                    </p>
                )}
            </div>
        </Link >
    );
};