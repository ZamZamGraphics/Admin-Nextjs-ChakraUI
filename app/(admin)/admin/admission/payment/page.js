"use client"

import CalendarInput from "@/components/admin/calendar-input";
import useDebounce from "@/hooks/useDebounce";
import { Alert, Avatar, Box, Field, Input, Flex, Text, Button, Table } from "@chakra-ui/react";
import Status from "@/components/admin/status";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { parseDate, totalPayment } from "@/lib/utils";
import { addPayment } from "@/app/actions/admissions";

function PaymentPage() {
    const { pending } = useFormStatus();
    const [error, setError] = useState("");

    const [studentId, setStudentId] = useState("");
    const [discount, setDiscount] = useState("");
    const [payment, setPayment] = useState("");
    const [nextPay, setNextPay] = useState("");
    const [batch, setBatch] = useState("");
    const [student, setStudent] = useState("");
    const [course, setCourse] = useState("");
    const [total, setTotal] = useState("");
    const [previousDue, setPreviousDue] = useState("");
    const [due, setDue] = useState("");
    const [method, setMethod] = useState("Cash");
    const [transactionId, setTransactionId] = useState(null);

    const debounce = useDebounce(studentId, 500)
    const router = useRouter()

    useEffect(() => {
        async function fetchStudent() {
            try {
                const res = await fetch(`/api/admission/${batch}/${studentId}`, {
                    credentials: "include",
                })
                const response = await res.json()
                if (response?.admission) {
                    const { admission } = response;
                    setStudent(admission?.student);
                    setStudent({
                        avatar: admission?.student.avatar,
                        fullName: admission?.student.fullName,
                        status: admission?.student.status,
                        phone: admission?.student.phone[0]
                    });
                    setCourse(admission?.course);
                    const prevDue = admission?.payableAmount - totalPayment(admission?.paymentHistory)
                    setPreviousDue(prevDue);
                    const subTotal = prevDue - discount
                    setTotal(subTotal);
                    setDue(subTotal - payment);
                } else {
                    setStudent("");
                    setCourse("");
                    setPreviousDue("");
                    setTotal("");
                    setDue("");
                }
            } catch (e) {
                setError({ message: e.message });
            }
        }
        if (debounce && batch) {
            fetchStudent();
        }
    }, [batch, debounce, studentId, discount, payment])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (discount > previousDue) {
            setError({
                discount: {
                    msg: "The discount cannot exceed the course fee.",
                },
            });
        } else if (payment > total) {
            setError({
                payment: {
                    msg: "Payment cannot exceed the total.",
                },
            });
        } else {
            const data = {
                batch,
                student: studentId,
                discount,
                payment,
                nextPay: parseDate(nextPay) || "",
                method,
                transactionId
            };

            try {
                const response = await addPayment(data)
                window.scrollTo({ top: 0, behavior: 'smooth' });

                if (response?.success) {
                    const { admission } = response;
                    router.push(`/invoice/${admission._id}`)
                }

                if (response?.errors) {
                    setError({ ...response?.errors });
                }
            } catch (e) {
                setError({ message: e.message });
            }
        }
    }

    return (
        <Box
            p={8}
            mx="auto"
            bg="bg"
            rounded="2xl"
            shadow="sm"
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            gap="6"
        >
            <Box flexBasis="50%">
                <Flex direction="column" gap={5}>
                    <Text textStyle="2xl" fontWeight="semibold">Payment</Text>
                    {error?.message &&
                        <Alert.Root status="error">
                            <Alert.Indicator />
                            <Alert.Title>{error?.message}</Alert.Title>
                        </Alert.Root>
                    }
                    <form onSubmit={handleSubmit}>
                        <Flex
                            direction="column"
                            gap={6}
                        >
                            <Field.Root invalid={error?.batch}>
                                <Input
                                    name='batch'
                                    value={batch}
                                    onChange={(e) => setBatch(e.target.value)}
                                    placeholder="Batch No"
                                />
                                <Field.ErrorText>{error?.batch?.msg}</Field.ErrorText>
                            </Field.Root>
                            <Field.Root invalid={error?.student}>
                                <Input
                                    name='studentId'
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    placeholder="Student Id"
                                />
                                <Field.ErrorText>{error?.student?.msg}</Field.ErrorText>
                            </Field.Root>
                            <Field.Root invalid={error?.discount}>
                                <Input
                                    name='discount'
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    placeholder="Discount"
                                />
                                <Field.ErrorText>{error?.discount?.msg}</Field.ErrorText>
                            </Field.Root>
                            <Field.Root invalid={error?.payment}>
                                <Input
                                    name='payment'
                                    value={payment}
                                    onChange={(e) => setPayment(e.target.value)}
                                    placeholder="Payment"
                                />
                                <Field.ErrorText>{error?.payment?.msg}</Field.ErrorText>
                            </Field.Root>
                            <Field.Root invalid={error?.nextPay}>
                                <CalendarInput
                                    name='nextPay'
                                    value={nextPay}
                                    onChange={(e) => setNextPay(e.target.value)}
                                    placeholder="Next Payment Date"
                                />
                                <Field.ErrorText>{error?.nextPay?.msg}</Field.ErrorText>
                            </Field.Root>
                            <Box mx="auto">
                                <Button
                                    type='submit'
                                    colorPalette="gray"
                                    loading={pending}
                                >
                                    Add New Payment
                                </Button>
                            </Box>
                        </Flex>
                    </form>
                </Flex>
            </Box>
            <Box flexBasis="50%">
                <Flex my={5} gap={3} direction="column" align="center">
                    <Avatar.Root size="2xl">
                        <Avatar.Fallback name={student?.fullName} />
                        <Avatar.Image src={student?.avatar && `${process.env.NEXT_PUBLIC_API_URL}/upload/${student.avatar}`} />
                    </Avatar.Root>
                </Flex>
                <Table.Root size="sm">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader w="50%">
                            </Table.ColumnHeader>
                            <Table.ColumnHeader w="50%">
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell textAlign="end">
                                <Text fontWeight="semibold" textStyle="xl">
                                    Student ID
                                </Text>
                            </Table.Cell>
                            <Table.Cell>
                                <Text fontWeight="semibold" textStyle="xl">
                                    {studentId}
                                </Text>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign="end">
                                <Text>Batch Number</Text>
                            </Table.Cell>
                            <Table.Cell>
                                <Text fontWeight="semibold" textStyle="xl">
                                    {batch}
                                </Text>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign="end">
                                <Text>Student Status</Text>
                            </Table.Cell>
                            <Table.Cell>
                                {student?.status &&
                                    <Text><Status status={student?.status} /></Text>
                                }
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign="end">
                                <Text>Student Name</Text>
                            </Table.Cell>
                            <Table.Cell>
                                <Text>{student?.fullName}</Text>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign="end">
                                <Text>Student Mobile</Text>
                            </Table.Cell>
                            <Table.Cell>
                                <Text>{student?.phone}</Text>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign="end">
                                <Text>Course Name</Text>
                            </Table.Cell>
                            <Table.Cell>
                                <Text>{course?.name}</Text>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign="end">
                                <Text>Previous Due</Text>
                            </Table.Cell>
                            <Table.Cell>
                                <Text>{previousDue}</Text>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign="end">
                                <Text>Discount</Text>
                            </Table.Cell>
                            <Table.Cell>
                                <Text>{discount}</Text>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign="end">
                                <Text>Total</Text>
                            </Table.Cell>
                            <Table.Cell>
                                <Text>{total}</Text>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign="end">
                                <Text>Payment</Text>
                            </Table.Cell>
                            <Table.Cell>
                                <Text>{payment}</Text>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign="end">
                                <Text>Due</Text>
                            </Table.Cell>
                            <Table.Cell>
                                <Text>{due}</Text>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table.Root>
            </Box>
        </Box>
    )
}

export default PaymentPage
