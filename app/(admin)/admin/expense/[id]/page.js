import { Box, Text } from '@chakra-ui/react'
import React from 'react'

async function page({ params }) {
    const { id } = await params
    return (
        <Box>
            <Text mb={5} textStyle="2xl" fontWeight="semibold">Edit : {id}</Text>
        </Box>
    )
}

export default page
