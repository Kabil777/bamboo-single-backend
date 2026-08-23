"use client";

import { NavBar } from "@/components/ui";
import { SearchCommandPalette } from "@/components/ui/searchCommandPalette";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import { getAuthentication } from "@/store/reducers/AuthReducers";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
        const dispatch = useAppDispatch();
        const authFetched = useRef(false);
        const { status } = useAppState((s) => s.userReducer);
        const router = useRouter();
        const pathname = usePathname();
        const isPublicReaderRoute =
            pathname === "/" ||
            pathname === "/search" ||
            pathname === "/docs" ||
            pathname.startsWith("/docs/") ||
            pathname.startsWith("/blog/") ||
            pathname.startsWith("/profile/");

        useEffect(() => {
          if (!isPublicReaderRoute && !authFetched.current && status === "idle") {
            authFetched.current = true;
            dispatch(getAuthentication());
          }
        }, [isPublicReaderRoute, status, dispatch]);

        useEffect(() => {
            if (!isPublicReaderRoute && (status === "logged_out" || status === "unauthorized")) {
                const redirectTarget = pathname
                    ? `/login?next=${encodeURIComponent(pathname)}`
                    : "/login";
                router.replace(redirectTarget);
            }
        }, [isPublicReaderRoute, pathname, router, status]);
    return (
        <>
            <NavBar />
            <div className="pt-[3.6rem]">
                {children}
            </div>
            {pathname !== "/search" && <SearchCommandPalette />}
        </>
    );
}
