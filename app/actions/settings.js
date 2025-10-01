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