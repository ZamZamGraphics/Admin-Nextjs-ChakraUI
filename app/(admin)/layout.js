import AdminLayout from "@/components/admin/admin-layout"
import { Suspense } from "react"
import { auth } from "@/auth"
import { jwtVerify } from "jose";

async function DashboardLayout({ children }) {
    const session = await auth();
    let token = null;

    if (session?.accessToken) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(session?.accessToken, secret);
            token = true
        } catch (err) {
            // console.log(err)
        }
    }

    return (
        <Suspense fallback="Loading...">
            <AdminLayout auth={token}>
                {children}
            </AdminLayout>
        </Suspense>
    )
}

export default DashboardLayout
