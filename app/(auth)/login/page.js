"use client"
import { Center, Card, Field, Input, Stack, Button, Alert, InputGroup } from '@chakra-ui/react'
import Link from 'next/link'
import Logo from '@/components/ui/logo'
import { LuUser } from 'react-icons/lu'
import { PasswordInput } from '@/components/ui/password-input'
import { useEffect, useState } from 'react'
import { ceredntialLogin, verifyOTP } from '@/app/actions'
import { signIn } from "next-auth/react"
import { useFormStatus } from 'react-dom'

function LoginPage() {
    const [ua, setUa] = useState("");
    const { pending } = useFormStatus();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState({})
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState("login");
    const [userid, setUserid] = useState("");
    const [deviceId, setDeviceId] = useState(null);

    useEffect(() => {
        setUa(navigator.userAgent);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData(event.currentTarget);
            const response = await ceredntialLogin(formData);

            if (response?.require2FA) {
                setUserid(response.userid);
                setDeviceId(response.deviceId);
                setStep("otp");
            } else if (response?.success) {
                await signIn("credentials", {
                    userid: (response.userid),
                    accessToken: response.token,
                    redirect: true,
                    callbackUrl: "/admin"
                })
            }

            if (response?.errors) {
                setError({ ...response?.errors });
            }

            if (response?.message) {
                setError({ message: response?.message });
            }
        } catch (e) {
            setError({ message: e.message });
        }
    }

    const handleVerify = async (event) => {
        event.preventDefault();

        try {
            const response = await verifyOTP({
                userid,
                token: otp,
                deviceId,
                userAgent: ua
            })

            if (response?.success) {
                await signIn("credentials", {
                    userid: (response.userid),
                    accessToken: response.token,
                    redirect: true,
                    callbackUrl: "/admin"
                })
            }

            if (response?.errors) {
                setError({ ...response?.errors });
            }

            if (response?.message) {
                setError({ message: response?.message });
            }
        } catch (e) {
            setError({ message: e.message });
        }
    };

    return (
        <>
            <Center h="100vh">
                <Card.Root w={{ base: "100%", md: "400px", lg: "550px" }}>
                    {step === "login" ? (
                        <>
                            <Card.Header textAlign="center" m="auto" w="full">
                                <Logo />
                                <Card.Title mb="2">Sign in</Card.Title>
                                {error?.message &&
                                    <Alert.Root status="error">
                                        <Alert.Indicator />
                                        <Alert.Title>{error?.message}</Alert.Title>
                                    </Alert.Root>
                                }
                            </Card.Header>
                            <form onSubmit={handleSubmit}>
                                <Card.Body>
                                    <Stack gap="4" w="full">
                                        <Field.Root invalid={error?.username} >
                                            <Field.Label>Username</Field.Label>
                                            <InputGroup startElement={<LuUser />}>
                                                <Input
                                                    name='username'
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    placeholder="Username"
                                                />
                                            </InputGroup>
                                            <Field.ErrorText>{error?.username?.msg}</Field.ErrorText>
                                        </Field.Root>
                                        <Field.Root invalid={error?.password}>
                                            <Field.Label>Password</Field.Label>
                                            <PasswordInput
                                                name="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Password"
                                            />
                                            <Field.ErrorText>{error?.password?.msg}</Field.ErrorText>
                                        </Field.Root>
                                        <input type="hidden" name="userAgent" value={ua} />
                                    </Stack>
                                </Card.Body>
                                <Card.Footer
                                    display="flex"
                                    flexDirection="column"
                                    gap={5} // space between items
                                    alignItems="stretch"
                                >
                                    <Link href="/forgott">Forgotten password?</Link>
                                    <Button
                                        type='submit'
                                        colorPalette="gray"
                                        loading={pending}
                                    >Sign in</Button>
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
                                {error?.message &&
                                    <Alert.Root status="error">
                                        <Alert.Indicator />
                                        <Alert.Title>{error?.message}</Alert.Title>
                                    </Alert.Root>
                                }
                            </Card.Header>
                            <form onSubmit={handleVerify}>
                                <Card.Body>
                                    <Stack gap="4" w="full">
                                        <Field.Root invalid={error?.token} >
                                            <Field.Label>
                                                Verification Code
                                            </Field.Label>
                                            <Input
                                                name="token"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="6 digit code"
                                            />
                                            <Field.ErrorText>{error?.token?.msg}</Field.ErrorText>
                                        </Field.Root>
                                    </Stack>
                                </Card.Body>
                                <Card.Footer
                                    display="flex"
                                    flexDirection="column"
                                    gap={2} // space between items
                                    alignItems="stretch"
                                >
                                    <Button
                                        type='submit'
                                        colorPalette="gray"
                                        loading={pending}
                                    >Verify</Button>
                                </Card.Footer>
                            </form>
                        </>
                    )}
                </Card.Root>
            </Center>
        </>
    )
}

export default LoginPage
