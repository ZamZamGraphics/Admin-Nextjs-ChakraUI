export const dynamic = "force-dynamic"; // cacheable
export const revalidate = 300

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const session = await auth()
        const token = session?.accessToken

        const { searchParams } = new URL(req.url)
        const query = searchParams.toString()

        const res = await fetch(`${process.env.API_URL}/v2/employee${query ? "?" + query : ""}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: {
                tags: ['employees'],
                revalidate: 300
            },
        })

        const data = await res.json();
        return NextResponse.json(data, { status: res.status })
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}