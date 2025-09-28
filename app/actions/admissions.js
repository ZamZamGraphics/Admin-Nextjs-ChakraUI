"use server"
import { revalidateTag } from "next/cache";
import { auth } from "@/auth";

export async function getAllAdmission({ limit, page, search, from, to } = {}) {
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

        const response = await fetch(`${process.env.API_URL}/v2/admission${query ? "?" + query : ""}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: {
                tags: ['admissions'],
            },
        })

        const data = await response.json();
        return data
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function getAdmission(id) {
    const session = await auth()
    const token = session?.accessToken

    try {
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

export async function getStdAdmission(batchNo, studentId) {
    const session = await auth()
    const token = session?.accessToken

    try {
        const response = await fetch(`${process.env.API_URL}/v2/admission/${batchNo}/${studentId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

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
