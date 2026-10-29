"use client"

import { Box, Flex, Table, Text } from "@chakra-ui/react";
import Search from "@/components/admin/search";
import Pagination from "@/components/admin/pagination";
import UserComponent from "./_components/user-component";
import Loading from "@/components/admin/loading";
import Error from "@/components/admin/error";
import useSettings from "@/hooks/useSettings";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useApi from "@/hooks/useApi";

function UsersPage() {
    const { limit } = useSettings()
    const { data, refetch, loading, error } = useApi('users', { limit })

    const router = useRouter();
    const pathname = usePathname() || "/";
    const searchParams = useSearchParams();
    
    const items = data?.students || [];
    const page = Number(searchParams.get("page")) || 1;

    const handleChanged = async () => {
        if (items.length === 1 && page > 1) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", String(page - 1));
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            return;
        }
        await refetch();
    };

    let content = null
    if (loading) {
        content = <Loading col={6} />
    } else if (error) {
        content = <Error col={6} error={error} />
    } else {
        content = <UserComponent data={data?.users} onChanged={handleChanged} />
    }

    return (
        <Box>
            <Text textStyle="2xl" fontWeight="semibold" mb={2}>All Users</Text>
            <Flex
                w="full"
                direction={{ base: "column", md: "row" }}
                alignItems="center"
                justify="space-between"
                gap={3}
                mb={3}
            >
                <Text textStyle="md">Total : {data?.total}</Text>
                <Search placeholder="Search User" />
            </Flex>
            <Table.ScrollArea borderWidth="1px" maxW="full">
                <Table.Root size="sm" variant="outline" bg="bg">
                    <Table.Header bg="bg.emphasized">
                        <Table.Row>
                            <Table.ColumnHeader>Full Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Username</Table.ColumnHeader>
                            <Table.ColumnHeader>Email</Table.ColumnHeader>
                            <Table.ColumnHeader>Role</Table.ColumnHeader>
                            <Table.ColumnHeader>Status</Table.ColumnHeader>
                            <Table.ColumnHeader
                                textAlign="center"
                                minW="50px"
                            >
                                Actions
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body textStyle="md">
                        {content}
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
            <Pagination
                limit={limit}
                totalData={data?.total || 0}
            />
        </Box>
    )
}

export default UsersPage
