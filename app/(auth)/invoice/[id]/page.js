import { getAdmission } from '@/app/actions/admissions'
import { Button, HStack } from '@chakra-ui/react'
import Link from 'next/link'

async function page({ params }) {
    const { id } = await params

    try {
        const response = await getAdmission(id)
        console.log(response)
    } catch (e) {
        console.log(e.message)
    }

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
