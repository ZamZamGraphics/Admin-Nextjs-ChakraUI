import AdminLayout from "@/components/admin/admin-layout"
import { apiFetch } from "@/utils/apiServer";
import { redirect } from "next/navigation";
import { Suspense } from "react"

async function DashboardLayout({ children }) {
    const res = await apiFetch("/v2/users/me");
    if (res.status === 401) redirect("/api/force-logout");

    return (
        <Suspense fallback="Loading...">
            <AdminLayout>
                {children}
            </AdminLayout>
        </Suspense>
    )
}

export default DashboardLayout
