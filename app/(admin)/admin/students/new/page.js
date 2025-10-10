"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom";
import CalendarInput from "@/components/admin/calendar-input";
import { Alert, Avatar, Box, Button, createListCollection, Field, Flex, Grid, GridItem, HStack, Input, Portal, RadioGroup, Select, Text } from "@chakra-ui/react"
import { addStudent } from "@/app/actions/students";
import { parseDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

function NewStudentPage() {
    const { pending } = useFormStatus();
    const [avatar, setAvatar] = useState(null);
    const [avatarImage, setAvatarImage] = useState("");
    const [error, setError] = useState("")

    const [student, setStudent] = useState({
        fullName: "",
        fathersName: "",
        mothersName: "",
        present: "",
        permanent: "",
        birthDay: "",
        gender: "",
        stdPhone: "",
        guardianPhone: "",
        email: "",
        occupation: "",
        nid: "",
        birthCertificate: "",
        bloodGroup: "",
        education: "",
        reference: "",
    })

    const router = useRouter()

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "present") {
            setStudent((prev) => ({
                ...prev,
                [name]: value,
                permanent: value,
            }));
        } else {
            setStudent((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
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

            Object.entries(student).forEach(([key, value]) => {
                if (key === "bloodGroup" && Array.isArray(value)) {
                    formData.append(key, value[0]);
                } else if (key === "birthDay") {
                    const dob = parseDate(student.birthDay) || ""
                    formData.append(key, dob);
                } else {
                    formData.append(key, value);
                }
            });
            formData.append("status", "Pending");

            const response = await addStudent(formData);
            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (response?.success) {
                router.push(`/admin/admission/new?studentId=${response.studentId}`)
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
            <Text textStyle="2xl" fontWeight="semibold">New Student</Text>
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
                            <Avatar.Fallback fontSize="40px" name="Student Photo" />
                            <Avatar.Image src={avatarImage || null} />
                        </Avatar.Root>
                    </label>
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
                                value={student.fullName}
                                onChange={handleChange}
                                placeholder="Student Name"
                            />
                            <Field.ErrorText>{error?.fullName?.msg}</Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.fathersName}>
                            <Input
                                name='fathersName'
                                value={student.fathersName}
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
                                value={student.mothersName}
                                onChange={handleChange}
                                placeholder="Mothers Name"
                            />
                            <Field.ErrorText>
                                {error?.mothersName?.msg}
                            </Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem colSpan={{ base: 1, md: 2 }}>
                        <Field.Root invalid={error?.present}>
                            <Input
                                name='present'
                                value={student.present}
                                onChange={handleChange}
                                placeholder="Present Address"
                            />
                            <Field.ErrorText>{error?.present?.msg}</Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem colSpan={{ base: 1, md: 2 }}>
                        <Field.Root>
                            <Input
                                name='permanent'
                                value={student.permanent}
                                onChange={handleChange}
                                placeholder="Permanent Address"
                            />
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.stdPhone}>
                            <Input
                                name='stdPhone'
                                type="tel"
                                value={student.stdPhone}
                                onChange={handleChange}
                                placeholder="Student Mobile Number"
                            />
                            <Field.ErrorText>{error?.stdPhone?.msg}</Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.guardianPhone}>
                            <Input
                                name='guardianPhone'
                                type="tel"
                                value={student.guardianPhone}
                                onChange={handleChange}
                                placeholder="Guardian Number"
                            />
                            <Field.ErrorText>
                                {error?.guardianPhone?.msg}
                            </Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.birthDay}>
                            <CalendarInput
                                name='birthDay'
                                value={student.birthDay}
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
                                value={student.gender}
                                onValueChange={(value) =>
                                    setStudent((prev) => ({ ...prev, gender: value.value }))
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
                                name='occupation'
                                value={student.occupation}
                                onChange={handleChange}
                                placeholder="Student Occupation"
                            />
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root>
                            <Input
                                name='education'
                                value={student.education}
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
                                value={student.bloodGroup}
                                onValueChange={(value) =>
                                    setStudent((prev) => ({ ...prev, bloodGroup: value.value }))
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
                        <Field.Root>
                            <Input
                                name='reference'
                                value={student.reference}
                                onChange={handleChange}
                                placeholder="Reference"
                            />
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.nid}>
                            <Input
                                name='nid'
                                type="tel"
                                value={student.nid}
                                onChange={handleChange}
                                placeholder="NID Number"
                            />
                            <Field.ErrorText>{error?.nid?.msg}</Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.birthCertificate}>
                            <Input
                                name='birthCertificate'
                                type="tel"
                                value={student.birthCertificate}
                                onChange={handleChange}
                                placeholder="Birth Certificate Number"
                            />
                            <Field.ErrorText>
                                {error?.birthCertificate?.msg}
                            </Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.email}>
                            <Input
                                name='email'
                                type="email"
                                value={student.email}
                                onChange={handleChange}
                                placeholder="Student Email"
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
                >Add New Student</Button>
            </form>
        </Box>
    )
}

export default NewStudentPage

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
