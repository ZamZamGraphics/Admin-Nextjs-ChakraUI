import { auth, signOut } from "@/auth"
import { NextResponse } from "next/server"
import { jwtVerify } from 'jose';

export default auth(async (req) => {
    const { pathname } = req.nextUrl

    const session = req.auth // NextAuth session
    const token = session?.accessToken || null

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
            const res = await signOut({ redirect: true, callbackUrl: "/login" })
            return res
        }
    }

    if (pathname.startsWith("/login")) {
        if (token) {
            return NextResponse.redirect(new URL("/admin", req.url))
        }
    }

    return NextResponse.next()
})


export const config = {
    matcher: [
        "/admin/:path*",
        "/invoice",
        "/login",
        "/",
    ],
}
