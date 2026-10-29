"use server"
import { revalidateTag } from "next/cache";
import { apiFetch } from "@/utils/apiServer";
import { signOut } from "@/auth";

export async function addCourse(formData) {
    try {
        const res = await apiFetch(`/v2/courses/new`, {
            method: "POST",
            body: JSON.stringify(formData)
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json();

        if (data?.course) {
            revalidateTag('courses')
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

export async function updateCourse(id, formData) {
    try {
        const res = await apiFetch(`/v2/courses/${id}`, {
            method: "PATCH",
            body: JSON.stringify(formData)
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json();

        if (data?.course) {
            revalidateTag('courses')
            revalidateTag('course')
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

export async function deleteCourse(id) {
    try {
        const res = await apiFetch(`/v2/courses/${id}`, {
            method: "DELETE",
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return { success: false, message: data.message || "Delete failed" };

        revalidateTag('courses')
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}
