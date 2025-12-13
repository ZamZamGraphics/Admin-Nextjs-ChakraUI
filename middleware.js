import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth(async (req) => {
    const { pathname } = req.nextUrl
    const token = req.auth?.accessToken || null
    const privateRoute = ["/admin", "/invoice"];

    if (privateRoute.some(route => pathname.startsWith(route))) {
        if (!token) return NextResponse.redirect(new URL("/login", req.url))
    }

    if (pathname.startsWith("/login") && token) {
        return NextResponse.redirect(new URL("/admin", req.url))
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        "/admin/:path*",
        "/invoice",
        "/login",
    ],
}
