"use server"
import { revalidateTag } from "next/cache";
import { apiFetch } from "@/utils/apiServer";
import { signOut } from "@/auth";

export async function addEmployee(formData) {
    try {
        const res = await apiFetch(`/v2/employee/register`, {
            method: "POST",
            body: formData
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json();
        
        if (data?.employee) {
            revalidateTag('employees')
            return {
                success: true,
                ...data.employee
            }
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function updateEmployee(id, formData) {
    try {
        const res = await apiFetch(`/v2/employee/${id}`, {
            method: "PATCH",
            body: formData
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json();
        
        if (data?.employee) {
            revalidateTag('employees')
            revalidateTag('employee')
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

export async function deleteEmployee(id) {
    try {
        const res = await apiFetch(`/v2/employee/${id}`, {
            method: "DELETE",
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return { success: false, message: data.message || "Delete failed" };
        
        revalidateTag('employees')
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}
