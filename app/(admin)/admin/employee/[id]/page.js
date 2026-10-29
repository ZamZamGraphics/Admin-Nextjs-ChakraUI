import { Suspense } from "react";
import { Alert } from "@chakra-ui/react";
import EditEmployee from "../_components/edit-employee";
import { apiFetch } from "@/utils/apiServer";

async function page({ params }) {
    const { id } = await params;
    try {
        const res = await apiFetch(`/v2/employee/${id}`)
        const employee = await res.json()
        
        return (
            <Suspense fallback="Loading Edit Employee...">
                <EditEmployee employeeInfo={employee} />
            </Suspense>
        )
    } catch (error) {
        return (
            <Alert.Root status="error">
                <Alert.Indicator />
                <Alert.Title>{error?.message}</Alert.Title>
            </Alert.Root>
        )
    }
}

export default page

