import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { slug } = await params
        const session = await auth()
        const token = session?.accessToken

        const res = await fetch(`${process.env.API_URL}/v2/admission/${slug[0]}/${slug[1]}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })

        const data = await res.json();
        return NextResponse.json(data)
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}