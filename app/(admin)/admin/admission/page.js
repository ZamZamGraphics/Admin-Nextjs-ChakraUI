"use client"

import { Box, Flex, Table, Text } from "@chakra-ui/react";
import Search from "@/components/admin/search";
import Pagination from "@/components/admin/pagination";
import AdmissionComponent from "./_components/admission-component";
import { useSearchParams } from "next/navigation";
import { useFetchData } from "@/hooks/useFetchData";
import Loading from "@/components/admin/loading";
import Error from "@/components/admin/error";

function AdmissionPage() {
    const searchParams = useSearchParams()
    const limit = Number(searchParams?.limit) || 10
    const { data: { admission, total }, loading, error } = useFetchData('admission', limit)

    let content = null
    if (loading) {
        content = <Loading col={7} />
    } else if (error) {
        content = <Error col={7} error={error} />
    } else {
        content = <AdmissionComponent data={admission} />
    }

    return (
        <Box>
            <Text textStyle="2xl" fontWeight="semibold" mb={2}>All Admission</Text>
            <Flex
                w="full"
                direction={{ base: "column", md: "row" }}
                alignItems="center"
                justify="space-between"
                gap={3}
                mb={3}
            >
                <Text textStyle="md">Total : {total}</Text>
                <Search placeholder="Search Admission" />
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
                            <Table.ColumnHeader>Course Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Batch No</Table.ColumnHeader>
                            <Table.ColumnHeader>Due</Table.ColumnHeader>
                            <Table.ColumnHeader>Next Pay Date</Table.ColumnHeader>
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

export default AdmissionPage
