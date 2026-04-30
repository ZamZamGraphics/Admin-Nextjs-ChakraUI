"use client"

import { Alert, Box, Button, Card, Field, Flex, Grid, GridItem, Input, Text, createListCollection, Portal, Select, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react"

function MessagePage() {
    const [recall, setRcall] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const getBalance = async () => {
            try {
                const res = await fetch('/api/sms/balance')
                const data = await res.json();
                setBalance(data?.balance.toFixed(2))
            } catch (e) {
                setError({ general: e.message });
            }
        }
        getBalance()
    }, [recall])

    const reset = () => {
        setPhoneNumber("")
        setStatus([])
        setMessage("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const data = {
                number: phoneNumber,
                status: status[0],
                message
            }
            const res = await fetch('/api/sms', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data)
            })

            const response = await res.json();
            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (response?.success) {
                setSuccess(response?.message)
                setRcall(true)
                reset()
            }
            if (response?.errors) {
                setError({ ...response?.errors });
            }
            setLoading(false)
        } catch (e) {
            setLoading(false)
            setError({ general: e.message });
        }
    }

    return (
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="6">
            <GridItem colSpan={2}>
                <form onSubmit={handleSubmit}>
                    <Flex
                        direction="column"
                        gap={4}
                        bg="bg"
                        p={5}
                        rounded="2xl"
                        shadow="sm"
                    >
                        <Text mb={5} textStyle="2xl" fontWeight="semibold">Messages</Text>
                        {success && (
                            <Alert.Root status="success">
                                <Alert.Indicator />
                                <Alert.Title>{success}</Alert.Title>
                            </Alert.Root>
                        )}
                        {error?.general && (
                            <Alert.Root status="error">
                                <Alert.Indicator />
                                <Alert.Title>{error?.general}</Alert.Title>
                            </Alert.Root>
                        )}
                        <Field.Root invalid={error?.number}>
                            <Input
                                name='phoneNumber'
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Student/Employee Name or Number or Batch Number"
                            />
                            <Field.ErrorText>{error?.number?.msg}</Field.ErrorText>
                        </Field.Root>
                        <Field.Root invalid={error?.status}>
                            <Select.Root
                                collection={types}
                                size="md"
                                width="full"
                                value={status}
                                onValueChange={(e) => setStatus(e.value)}
                            >
                                <Select.HiddenSelect />
                                <Select.Control>
                                    <Select.Trigger>
                                        <Select.ValueText placeholder="Select Status" />
                                    </Select.Trigger>
                                    <Select.IndicatorGroup>
                                        <Select.Indicator />
                                    </Select.IndicatorGroup>
                                </Select.Control>
                                <Portal>
                                    <Select.Positioner>
                                        <Select.Content>
                                            {types.items.map((type) => (
                                                <Select.Item item={type} key={type.value}>
                                                    {type.label}
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>
                            <Field.ErrorText>{error?.status?.msg}</Field.ErrorText>
                        </Field.Root>
                        <Field.Root invalid={error?.message}>
                            <Textarea
                                rows={10}
                                name='message'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Write message here."
                            />
                            <Field.ErrorText>{error?.message?.msg}</Field.ErrorText>
                        </Field.Root>
                        <Box mx="auto">
                            <Button
                                type='submit'
                                colorPalette="gray"
                                disabled={loading}
                            >
                                Send Message
                            </Button>
                        </Box>
                    </Flex>
                </form>
            </GridItem>
            <GridItem>
                <Card.Root rounded="xl" shadow="xs">
                    <Card.Body
                        flexDirection="column"
                        alignItems="start"
                        padding={5}
                    >
                        <Text textStyle="xl" fontWeight="semibold">
                            Available Balance
                        </Text>
                        <Text textStyle="2xl" fontWeight="bold" color="#1F69D8">
                            BDT {balance}
                        </Text>
                    </Card.Body>
                </Card.Root>
                <Card.Root rounded="xl" shadow="xs" mt={3}>
                    <Card.Body padding={0}>
                        <Alert.Root status="warning">
                            <Alert.Indicator />
                            <Alert.Content>
                                <Alert.Title>UNSUB</Alert.Title>
                                <Alert.Description>
                                    UAE Users please ensure that you put (UNSUB 3811 or OPTOUT 3811) at end of each SMS. As per TRA optout option is mandatory. We will not be responsible for any non delivery arising because of this.
                                </Alert.Description>
                            </Alert.Content>
                        </Alert.Root>
                    </Card.Body>
                </Card.Root>
                <Card.Root rounded="xl" shadow="xs" mt={3}>
                    <Card.Body padding={0}>
                        <Alert.Root status="warning">
                            <Alert.Indicator />
                            <Alert.Content>
                                <Alert.Title>SMS Content</Alert.Title>
                                <Alert.Description>
                                    <p>* 160 Characters are counted as 1 SMS in case of English language & 70 in other language.</p>
                                    <p>* One simple text message containing extended GSM character set (~^{ }[]|) is 70 characters long. Check your SMS count before pushing SMS.</p>
                                </Alert.Description>
                            </Alert.Content>
                        </Alert.Root>
                    </Card.Body>
                </Card.Root>
            </GridItem>
        </Grid>
    )
}

export default MessagePage

const types = createListCollection({
    items: [
        { value: "student", label: "Student" },
        { value: "employee", label: "Employee" },
        { value: "batch", label: "Batch" }
    ]
})