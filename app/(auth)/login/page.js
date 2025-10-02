"use client"
import { Center, Card, Field, Input, Stack, Button, Alert, InputGroup } from '@chakra-ui/react'
import Link from 'next/link'
import Logo from '@/components/ui/logo'
import { LuUser } from 'react-icons/lu'
import { PasswordInput } from '@/components/ui/password-input'
import { useEffect, useState } from 'react'
import { ceredntialLogin } from '@/app/actions'
import { signIn, signOut } from "next-auth/react"
import { useFormStatus } from 'react-dom'
import { useSearchParams } from 'next/navigation'

function LoginPage() {
    const { pending } = useFormStatus();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState({})

    const params = useSearchParams()
    const autologout = params.get("autologout")

    useEffect(() => {
        if (autologout) {
            signOut({ redirect: false }).then(() => {
                window.location.href = "/login"
            })
        }
    }, [autologout])

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const formData = new FormData(event.currentTarget);
            const response = await ceredntialLogin(formData);

            if (response?.success) {
                await signIn("credentials", {
                    userInfo: JSON.stringify(response.user),
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

    return (
        <>
            <Center h="100vh">
                <Card.Root w={{ base: "100%", md: "400px", lg: "550px" }}>
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
                            >Sign in</Button>
                            <Link href="/forgott">Forgotten password?</Link>
                        </Card.Footer>
                    </form>
                </Card.Root>
            </Center>
        </>
    )
}

export default LoginPage
