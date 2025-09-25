"use server"
import { revalidateTag } from "next/cache";
import { auth } from "@/auth";

export async function getAllStudents({ limit, page, search, from, to } = {}) {
    const session = await auth()
    const token = session?.accessToken

    const query = [
        limit ? `limit=${limit}` : "",
        page ? `page=${page}` : "",
        search ? `search=${search}` : "",
        from ? `from=${from}` : "",
        to ? `to=${to}` : "",
    ].filter(Boolean).join("&");

    try {
        const response = await fetch(`${process.env.API_URL}/v2/students${query ? "?" + query : ""}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: {
                tags: ['students'],
            },
        })

        const data = await response.json();
        return data
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function getStudent(id) {
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/students/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: {
                tags: ['student'],
            },
        })

        const data = await response.json();
        return data
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function getStudentByStudentId(studentId) {
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/students/verify/${studentId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })

        const data = await response.json();
        return data
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function addStudent(formData) {
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/students/register`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })

        const data = await response.json();
        if (data?.student) {
            revalidateTag('students')
            return {
                success: true,
                ...data.student
            }
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function updateStudent(id, formData) {
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/students/${id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })

        const data = await response.json();
        if (data?.student) {
            revalidateTag(['students', 'student'])
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

export async function deleteStudent(id) {
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/students/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        const data = await response.json();
        revalidateTag(['students', 'student', 'admissions'])
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}
