import { Suspense } from "react";
import { Box, Flex, Table, Text } from "@chakra-ui/react";
import Search from "@/components/admin/search";
import Pagination from "@/components/admin/pagination";
import { getAllStudents } from "@/app/actions/students";
import StudentLoading from "./_components/student-loading";
import StudentComponent from "./_components/student-component";

async function page(props) {
    let totalData;
    const searchParams = await props.searchParams;

    const queryString = {
        page: Number(searchParams?.page) || 1,
        limit: Number(searchParams?.limit) || 10,
        search: searchParams?.search || ""
    }
    try {
        const response = await getAllStudents(queryString)
        totalData = response?.total || 0;
    } catch (err) {
        console.error(err);
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
                <Text textStyle="md">Total : {totalData}</Text>
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
                        <Suspense fallback={<StudentLoading />}>
                            <StudentComponent queryString={queryString} />
                        </Suspense>
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
            <Pagination
                queryString={queryString}
                totalData={totalData}
            />
        </Box>
    )
}

export default page
