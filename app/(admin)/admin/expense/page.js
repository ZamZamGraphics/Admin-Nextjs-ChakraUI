import Pagination from "@/components/admin/pagination";
import Search from "@/components/admin/search";
import { serverFetch } from "@/utils";
import { Box, Flex, Table, Text } from "@chakra-ui/react";
import { Suspense } from "react";
import LoadingExpense from "./_components/expense-loading";
import ExpenseComponent from "./_components/expense-component";

async function page(props) {
    let totalData;
    const searchParams = await props.searchParams;

    const queryString = {
        page: Number(searchParams?.page) || 1,
        limit: Number(searchParams?.limit) || 10,
        search: searchParams?.search || ""
    }
    try {
        const response = await serverFetch('expenses', queryString)
        totalData = response?.total || 0;
    } catch (err) {
        console.error(err);
    }

    return (
        <Box>
            <Text mb={5} textStyle="2xl" fontWeight="semibold">Courses</Text>
            <Flex
                w="full"
                direction={{ base: "column", md: "row" }}
                alignItems="center"
                justify="space-between"
                gap={3}
                mb={3}
            >
                <Text textStyle="md">Total : {totalData}</Text>
                <Search placeholder="Search Expense" />
            </Flex>
            <Table.ScrollArea borderWidth="1px" maxW="full">
                <Table.Root size="sm" variant="outline" bg="bg">
                    <Table.Header bg="bg.emphasized">
                        <Table.Row>
                            <Table.ColumnHeader>Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Type</Table.ColumnHeader>
                            <Table.ColumnHeader>Description</Table.ColumnHeader>
                            <Table.ColumnHeader>Amount</Table.ColumnHeader>
                            <Table.ColumnHeader>Date</Table.ColumnHeader>
                            <Table.ColumnHeader
                                textAlign="center"
                                minW="50px"
                            >
                                Actions
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body textStyle="md">
                        <Suspense fallback={<LoadingExpense />}>
                            <ExpenseComponent queryString={queryString} />
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
