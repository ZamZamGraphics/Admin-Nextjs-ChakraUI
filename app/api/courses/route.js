export const dynamic = "force-dynamic"; // cacheable
export const revalidate = 60 * 5

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const session = await auth()
        const token = session?.accessToken

        const { searchParams } = new URL(req.url)
        const query = searchParams.toString()

        const res = await fetch(`${process.env.API_URL}/v2/courses${query ? "?" + query : ""}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: {
                tags: ['courses'],
                revalidate: 60 * 5
            },
        })

        const data = await res.json();
        return NextResponse.json(data)
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}