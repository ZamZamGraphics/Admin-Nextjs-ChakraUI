'use client'
import { logout } from '@/app/actions'
import { Box } from '@chakra-ui/react'

function Logout() {

    const handleLogout = async () => await logout()

    return (
        <Box onClick={handleLogout}>
            Logout
        </Box>
    )
}

export default Logout
