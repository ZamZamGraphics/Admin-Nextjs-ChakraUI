import Link from "next/link";
import { Alert, Flex, Table, Text, Avatar, Badge } from "@chakra-ui/react";
import { getAllAdmission } from "@/app/actions/admissions"
import dayjs from 'dayjs';
import Action from "./action";
import Status from "@/components/admin/status";

async function AdmissionComponent({ queryString }) {
    let data, error;

    try {
        const response = await getAllAdmission(queryString)
        data = response?.data || {};
    } catch (err) {
        error = err;
    }

    if (error) {
        return (
            <Table.Row>
                <Table.Cell colSpan={7}>
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
            {data?.length > 0 ? data.map((admission) => (
                <Table.Row key={admission._id}>
                    <Table.Cell textAlign="center">
                        <Text fontWeight="semibold" textStyle="lg">
                            {admission?.student?.studentId}
                        </Text>
                    </Table.Cell>
                    <Table.Cell>
                        <Flex
                            align="center"
                            gap={3}
                            as={Link}
                            href={`/invoice/${admission?._id}`}
                        >
                            <Avatar.Root>
                                <Avatar.Fallback name={admission?.student?.fullName} />
                                <Avatar.Image src={`${process.env.API_URL}/upload/${admission?.student?.avatar}`} />
                            </Avatar.Root>
                            <Text fontWeight="semibold">
                                {admission?.student?.fullName}
                            </Text>
                        </Flex>
                    </Table.Cell>
                    <Table.Cell>{admission?.course?.name}</Table.Cell>
                    <Table.Cell>{admission?.batchNo}</Table.Cell>
                    <Table.Cell>{admission?.due}</Table.Cell>
                    <Table.Cell>
                        {admission?.nextPay ? (
                            dayjs(admission?.nextPay).format("DD-MM-YYYY")
                        ) : (
                            <Status status="Full Paid" />
                        )}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                        <Action id={admission?._id} />
                    </Table.Cell>
                </Table.Row>
            )) : (
                <Table.Row>
                    <Table.Cell colSpan={7}>
                        <Alert.Root status="warning">
                            <Alert.Indicator />
                            <Alert.Title>Admission Not Found</Alert.Title>
                        </Alert.Root>
                    </Table.Cell>
                </Table.Row>
            )}
        </>
    )
}

export default AdmissionComponent
