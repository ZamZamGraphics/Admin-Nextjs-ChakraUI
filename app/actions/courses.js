"use server"
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export async function getAllCourses({ limit, page, search } = {}) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const query = [
        limit ? `limit=${limit}` : "",
        page ? `page=${page}` : "",
        search ? `search=${search}` : ""
    ].filter(Boolean).join("&");

    try {
        const response = await fetch(`${process.env.API_URL}/v2/courses${query ? "?" + query : ""}`, {
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

export async function addCourse(formData) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

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
            revalidateTag(['courses'])
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
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

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
            revalidateTag(['courses', 'course'])
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
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    try {
        const response = await fetch(`${process.env.API_URL}/v2/courses/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        const data = await response.json();
        revalidateTag(['courses', 'course'])
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}
