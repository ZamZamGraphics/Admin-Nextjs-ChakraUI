import sidebarRoutes from "@/lib/sidebar-routes"
import Logo from "@/components/ui/logo"
import { Box } from "@chakra-ui/react"
import SidebarItemCollapse from "./sidebar-item-collapse"
import SidebarItem from "./sidebar-item"

function Sidebar() {
    return (
        <Box h="100vh" overflowY="auto">
            <Box py={4}>
                <Logo />
            </Box>
            {sidebarRoutes.map((route, index) =>
                route ? (
                    route.child ? (
                        <SidebarItemCollapse
                            item={route}
                            key={index}
                        //   handleDrawerToggle={handleDrawerToggle}
                        />
                    ) : (
                        <SidebarItem
                            item={route}
                            key={index}
                        //   handleDrawerToggle={handleDrawerToggle}
                        />
                    )
                ) : null
            )}
        </Box>
    )
}

export default Sidebar
