import { serverFetch } from "@/utils"
import { Alert } from "@chakra-ui/react"
import { Suspense } from "react"
import SettingsPages from "./edit-settings"

async function page() {
    try {
        const settings = await serverFetch('settings')
        return (
            <Suspense fallback="Loading Settings page...">
                <SettingsPages initial={settings} />
            </Suspense>
        )
    } catch (err) {
        return (
            <Alert.Root status="error">
                <Alert.Indicator />
                <Alert.Title>{err?.message}</Alert.Title>
            </Alert.Root>
        )
    }
}

export default page
