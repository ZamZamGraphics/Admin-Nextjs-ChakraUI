"use server"
import { revalidateTag } from "next/cache";
import { apiFetch } from "@/utils/apiServer";
import { signOut } from "@/auth";

export async function addStudent(formData) {
    try {
        const res = await apiFetch(`/v2/students/register`, {
            method: "POST",
            body: formData
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json();

        if (data?.student) {
            revalidateTag('students')
            return {
                success: true,
                ...data.student
            }
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function updateStudent(id, formData) {
    try {
        const res = await apiFetch(`/v2/students/${id}`, {
            method: "PATCH",
            body: formData
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json();

        if (data?.student) {
            revalidateTag('students')
            revalidateTag('student')
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

export async function deleteStudent(id) {
    try {
        const res = await apiFetch(`/v2/students/${id}`, {
            method: "DELETE",
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return { success: false, message: data.message || "Delete failed" };
        
        revalidateTag('students')
        revalidateTag('admissions')
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}
