"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom";
import CalendarInput from "@/components/admin/calendar-input";
import { Alert, Avatar, Box, Button, createListCollection, Field, Flex, Grid, GridItem, HStack, Input, Portal, RadioGroup, Select, Text } from "@chakra-ui/react"
import { addEmployee, updateEmployee } from "@/app/actions/employee";
import { parseDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

function EditEmployee({ employeeInfo }) {
    const { pending } = useFormStatus();
    const avatarURL = employeeInfo?.avatar && `${process.env.NEXT_PUBLIC_API_URL}/upload/${employeeInfo?.avatar}`;
    const [avatar, setAvatar] = useState(employeeInfo?.avatar);
    const [avatarImage, setAvatarImage] = useState(avatarURL);
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    const [employee, setEmployee] = useState({
        fullName: employeeInfo?.fullName,
        fathersName: employeeInfo?.fathersName,
        mothersName: employeeInfo?.mothersName,
        address: employeeInfo?.address,
        birthDay: dayjs(employeeInfo?.birthDay).format("DD-MM-YYYY"),
        gender: employeeInfo?.gender,
        phonePrimary: employeeInfo?.phone[0],
        phoneSecondary: employeeInfo?.phone[1],
        email: employeeInfo?.email,
        nid: employeeInfo?.nid,
        designation: employeeInfo?.designation,
        bloodGroup: [employeeInfo?.bloodGroup],
        education: employeeInfo?.education,
        status: [employeeInfo?.status],
    })

    const router = useRouter()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee((prev) => ({
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
        setSuccess("")
        setError("")

        try {
            const formData = new FormData();

            if (avatar) formData.append("avatar", avatar);

            Object.entries(employee).forEach(([key, value]) => {
                if (key === "bloodGroup" && Array.isArray(value)) {
                    formData.append(key, value[0]);
                } else if (key === "status" && Array.isArray(value)) {
                    formData.append(key, value[0]);
                } else if (key === "birthDay") {
                    const dob = parseDate(employee.birthDay) || ""
                    formData.append(key, dob);
                } else {
                    formData.append(key, value);
                }
            });

            const response = await updateEmployee(employeeInfo?._id, formData);

            if (response?.success) setSuccess({ message: response?.message })
            if (response?.errors) setError({ ...response?.errors })

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
            <Text textStyle="2xl" fontWeight="semibold">Edit Employee</Text>
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
                            <Avatar.Fallback fontSize="40px" name="Employee Photo" />
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
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="6">
                    <GridItem colSpan={{ base: 1, md: 2 }}>
                        <Field.Root invalid={error?.fullName}>
                            <Input
                                name='fullName'
                                value={employee.fullName}
                                onChange={handleChange}
                                placeholder="Employee Name"
                            />
                            <Field.ErrorText>{error?.fullName?.msg}</Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.fathersName}>
                            <Input
                                name='fathersName'
                                value={employee.fathersName}
                                onChange={handleChange}
                                placeholder="Fathers Name"
                            />
                            <Field.ErrorText>
                                {error?.fathersName?.msg}
                            </Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.mothersName}>
                            <Input
                                name='mothersName'
                                value={employee.mothersName}
                                onChange={handleChange}
                                placeholder="Mothers Name"
                            />
                            <Field.ErrorText>
                                {error?.mothersName?.msg}
                            </Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem colSpan={{ base: 1, md: 2 }}>
                        <Field.Root invalid={error?.address}>
                            <Input
                                name='address'
                                value={employee.address}
                                onChange={handleChange}
                                placeholder="Address"
                            />
                            <Field.ErrorText>{error?.address?.msg}</Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.phonePrimary}>
                            <Input
                                name='phonePrimary'
                                type="tel"
                                value={employee.phonePrimary}
                                onChange={handleChange}
                                placeholder="Primary Mobile Number"
                            />
                            <Field.ErrorText>{error?.phonePrimary?.msg}</Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.phoneSecondary}>
                            <Input
                                name='phoneSecondary'
                                type="tel"
                                value={employee.phoneSecondary}
                                onChange={handleChange}
                                placeholder="Secondary Mobile Number"
                            />
                            <Field.ErrorText>
                                {error?.phoneSecondary?.msg}
                            </Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.birthDay}>
                            <CalendarInput
                                name='birthDay'
                                value={employee.birthDay}
                                onChange={handleChange}
                                placeholder="Date of Birth"
                            />
                            <Field.ErrorText>{error?.birthDay?.msg}</Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.gender}>
                            <RadioGroup.Root
                                name="gender"
                                value={employee.gender}
                                onValueChange={(e) =>
                                    setEmployee((prev) => ({ ...prev, gender: e.value }))
                                }
                            >
                                <HStack gap={6} mt={3}>
                                    <RadioGroup.Item value="Female">
                                        <RadioGroup.ItemHiddenInput />
                                        <RadioGroup.ItemIndicator />
                                        <RadioGroup.ItemText>Female</RadioGroup.ItemText>
                                    </RadioGroup.Item>
                                    <RadioGroup.Item value="Male">
                                        <RadioGroup.ItemHiddenInput />
                                        <RadioGroup.ItemIndicator />
                                        <RadioGroup.ItemText>Male</RadioGroup.ItemText>
                                    </RadioGroup.Item>
                                    <Field.ErrorText>
                                        {error?.gender?.msg}
                                    </Field.ErrorText>
                                </HStack>
                            </RadioGroup.Root>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root>
                            <Input
                                name='designation'
                                value={employee.designation}
                                onChange={handleChange}
                                placeholder="Employee Designation"
                            />
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root>
                            <Input
                                name='education'
                                value={employee.education}
                                onChange={handleChange}
                                placeholder="Educational Qualification"
                            />
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root>
                            <Select.Root
                                collection={bloodGroup}
                                size="md"
                                width="full"
                                name="bloodGroup"
                                value={employee.bloodGroup}
                                onValueChange={(e) =>
                                    setEmployee((prev) => ({ ...prev, bloodGroup: e.value }))
                                }
                            >
                                <Select.HiddenSelect />
                                <Select.Control>
                                    <Select.Trigger>
                                        <Select.ValueText placeholder="Select Blood Group" />
                                    </Select.Trigger>
                                    <Select.IndicatorGroup>
                                        <Select.Indicator />
                                    </Select.IndicatorGroup>
                                </Select.Control>
                                <Portal>
                                    <Select.Positioner>
                                        <Select.Content>
                                            {bloodGroup.items.map((blood) => (
                                                <Select.Item item={blood} key={blood.value}>
                                                    {blood.label}
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.status}>
                            <Select.Root
                                collection={statusList}
                                size="md"
                                width="full"
                                name="status"
                                value={employee.status}
                                onValueChange={(e) =>
                                    setEmployee((prev) => ({ ...prev, status: e.value }))
                                }
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
                                            {statusList.items.map((status) => (
                                                <Select.Item item={status} key={status.value}>
                                                    {status.label}
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>
                            <Field.ErrorText>{error?.status?.msg}</Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.nid}>
                            <Input
                                name='nid'
                                type="tel"
                                value={employee.nid}
                                onChange={handleChange}
                                placeholder="NID Number"
                            />
                            <Field.ErrorText>{error?.nid?.msg}</Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.email}>
                            <Input
                                name='email'
                                type="email"
                                value={employee.email}
                                onChange={handleChange}
                                placeholder="Employee Email"
                            />
                            <Field.ErrorText>
                                {error?.email?.msg}
                            </Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                </Grid>
                <Button
                    mt={8}
                    type='submit'
                    colorPalette="gray"
                    loading={pending}
                >Add New Employee</Button>
            </form>
        </Box>
    )
}

export default EditEmployee

const bloodGroup = createListCollection({
    items: [
        { value: "A positive (A+)", label: "A positive (A+)" },
        { value: "A negative (A-)", label: "A negative (A-)" },
        { value: "B positive (B+)", label: "B positive (B+)" },
        { value: "B negative (B-)", label: "B negative (B-)" },
        { value: "O positive (O+)", label: "O positive (O+)" },
        { value: "O negative (O-)", label: "O negative (O-)" },
        { value: "AB positive (AB+)", label: "AB positive (AB+)" },
        { value: "AB negative (AB-)", label: "AB negative (AB-)" },
    ]
});

const statusList = createListCollection({
    items: [
        { value: "Full Time", label: "Full Time" },
        { value: "Part Time", label: "Part Time" },
        { value: "Fixed Term", label: "Fixed Term" },
        { value: "Intern", label: "Intern" },
        { value: "Resigned", label: "Resigned" },
        { value: "Terminated", label: "Terminated" },
    ]
});
