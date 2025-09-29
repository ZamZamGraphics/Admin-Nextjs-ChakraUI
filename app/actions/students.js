"use server"
import { revalidateTag } from "next/cache";
import { auth } from "@/auth";

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
            revalidateTag('students')
            revalidateTag('student')
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
        revalidateTag('students')
        revalidateTag('admissions')
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}
