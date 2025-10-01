"use client"

import { useColorMode } from "@/components/ui/color-mode"
import { Alert, Box, Button, Grid, GridItem, NumberInput, Text } from "@chakra-ui/react"
import { Switch } from "@chakra-ui/react"
import { useState } from "react"
import { useFormStatus } from "react-dom"
import { updateSettings } from "@/app/actions/settings"

function SettingsPages({ initial }) {
    const { pending } = useFormStatus()
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")
    const { toggleColorMode } = useColorMode()

    const [settings, setSettings] = useState({
        emailChecked: initial?.emailChecked,
        smsChecked: initial?.smsChecked,
        darkMode: initial?.darkMode,
        perPage: initial?.perPage
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("")
        setSuccess("")

        try {
            const res = await updateSettings(initial?._id, settings)
            if (res?.success) setSuccess({ message: res.message })
            if (res?.errors) setError({ message: res.errors?.perPage?.msg })
        } catch (err) {
            setError({ message: err.message });
        }
    }

    return (
        <Box maxW="2xl">
            {success?.message &&
                <Alert.Root status="success" mb={5}>
                    <Alert.Indicator />
                    <Alert.Title>{success?.message}</Alert.Title>
                </Alert.Root>
            }

            {error?.message &&
                <Alert.Root status="error" mb={5}>
                    <Alert.Indicator />
                    <Alert.Title>{error?.message}</Alert.Title>
                </Alert.Root>
            }
            <Text textStyle="2xl" fontWeight="semibold" mb={5}>General Settings</Text>
            <form onSubmit={handleSubmit}>
                <Grid
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                    gap={{ base: 3, md: 10 }}
                >
                    <GridItem>
                        <Text
                            textStyle="lg"
                            fontWeight="semibold"
                        >Notification</Text>
                    </GridItem>
                    <GridItem spaceY={{ base: 1, md: 5 }}>
                        <Box>
                            <Switch.Root
                                checked={settings.emailChecked}
                                onCheckedChange={(e) => {
                                    setSettings((prev) => ({
                                        ...prev,
                                        emailChecked: e.checked,
                                    }));
                                }}
                            >
                                <Switch.HiddenInput />
                                <Switch.Control>
                                    <Switch.Thumb />
                                </Switch.Control>
                                <Switch.Label>Email Notification</Switch.Label>
                            </Switch.Root>
                        </Box>
                        <Box>
                            <Switch.Root
                                checked={settings.smsChecked}
                                onCheckedChange={(e) => {
                                    setSettings((prev) => ({
                                        ...prev,
                                        smsChecked: e.checked,
                                    }));
                                }}
                            >
                                <Switch.HiddenInput />
                                <Switch.Control>
                                    <Switch.Thumb />
                                </Switch.Control>
                                <Switch.Label>SMS Notification</Switch.Label>
                            </Switch.Root>
                        </Box>
                    </GridItem>
                    <GridItem>
                        <Text
                            textStyle="lg"
                            fontWeight="semibold"
                        >Color Mode</Text>
                    </GridItem>
                    <GridItem>
                        <Switch.Root
                            checked={settings.darkMode}
                            onCheckedChange={(e) => {
                                toggleColorMode()
                                setSettings((prev) => ({
                                    ...prev,
                                    darkMode: e.checked,
                                }));
                            }}
                        >
                            <Switch.HiddenInput />
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                            <Switch.Label>Dark Mode</Switch.Label>
                        </Switch.Root>
                    </GridItem>
                    <GridItem>
                        <Text
                            textStyle="lg"
                            fontWeight="semibold"
                        >
                            Data Limit
                        </Text>
                    </GridItem>
                    <GridItem>
                        <NumberInput.Root
                            min={5}
                            max={100}
                            step={10}
                            bg="bg"
                            value={settings.perPage}
                            onValueChange={(e) => {
                                setSettings((prev) => ({
                                    ...prev,
                                    perPage: e.value,
                                }));
                            }}
                        >
                            <NumberInput.Control />
                            <NumberInput.Input />
                        </NumberInput.Root>
                    </GridItem>
                    <GridItem>
                        <Button
                            type='submit'
                            colorPalette="gray"
                            loading={pending}
                        >Save Changes</Button>
                    </GridItem>
                </Grid>
            </form>
        </Box>
    )
}

export default SettingsPages
