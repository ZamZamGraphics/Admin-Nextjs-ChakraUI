import { Alert, Table } from '@chakra-ui/react'

function Error({ error, col }) {
    return (
        <Table.Row>
            <Table.Cell colSpan={col}>
                <Alert.Root status="error">
                    <Alert.Indicator />
                    <Alert.Title>{error.message}</Alert.Title>
                </Alert.Root>
            </Table.Cell>
        </Table.Row>
    )
}

export default Error
