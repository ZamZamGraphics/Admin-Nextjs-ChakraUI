"use server"
import { revalidateTag } from "next/cache";
import { apiFetch } from "@/utils/apiServer";
import { signOut } from "@/auth";

export async function addAdmission(formData) {
    try {
        const res = await apiFetch("/v2/admission/new", {
            method: "POST",
            body: JSON.stringify(formData)
        });
        
        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json();

        if (data?.admission) {
            revalidateTag('admissions')
            revalidateTag('admission')
            revalidateTag('students')
            revalidateTag('sms-balance')
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

export async function addPayment(formData) {
    try {
        const res = await apiFetch("/v2/admission/payment", {
            method: "POST",
            body: JSON.stringify(formData)
        });

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json();

        if (data?.admission) {
            revalidateTag('admissions')
            revalidateTag('admission')
            revalidateTag('students')
            revalidateTag('sms-balance')
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

export async function deleteAdmission(id) {
    try {
        const res = await apiFetch(`/v2/admission/${id}`, {
            method: "DELETE",
        });
        
        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return { success: false, message: data.message || "Delete failed" };

        if (data?.success) {
            revalidateTag('admissions')
            revalidateTag('admission')
            revalidateTag('students')
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}
