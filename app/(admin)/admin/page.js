"use client"

import { Box, Text, Flex, Grid, GridItem, Card, Icon, Heading, Alert, Badge } from '@chakra-ui/react'
import { LuDollarSign, LuGraduationCap, LuLandmark, LuLayers, LuNotebookText } from 'react-icons/lu'
import CalendarInput from '@/components/admin/calendar-input'
import UpcomingBatches from '@/components/admin/upcoming-batches'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { clientFetch } from '@/utils/client-fetch'
import { totalPayment as totalPay } from '@/lib/utils'
import dayjs from 'dayjs'
import useLoggedUser from '@/hooks/useLoggedUser'

function AdminHomePage() {
    const { user } = useLoggedUser()

    const [from, setFrom] = useState(dayjs(new Date()).format("DD-MM-YYYY"))
    const [to, setTo] = useState(dayjs(new Date()).format("DD-MM-YYYY"))

    const [totalStudents, setTotalStudents] = useState(0)
    const [totalAdmission, setTotalAdmission] = useState(0)
    const [totalBatches, setTotalBatches] = useState(0)
    const [totalPayment, setTotalPayment] = useState(0)
    const [totalDues, setTotalDues] = useState(0)
    const [totalExpense, setTotalExpense] = useState(0)

    useEffect(() => {
        async function fetchData() {
            try {
                const filter = {
                    limit: 999999,
                    from: from.split("-").reverse().join("-"),
                    to: to.split("-").reverse().join("-")
                }
                const students = await clientFetch('students', filter)
                const admission = await clientFetch('admission', filter)
                const batches = await clientFetch('batches', { to: to.split("-").reverse().join("-") })
                const expenses = await clientFetch("expenses", filter)
                const payment = await paymentReducer(admission?.admission)
                const dues = await dueReducer(admission?.admission, payment)
                const totalAmount = await expenseReducer(expenses?.expenses)

                setTotalStudents(students?.total)
                setTotalAdmission(admission?.total)
                setTotalBatches(batches?.total)
                setTotalPayment(payment)
                setTotalDues(dues)
                setTotalExpense(totalAmount)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [from, to])

    const router = useRouter();
    const handleNavigation = () => {
        router.push('/admin/settings#authentication');
    };

    return (
        <Box>
            {!user?.is2FAEnabled && (
                <Alert.Root status="warning">
                    <Alert.Indicator />
                    <Alert.Title>
                        Use 2FA security to provide maximum security to your account!
                    </Alert.Title>
                    <Badge
                        variant="solid"
                        size="md"
                        cursor="pointer"
                        onClick={handleNavigation}
                    >Activate 2FA</Badge>
                </Alert.Root>
            )}
            <Flex
                w="full"
                direction={{ base: "column", md: "row" }}
                alignItems="center"
                justify="space-between"
                gap={3}
                mb={3}
            >
                <Text textStyle="2xl" fontWeight="semibold">Welcome</Text>
                <Flex
                    direction={{ base: "column", md: "row" }}
                    alignItems="center"
                    gap={3}
                >
                    <CalendarInput
                        bg="bg"
                        name="from"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        placeholder="From"
                    />
                    <CalendarInput
                        bg="bg"
                        name="to"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="To"
                    />
                </Flex>
            </Flex>
            <Grid
                templateColumns={{
                    base: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(4, 1fr)",
                    lg: "repeat(6, 1fr)",
                }}
                gap="5"
            >
                <GridItem>
                    <Card.Root rounded="xl" shadow="xs">
                        <Card.Body
                            textStyle="lg"
                            fontWeight="bold"
                            textAlign="center"
                            alignItems="center"
                            gap={3}
                        >
                            <Box
                                color="blue.600"
                                bg="blue.100"
                                p={2}
                                rounded="xl"
                            >
                                <Icon size="xl">
                                    <LuGraduationCap />
                                </Icon>
                            </Box>
                            <Text>Total Students</Text>
                            <Text textStyle="2xl" color="blue.600">{totalStudents}</Text>
                        </Card.Body>
                    </Card.Root>
                </GridItem>
                <GridItem>
                    <Card.Root rounded="xl" shadow="xs">
                        <Card.Body
                            textStyle="lg"
                            fontWeight="bold"
                            textAlign="center"
                            alignItems="center"
                            gap={3}
                        >
                            <Box
                                color="cyan.600"
                                bg="cyan.100"
                                p={2}
                                rounded="xl"
                            >
                                <Icon size="xl">
                                    <LuLandmark />
                                </Icon>
                            </Box>
                            <Text>Total Admission</Text>
                            <Text textStyle="2xl" color="cyan.600">{totalAdmission}</Text>
                        </Card.Body>
                    </Card.Root>
                </GridItem>
                <GridItem>
                    <Card.Root rounded="xl" shadow="xs">
                        <Card.Body
                            textStyle="lg"
                            fontWeight="bold"
                            textAlign="center"
                            alignItems="center"
                            gap={3}
                        >
                            <Box
                                color="teal.600"
                                bg="teal.100"
                                p={2}
                                rounded="xl"
                            >
                                <Icon size="xl">
                                    <LuLayers />
                                </Icon>
                            </Box>
                            <Text>Completed Batches</Text>
                            <Text textStyle="2xl" color="teal.600">{totalBatches}</Text>
                        </Card.Body>
                    </Card.Root>
                </GridItem>
                <GridItem>
                    <Card.Root rounded="xl" shadow="xs">
                        <Card.Body
                            textStyle="lg"
                            fontWeight="bold"
                            textAlign="center"
                            alignItems="center"
                            gap={3}
                        >
                            <Box
                                color="green.600"
                                bg="green.100"
                                p={2}
                                rounded="xl"
                            >
                                <Icon size="xl">
                                    <LuDollarSign />
                                </Icon>
                            </Box>
                            <Text>Total Payment</Text>
                            <Text textStyle="2xl" color="green.600">{totalPayment} Tk</Text>
                        </Card.Body>
                    </Card.Root>
                </GridItem>
                <GridItem>
                    <Card.Root rounded="xl" shadow="xs">
                        <Card.Body
                            textStyle="lg"
                            fontWeight="bold"
                            textAlign="center"
                            alignItems="center"
                            gap={3}
                        >
                            <Box
                                color="red.600"
                                bg="red.100"
                                p={2}
                                rounded="xl"
                            >
                                <Icon size="xl">
                                    <LuNotebookText />
                                </Icon>
                            </Box>
                            <Text>Total Dues</Text>
                            <Text textStyle="2xl" color="red.600">{totalDues} Tk</Text>
                        </Card.Body>
                    </Card.Root>
                </GridItem>
                <GridItem>
                    <Card.Root rounded="xl" shadow="xs">
                        <Card.Body
                            textStyle="lg"
                            fontWeight="bold"
                            textAlign="center"
                            alignItems="center"
                            gap={3}
                        >
                            <Box
                                color="orange.600"
                                bg="orange.100"
                                p={2}
                                rounded="xl"
                            >
                                <Icon size="xl">
                                    <LuNotebookText />
                                </Icon>
                            </Box>
                            <Text>Total Expenses</Text>
                            <Text textStyle="2xl" color="orange.600">{totalExpense} Tk</Text>
                        </Card.Body>
                    </Card.Root>
                </GridItem>
            </Grid>
            <Grid
                templateColumns={{
                    base: "1fr",
                    md: "repeat(2, 1fr)"
                }}
                gap="5"
                mt={5}
            >
                <GridItem>
                    <Card.Root size="sm" rounded="xl" shadow="xs">
                        <Card.Header>
                            <Heading>Upcoming Batches</Heading>
                        </Card.Header>
                        <Card.Body>
                            <UpcomingBatches />
                        </Card.Body>
                    </Card.Root>
                </GridItem>
            </Grid>
        </Box>
    )
}

export default AdminHomePage

async function paymentReducer(admission) {
    if (admission?.length > 0) {
        const payment = admission.reduce((total, admission) => {
            return total + totalPay(admission?.paymentHistory);
        }, 0)
        return payment
    }
    return 0
}

async function expenseReducer(expenses) {
    if (expenses?.length > 0) {
        const totalAmount = expenses.reduce((total, expend) => {
            return total + expend?.amount;
        }, 0)
        return totalAmount
    }
    return 0
}

async function dueReducer(admission, payment) {
    if (admission?.length > 0) {
        const payableAmount = admission.reduce((total, admission) => {
            return total + admission?.payableAmount;
        }, 0)
        return payableAmount - payment
    }
    return 0
}
