"use server"
import { revalidateTag } from "next/cache";
import { auth } from "@/auth";

export async function addExpense(formData) {
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/expenses/new`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })

        const data = await response.json();
        if (data?.success) {
            revalidateTag('expenses')
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function updateExpense(id, formData) {
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/expenses/${id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })

        const data = await response.json();
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
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/expenses/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        const data = await response.json();
        if (data?.success) {
            revalidateTag('expenses')
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}
