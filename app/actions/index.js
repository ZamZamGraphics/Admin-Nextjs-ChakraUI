"use server"
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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
