import { Avatar, CloseButton, Dialog, Flex, Portal, Table, Text } from "@chakra-ui/react"
import Status from "@/components/admin/status"
import dayjs from 'dayjs';

function UserDialog({ user }) {
    const avatar = user?.avatar && `${process.env.NEXT_PUBLIC_API_URL}/upload/${user.avatar}`
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
                                <Avatar.Fallback fontSize="40px" name={user?.fullname} />
                                <Avatar.Image src={avatar} />
                            </Avatar.Root>
                            <Text fontWeight="semibold" textStyle="2xl">
                                {user?.fullname}
                            </Text>
                            <Status status={user?.status} />
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
                                        <Text>{user?.fullname}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Username</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{user?.username}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Email</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{user?.email}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>User Role</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{user?.role}</Text>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="end">
                                        <Text>Registered</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>
                                            {dayjs(user?.createdAt).format("DD MMMM YYYY h:mm A")}
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

export default UserDialog
