import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req) {
    const session = await auth()
    const token = session?.accessToken
    // const { number, status, message } = req.body; পাঠাতে হবে
    try {
        const body = await req.json();
        const response = await fetch(`${process.env.API_URL}/v2/messages/sms`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })

        const data = await response.json();
        revalidateTag('sms-balance')

        return NextResponse.json(data, { status: res.status })
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
