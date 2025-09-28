import { Suspense } from "react";
import { Alert } from "@chakra-ui/react";
import { serverFetchById } from "@/utils";
import EditUser from "../_components/edit-user";

async function page({ params }) {
    const { userId } = await params;
    try {
        const user = await serverFetchById('users', userId)
        return (
            <Suspense fallback="Loading Edit User...">
                <EditUser userInfo={user} />
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

