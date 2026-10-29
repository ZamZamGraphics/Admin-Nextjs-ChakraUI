"use server"
import { revalidateTag } from "next/cache";
import { apiFetch } from "@/utils/apiServer";
import { signOut } from "@/auth";

export async function addUser(formData) {
    try {
        const res = await apiFetch(`/v2/users/register`, {
            method: "POST",
            body: formData
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json();

        if (data?.success) {
            revalidateTag('users')
            return data;
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function updateUser(id, formData) {
    try {
        const res = await apiFetch(`/v2/users/${id}`, {
            method: "PATCH",
            body: formData
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json();

        if (data?.success) {
            revalidateTag('users')
            revalidateTag('user')
            return data;
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function deleteUser(id) {
    try {
        const res = await apiFetch(`/v2/users/${id}`, {
            method: "DELETE",
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return { success: false, message: data.message || "Delete failed" };

        revalidateTag('users')
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}
