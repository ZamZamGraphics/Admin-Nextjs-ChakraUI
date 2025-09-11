import { Box, Button, Flex, Icon } from '@chakra-ui/react'
import AvatarMenu from './header-menu'
import Link from 'next/link'
import { LuPlus } from 'react-icons/lu'
import { ColorModeButton } from "@/components/ui/color-mode";

function Header() {
    return (
        <Flex align="center" justify="space-between" gap="2">
            <Flex align="center" gap="3">
                <Button variant="subtle" colorPalette="blue" asChild>
                    <Link href="/admin/students">
                        All Student
                    </Link>
                </Button>
                <Box rounded="full" p={2} _hover={{ color: "gray.fg", bg: "gray.subtle" }}>
                    <Link href="/admin/students/new">
                        <Icon size="lg">
                            <LuPlus />
                        </Icon>
                    </Link>
                </Box>
                <ColorModeButton />
            </Flex>
            <AvatarMenu />
        </Flex>
    )
}

export default Header
