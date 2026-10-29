"use server"
import { revalidateTag } from "next/cache";
import { apiFetch } from "@/utils/apiServer";
import { signOut } from "@/auth";

export async function addExpense(formData) {
    try {
        const res = await apiFetch(`/v2/expenses/new`, {
            method: "POST",
            body: JSON.stringify(formData)
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json();

        if (data?.success) {
            revalidateTag('expenses')
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function updateExpense(id, formData) {
    try {
        const res = await apiFetch(`/v2/expenses/${id}`, {
            method: "PATCH",
            body: JSON.stringify(formData)
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json();

        if (data?.success) {
            revalidateTag('expenses')
            revalidateTag('expense')
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function deleteExpense(id) {
    try {
        const res = await apiFetch(`/v2/expenses/${id}`, {
            method: "DELETE",
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return { success: false, message: data.message || "Delete failed" };

        if (data?.success) {
            revalidateTag('expenses')
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}
