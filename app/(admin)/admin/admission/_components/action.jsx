"use client"

import { LuDownload, LuEllipsisVertical, LuPrinter, LuTrash } from "react-icons/lu"
import { Box, Dialog, Icon, Menu, Portal, useDisclosure } from "@chakra-ui/react"
import DeleteDialog from "./delete"
import Link from "next/link"

function Action({ id }) {
    const { open, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Menu.Root positioning={{ placement: "left-start" }}>
                <Menu.Trigger focusRing="none">
                    <Box rounded="full" p={2} _hover={{ color: "gray.fg", bg: "gray.subtle" }}>
                        <Icon size="lg">
                            <LuEllipsisVertical />
                        </Icon>
                    </Box>
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content>
                            <Menu.Item
                                value="print"
                                cursor="pointer"
                            // as={Link} href={`/print/${id}`}
                            >
                                <Icon><LuPrinter /></Icon>
                                Print
                            </Menu.Item>
                            <Menu.Item
                                value="download"
                                cursor="pointer"
                            >
                                <Icon><LuDownload /></Icon>
                                Download
                            </Menu.Item>
                            <Menu.Item
                                value="delete"
                                cursor="pointer"
                                color="fg.error"
                                _hover={{ bg: "bg.error", color: "fg.error" }}
                                onClick={onOpen}
                            ><Icon><LuTrash /></Icon>Delete</Menu.Item>
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
            <Dialog.Root
                open={open}
                onOpenChange={onClose}
                role="alertdialog"
            >
                <DeleteDialog id={id} />
            </Dialog.Root>
        </>
    )
}

export default Action
