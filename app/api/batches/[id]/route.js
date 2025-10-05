export const dynamic = "force-dynamic"; // cacheable
export const revalidate = 300

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { id } = await params
        const session = await auth()
        const token = session?.accessToken

        const res = await fetch(`${process.env.API_URL}/v2/batches/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: {
                tags: ['batch'],
                revalidate: 300
            },
        })

        const data = await res.json();
        return NextResponse.json(data, { status: res.status })
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}