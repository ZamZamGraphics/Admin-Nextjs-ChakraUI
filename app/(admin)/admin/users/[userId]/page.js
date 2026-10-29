import { Suspense } from "react";
import { Alert } from "@chakra-ui/react";
import EditUser from "../_components/edit-user";
import { apiFetch } from "@/utils/apiServer";

async function page({ params }) {
    const { userId } = await params;
    try {
        const res = await apiFetch(`/v2/users/${userId}`)
        const user = await res.json()
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

