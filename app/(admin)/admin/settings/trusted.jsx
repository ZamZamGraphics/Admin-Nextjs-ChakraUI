import { Box, Text, Table, Alert } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import dayjs from "dayjs";
import Loading from "@/components/admin/loading";
import Error from "@/components/admin/error";

function Trusted() {
    const [devices, setDevices] = useState([]);
    const [total, setTotal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchDevices = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/trusted', { credentials: "include" });
            const data = await res.json();
            setDevices(data?.trusted)
            setTotal(data?.total)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchDevices()
    }, [])

    let content = null
    if (loading) {
        content = <Loading col={5} />
    } else if (error) {
        content = <Error col={5} error={error} />
    } else {
        content = <TrustedComponent devices={devices} />
    }

    return (
        <Box>
            <Text textStyle="2xl" fontWeight="semibold" mb={3}>Trusted Device</Text>
            <Text textStyle="md" mb={3}>Total : {total}</Text>
            <Table.ScrollArea borderWidth="1px" maxW="full">
                <Table.Root size="sm" variant="outline" bg="bg">
                    <Table.Header bg="bg.emphasized">
                        <Table.Row>
                            <Table.ColumnHeader>Device</Table.ColumnHeader>
                            <Table.ColumnHeader>OS</Table.ColumnHeader>
                            <Table.ColumnHeader>Browser</Table.ColumnHeader>
                            <Table.ColumnHeader>Location</Table.ColumnHeader>
                            <Table.ColumnHeader>Last session</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body textStyle="md">
                        {content}
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
        </Box>
    )
}

export default Trusted


function TrustedComponent({ devices }) {
    return (
        <>
            {devices?.length > 0 ? devices.map((trusted) => (
                <Table.Row key={trusted._id}>
                    <Table.Cell>
                        {trusted?.device}
                    </Table.Cell>
                    <Table.Cell>
                        {trusted?.os}
                    </Table.Cell>
                    <Table.Cell>
                        {trusted?.browser}
                    </Table.Cell>
                    <Table.Cell>
                        {trusted?.ip}
                    </Table.Cell>
                    <Table.Cell>
                        {dayjs(trusted?.addedAt).format("DD MMMM YYYY h:mm A")}
                    </Table.Cell>
                </Table.Row>
            )) : (
                <Table.Row>
                    <Table.Cell colSpan={5}>
                        <Alert.Root status="warning">
                            <Alert.Indicator />
                            <Alert.Title>No Trusted Device</Alert.Title>
                        </Alert.Root>
                    </Table.Cell>
                </Table.Row>
            )}
        </>
    )
}