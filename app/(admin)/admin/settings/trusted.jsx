"use client";

import { LuTrash, LuSmartphone, LuMonitor, LuTablet, LuInfo } from "react-icons/lu"
import { Box, Text, Table, Alert, IconButton, Flex, Image, Button } from "@chakra-ui/react"
import Loading from "@/components/admin/loading";
import Error from "@/components/admin/error";
import { useEffect, useState } from "react"
import { api } from "@/utils/clientFetch";
import { removeTrustedDevice } from "@/app/actions";
import dayjs from "dayjs";
import timeAgo from "@/utils/timeAgo";
import { Tooltip } from "@/components/ui/tooltip";

function Trusted() {
    const [devices, setDevices] = useState([]);
    const [total, setTotal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchDevices = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api('/v2/auth/trusted-device');
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
        content = <TrustedComponent devices={devices} onDeleted={() => fetchDevices()} />
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
                            <Table.ColumnHeader>Browser</Table.ColumnHeader>
                            <Table.ColumnHeader>Location</Table.ColumnHeader>
                            <Table.ColumnHeader>Last session</Table.ColumnHeader>
                            <Table.ColumnHeader></Table.ColumnHeader>
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

function TrustedComponent({ devices, onDeleted }) {

    const deviceIcon = (device) => {
        if(device === "Mobile") return <LuSmartphone />
        if(device === "Tablet") return <LuTablet />
        if(device === "Desktop") return <LuMonitor />
        return <LuInfo />
    }

    const iconPath = (browser) => {
        let imagePath;
        if(browser === "Chrome") {
            imagePath = "/browser/chrome.png"
        } else if (browser === "Firefox"){
            imagePath = "/browser/chrome.png"
        } else if(browser === "Edge") {
            imagePath = "/browser/chrome.png"
        } else if(browser === "Safari") {
            imagePath = "/browser/chrome.png"
        } else if(browser === "Opera") {
            imagePath = "/browser/chrome.png"
        } else {
            imagePath = "/browser/chrome.png"
        }

        return imagePath;
    }

    return (
      <>
        {devices?.length > 0 ? (
          devices.map((trusted) => (
            <Table.Row key={trusted._id}>
              <Table.Cell>
                <Flex alignItems="center" gap={3}>
                    {deviceIcon(trusted?.device)} {trusted?.os}
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Image
                    src={iconPath(trusted?.browser)}
                    boxSize="25px"
                    borderRadius="full"
                    fit="cover"
                    alt={trusted?.browser}
                />
              </Table.Cell>
              <Table.Cell>{trusted?.ip}</Table.Cell>
              <Table.Cell>
                <Tooltip content={dayjs(trusted?.addedAt).format("dddd, DD MMMM YYYY h:mm A")}>
                    <Button variant="plain" size="sm">
                        {timeAgo(trusted?.addedAt)}
                    </Button>
                </Tooltip>
              </Table.Cell>
              <Table.Cell>
                <RemoveDevice id={trusted._id} onDeleted={onDeleted} />
              </Table.Cell>
            </Table.Row>
          ))
        ) : (
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
    );
}

function RemoveDevice({id, onDeleted}) {
    const [loading, setLoading] = useState(false);

    const handleRemove = async () => {
        setLoading(true);
        try {
            const res = await removeTrustedDevice(id);
            if (res && res.success === false) {
                console.log(res.message);
                return;
            }
            await onDeleted?.(id);
        } catch (e) {
            console.log(e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <IconButton 
            rounded="full"
            variant="ghost"
            colorPalette="red"
            onClick={handleRemove}
            loading={loading}
        >
            <LuTrash />
        </IconButton>
    )
}