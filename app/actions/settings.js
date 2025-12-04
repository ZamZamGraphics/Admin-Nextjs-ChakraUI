"use server"
import { revalidateTag } from "next/cache";
import { auth } from "@/auth";

export async function updateSettings(id, formData) {
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/settings/${id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })

        const data = await response.json();
        if (data?.success) {
            revalidateTag('settings')
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function setup2FA() {
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/auth/2fa/setup`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        })

        const data = await response.json();
        if (data?.success) {
            revalidateTag('settings')
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function confirm2FASetup(verifyOTP) {
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/auth/2fa/verify-setup`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: verifyOTP })
        })

        const data = await response.json();
        if (data?.success) {
            revalidateTag('user')
            revalidateTag('settings')
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function disable2FA(password) {
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/auth/2fa/disable`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password })
        })

        const data = await response.json();
        if (data?.success) {
            revalidateTag('user')
            revalidateTag('settings')
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}