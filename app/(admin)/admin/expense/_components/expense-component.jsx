import { Alert, Table } from "@chakra-ui/react";
import { serverFetch } from "@/utils";
import Action from "./action";
import dayjs from "dayjs";

async function ExpenseComponent({ queryString }) {
    let data, error;

    try {
        const response = await serverFetch('expenses', queryString)
        data = response?.expenses || {};
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
