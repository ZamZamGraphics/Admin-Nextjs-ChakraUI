import { Suspense } from "react";
import { Alert } from "@chakra-ui/react";
import EditUser from "../_components/edit-user";
import { apiFetch } from "@/utils/apiServer";

async function page() {
    try {
        const res = await apiFetch(`/v2/users/me`)
        const user = await res.json()

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

