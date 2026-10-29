"use server"
import { revalidateTag } from "next/cache";
import { apiFetch } from "@/utils/apiServer";
import { signOut } from "@/auth";

export async function addBatch(formData) {
    try {
        const res = await apiFetch("/v2/batches/new", {
            method: "POST",
            body: JSON.stringify(formData)
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json();

        if (data?.batch) {
            revalidateTag('batches')
            return {
                success: true,
                ...data
            }
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function updateBatch(id, formData) {
    try {
        const res = await apiFetch(`/v2/batches/${id}`, {
            method: "PATCH",
            body: JSON.stringify(formData)
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json();

        if (data?.batch) {
            revalidateTag('batches')
            revalidateTag('batch')
            return {
                success: true,
                ...data
            }
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function deleteBatch(id) {
    try {
        const res = await apiFetch(`/v2/batches/${id}`, {
            method: "DELETE",
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return { success: false, message: data.message || "Delete failed" };

        revalidateTag('batches')
        revalidateTag('students')
        revalidateTag('admissions')
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}
