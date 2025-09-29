"use server"
import { revalidateTag } from "next/cache";
import { auth } from "@/auth";

export async function addUser(formData) {
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/users/register`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })

        const data = await response.json();
        if (data?.success) {
            revalidateTag('users')
            return data;
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function updateUser(id, formData) {
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/users/${id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })

        const data = await response.json();
        if (data?.success) {
            revalidateTag('users')
            revalidateTag('user')
            return data;
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function deleteUser(id) {
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/users/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        const data = await response.json();
        revalidateTag('users')
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}
