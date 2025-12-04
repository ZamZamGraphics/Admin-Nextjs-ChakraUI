"use client"

import { setup2FA, confirm2FASetup, disable2FA } from "@/app/actions/settings"
import { PasswordInput } from "@/components/ui/password-input"
import { Alert, Box, Button, CloseButton, Dialog, Portal, Grid, GridItem, QrCode, Text, Stack, Field, Input } from "@chakra-ui/react"
import { useState } from "react"

function Authentication({ is2FAEnabled }) {
    const [open, setOpen] = useState(false)
    const [qrImaage, setQRImage] = useState(null)
    const [secret, setSecret] = useState(null)
    const [token, setToken] = useState("")

    const [password, setPassword] = useState("")
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    const handleEnable2FA = async () => {
        setError("")
        setSuccess("")
        try {
            const res = await setup2FA()

            console.log('Generated Secret: ', res?.secret)

            if (res?.success) {
                setQRImage(res?.otpauth_url)
                setSecret(res?.secret)
                setSuccess(res?.message)
            }
            if (res?.errors) setError({ message: res.errors?.message })
        } catch (err) {
            console.log('he error', err)
            setError({ message: err?.message });
        }
    };

    const verify2FA = async () => {
        setError("")
        setSuccess("")
        try {
            const res = await confirm2FASetup(token)

            console.log("DB Secret : ", res)

            if (res?.success) {
                setOpen(false)
                setSuccess(res?.message)
            }
            if (res?.errors) setError({ message: res.errors?.message })
        } catch (err) {
            setError({ message: err?.message });
        }
    }

    const handleDisable2FA = async () => {
        setError("")
        setSuccess("")
        try {
            const res = await disable2FA(password)
            if (res?.success) {
                setOpen(false)
                setSuccess(res?.message)
            }
            if (res?.errors) setError({ message: res.errors?.message })
        } catch (err) {
            setError({ message: err?.message });
        }
    };

    return (
        <Box maxW="2xl">
            {success?.message &&
                <Alert.Root status="success" mb={5}>
                    <Alert.Indicator />
                    <Alert.Title>{success?.message}</Alert.Title>
                </Alert.Root>
            }
            <Text textStyle="2xl" fontWeight="semibold" mb={5}>Authentication</Text>
            <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={{ base: 3, md: 10 }}
            >
                <GridItem>
                    <Text
                        textStyle="lg"
                        fontWeight="semibold"
                    >Authenticator App</Text>
                </GridItem>
                <GridItem spaceY={{ base: 1, md: 5 }}>
                    <Dialog.Root
                        open={open}
                        onOpenChange={(e) => setOpen(e.open)}
                        size={{ mdDown: "full", md: "md" }}
                        scrollBehavior="outside"
                    >
                        <Dialog.Trigger asChild>
                            {is2FAEnabled ? (
                                <Button size="sm" onClick={(e) => setOpen(true)}>
                                    Disable
                                </Button>
                            ) : (
                                <Button size="sm" onClick={handleEnable2FA}>
                                    Enable
                                </Button>
                            )}
                        </Dialog.Trigger>
                        <Portal>
                            <Dialog.Backdrop />
                            <Dialog.Positioner>
                                <Dialog.Content>
                                    <Dialog.Header>
                                        <Dialog.Title>
                                            Set up two-factor authentication
                                        </Dialog.Title>
                                    </Dialog.Header>
                                    <Dialog.Body>
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
                                        {qrImaage &&
                                            <Stack gap="4" alignItems="center">
                                                <QrCode.Root size="xl" value={qrImaage}>
                                                    <QrCode.Frame>
                                                        <QrCode.Pattern />
                                                    </QrCode.Frame>
                                                </QrCode.Root>
                                                <Text
                                                    textStyle="lg"
                                                    fontWeight="semibold"
                                                >Manual Secret Key</Text>
                                                {secret}
                                                <Field.Root>
                                                    <Field.Label>Token</Field.Label>
                                                    <Input
                                                        name="token"
                                                        value={token}
                                                        onChange={(e) => setToken(e.target.value)}
                                                        placeholder="Token"
                                                    />
                                                </Field.Root>
                                            </Stack>
                                        }
                                        {is2FAEnabled &&
                                            <Field.Root>
                                                <Field.Label>Password</Field.Label>
                                                <PasswordInput
                                                    name="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Password"
                                                />
                                            </Field.Root>
                                        }
                                    </Dialog.Body>
                                    <Dialog.Footer>
                                        <Dialog.ActionTrigger asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </Dialog.ActionTrigger>
                                        {is2FAEnabled ? (
                                            <Button onClick={handleDisable2FA}>
                                                Disable
                                            </Button>
                                        ) : (
                                            <Button onClick={verify2FA}>
                                                Verify OTP
                                            </Button>
                                        )}
                                    </Dialog.Footer>
                                    <Dialog.CloseTrigger asChild>
                                        <CloseButton size="sm" />
                                    </Dialog.CloseTrigger>
                                </Dialog.Content>
                            </Dialog.Positioner>
                        </Portal>
                    </Dialog.Root>
                </GridItem>
                <GridItem>
                    <Text
                        textStyle="lg"
                        fontWeight="semibold"
                    >Text Message</Text>
                </GridItem>
                <GridItem>
                    .......
                </GridItem>
            </Grid>
        </Box>
    )
}

export default Authentication
