"use server"
import { revalidateTag } from "next/cache";
import { auth } from "@/auth";

export async function addCourse(formData) {
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/courses/new`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })

        const data = await response.json();
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
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/courses/${id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })

        const data = await response.json();
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
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/courses/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        const data = await response.json();
        revalidateTag('courses')
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}
