import { Alert, Table, Text } from "@chakra-ui/react";
import { getAllBatches } from "@/app/actions/batches";
import Action from "./action";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

async function BatchesComponent({ queryString }) {
    let data, error;

    try {
        const response = await getAllBatches(queryString)
        data = response?.batches || {};
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
            {data?.length > 0 ? data.map((batch) => (
                <Table.Row key={batch._id}>
                    <Table.Cell textAlign="center">
                        <Text fontWeight="semibold" textStyle="lg">
                            {batch?.batchNo}
                        </Text>
                    </Table.Cell>
                    <Table.Cell>
                        <Text fontWeight="semibold" textStyle="lg">
                            {batch?.course?.name}
                        </Text>
                        {batch?.course?.courseType}
                    </Table.Cell>
                    <Table.Cell>
                        <strong>
                            {
                                dayjs().isBetween(dayjs(batch.startDate), dayjs(dayjs(batch.endDate))) ? "Running" :
                                    dayjs().isBefore(dayjs(batch.startDate)) ? "Upcoming" : "Completed"
                            }
                        </strong> <br />
                        {batch?.classTime}
                    </Table.Cell>
                    <Table.Cell>
                        {dayjs(batch?.startDate).format("DD-MM-YYYY")} <br />
                        {dayjs(batch?.endDate).format("DD-MM-YYYY")}
                    </Table.Cell>
                    <Table.Cell>{batch?.classDays}</Table.Cell>
                    <Table.Cell textAlign="center">{batch?.student?.length}</Table.Cell>
                    <Table.Cell textAlign="center">
                        <Action id={batch?._id} />
                    </Table.Cell>
                </Table.Row>
            )) : (
                <Table.Row>
                    <Table.Cell colSpan={7}>
                        <Alert.Root status="warning">
                            <Alert.Indicator />
                            <Alert.Title>Batch Not Found</Alert.Title>
                        </Alert.Root>
                    </Table.Cell>
                </Table.Row>
            )}
        </>
    )
}

export default BatchesComponent
