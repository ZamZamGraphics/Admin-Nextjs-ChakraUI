"use server"
import { revalidateTag } from "next/cache";
import { apiFetch } from "@/utils/apiServer";
import { signOut } from "@/auth";

export async function updateSettings(id, formData) {
    try {
        const res = await apiFetch(`/v2/settings/${id}`, {
            method: "PATCH",
            body: JSON.stringify(formData)
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json();

        if (data?.success) {
            revalidateTag('settings')
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function setup2FA() {
    try {
        const res = await apiFetch("/v2/auth/2fa/setup", {
            method: "POST",
            body: JSON.stringify({})
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json();

        if (data?.success) {
            revalidateTag('settings')
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function confirm2FASetup(verifyOTP) {
    try {
        const res = await apiFetch("/v2/auth/2fa/verify-setup", {
            method: "POST",
            body: JSON.stringify({ token: verifyOTP })
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json();

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
    try {
        const res = await apiFetch("/v2/auth/2fa/disable", {
            method: "POST",
            body: JSON.stringify({ password })
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json();
        
        if (data?.success) {
            revalidateTag('user')
            revalidateTag('settings')
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}