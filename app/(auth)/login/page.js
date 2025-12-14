"use client"
export const dynamic = 'force-dynamic';
import { useState, useEffect } from "react"
import { Center, Card, Field, Input, Stack, Button, Alert, InputGroup } from "@chakra-ui/react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { LuUser } from "react-icons/lu"
import Logo from "@/components/ui/logo"
import { PasswordInput } from "@/components/ui/password-input"
import { credentialLogin, verifyOTP } from "@/app/actions"

export default function LoginPage() {
    const [ua, setUa] = useState("")
    const [step, setStep] = useState("login") // 'login' | 'otp'
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({})
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [otp, setOtp] = useState("")
    const [userid, setUserid] = useState("")
    const [deviceId, setDeviceId] = useState(null)

    // Get user-agent on client-side
    useEffect(() => {
        setUa(navigator.userAgent || "")
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError({})

        try {
            const response = await credentialLogin({ username, password, userAgent: ua })

            if (response?.require2FA) {
                setUserid(response.userid)
                setDeviceId(response.deviceId)
                setStep("otp")
            } else if (response?.success) {
                await signIn("credentials", {
                    userid: response.userid,
                    accessToken: response.token,
                    redirect: true,
                    callbackUrl: "/admin",
                })
            } else {
                // Merge errors and message
                setError({
                    ...(response?.errors || {}),
                    ...(response?.message ? { message: response.message } : {}),
                })
            }
        } catch (err) {
            setError({ message: err.message || "Internal server error" })
        } finally {
            setLoading(false)
        }
    }

    const handleVerify = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError({})

        try {
            const response = await verifyOTP({ userid, token: otp, deviceId, userAgent: ua })

            if (response?.success) {
                await signIn("credentials", {
                    userid: response.userid,
                    accessToken: response.token,
                    redirect: true,
                    callbackUrl: "/admin",
                })
            } else {
                setError({
                    ...(response?.errors || {}),
                    ...(response?.message ? { message: response.message } : {}),
                })
            }
        } catch (err) {
            setError({ message: err.message || "Internal server error" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Center h="100vh">
            <Card.Root w={{ base: "100%", md: "400px", lg: "550px" }}>
                {step === "login" ? (
                    <>
                        <Card.Header textAlign="center" m="auto" w="full">
                            <Logo />
                            <Card.Title mb="2">Sign in</Card.Title>
                            {error?.message && (
                                <Alert.Root status="error">
                                    <Alert.Indicator />
                                    <Alert.Title>{error.message}</Alert.Title>
                                </Alert.Root>
                            )}
                        </Card.Header>

                        <form onSubmit={handleLogin}>
                            <Card.Body>
                                <Stack gap="4" w="full">
                                    <Field.Root invalid={!!error.username}>
                                        <Field.Label>Username</Field.Label>
                                        <InputGroup startElement={<LuUser />}>
                                            <Input
                                                name="username"
                                                placeholder="Username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                            />
                                        </InputGroup>
                                        <Field.ErrorText>{error.username?.msg}</Field.ErrorText>
                                    </Field.Root>

                                    <Field.Root invalid={!!error.password}>
                                        <Field.Label>Password</Field.Label>
                                        <PasswordInput
                                            name="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <Field.ErrorText>{error.password?.msg}</Field.ErrorText>
                                    </Field.Root>
                                </Stack>
                            </Card.Body>

                            <Card.Footer display="flex" flexDirection="column" gap={5} alignItems="stretch">
                                <Link href="/forgot">Forgotten password?</Link>
                                <Button type="submit" colorPalette="gray" loading={loading}>
                                    Sign in
                                </Button>
                            </Card.Footer>
                        </form>
                    </>
                ) : (
                    <>
                        <Card.Header textAlign="center" m="auto" w="full">
                            <Logo />
                            <Card.Title mb="2">Two-Factor Authentication</Card.Title>
                            <Card.Description>
                                Enter the verification code from your authentication app.
                            </Card.Description>
                            {error?.message && (
                                <Alert.Root status="error">
                                    <Alert.Indicator />
                                    <Alert.Title>{error.message}</Alert.Title>
                                </Alert.Root>
                            )}
                        </Card.Header>

                        <form onSubmit={handleVerify}>
                            <Card.Body>
                                <Stack gap="4" w="full">
                                    <Field.Root invalid={!!error.token}>
                                        <Field.Label>Verification Code</Field.Label>
                                        <Input
                                            name="token"
                                            placeholder="6-digit code"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                        <Field.ErrorText>{error.token?.msg}</Field.ErrorText>
                                    </Field.Root>
                                </Stack>
                            </Card.Body>

                            <Card.Footer display="flex" flexDirection="column" gap={2} alignItems="stretch">
                                <Button type="submit" colorPalette="gray" loading={loading}>
                                    Verify
                                </Button>
                            </Card.Footer>
                        </form>
                    </>
                )}
            </Card.Root>
        </Center>
    )
}
