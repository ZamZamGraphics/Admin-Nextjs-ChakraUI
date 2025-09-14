"use client"

import { Avatar, Box, Button, createListCollection, Field, Flex, Grid, GridItem, HStack, Input, Portal, RadioGroup, Select, Text } from "@chakra-ui/react"
import { useState } from "react"

function NewStudentPage() {
    const [avatar, setAvatar] = useState(null);
    const [avatarImage, setAvatarImage] = useState("");

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

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(avatar)
        console.log(student)
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
                </Flex>
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="6">
                    <GridItem colSpan={{ base: 1, md: 2 }}>
                        <Field.Root invalid>
                            <Input
                                name='fullName'
                                value={student.fullName}
                                onChange={handleChange}
                                placeholder="Student Name"
                            />
                            <Field.ErrorText>Student Name is required</Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid>
                            <Input
                                name='fathersName'
                                value={student.fathersName}
                                onChange={handleChange}
                                placeholder="Fathers Name"
                            />
                            <Field.ErrorText>Fathers Name is required</Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid>
                            <Input
                                name='mothersName'
                                value={student.mothersName}
                                onChange={handleChange}
                                placeholder="Mothers Name"
                            />
                            <Field.ErrorText>Mothers Name is required</Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem colSpan={{ base: 1, md: 2 }}>
                        <Field.Root invalid>
                            <Input
                                name='present'
                                value={student.present}
                                onChange={handleChange}
                                placeholder="Present Address"
                            />
                            <Field.ErrorText>Present Address is required</Field.ErrorText>
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
                        <Field.Root invalid>
                            <Input
                                name='stdPhone'
                                type="tel"
                                value={student.stdPhone}
                                onChange={handleChange}
                                placeholder="Student Mobile Number"
                            />
                            <Field.ErrorText>Present Address is required</Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root>
                            <Input
                                name='guardianPhone'
                                type="tel"
                                value={student.guardianPhone}
                                onChange={handleChange}
                                placeholder="Guardian Number"
                            />
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid>
                            <Input
                                name='birthDay'
                                value={student.birthDay}
                                onChange={handleChange}
                                placeholder="Date of Birth"
                            />
                            <Field.ErrorText>Date of Birth is required</Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid>
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
                                    <Field.ErrorText>Gender is required</Field.ErrorText>
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
                        <Field.Root>
                            <Input
                                name='nid'
                                type="tel"
                                value={student.nid}
                                onChange={handleChange}
                                placeholder="NID Number"
                            />
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root>
                            <Input
                                name='birthCertificate'
                                type="tel"
                                value={student.birthCertificate}
                                onChange={handleChange}
                                placeholder="Birth Certificate Number"
                            />
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root>
                            <Input
                                name='email'
                                type="email"
                                value={student.email}
                                onChange={handleChange}
                                placeholder="Student Email"
                            />
                        </Field.Root>
                    </GridItem>
                </Grid>
                <Button
                    mt={8}
                    type='submit'
                    colorPalette="gray"
                // disabled={pending}
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
