import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
    const token = request.cookies.get("GHGAuthToken")?.value;
    const { pathname } = request.nextUrl;
    const maintenanceMode = process.env.GHG_MAINTENANCE_MODE === "true";

    if (
        maintenanceMode &&
        !request.nextUrl.pathname.startsWith("/maintenance.html") &&
        !request.nextUrl.pathname.startsWith("/_next") &&
        !request.nextUrl.pathname.startsWith("/favicon") &&
        !request.nextUrl.pathname.startsWith("/images/logo")
    ) {
        const url = request.nextUrl.clone();
        url.pathname = "/maintenance.html";
        return NextResponse.rewrite(url);
    }

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/static") ||
        pathname.startsWith("/icon") ||
        pathname.startsWith("/images")
    ) {
        return NextResponse.next();
    }
    const publicPath = [
        "/login",
        "/register",
        "/reset-password",
        "/verify-email",
        "rest-password-email",
    ];
    const isPublicPath = publicPath.some(
        (page) => pathname.startsWith(page) || pathname.endsWith(page)
    );

    if (isPublicPath && !token) {
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|api|static).*)"],
};
