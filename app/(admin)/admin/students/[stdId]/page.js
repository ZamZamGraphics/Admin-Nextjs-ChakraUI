import { getStudent } from "@/app/actions/students";
import { Alert } from "@chakra-ui/react";
import EditStudent from "../_components/student-edit";
import { Suspense } from "react";

async function page({ params }) {
    const { stdId } = await params;
    try {
        const student = await getStudent(stdId)
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


