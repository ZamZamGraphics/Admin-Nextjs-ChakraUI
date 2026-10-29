import { Suspense } from "react";
import { Alert } from "@chakra-ui/react";
import EditStudent from "../_components/student-edit";
import { apiFetch } from "@/utils/apiServer";

async function page({ params }) {
    const { stdId } = await params;
    try {
        const res = await apiFetch(`/v2/students/${stdId}`)
        const student = await res.json();
        return (
            <Suspense fallback="Loading Edit Student...">
                <EditStudent std={student} />
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


