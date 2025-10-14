"use client"

import { Button } from "@chakra-ui/react"
import { useRouter } from "next/navigation"

function BackButton({ children, ...props }) {
    const router = useRouter()

    return (
        <Button
            {...props}
            variant="plain"
            onClick={() => router.back()}
        >
            {children}
        </Button>
    )
}

export default BackButton
