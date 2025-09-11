"use client"

import { Icon, Box } from "@chakra-ui/react"
import { usePathname } from "next/navigation"
import Link from 'next/link';

function SidebarItem({ item }) {
    const pathname = usePathname()

    const color = pathname === item.path ? "green.fg" : "fg.muted"
    const bgColor = pathname === item.path ? "green.subtle" : ""

    return item && item.path ? (
        <Box
            px={3}
            py={2}
            textStyle="lg"
            fontWeight={500}
            color={color}
            bg={bgColor}
            _hover={{ color: "green.fg", bg: "green.subtle" }}
        >
            <Link
                className="flex gap-3 items-center"
                href={item.path}
            //   onClick={handleDrawerToggle}
            //   selected={pathname === item.path && true}
            >
                {item.icon &&
                    <Icon>{item.icon}</Icon>
                }
                {item.title}
            </Link>
        </Box>
    ) : null;
}

export default SidebarItem
