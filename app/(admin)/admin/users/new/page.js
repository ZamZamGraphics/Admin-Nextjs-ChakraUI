"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom";
import { Alert, Avatar, Box, Button, createListCollection, Field, Flex, Grid, GridItem, Input, Portal, Select, Text } from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input";
import { addUser } from "@/app/actions/users";

function NewUserPage() {
    const { pending } = useFormStatus();
    const [avatar, setAvatar] = useState(null);
    const [avatarImage, setAvatarImage] = useState("");
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const [user, setUser] = useState({
        fullname: "",
        username: "",
        email: "",
        password: "",
        role: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const changeAvatar = (file) => {
        if (!file) return;
        setAvatar(file);
        const reader = new FileReader();
        reader.onload = () => setAvatarImage(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("")
        try {
            const formData = new FormData();

            if (avatar) formData.append("avatar", avatar);

            Object.entries(user).forEach(([key, value]) => {
                if (key === "role" && Array.isArray(value)) {
                    formData.append(key, value[0]);
                } else {
                    formData.append(key, value);
                }
            });
            formData.append("status", "Unverified");

            const response = await addUser(formData);
            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (response?.success) {
                setSuccess({ message: response?.message });
            }

            if (response?.errors) {
                setError({ ...response?.errors });
            }
        } catch (e) {
            setError({ message: e.message });
        }
    }

    return (
        <Box
            p={8}
            mx="auto"
            bg="bg"
            textAlign="center"
            maxW="800px"
            rounded="2xl"
            shadow="sm"
        >
            <Text textStyle="2xl" fontWeight="semibold">New User</Text>
            <form onSubmit={handleSubmit}>
                <Flex my={5} gap={3} direction="column" align="center">
                    <Input
                        type="file"
                        hidden
                        accept="image/*"
                        name="avatar"
                        id="avatarUpload"
                        onChange={(e) => {
                            changeAvatar(e.target.files[0]);
                            e.target.value = "";
                        }}
                    />
                    <label htmlFor="avatarUpload">
                        <Avatar.Root boxSize="100px" cursor="pointer">
                            <Avatar.Fallback fontSize="40px" name="User Photo" />
                            <Avatar.Image src={avatarImage || null} />
                        </Avatar.Root>
                    </label>
                    {success?.message &&
                        <Alert.Root status="warning">
                            <Alert.Indicator />
                            <Alert.Title>{success?.message}</Alert.Title>
                        </Alert.Root>
                    }

                    {error?.message &&
                        <Alert.Root status="error">
                            <Alert.Indicator />
                            <Alert.Title>{error?.message}</Alert.Title>
                        </Alert.Root>
                    }
                </Flex>
                <Grid templateColumns="1fr" gap="6">
                    <GridItem>
                        <Field.Root invalid={error?.fullname}>
                            <Input
                                name='fullname'
                                value={user.fullname}
                                onChange={handleChange}
                                placeholder="Full Name"
                            />
                            <Field.ErrorText>{error?.fullname?.msg}</Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.username}>
                            <Input
                                name='username'
                                value={user.username}
                                onChange={handleChange}
                                placeholder="Username"
                            />
                            <Field.ErrorText>
                                {error?.username?.msg}
                            </Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.email}>
                            <Input
                                type="email"
                                name='email'
                                value={user.email}
                                onChange={handleChange}
                                placeholder="Email"
                            />
                            <Field.ErrorText>
                                {error?.email?.msg}
                            </Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.password}>
                            <PasswordInput
                                name='password'
                                value={user.password}
                                onChange={handleChange}
                                placeholder="Password"
                            />
                            <Field.ErrorText>{error?.password?.msg}</Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.role}>
                            <Select.Root
                                collection={userRole}
                                size="md"
                                width="full"
                                name="role"
                                value={user.role}
                                onValueChange={(e) =>
                                    setUser((prev) => ({ ...prev, role: e.value }))
                                }
                            >
                                <Select.HiddenSelect />
                                <Select.Control>
                                    <Select.Trigger>
                                        <Select.ValueText
                                            placeholder="Select User Role"
                                        />
                                    </Select.Trigger>
                                    <Select.IndicatorGroup>
                                        <Select.Indicator />
                                    </Select.IndicatorGroup>
                                </Select.Control>
                                <Portal>
                                    <Select.Positioner>
                                        <Select.Content>
                                            {userRole.items.map((role) => (
                                                <Select.Item item={role} key={role.value}>
                                                    {role.label}
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>
                            <Field.ErrorText>{error?.role?.msg}</Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                </Grid>
                <Button
                    mt={8}
                    type='submit'
                    colorPalette="gray"
                    loading={pending}
                >Add New User</Button>
            </form>
        </Box>
    )
}

export default NewUserPage

const userRole = createListCollection({
    items: [
        { value: "Admin", label: "Admin" },
        { value: "User", label: "User" },
    ]
});
