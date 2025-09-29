"use server"
import { revalidateTag } from "next/cache";
import { auth } from "@/auth";

export async function addEmployee(formData) {
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/employee/register`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })

        const data = await response.json();
        if (data?.employee) {
            revalidateTag('employees')
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

export async function updateEmployee(id, formData) {
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/employee/${id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })

        const data = await response.json();
        if (data?.employee) {
            revalidateTag('employees')
            revalidateTag('employee')
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

export async function deleteEmployee(id) {
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/employee/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        const data = await response.json();
        revalidateTag('employees')
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}
