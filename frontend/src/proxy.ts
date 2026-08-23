import { NextRequest, NextResponse } from "next/server";

const PUBLIC_EXACT_ROUTES = new Set(["/", "/login", "/signup", "/callback", "/search", "/docs"]);
const PUBLIC_ROUTE_PREFIXES = ["/blog/", "/docs/"];

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const isPublicRoute =
        PUBLIC_EXACT_ROUTES.has(pathname) ||
        PUBLIC_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
    const token = req.cookies.get("rf_token")?.value;

    if (isPublicRoute && !token) {
        return NextResponse.next();
    }

    if (!isPublicRoute && !token) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("next", `${pathname}${req.nextUrl.search}`);
        return NextResponse.redirect(loginUrl);
    }

    // if (isPublicRoute && token) {
    //     return NextResponse.redirect(new URL("/", req.url));
    // }

    if (token) {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.jpg|.*\\.png|.*\\.svg|.*\\.webp).*)",
    ],
};
