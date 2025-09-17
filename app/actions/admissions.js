"use server"
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export async function getAllAdmission({ limit, page, search }) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        const response = await fetch(`${process.env.API_URL}/v2/admission?limit=${limit}&page=${page}&search=${search}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: {
                tags: ['admissions'],
            },
        })

        const data = await response.json();
        return {
            data: data[0]?.admission,
            total: data[0]?.total[0]?.totalRecords
        }
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function getAdmission(id) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        const response = await fetch(`${process.env.API_URL}/v2/admission/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: {
                tags: ['admission'],
            },
        })

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function addAdmission(formData) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

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
