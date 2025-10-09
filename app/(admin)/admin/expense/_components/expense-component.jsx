import { Alert, Table } from "@chakra-ui/react";
import Action from "./action";
import dayjs from "dayjs";

function ExpenseComponent({ data }) {
    return (
        <>
            {data?.length > 0 ? data.map((expense) => (
                <Table.Row key={expense._id}>
                    <Table.Cell>{expense?.name}</Table.Cell>
                    <Table.Cell>{expense?.type}</Table.Cell>
                    <Table.Cell>{expense?.description}</Table.Cell>
                    <Table.Cell>{expense?.amount}</Table.Cell>
                    <Table.Cell>{dayjs(expense?.date).format("DD-MM-YYYY")}</Table.Cell>
                    <Table.Cell textAlign="center">
                        <Action id={expense?._id} />
                    </Table.Cell>
                </Table.Row>
            )) : (
                <Table.Row>
                    <Table.Cell colSpan={6}>
                        <Alert.Root status="warning">
                            <Alert.Indicator />
                            <Alert.Title>Expense Not Found</Alert.Title>
                        </Alert.Root>
                    </Table.Cell>
                </Table.Row>
            )}
        </>
    )
}

export default ExpenseComponent
