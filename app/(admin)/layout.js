import AdminLayout from "@/components/admin/admin-layout"
import { getAuthUser } from "../actions"

async function DashboardLayout({ children }) {
    const authUser = await getAuthUser()
    return (
        <AdminLayout user={authUser}>
            {children}
        </AdminLayout>
    )
}

export default DashboardLayout
