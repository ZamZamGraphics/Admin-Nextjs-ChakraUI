import { Avatar, CloseButton, Dialog, Flex, Portal, Table, Text } from "@chakra-ui/react"
import Status from "@/components/admin/status"
import dayjs from 'dayjs';

function StudentDialog({ student }) {
    return (
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Body>
                        <Flex
                            mt={3}
                            gap="3"
                            direction="column"
                            align="center"
                        >
                            <Avatar.Root boxSize="100px" >
                                <Avatar.Fallback fontSize="40px" name={student?.fullName} />
                                <Avatar.Image src={`${process.env.API_URL}/upload/${student?.avatar}`} />
                            </Avatar.Root>
                            <Text fontWeight="semibold" textStyle="2xl">
                                {student?.fullName}
                            </Text>
                            <Status status={student?.status} />
                        </Flex>
                        <Table.Root size="sm">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader w="50%">
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader w="50%">
                                    </Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text fontWeight="semibold" textStyle="xl">
                                            Student ID
                                        </Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text fontWeight="semibold" textStyle="xl">
                                            {student?.studentId}
                                        </Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Father's Name</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{student?.fathersName}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Mother's Name</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{student?.mothersName}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Present Address</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{student?.address.present}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Permanent Address</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{student?.address.permanent}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Date of Birth</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>
                                            {dayjs(student?.birthDay).format("DD MMMM YYYY")}
                                        </Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Gender</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{student?.gender}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Mobile Number</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{student?.phone[0]}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Guardian Number</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{student?.phone[1]}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>E-mail</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{student?.email}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>NID Number</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{student?.nid}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Birth Certificate No</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{student?.birthCertificate}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Blood Group</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{student?.bloodGroup}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Occupation</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{student?.occupation}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Educational Qualification</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{student?.education}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Reference</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{student?.reference}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Registered</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>
                                            {dayjs(student?.registeredAt).format("DD MMMM YYYY h:mm A")}
                                        </Text>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table.Root>
                    </Dialog.Body>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Portal>
    )
}

export default StudentDialog
