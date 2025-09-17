"use server"
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export async function getAllCourses(search) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    try {
        const response = await fetch(`${process.env.API_URL}/v2/courses?search=${search}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: {
                tags: ['courses'],
            },
        })

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function getCourse(id) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    try {
        const response = await fetch(`${process.env.API_URL}/v2/courses/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: {
                tags: ['course'],
            },
        })

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}
