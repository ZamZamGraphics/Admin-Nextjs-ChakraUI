"use client"

import { useColorMode } from "@/components/ui/color-mode"
import { Alert, Box, Button, Grid, GridItem, NumberInput, Text } from "@chakra-ui/react"
import { Switch } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { updateSettings } from "@/app/actions/settings"
import { clientFetch } from "@/utils/client-fetch"

function GeneralSettings() {
    const [id, setId] = useState(null)
    const { pending } = useFormStatus()
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")
    const { toggleColorMode } = useColorMode()

    const [emailChecked, setEmailChecked] = useState(false)
    const [smsChecked, setSMSChecked] = useState(false)
    const [darkMode, setDarkMode] = useState(true)
    const [perPage, setPerPage] = useState(5)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await clientFetch("settings")
                setId(res._id)
                setEmailChecked(res.emailChecked)
                setSMSChecked(res.smsChecked)
                setDarkMode(res.darkMode)
                setPerPage(res.perPage)
            } catch (err) {
                setError({ message: err?.message })
            }
        }
        fetchSettings()
    }, [])

    const handleColorMode = async (e) => {
        toggleColorMode()
        setDarkMode(e.checked)
        const formData = {
            emailChecked,
            smsChecked,
            perPage,
            darkMode: e.checked
        }
        await updateSettings(id, formData)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("")
        setSuccess("")

        try {
            const formData = {
                emailChecked,
                smsChecked,
                darkMode,
                perPage
            }
            const res = await updateSettings(id, formData)
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (res?.success) setSuccess({ message: res.message })
            if (res?.errors) setError({ message: res.errors?.perPage?.msg })
        } catch (err) {
            setError({ message: err?.message });
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
                                name="emailChecked"
                                value={emailChecked}
                                checked={emailChecked}
                                onCheckedChange={(e) => setEmailChecked(e.checked)}
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
                                name="smsChecked"
                                value={smsChecked}
                                checked={smsChecked}
                                onCheckedChange={(e) => setSMSChecked(e.checked)}
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
                            name="darkMode"
                            value={darkMode}
                            checked={darkMode}
                            onCheckedChange={(e) => handleColorMode(e)}
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
                            name="perPage"
                            value={perPage}
                            onValueChange={(e) => setPerPage(e.value)}
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

export default GeneralSettings
