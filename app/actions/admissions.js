"use server"
import { revalidateTag } from "next/cache";
import { auth } from "@/auth";

export async function addAdmission(formData) {
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/admission/new`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })

        const data = await response.json();
        if (data?.admission) {
            revalidateTag('admissions')
            revalidateTag('admission')
            revalidateTag('students')
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
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/admission/payment`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })

        const data = await response.json();
        if (data?.admission) {
            revalidateTag('admissions')
            revalidateTag('admission')
            revalidateTag('students')
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
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/admission/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        const data = await response.json();
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
