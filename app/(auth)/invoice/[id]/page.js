import { Button, HStack } from '@chakra-ui/react'
import Link from 'next/link'

async function page({ params }) {
    const { id } = await params
    return (
        <div>
            <h3>Admission ID : {id}</h3>
            <HStack>
                <Button asChild colorPalette="blue">
                    <Link href="/">Home</Link>
                </Button>
                <Button asChild colorPalette="green">
                    <Link href="/login">Login</Link>
                </Button>
            </HStack>
        </div>
    )
}

export default page
