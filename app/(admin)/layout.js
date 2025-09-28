import AdminLayout from "@/components/admin/admin-layout"

async function DashboardLayout({ children }) {
    return (
        <AdminLayout>
            {children}
        </AdminLayout>
    )
}

export default DashboardLayout
