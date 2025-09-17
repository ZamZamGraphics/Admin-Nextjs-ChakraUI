import { NextResponse } from "next/server"
import { jwtVerify } from 'jose';

export async function middleware(req) {
    const { pathname } = req.nextUrl

    const token = req.cookies.get("token")?.value

    if (pathname === "/") {
        return NextResponse.redirect(new URL("/admin", req.url))
    }

    // 🛠 Protect admin routes
    const privateRoute = ["/admin", "/invoice"];

    if (privateRoute.some(route => pathname.startsWith(route))) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url))
        }

        try {
            // Use TextEncoder for Edge compatibility
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(token, secret);
        } catch (error) {
            const res = NextResponse.redirect(new URL("/login", req.url))
            res.cookies.delete("token")
            return res
        }
    }

    if (pathname.startsWith("/login")) {
        if (token) {
            return NextResponse.redirect(new URL("/admin", req.url))
        }
    }

    return NextResponse.next()
}


export const config = {
    matcher: [
        "/admin/:path*",
        "/invoice",
        "/login",
        "/",
    ],
}
