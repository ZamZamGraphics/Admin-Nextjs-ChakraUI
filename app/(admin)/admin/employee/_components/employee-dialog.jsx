import { Avatar, CloseButton, Dialog, Flex, Portal, Table, Text } from "@chakra-ui/react"
import Status from "@/components/admin/status"
import dayjs from 'dayjs';

function EmployeeDialog({ employee }) {
    const avatar = employee?.avatar && `${process.env.API_URL}/upload/${employee.avatar}`
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
                                <Avatar.Fallback fontSize="40px" name={employee?.fullName} />
                                <Avatar.Image src={avatar} />
                            </Avatar.Root>
                            <Text fontWeight="semibold" textStyle="2xl">
                                {employee?.fullName}
                            </Text>
                            <Status status={employee?.status} />
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
                                        <Text>Full Name</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{employee?.fullName}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Father's Name</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{employee?.fathersName}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Mother's Name</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{employee?.mothersName}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Address</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{employee?.address}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Date of Birth</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>
                                            {dayjs(employee?.birthDay).format("DD MMMM YYYY")}
                                        </Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Gender</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{employee?.gender}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Phone</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{employee?.phone[0]}</Text>
                                        <Text>{employee?.phone[1]}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Email</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{employee?.email}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>NID Number</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{employee?.nid}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Designation</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{employee?.designation}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Blood Group</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{employee?.bloodGroup}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Education</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{employee?.education}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Registered</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>
                                            {dayjs(employee?.registeredAt).format("DD MMMM YYYY h:mm A")}
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

export default EmployeeDialog
