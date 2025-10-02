import { serverFetchById } from '@/utils'
import { Theme, Alert, Box, DataList, Grid, GridItem, Table, Text } from '@chakra-ui/react'
import logoLight from "@/public/logo-light.svg"
import Link from 'next/link'
import Image from 'next/image'
import Status from '@/components/admin/status'
import dayjs from 'dayjs'
import PrintButton from './print-button'

async function page({ params }) {
    const { id } = await params

    try {
        const admission = await serverFetchById('admission', id)
        const totalPay = admission?.paymentHistory?.reduce((total, history) => {
            return total + history.amount
        }, 0);
        const due = admission?.payableAmount - totalPay;

        return (
            <Theme appearance="light">
                <Box
                    w="210mm"
                    h="297mm"
                    mx="auto"
                    p={12}
                    boxShadow="md"
                    bg="#fff"
                >
                    <Box position="relative" w="full" h="full">
                        <Grid
                            templateColumns="repeat(2, 1fr)"
                            gap={8}
                            alignItems="center"
                        >
                            <GridItem colSpan={2}>
                                <Link href="/admin/admission">
                                    <Image
                                        src={logoLight}
                                        alt="Al Madina IT"
                                        priority
                                        style={{
                                            width: "250px",
                                            height: "auto",
                                            display: "block",
                                        }}
                                    />
                                </Link>
                                <Box
                                    position="absolute"
                                    top={0}
                                    right={0}
                                    className='print:hidden'
                                >
                                    <PrintButton />
                                </Box>
                            </GridItem>
                            <GridItem spaceY={3}>
                                <Text>
                                    Fakhre Bangal Road, Kandipara, <br />
                                    Brahmanbaria-3400 <br />
                                    Phone : +880 1736 722 622 <br />
                                    Email : info@almadinait.com <br />
                                    Web : almadinait.com <br />
                                </Text>
                            </GridItem>
                            <GridItem>
                                <Table.Root size="sm" showColumnBorder>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeader
                                                colSpan={2}
                                                color="#fff"
                                                bg="rgb(102, 184, 33)"
                                                textAlign="center"
                                                textStyle="xl"
                                                fontWeight="semibold"
                                            >
                                                Student ID : {admission?.student?.studentId}
                                            </Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        <Table.Row bg="#f4f4f5">
                                            <Table.Cell>Invoice Date</Table.Cell>
                                            <Table.Cell>
                                                {dayjs(admission?.admitedAt).format("DD-MM-YYYY")}
                                            </Table.Cell>
                                        </Table.Row>
                                        {admission?.nextPay ? (
                                            <Table.Row bg="#f4f4f5">
                                                <Table.Cell>Due Date</Table.Cell>
                                                <Table.Cell>
                                                    {dayjs(admission?.nextPay).format("DD-MM-YYYY")}
                                                </Table.Cell>
                                            </Table.Row>
                                        ) : (
                                            <Table.Row bg="#f4f4f5">
                                                <Table.Cell
                                                    colSpan={2}
                                                    textAlign="center"
                                                >
                                                    Payment Completed
                                                </Table.Cell>
                                            </Table.Row>
                                        )}

                                    </Table.Body>
                                </Table.Root>
                            </GridItem>
                            <GridItem colSpan={2}>
                                <Text textStyle="xl" fontWeight="semibold">Invoice To</Text>
                                <DataList.Root
                                    size="md"
                                    orientation="horizontal"
                                    variant="bold"
                                    gap={0}
                                >
                                    <DataList.Item pt="1">
                                        <DataList.ItemLabel>Student Name</DataList.ItemLabel>
                                        <DataList.ItemValue>
                                            {admission?.student?.fullName}
                                        </DataList.ItemValue>
                                    </DataList.Item>
                                    <DataList.Item pt="1">
                                        <DataList.ItemLabel>Address</DataList.ItemLabel>
                                        <DataList.ItemValue>
                                            {admission?.student?.address?.present}
                                        </DataList.ItemValue>
                                    </DataList.Item>
                                    <DataList.Item pt="1">
                                        <DataList.ItemLabel>Mobile</DataList.ItemLabel>
                                        <DataList.ItemValue>
                                            {admission?.student?.phone[0]}
                                        </DataList.ItemValue>
                                    </DataList.Item>
                                    <DataList.Item pt="1">
                                        <DataList.ItemLabel>Status</DataList.ItemLabel>
                                        <DataList.ItemValue>
                                            <Status status={admission?.student?.status} />
                                        </DataList.ItemValue>
                                    </DataList.Item>
                                    <DataList.Item pt="1">
                                        <DataList.ItemLabel>Batch No</DataList.ItemLabel>
                                        <DataList.ItemValue>
                                            {admission?.batchNo}
                                        </DataList.ItemValue>
                                    </DataList.Item>
                                </DataList.Root>
                            </GridItem>
                            <GridItem colSpan={2}>
                                <Table.Root
                                    size="sm"
                                    variant="outline"
                                    showColumnBorder
                                >
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeader textAlign="center">
                                                Course Name
                                            </Table.ColumnHeader>
                                            <Table.ColumnHeader textAlign="center">
                                                Course Type
                                            </Table.ColumnHeader>
                                            <Table.ColumnHeader
                                                textAlign="right"
                                                pr={10}
                                            >
                                                Total
                                            </Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>
                                                {admission?.course?.name}
                                            </Table.Cell>
                                            <Table.Cell
                                                textAlign="right"
                                                pr={5}
                                            >
                                                {admission?.course?.courseType}
                                            </Table.Cell>
                                            <Table.Cell
                                                textAlign="right"
                                                pr={10}
                                            >
                                                {admission?.course?.courseFee}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell
                                                colSpan={2}
                                                textAlign="right"
                                                pr={5}
                                            >Discount</Table.Cell>
                                            <Table.Cell
                                                textAlign="right"
                                                pr={10}
                                            >
                                                {admission?.discount || 0}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell
                                                colSpan={2}
                                                textAlign="right"
                                                pr={5}
                                            >Total</Table.Cell>
                                            <Table.Cell
                                                textAlign="right"
                                                pr={10}
                                            >
                                                {admission?.payableAmount}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell
                                                colSpan={2}
                                                textAlign="right"
                                                pr={5}
                                            >Payment</Table.Cell>
                                            <Table.Cell
                                                textAlign="right"
                                                pr={10}
                                            >{totalPay}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell
                                                colSpan={2}
                                                textAlign="right"
                                                pr={5}
                                            >Due</Table.Cell>
                                            <Table.Cell
                                                textAlign="right"
                                                pr={10}
                                            >{due}</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table.Root>
                            </GridItem>
                            {admission?.paymentHistory.length > 1 &&
                                <GridItem colSpan={2}>
                                    <Text mb={2} textStyle="xl" fontWeight="semibold">Transactions</Text>
                                    <Table.Root
                                        size="sm"
                                        variant="outline"
                                        showColumnBorder
                                    >
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.ColumnHeader textAlign="center">
                                                    Date
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader textAlign="center">
                                                    Method
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader textAlign="center">
                                                    Transactions ID
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader
                                                    textAlign="right"
                                                    pr={10}
                                                >
                                                    Amount
                                                </Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {admission?.paymentHistory?.map((payment) => {
                                                return (
                                                    <Table.Row key={payment._id}>
                                                        <Table.Cell>
                                                            {dayjs(payment.date).format("DD-MM-YYYY")}
                                                        </Table.Cell>
                                                        <Table.Cell
                                                            textAlign="center"
                                                        >{payment.method}</Table.Cell>
                                                        <Table.Cell
                                                            textAlign="center"
                                                        >{payment.transactionId}</Table.Cell>
                                                        <Table.Cell
                                                            textAlign="right"
                                                            pr={10}
                                                        >{payment.amount}</Table.Cell>
                                                    </Table.Row>
                                                )
                                            })}
                                        </Table.Body>
                                    </Table.Root>
                                </GridItem>
                            }
                        </Grid>
                        <Box position="absolute" bottom={0} left={0}>
                            This invoice must be produced when demanded. <br />
                            Fees once paid are not refundable. <br />
                            Subject to terms and conditions printed overleaf the invoice.
                        </Box>
                        <Box position="absolute" bottom={0} right={0}>
                            <Text>Authorized Signatory</Text>
                        </Box>
                    </Box>
                </Box>
            </Theme>
        )
    } catch (e) {
        return (
            <Alert.Root status="error">
                <Alert.Indicator />
                <Alert.Title>{e.message}</Alert.Title>
            </Alert.Root>
        )
    }
}

export default page
