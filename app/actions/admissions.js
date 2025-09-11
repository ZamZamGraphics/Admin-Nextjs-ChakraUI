"use server"
import { cookies } from "next/headers";

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
