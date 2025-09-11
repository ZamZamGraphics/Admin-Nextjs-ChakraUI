import { Avatar, Icon, Menu, Portal } from "@chakra-ui/react"
import { LuLogOut, LuSettings, LuUser } from "react-icons/lu"
import Logout from "../logout"
import Link from "next/link"

export default function AvatarMenu() {
    return (
        <Menu.Root>
            <Menu.Trigger rounded="full" focusRing="outside">
                <Avatar.Root size="sm" cursor="pointer">
                    <Avatar.Fallback name="Segun Adebayo" />
                    <Avatar.Image src="https://bit.ly/sage-adebayo" />
                </Avatar.Root>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.Item
                            value="account"
                            cursor="pointer"
                            as={Link} href="/admin/users/profile"
                        >
                            <Icon><LuUser /></Icon>
                            Account
                        </Menu.Item>
                        <Menu.Item
                            value="settings"
                            cursor="pointer"
                            as={Link} href="/admin/settings"
                        >
                            <Icon><LuSettings /></Icon>
                            Settings
                        </Menu.Item>
                        <Menu.Item value="logout" cursor="pointer">
                            <Icon><LuLogOut /></Icon>
                            <Logout />
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    )
}
