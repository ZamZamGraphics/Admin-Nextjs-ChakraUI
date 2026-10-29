"use client"

import { Flex, Grid, GridItem, Table, Text } from "@chakra-ui/react"
import Search from "@/components/admin/search"
import Pagination from "@/components/admin/pagination"
import BatchesComponent from "./_components/batches-component";
import BatchEdit from "./_components/batch-edit";
import NewBatch from "./_components/new-batch";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/admin/loading";
import Error from "@/components/admin/error";
import { useEffect, useState } from "react";
import useSettings from "@/hooks/useSettings";
import useApi from "@/hooks/useApi";

function BatchPage() {
    const [edit, setEdit] = useState(false)
    const searchParams = useSearchParams()
    const pathname = usePathname() || "/";
    const { replace } = useRouter();

    const { limit } = useSettings();
    const { data, refetch, loading, error } = useApi('batches', { limit })

    useEffect(() => {
        if (searchParams.get("edit")) {
            setEdit(true)
        } else {
            setEdit(false)
        }
    }, [searchParams])

    const handleChanged = async () => {
        replace(pathname);
        await refetch();
    };

    let content = null
    if (loading) {
        content = <Loading col={7} />
    } else if (error) {
        content = <Error col={7} error={error} />
    } else {
        content = <BatchesComponent data={data?.batches} onChanged={handleChanged} />
    }

    return (
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="6">
            <GridItem>
                <Text mb={5} textStyle="2xl" fontWeight="semibold">Batches</Text>
                {edit ? (
                    <BatchEdit />
                ) : (
                    <NewBatch />
                )}
            </GridItem>
            <GridItem colSpan={2}>
                <Flex
                    w="full"
                    direction={{ base: "column", md: "row" }}
                    alignItems="center"
                    justify="space-between"
                    gap={3}
                    mb={3}
                >
                    <Text textStyle="md">Total : {data?.total}</Text>
                    <Search placeholder="Search Batches" />
                </Flex>
                <Table.ScrollArea borderWidth="1px" maxW="full">
                    <Table.Root size="sm" variant="outline" bg="bg">
                        <Table.Header bg="bg.emphasized">
                            <Table.Row>
                                <Table.ColumnHeader>Batch No</Table.ColumnHeader>
                                <Table.ColumnHeader>Course Name</Table.ColumnHeader>
                                <Table.ColumnHeader>Class Time</Table.ColumnHeader>
                                <Table.ColumnHeader>Start & End</Table.ColumnHeader>
                                <Table.ColumnHeader>Class Days</Table.ColumnHeader>
                                <Table.ColumnHeader>Students</Table.ColumnHeader>
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
            </GridItem>
        </Grid>
    )
}

export default BatchPage
