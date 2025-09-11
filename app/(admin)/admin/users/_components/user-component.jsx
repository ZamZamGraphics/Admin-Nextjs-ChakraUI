import { Alert, Flex, Table, Text, Avatar } from "@chakra-ui/react";
import Status from "@/components/admin/status";
import { getAllUsers } from "@/app/actions/users";
import Action from "./action";
import Link from "next/link";

async function UserComponent({ queryString }) {
    let data, error;

    try {
        const response = await getAllUsers(queryString)
        data = response?.data || {};
    } catch (err) {
        error = err;
    }

    if (error) {
        return (
            <Table.Row>
                <Table.Cell colSpan={6}>
                    <Alert.Root status="error">
                        <Alert.Indicator />
                        <Alert.Title>{error.message}</Alert.Title>
                    </Alert.Root>
                </Table.Cell>
            </Table.Row>
        )
    }

    return (
        <>
            {data?.length > 0 ? data.map((user) => (
                <Table.Row key={user._id}>
                    <Table.Cell>
                        <Flex
                            align="center"
                            gap={3}
                            as={Link}
                            href={`/admin/users/${user?._id}`}
                        >
                            <Avatar.Root>
                                <Avatar.Fallback name={user?.fullname} />
                                <Avatar.Image src={`${process.env.API_URL}/upload/${user?.avatar}`} />
                            </Avatar.Root>
                            <Text fontWeight="semibold">
                                {user?.fullname}
                            </Text>
                        </Flex>
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
