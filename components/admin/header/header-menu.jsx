import { signOut } from "next-auth/react"
import { api } from "@/utils/clientFetch"
import { Avatar, Icon, Menu, Portal } from "@chakra-ui/react"
import { LuLogOut, LuSettings, LuUser } from "react-icons/lu"
import { getImageUrl } from "@/utils/getImageUrl"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function AvatarMenu() {
    const [user, setUser] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            const res = await api("/v2/users/me");
            const data = await res.json();
            setUser(data);
        }
        fetchUser()
    },[]);
    
    const avatar = getImageUrl(user?.avatar);

    const handleLogout = async () => {
        await api("/v2/auth/logout")
        await signOut({ redirectTo: "/login?reason=session" });
    }

    return (
        <Menu.Root>
            <Menu.Trigger rounded="full" focusRing="outside">
                <Avatar.Root size="sm" cursor="pointer">
                    <Avatar.Fallback name={user?.fullname} />
                    <Avatar.Image src={avatar} />
                </Avatar.Root>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.Item cursor="pointer">
                            <Avatar.Root size="sm" cursor="pointer">
                                <Avatar.Fallback name={user?.fullname} />
                                <Avatar.Image src={avatar} />
                            </Avatar.Root>
                            {user?.fullname}
                        </Menu.Item>
                        <Menu.Separator />
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
                        <Menu.Item
                            value="logout"
                            cursor="pointer"
                            onClick={handleLogout}
                        >
                            <Icon><LuLogOut /></Icon>
                            Logout
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    )
}
