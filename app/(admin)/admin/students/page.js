"use client"

import { Box, Flex, Table, Text } from "@chakra-ui/react";
import Search from "@/components/admin/search";
import Pagination from "@/components/admin/pagination";
import StudentComponent from "./_components/student-component";
import { useFetchData } from "@/hooks/useFetchData";
import Loading from "@/components/admin/loading";
import Error from "@/components/admin/error";
import useSettings from "@/hooks/useSettings";

function StudentPage() {
    const {limit} = useSettings()
    const { data: { students, total }, loading, error } = useFetchData('students', limit)

    let content = null
    if (loading) {
        content = <Loading col={8} />
    } else if (error) {
        content = <Error col={8} error={error} />
    } else {
        content = <StudentComponent data={students} />
    }

    return (
        <Box>
            <Text textStyle="2xl" fontWeight="semibold" mb={2}>All Students</Text>
            <Flex
                w="full"
                direction={{ base: "column", md: "row" }}
                alignItems="center"
                justify="space-between"
                gap={3}
                mb={3}
            >
                <Text textStyle="md">Total : {total}</Text>
                <Search placeholder="Search Student" />
            </Flex>
            <Table.ScrollArea borderWidth="1px" maxW="full">
                <Table.Root size="sm" variant="outline" bg="bg">
                    <Table.Header bg="bg.emphasized">
                        <Table.Row>
                            <Table.ColumnHeader
                                textAlign="center"
                                minW="80px"
                            >
                                Student ID
                            </Table.ColumnHeader>
                            <Table.ColumnHeader>Student Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Mobile</Table.ColumnHeader>
                            <Table.ColumnHeader>Course Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Batch No</Table.ColumnHeader>
                            <Table.ColumnHeader>Status</Table.ColumnHeader>
                            <Table.ColumnHeader>Due</Table.ColumnHeader>
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

export default StudentPage
