import AdminLayout from "@/components/admin/admin-layout"
import { Suspense } from "react"

async function DashboardLayout({ children }) {
    return (
        <Suspense fallback="Loading...">
            <AdminLayout>
                {children}
            </AdminLayout>
        </Suspense>
    )
}

export default DashboardLayout
