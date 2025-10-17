"use client"

import { Table, Text, Alert } from '@chakra-ui/react'
import { clientFetch } from '@/utils/client-fetch'
import { useEffect, useState } from 'react'
import Loading from './loading'
import Error from './error'
import dayjs from 'dayjs'

function UpcomingBatches() {
    const [batches, setBatches] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                const from = dayjs(new Date()).format("YYYY-MM-DD")
                const filter = { limit: 8, from }
                const res = await clientFetch('batches', filter)
                setBatches(res?.batches)
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [])

    let content = null
    if (loading) {
        content = <Loading col={4} />
    } else if (error) {
        content = <Error col={4} error={error} />
    } else {
        content = <BatchesComponent data={batches} />
    }

    return (
        <Table.ScrollArea borderWidth="1px" maxW="full">
            <Table.Root size="sm" variant="outline" bg="bg">
                <Table.Header bg="bg.emphasized">
                    <Table.Row>
                        <Table.ColumnHeader>Batch</Table.ColumnHeader>
                        <Table.ColumnHeader>Course Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Start & End</Table.ColumnHeader>
                        <Table.ColumnHeader>Class Days</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body textStyle="md">
                    {content}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    )
}

export default UpcomingBatches

function BatchesComponent({ data }) {
    return (
        <>
            {data?.length > 0 ? data.map((batch) => (
                <Table.Row key={batch._id}>
                    <Table.Cell>
                        <Text fontWeight="semibold" textStyle="lg">
                            Batch No : {batch?.batchNo}
                        </Text>
                        Total Students : {batch?.student?.length}
                    </Table.Cell>
                    <Table.Cell>
                        <Text fontWeight="semibold" textStyle="lg">
                            {batch?.course?.name}
                        </Text>
                        {batch?.course?.courseType}
                    </Table.Cell>
                    <Table.Cell>
                        {dayjs(batch?.startDate).format("DD-MM-YYYY")} <br />
                        {dayjs(batch?.endDate).format("DD-MM-YYYY")}
                    </Table.Cell>
                    <Table.Cell>{batch?.classDays}</Table.Cell>
                </Table.Row>
            )) : (
                <Table.Row>
                    <Table.Cell colSpan={4}>
                        <Alert.Root status="warning">
                            <Alert.Indicator />
                            <Alert.Title>No Upcoming Batch</Alert.Title>
                        </Alert.Root>
                    </Table.Cell>
                </Table.Row>
            )}
        </>
    )
}
