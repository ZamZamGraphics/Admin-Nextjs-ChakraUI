import { Alert, Spinner, Table } from '@chakra-ui/react'

function LoadingBatches() {
    return (
        <Table.Row>
            <Table.Cell colSpan={7}>
                <Alert.Root status="warning">
                    <Alert.Indicator>
                        <Spinner size="sm" />
                    </Alert.Indicator>
                    <Alert.Title>We are loading something</Alert.Title>
                </Alert.Root>
            </Table.Cell>
        </Table.Row>
    )
}

export default LoadingBatches
