import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { jwtVerify } from 'jose';

export default auth(async (req) => {
    const { pathname } = req.nextUrl
    const token = req.auth?.accessToken || null
    const privateRoute = ["/admin", "/invoice"];

    if (pathname === "/") return NextResponse.redirect(new URL("/admin", req.url))

    if (privateRoute.some(route => pathname.startsWith(route))) {
        if (!token) return redirectToLogin(req)
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(token, secret);
        } catch (error) {
            return redirectToLogin(req)
        }
    }

    if (pathname.startsWith("/login") && token) {
        return NextResponse.redirect(new URL("/admin", req.url))
    }

    return NextResponse.next()
})

function redirectToLogin(req) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("autologout", "1")
    return NextResponse.redirect(loginUrl)
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/invoice",
        "/login",
        "/",
    ],
}
