"use server"
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export async function getAllUsers({ limit, page, search }) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        const response = await fetch(`${process.env.API_URL}/v2/users?limit=${limit}&page=${page}&search=${search}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: {
                tags: ['users'],
            },
        })

        const data = await response.json();

        return {
            data: data?.users,
            total: data?.total
        }
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}
