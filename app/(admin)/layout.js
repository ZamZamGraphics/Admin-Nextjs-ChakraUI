import AdminLayout from "@/components/admin/admin-layout"

function DashboardLayout({ children }) {
    return (
        <AdminLayout>
            {children}
        </AdminLayout>
    )
}

export default DashboardLayout
