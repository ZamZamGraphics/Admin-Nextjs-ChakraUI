import { Suspense } from "react";
import { Alert } from "@chakra-ui/react";
import { serverFetchById } from "@/utils";
import EditStudent from "../_components/student-edit";

async function page({ params }) {
    const { stdId } = await params;
    try {
        const student = await serverFetchById('students', stdId)
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


