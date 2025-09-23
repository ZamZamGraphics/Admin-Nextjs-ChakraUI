"use server"
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { jwtVerify } from 'jose';
import { getUser } from './users';

export async function ceredntialLogin(formData) {
    try {
        const username = formData.get("username")
        const password = formData.get("password")

        const response = await fetch(`${process.env.API_URL}/v2/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        const data = await response.json();

        if (data?.success) {
            const cookieStore = await cookies()
            cookieStore.set({
                name: 'token',
                value: data.token,
                httpOnly: true,
                secure: true,
                path: '/',
                maxAge: 60 * 60 * 24, // 1 day
            })
        }

        return data;
    } catch (error) {
        throw new Error("Internal Server Error");
    }
}

export async function logout() {
    (await cookies()).delete('token')
    redirect("/login")
}

export async function getAuthUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    try {
        // Use TextEncoder for Edge compatibility
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const user = await getUser(payload?.userid)
        return {
            avatar: user.avatar,
            fullname: user.fullname,
            status: user.status,
            role: user.role
        }
    } catch (error) {
        res.cookies.delete("token")
        redirect("/login")
    }
}
