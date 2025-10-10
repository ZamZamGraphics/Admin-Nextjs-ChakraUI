"use client"

import { Flex, Grid, GridItem, Table, Text } from "@chakra-ui/react"
import Search from "@/components/admin/search"
import Pagination from "@/components/admin/pagination"
import CoursesComponent from "./_components/courses-component";
import CourseEdit from "./_components/course-edit";
import NewCourse from "./_components/new-course";
import { useSearchParams } from "next/navigation";
import { useFetchData } from "@/hooks/useFetchData";
import Loading from "@/components/admin/loading";
import Error from "@/components/admin/error";
import { useEffect, useState } from "react";

function CoursesPage() {
    const [edit, setEdit] = useState(false)
    const searchParams = useSearchParams()
    const limit = 10
    const { data: { courses, total }, loading, error } = useFetchData('courses', limit)

    useEffect(() => {
        if (searchParams.get("edit")) setEdit(true)
    }, [searchParams])

    let content = null
    if (loading) {
        content = <Loading col={5} />
    } else if (error) {
        content = <Error col={5} error={error} />
    } else {
        content = <CoursesComponent data={courses} />
    }

    return (
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="6">
            <GridItem>
                <Text mb={5} textStyle="2xl" fontWeight="semibold">Courses</Text>
                {edit ? (
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
                    <Text textStyle="md">Total : {total}</Text>
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
                            {content}
                        </Table.Body>
                    </Table.Root>
                </Table.ScrollArea>
                <Pagination
                    limit={limit}
                    totalData={total || 0}
                />
            </GridItem>
        </Grid>
    )
}

export default CoursesPage
