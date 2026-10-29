"use server"
import { revalidateTag } from "next/cache";
import { apiFetch } from "@/utils/apiServer";
import { signOut } from "@/auth";

export async function sendMessage(formData) {
    try {
        const res = await apiFetch(`/v2/messages/sms`, {
            method: "POST",
            body: JSON.stringify(formData)
        })

        if (res.status === 401) await signOut({ redirectTo: "/login?reason=session" });
        const data = await res.json();

        if (data?.success) {
            revalidateTag('message')
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
