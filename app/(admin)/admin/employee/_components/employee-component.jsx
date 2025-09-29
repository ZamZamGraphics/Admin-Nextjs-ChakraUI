import { Alert, Flex, Table, Text, Avatar, Dialog } from "@chakra-ui/react";
import { serverFetch } from "@/utils";
import Status from "@/components/admin/status";
import Action from "./action";
import EmployeeDialog from "./employee-dialog";

async function EmployeeComponent({ queryString }) {
    let data, error;

    try {
        const response = await serverFetch('employee', queryString)
        data = response?.employee || {};
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
            {data?.length > 0 ? data.map((employee) => (
                <Table.Row key={employee._id}>
                    <Table.Cell>
                        <Dialog.Root size={{ mdDown: "full", md: "lg" }} scrollBehavior="outside">
                            <Dialog.Trigger asChild>
                                <Flex align="center" gap={3} cursor="pointer">
                                    <Avatar.Root>
                                        <Avatar.Fallback name={employee?.fullName} />
                                        <Avatar.Image src={employee?.avatar && `${process.env.API_URL}/upload/${employee.avatar}`} />
                                    </Avatar.Root>
                                    <Text fontWeight="semibold">
                                        {employee?.fullName}
                                    </Text>
                                </Flex>
                            </Dialog.Trigger>
                            <EmployeeDialog employee={employee} />
                        </Dialog.Root>
                    </Table.Cell>
                    <Table.Cell>
                        {employee?.phone[0]} <br />
                        {employee?.phone[1]}
                    </Table.Cell>
                    <Table.Cell>{employee?.address}</Table.Cell>
                    <Table.Cell>{employee?.designation}</Table.Cell>
                    <Table.Cell>
                        <Status status={employee?.status} />
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                        <Action id={employee?._id} />
                    </Table.Cell>
                </Table.Row>
            )) : (
                <Table.Row>
                    <Table.Cell colSpan={6}>
                        <Alert.Root status="warning">
                            <Alert.Indicator />
                            <Alert.Title>Employee Not Found</Alert.Title>
                        </Alert.Root>
                    </Table.Cell>
                </Table.Row>
            )}
        </>
    )
}

export default EmployeeComponent
