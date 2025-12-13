import { Suspense } from "react";
import { Alert } from "@chakra-ui/react";
import EditUser from "../_components/edit-user";
import { auth } from "@/auth";
import { serverFetchById } from "@/utils";

async function page() {
    try {
        const session = await auth();
        const userId = session.userid
        const user = await serverFetchById('users', userId)
        return (
            <Suspense fallback="Loading User Profile...">
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

