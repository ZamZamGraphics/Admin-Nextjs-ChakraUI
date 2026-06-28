import { Skeleton, Stack, Table } from '@chakra-ui/react'

function Loading({ col }) {
    return (
        <Table.Row>
            <Table.Cell colSpan={col}>
                <Stack flex="1" >
                    <Skeleton height="6" />
                    <Skeleton height="6" />
                    <Skeleton height="6" />
                    <Skeleton height="6" />
                    <Skeleton height="6" />
                    <Skeleton height="6" />
                    <Skeleton height="6" />
                    <Skeleton height="6" />
                    <Skeleton height="6" />
                    <Skeleton height="6" />
                    <Skeleton height="6" />
                    <Skeleton height="6" />
                    <Skeleton height="6" />
                    <Skeleton height="6" />
                    <Skeleton height="6" />
                </Stack>
            </Table.Cell>
        </Table.Row>
    )
}

export default Loading
