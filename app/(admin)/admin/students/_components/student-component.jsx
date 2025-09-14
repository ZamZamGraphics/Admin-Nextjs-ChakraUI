import { Alert, Flex, Table, Text, Avatar, Dialog } from "@chakra-ui/react";
import Status from "@/components/admin/status";
import Action from "./action";
import { getAllStudents } from "@/app/actions/students";
import StudentDialog from "./student-dialog";

async function StudentComponent({ queryString }) {
    let data, error;

    try {
        const response = await getAllStudents(queryString)
        data = response?.data || {};
    } catch (err) {
        error = err;
    }

    if (error) {
        return (
            <Table.Row>
                <Table.Cell colSpan={8}>
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
            {data?.length > 0 ? data.map((std) => (
                <Table.Row key={std._id}>
                    <Table.Cell textAlign="center">
                        <Text fontWeight="semibold" textStyle="lg">
                            {std?.studentId}
                        </Text>
                    </Table.Cell>
                    <Table.Cell>
                        <Dialog.Root size={{ mdDown: "full", md: "lg" }} scrollBehavior="outside">
                            <Dialog.Trigger asChild>
                                <Flex align="center" gap={3} cursor="pointer">
                                    <Avatar.Root>
                                        <Avatar.Fallback name={std?.fullName} />
                                        <Avatar.Image src={`${process.env.API_URL}/upload/${std?.avatar}`} />
                                    </Avatar.Root>
                                    <Text fontWeight="semibold">
                                        {std?.fullName}
                                    </Text>
                                </Flex>
                            </Dialog.Trigger>
                            <StudentDialog student={std} />
                        </Dialog.Root>
                    </Table.Cell>
                    <Table.Cell>{std?.phone[0]}</Table.Cell>
                    <Table.Cell>
                        {std?.admissionDetails?.map((admission) => {
                            return (
                                <Text key={admission._id}>
                                    {admission?.course?.name}
                                </Text>
                            );
                        })}
                    </Table.Cell>
                    <Table.Cell>
                        {std?.admissionDetails?.map((admission) => {
                            return (
                                <Text key={admission._id}>
                                    {admission?.batchNo}
                                </Text>
                            );
                        })}
                    </Table.Cell>
                    <Table.Cell>
                        <Status status={std?.status} />
                    </Table.Cell>
                    <Table.Cell>{std?.totalDues}</Table.Cell>
                    <Table.Cell textAlign="center">
                        <Action id={std?._id} />
                    </Table.Cell>
                </Table.Row>
            )) : (
                <Table.Row>
                    <Table.Cell colSpan={8}>
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

export default StudentComponent