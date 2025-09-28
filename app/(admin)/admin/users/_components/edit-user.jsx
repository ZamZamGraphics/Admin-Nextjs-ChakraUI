"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom";
import { Alert, Avatar, Box, Button, createListCollection, Field, Flex, Grid, GridItem, Input, Portal, Select, Text } from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input";
import { updateUser } from "@/app/actions/users";

function EditUser({ userInfo }) {
    const { pending } = useFormStatus();
    const avatarURL = userInfo?.avatar && `${process.env.NEXT_PUBLIC_API_URL}/upload/${userInfo?.avatar}`;
    const [avatar, setAvatar] = useState(userInfo?.avatar);
    const [avatarImage, setAvatarImage] = useState(avatarURL);
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    const [user, setUser] = useState({
        fullname: userInfo?.fullname,
        email: userInfo?.email,
        password: "",
        role: [userInfo?.role],
        status: userInfo?.status,
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
        setSuccess("")
        try {
            const formData = new FormData();

            if (avatar) formData.append("avatar", avatar);

            formData.append("fullname", user.fullname);
            formData.append("email", user.email);
            formData.append("status", user.status);
            formData.append("role", user.role[0]);
            if (user.password) {
                formData.append("password", user.password);
            }

            const response = await updateUser(userInfo?._id, formData);

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
                        <Alert.Root status="success">
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
                        <Field.Root>
                            <Input
                                defaultValue={userInfo?.username}
                                disabled
                            />
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
                >Update User</Button>
            </form>
        </Box>
    )
}

export default EditUser

const userRole = createListCollection({
    items: [
        { value: "Admin", label: "Admin" },
        { value: "User", label: "User" },
    ]
});

