import { Alert, Flex, Table, Text, Avatar, Dialog } from "@chakra-ui/react";
import Status from "@/components/admin/status";
import Action from "./action";
import UserDialog from "./user-dialog";

function UserComponent({ data }) {
    return (
        <>
            {data?.length > 0 ? data.map((user) => (
                <Table.Row key={user._id}>
                    <Table.Cell>
                        <Dialog.Root size={{ mdDown: "full", md: "lg" }} scrollBehavior="outside">
                            <Dialog.Trigger asChild>
                                <Flex align="center" gap={3} cursor="pointer">
                                    <Avatar.Root>
                                        <Avatar.Fallback name={user?.fullname} />
                                        <Avatar.Image src={user?.avatar && `${process.env.NEXT_PUBLIC_API_URL}/upload/${user.avatar}`} />
                                    </Avatar.Root>
                                    <Text fontWeight="semibold">
                                        {user?.fullname}
                                    </Text>
                                </Flex>
                            </Dialog.Trigger>
                            <UserDialog user={user} />
                        </Dialog.Root>
                    </Table.Cell>
                    <Table.Cell>{user?.username}</Table.Cell>
                    <Table.Cell>{user?.email}</Table.Cell>
                    <Table.Cell>{user?.role}</Table.Cell>
                    <Table.Cell>
                        <Status status={user?.status} />
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                        <Action id={user?._id} />
                    </Table.Cell>
                </Table.Row>
            )) : (
                <Table.Row>
                    <Table.Cell colSpan={6}>
                        <Alert.Root status="warning">
                            <Alert.Indicator />
                            <Alert.Title>User Not Found</Alert.Title>
                        </Alert.Root>
                    </Table.Cell>
                </Table.Row>
            )}
        </>
    )
}

export default UserComponent
