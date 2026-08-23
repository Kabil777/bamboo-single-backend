import { StaticImageData } from "next/image";
import React from "react";
import { CiMenuFries } from "react-icons/ci";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/shadcnUI/accordion";
import { Logo } from "@/components/atomsComponents";
import { Button } from "@/components/shadcnUI/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/shadcnUI/drawer";
import Link from "next/link";
import { XIcon } from "lucide-react";
interface MenuItem {
    title: string;
    url: string;
    description?: string;
    icon?: React.ReactNode;
    items?: MenuItem[];
}

interface NavbarProps {
    logo?: {
        url: string;
        src: string | StaticImageData;
        alt: string;
        title: string;
    };
    menu?: MenuItem[];
    auth?: {
        login: {
            title: string;
            url: string;
        };
        signup: {
            title: string;
            url: string;
        };
    };
}

export function SideNavBarMenu({ menu, auth }: NavbarProps) {
    return (
        <Drawer direction="left">
            <DrawerTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="flex items-center "
                >
                    <CiMenuFries className="size-4 stroke-2 text-foreground" />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm overflow-auto">
                    <DrawerHeader className="relative">
                        <DrawerTitle>
                            <Logo />
                        </DrawerTitle>
                        <DrawerClose className="absolute top-2 right-0" asChild>
                            <Button variant="link">
                                <XIcon className="size-4" />
                            </Button>
                        </DrawerClose>
                    </DrawerHeader>
                    <div className="flex flex-col gap-6 p-4">
                        <Accordion
                            type="single"
                            collapsible
                            className="flex w-full flex-col gap-4"
                        >
                            {menu?.map((item) => (
                                <React.Fragment key={item.title}>
                                    {renderMobileMenuItem(item)}
                                </React.Fragment>
                            ))}
                        </Accordion>
                    </div>
                    <DrawerFooter>
                        {auth && (
                            <div className="flex flex-col gap-3 ">
                                <Button asChild variant="outline">
                                    <a href={auth?.login.url}>
                                        {auth?.login.title}
                                    </a>
                                </Button>
                                <Button asChild>
                                    <a href={auth?.signup.url}>
                                        {auth?.signup.title}
                                    </a>
                                </Button>
                            </div>
                        )}
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
const renderMobileMenuItem = (item: MenuItem) => {
    if (item.items) {
        return (
            <AccordionItem
                key={item.title}
                value={item.title}
                className="border-b-0"
            >
                <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
                    {item.title}
                </AccordionTrigger>
                <AccordionContent className="mt-2">
                    {item.items.map((subItem) => (
                        <SubMenuLink key={subItem.title} item={subItem} />
                    ))}
                </AccordionContent>
            </AccordionItem>
        );
    }

    return (
        <Link
            key={item.title}
            href={item.url}
            className="text-md font-semibold"
        >
            {item.title}
        </Link>
    );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
    return (
        <Link
            className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted"
            href={item.url}
        >
            <div className="text-foreground">{item.icon}</div>
            <div>
                <div className="text-sm font-semibold">{item.title}</div>
                {item.description && (
                    <p className="text-sm leading-snug text-muted-foreground">
                        {item.description}
                    </p>
                )}
            </div>
        </Link>
    );
};
