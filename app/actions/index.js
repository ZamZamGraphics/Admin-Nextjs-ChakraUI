"use server"
import { jwtVerify } from 'jose';
import { getUser } from './users';
import { auth, signOut } from '@/auth';

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
        return data;
    } catch (error) {
        throw new Error("Internal Server Error");
    }
}

export async function logout() {
    await signOut({ redirect: true, callbackUrl: "/login" })
}

export async function getAuthUser() {
    const session = await auth()
    const token = session?.accessToken || null
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
        await signOut({ redirect: true, callbackUrl: "/login" })
    }
}
