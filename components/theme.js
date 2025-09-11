import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
    globalCss: {
        body: {
            bg: "bg.muted",
        },
    }
})

export const theme = createSystem(defaultConfig, customConfig)