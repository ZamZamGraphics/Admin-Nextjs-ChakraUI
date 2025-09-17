import { Box, Button, HStack } from '@chakra-ui/react'
import Link from 'next/link'

function page() {
    return (
        <Box>
            <h3>Dashboard Home Page</h3>
            <HStack>
                <Button asChild colorPalette="blue">
                    <Link href="/">Home</Link>
                </Button>
                <Button asChild colorPalette="green">
                    <Link href="/login">Login</Link>
                </Button>
            </HStack>
        </Box>
    )
}

export default page
