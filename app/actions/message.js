"use server"
import { revalidateTag } from "next/cache";
import { auth } from "@/auth";

export async function sendMessage(formData) {
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/messages/sms`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })

        const data = await response.json();
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

