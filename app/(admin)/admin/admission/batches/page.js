import { Suspense } from "react"
import Search from "@/components/admin/search"
import Pagination from "@/components/admin/pagination"
import { Flex, Grid, GridItem, Table, Text } from "@chakra-ui/react"
import LoadingBatches from "./_components/batches-loading";
import BatchesComponent from "./_components/batches-component";
import BatchEdit from "./_components/batch-edit";
import NewBatch from "./_components/new-batch";
import { serverFetch } from "@/utils";

async function page(props) {
    let totalData;
    const searchParams = await props.searchParams;

    const queryString = {
        page: Number(searchParams?.page) || 1,
        limit: Number(searchParams?.limit) || 10,
        search: searchParams?.search || "",
        from: searchParams?.from || "",
        to: searchParams?.to || ""
    }
    try {
        const response = await serverFetch('batches', queryString)
        totalData = response?.total || 0;
    } catch (err) {
        console.error(err);
    }

    return (
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="6">
            <GridItem>
                <Text mb={5} textStyle="2xl" fontWeight="semibold">Batches</Text>
                {searchParams?.edit ? (
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
                    <Text textStyle="md">Total : {totalData}</Text>
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
                            <Suspense fallback={<LoadingBatches />}>
                                <BatchesComponent queryString={queryString} />
                            </Suspense>
                        </Table.Body>
                    </Table.Root>
                </Table.ScrollArea>
                <Pagination
                    limit={queryString.limit}
                    totalData={totalData}
                />
            </GridItem>
        </Grid>
    )
}

export default page
