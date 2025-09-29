import { Suspense } from "react";
import { Alert } from "@chakra-ui/react";
import { serverFetchById } from "@/utils";
import EditEmployee from "../_components/edit-employee";

async function page({ params }) {
    const { id } = await params;
    try {
        const employee = await serverFetchById('employee', id)
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

