"use client"

import Header from "@/components/admin/header/header"
import Sidebar from "@/components/admin/sidebar/sidebar"
import {
    Box,
    Flex,
    Drawer,
    Button,
    CloseButton,
    Portal,
} from "@chakra-ui/react"
import { useState } from "react"
import { LuMenu } from "react-icons/lu"

function AdminLayout({ children, user }) {
    const [open, setOpen] = useState(false)

    const sidebarWidth = "240px"
    const headerHeight = "64px"

    return (
        <Flex h="full" flexDirection="row">
            <Box
                display={{ base: "none", md: "block" }}
                w={sidebarWidth}
                h="100vh"
                position="fixed"
                left="0"
                top="0"
                bg="bg"
                borderRight="1px solid"
                borderColor="border"
            >
                <Sidebar />
            </Box>

            <Drawer.Root
                placement="start"
                open={open}
                onOpenChange={(e) => setOpen(e.open)}
            >
                <Portal>
                    <Drawer.Backdrop />
                    <Drawer.Positioner>
                        <Drawer.Content>
                            <Drawer.Body>
                                <Sidebar />
                            </Drawer.Body>
                            <Drawer.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Drawer.CloseTrigger>
                        </Drawer.Content>
                    </Drawer.Positioner>
                </Portal>
                <Box ml={{ base: "0", md: sidebarWidth }} flex="1">
                    <Flex
                        h={headerHeight}
                        bg="bg"
                        borderBottom="1px solid"
                        borderColor="border"
                        position="fixed"
                        top="0"
                        left={{ base: "0", md: sidebarWidth }}
                        right="0"
                        zIndex="10"
                        alignItems="center"
                        px="4"
                        justify="space-between"
                    >

                        <Box
                            display={{ base: "inline-flex", md: "none" }}
                        >
                            <Drawer.Trigger asChild>
                                <Button
                                    variant="plain"
                                    size="sm"
                                    display={{ base: "inline-flex", md: "none" }}
                                    color="fg.muted"
                                ><LuMenu /></Button>
                            </Drawer.Trigger>
                        </Box>
                        <Box w="full">
                            <Header user={user} />
                        </Box>
                    </Flex>
                    <Box
                        mt={headerHeight}
                        p="6"
                        w="full"
                        minH={`calc(100vh - ${headerHeight})`}
                        position={{
                            base: "absolute",
                            lg: "relative"
                        }}
                    >
                        {children}
                    </Box>
                </Box>
            </Drawer.Root>
        </Flex>
    )
}

export default AdminLayout
