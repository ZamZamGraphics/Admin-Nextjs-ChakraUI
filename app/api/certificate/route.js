import { auth } from "@/auth";

export async function POST(req) {
    const session = await auth()
    const token = session?.accessToken
    try {
        const body = await req.json();
        const { batchNo, studentId } = body;

        if (!batchNo || !studentId) {
            return Response.json(
                { message: 'Batch No, Student ID are required' },
                { status: 400 }
            );
        }

        const response = await fetch(`${process.env.API_URL}/v2/admission/${batchNo}/${studentId}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        })

        const data = await response.json();

        if (data?.success) {
            return Response.json({ ...data });
        }
        return Response.json({
            success: false,
            message: data?.errors?.message || data?.message
        });
    } catch (error) {
        throw new Error('Failed to generate certificate');
    }
}
