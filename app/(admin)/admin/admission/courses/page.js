import { Suspense } from "react"
import { serverFetch } from "@/utils";
import Search from "@/components/admin/search"
import Pagination from "@/components/admin/pagination"
import { Flex, Grid, GridItem, Table, Text } from "@chakra-ui/react"
import CoursesComponent from "./_components/courses-component";
import LoadingCourses from "./_components/courses-loading";
import CourseEdit from "./_components/course-edit";
import NewCourse from "./_components/new-course";

async function page(props) {
    let totalData;
    const searchParams = await props.searchParams;

    const queryString = {
        page: Number(searchParams?.page) || 1,
        limit: Number(searchParams?.limit) || 10,
        search: searchParams?.search || ""
    }
    try {
        const response = await serverFetch('courses', queryString)
        totalData = response?.total || 0;
    } catch (err) {
        console.error(err);
    }

    return (
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="6">
            <GridItem>
                <Text mb={5} textStyle="2xl" fontWeight="semibold">Courses</Text>
                {searchParams?.edit ? (
                    <CourseEdit />
                ) : (
                    <NewCourse />
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
                    <Search placeholder="Search Courses" />
                </Flex>
                <Table.ScrollArea borderWidth="1px" maxW="full">
                    <Table.Root size="sm" variant="outline" bg="bg">
                        <Table.Header bg="bg.emphasized">
                            <Table.Row>
                                <Table.ColumnHeader>Name</Table.ColumnHeader>
                                <Table.ColumnHeader>Type</Table.ColumnHeader>
                                <Table.ColumnHeader>Duration</Table.ColumnHeader>
                                <Table.ColumnHeader>Course Fee</Table.ColumnHeader>
                                <Table.ColumnHeader
                                    textAlign="center"
                                    minW="50px"
                                >
                                    Actions
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body textStyle="md">
                            <Suspense fallback={<LoadingCourses />}>
                                <CoursesComponent queryString={queryString} />
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
