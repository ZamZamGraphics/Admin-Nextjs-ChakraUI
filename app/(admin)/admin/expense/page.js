"use client"

import { Box, Flex, Table, Text } from "@chakra-ui/react";
import Pagination from "@/components/admin/pagination";
import Search from "@/components/admin/search";
import ExpenseComponent from "./_components/expense-component";
import { useFetchData } from "@/hooks/useFetchData";
import Loading from "@/components/admin/loading";
import Error from "@/components/admin/error";
import useSettings from "@/hooks/useSettings";

function ExpensePage() {
    const { limit } = useSettings()
    const { data: { expenses, total }, loading, error } = useFetchData('expenses', limit)

    let content = null
    if (loading) {
        content = <Loading col={6} />
    } else if (error) {
        content = <Error col={6} error={error} />
    } else {
        content = <ExpenseComponent data={expenses} />
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
                <Text textStyle="md">Total : {total}</Text>
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
                        {content}
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
            <Pagination
                limit={limit}
                totalData={total || 0}
            />
        </Box>
    )
}

export default ExpensePage
