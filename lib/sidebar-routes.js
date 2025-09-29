import {
    LuLayoutDashboard,
    LuUsers,
    LuGraduationCap,
    LuSettings,
    LuDollarSign,
} from "react-icons/lu";

const sidebarRoutes = [
    {
        path: "/admin",
        title: "Dashboard",
        icon: <LuLayoutDashboard />,
    },
    {
        path: "/admin/students",
        title: "Students",
        icon: <LuUsers />,
        child: [
            {
                path: "/admin/students",
                title: "All Students",
            },
            {
                path: "/admin/students/new",
                title: "Add New",
            },
        ],
    },
    {
        path: "/admin/admission",
        title: "Admission",
        icon: <LuGraduationCap />,
        child: [
            {
                path: "/admin/admission",
                title: "All Admission",
            },
            {
                path: "/admin/admission/new",
                title: "Add New",
            },
            {
                path: "/admin/admission/payment",
                title: "Payment",
            },
            {
                path: "/admin/admission/courses",
                title: "Courses",
            },
            {
                path: "/admin/admission/batches",
                title: "Batches",
            },
        ],
    },
    {
        path: "/admin/expense",
        title: "Expense",
        icon: <LuDollarSign />,
        child: [
            {
                path: "/admin/expense",
                title: "All Expense",
            },
            {
                path: "/admin/expense/new",
                title: "Add New",
            }
        ],
    },
    {
        path: "/admin/employee",
        title: "Employee",
        icon: <LuUsers />,
        child: [
            {
                path: "/admin/employee",
                title: "All Employee",
            },
            {
                path: "/admin/employee/new",
                title: "Add New",
            }
        ],
    },
    {
        path: "/admin/users",
        title: "Users",
        icon: <LuUsers />,
        child: [
            {
                path: "/admin/users",
                title: "All Users",
            },
            {
                path: "/admin/users/new",
                title: "Add New",
            },
            {
                path: "/admin/users/profile",
                title: "Profile",
            },
        ],
    },
    {
        path: "/admin/settings",
        title: "Settings",
        icon: <LuSettings />,
    },
];

export default sidebarRoutes;
