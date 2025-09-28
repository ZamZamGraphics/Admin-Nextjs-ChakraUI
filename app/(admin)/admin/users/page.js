import { Suspense } from "react";
import { serverFetch } from "@/utils";
import { Box, Flex, Table, Text } from "@chakra-ui/react";
import Search from "@/components/admin/search";
import Pagination from "@/components/admin/pagination";
import UserLoading from "./_components/user-loading";
import UserComponent from "./_components/user-component";

async function page(props) {
    let totalData;
    const searchParams = await props.searchParams;

    const queryString = {
        page: Number(searchParams?.page) || 1,
        limit: Number(searchParams?.limit) || 30,
        search: searchParams?.search || ""
    }
    try {
        const response = await serverFetch('users', queryString)
        totalData = response?.total || 0;
    } catch (err) {
        console.error(err);
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
                <Text textStyle="md">Total : {totalData}</Text>
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
                        <Suspense fallback={<UserLoading />}>
                            <UserComponent queryString={queryString} />
                        </Suspense>
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
            <Pagination
                limit={queryString.limit}
                totalData={totalData}
            />
        </Box>
    )
}

export default page
