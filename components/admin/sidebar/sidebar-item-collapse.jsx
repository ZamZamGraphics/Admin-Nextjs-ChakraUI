"use client"

import { Accordion, Box, Flex, Icon } from "@chakra-ui/react";
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import SidebarItem from "./sidebar-item";

function SidebarItemCollapse({ item, closeDrawer }) {
    const pathname = usePathname()
    const [openItems, setOpenItems] = useState([])

    useEffect(() => {
        if (
            item.child?.some(
                (route) =>
                    route.path === pathname || pathname.startsWith(route.path)
            )
        ) {
            setOpenItems([item.title])
        } else {
            setOpenItems([])
        }
    }, [pathname, item])

    return item ? (
        <Accordion.Root
            collapsible
            variant="plain"
            value={openItems}
            onValueChange={(e) => {
                setOpenItems(e.value)
            }}
        >
            <Accordion.Item value={item.title}>
                <Accordion.ItemTrigger
                    px={3}
                    py={2}
                    textStyle="lg"
                    color="fg.muted"
                    cursor="pointer"
                    borderRadius="none"
                    _hover={{ color: "green.fg", bg: "green.subtle" }}
                >
                    <Flex align="center" justify="space-between" w="full" gap="2">
                        <Flex align="center" gap="3">
                            {item.icon && (
                                <Icon as={item.icon.type} />
                            )}
                            <Box as="span">{item.title}</Box>
                        </Flex>
                        <Accordion.ItemIndicator />
                    </Flex>
                </Accordion.ItemTrigger>
                <Accordion.ItemContent pl="7">
                    {item.child?.map((route, index) =>
                        route ? (
                            route.child ? (
                                <SidebarItemCollapse
                                    item={route}
                                    key={index}
                                    closeDrawer={closeDrawer}
                                />
                            ) : (
                                <SidebarItem
                                    item={route}
                                    key={index}
                                    closeDrawer={closeDrawer}
                                />
                            )
                        ) : null
                    )}
                </Accordion.ItemContent>
            </Accordion.Item>
        </Accordion.Root>
    ) : null;
}

export default SidebarItemCollapse
