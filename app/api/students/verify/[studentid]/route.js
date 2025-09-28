export const dynamic = "force-dynamic"; // cacheable
export const revalidate = 60

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { studentid } = await params
        const session = await auth()
        const token = session?.accessToken

        const res = await fetch(`${process.env.API_URL}/v2/students/verify/${studentid}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: { revalidate: 60 },
        })

        const data = await res.json();
        return NextResponse.json(data)
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}