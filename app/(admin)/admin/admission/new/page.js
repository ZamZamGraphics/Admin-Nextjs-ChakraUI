"use client"

import CalendarInput from "@/components/admin/calendar-input";
import useDebounce from "@/hooks/useDebounce";
import { Alert, Avatar, Box, Field, Input, Flex, Text, Select, Portal, Button, createListCollection, Table } from "@chakra-ui/react";
import Status from "@/components/admin/status";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { addAdmission } from "@/app/actions/admissions";
import { parseDate } from "@/lib/utils";

function NewAdmissionPage() {
    const searchParams = useSearchParams()
    const initialID = searchParams.get('studentId') || ""

    const { pending } = useFormStatus();
    const [error, setError] = useState("");
    const [studentId, setStudentId] = useState(initialID);
    const [courseType, setCourseType] = useState("");
    const [courseList, setCourseList] = useState(createListCollection({
        items: []
    }));
    const [courseName, setCourseName] = useState("");
    const [discount, setDiscount] = useState("");
    const [payment, setPayment] = useState("");
    const [nextPay, setNextPay] = useState("");
    const [batch, setBatch] = useState("");
    const [timeSchedule, setTimeSchedule] = useState("");
    const [student, setStudent] = useState("");
    const [course, setCourse] = useState("");
    const [total, setTotal] = useState("");
    const [due, setDue] = useState("");
    const [method, setMethod] = useState("Cash");
    const [transactionId, setTransactionId] = useState(null);

    const debounce = useDebounce(studentId, 500)
    const pathname = usePathname()
    const { replace } = useRouter()

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (debounce) {
            async function fetchStudent() {
                try {
                    const res = await fetch(`/api/students/verify/${studentId}`, {
                        credentials: "include",
                    })
                    const response = await res.json()
                    if (response) {
                        setStudent({
                            avatar: response.avatar,
                            fullName: response.fullName,
                            status: response.status,
                            phone: response.phone[0]
                        });
                    }

                } catch (e) {
                    setError({ message: e.message });
                }
            }

            fetchStudent();
            params.set("studentId", debounce);
        } else {
            setStudent("");
            params.delete("studentId");
        }
        replace(`${pathname}?${params.toString()}`);
    }, [searchParams, debounce, pathname, replace, studentId])

    useEffect(() => {
        if (!courseType) return;

        async function fetchCourses() {
            try {
                const res = await fetch(`/api/courses?search=${courseType}`, {
                    credentials: "include",
                })
                const response = await res.json()

                if (response?.courses) {
                    const cList = response.courses.map((c) => {
                        return {
                            value: String(c._id),
                            label: c.name
                        }
                    })
                    setCourseList(
                        createListCollection({ items: cList })
                    );
                    setCourseName(""); // reset courseName
                    setCourse(""); // reset course
                }
            } catch (e) {
                setError({ message: e.message });
            }
        }

        fetchCourses();
    }, [courseType]);

    useEffect(() => {
        if (!courseName) return;

        async function fetchCourse() {
            try {
                const res = await fetch(`/api/courses/${courseName}`, {
                    credentials: "include",
                })
                const response = await res.json()
                setCourse(response);
            } catch (e) {
                setError({ message: e.message });
            }
        }

        fetchCourse();
    }, [courseName]);

    useEffect(() => {
        if (course) {
            const total = course.courseFee - discount;
            setTotal(total);
            setDue(total - payment);
        } else {
            setTotal("");
            setDue("");
        }
    }, [course, discount, payment]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (discount > course?.courseFee) {
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
                student: studentId,
                course: courseName,
                discount,
                payment,
                nextPay: parseDate(nextPay) || "",
                batch,
                timeSchedule,
                method,
                transactionId
            };

            try {
                const response = await addAdmission(data)

                if (response?.success) {
                    const { admission } = response;
                    replace(`/invoice/${admission._id}`)
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
                    <Text textStyle="2xl" fontWeight="semibold">New Admission</Text>
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
                            <Field.Root invalid={error?.studentId}>
                                <Input
                                    name='studentId'
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    placeholder="Student Id"
                                />
                                <Field.ErrorText>{error?.studentId?.msg}</Field.ErrorText>
                            </Field.Root>
                            <Field.Root>
                                <Select.Root
                                    collection={types}
                                    size="md"
                                    width="full"
                                    value={courseType}
                                    onValueChange={(e) =>
                                        setCourseType(e.value)
                                    }
                                >
                                    <Select.HiddenSelect />
                                    <Select.Control>
                                        <Select.Trigger>
                                            <Select.ValueText placeholder="Select Course Type" />
                                        </Select.Trigger>
                                        <Select.IndicatorGroup>
                                            <Select.Indicator />
                                        </Select.IndicatorGroup>
                                    </Select.Control>
                                    <Portal>
                                        <Select.Positioner>
                                            <Select.Content>
                                                {types.items.map((type) => (
                                                    <Select.Item item={type} key={type.value}>
                                                        {type.label}
                                                        <Select.ItemIndicator />
                                                    </Select.Item>
                                                ))}
                                            </Select.Content>
                                        </Select.Positioner>
                                    </Portal>
                                </Select.Root>
                            </Field.Root>
                            <Field.Root invalid={error?.course}>
                                <Select.Root
                                    collection={courseList}
                                    size="md"
                                    width="full"
                                    onValueChange={(e) => {
                                        setCourseName(e.value[0])
                                    }}
                                    disabled={!courseType}
                                >
                                    <Select.HiddenSelect />
                                    <Select.Control>
                                        <Select.Trigger>
                                            <Select.ValueText placeholder="Select Course Name" />
                                        </Select.Trigger>
                                        <Select.IndicatorGroup>
                                            <Select.Indicator />
                                        </Select.IndicatorGroup>
                                    </Select.Control>
                                    <Portal>
                                        <Select.Positioner>
                                            <Select.Content>
                                                {courseList.items.map((course) => (
                                                    <Select.Item
                                                        item={course}
                                                        key={course.value}
                                                    >
                                                        {course.label}
                                                        <Select.ItemIndicator />
                                                    </Select.Item>
                                                ))}
                                            </Select.Content>
                                        </Select.Positioner>
                                    </Portal>
                                </Select.Root>
                                <Field.ErrorText>{error?.course?.msg}</Field.ErrorText>
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
                            <Field.Root invalid={error?.batch}>
                                <Input
                                    name='batch'
                                    value={batch}
                                    onChange={(e) => setBatch(e.target.value)}
                                    placeholder="Batch No"
                                />
                                <Field.ErrorText>{error?.batch?.msg}</Field.ErrorText>
                            </Field.Root>
                            <Field.Root>
                                <Select.Root
                                    collection={times}
                                    size="md"
                                    width="full"
                                    onValueChange={(e) =>
                                        setTimeSchedule(e.value[0])
                                    }
                                >
                                    <Select.HiddenSelect />
                                    <Select.Control>
                                        <Select.Trigger>
                                            <Select.ValueText placeholder="Select Time" />
                                        </Select.Trigger>
                                        <Select.IndicatorGroup>
                                            <Select.Indicator />
                                        </Select.IndicatorGroup>
                                    </Select.Control>
                                    <Portal>
                                        <Select.Positioner>
                                            <Select.Content>
                                                {times.items.map((time) => (
                                                    <Select.Item item={time} key={time.value}>
                                                        {time.label}
                                                        <Select.ItemIndicator />
                                                    </Select.Item>
                                                ))}
                                            </Select.Content>
                                        </Select.Positioner>
                                    </Portal>
                                </Select.Root>
                            </Field.Root>
                            <Box mx="auto">
                                <Button
                                    type='submit'
                                    colorPalette="gray"
                                    loading={pending}
                                >
                                    Add New Admission
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
                                <Text>Course Fee</Text>
                            </Table.Cell>
                            <Table.Cell>
                                <Text>{course?.courseFee}</Text>
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

export default NewAdmissionPage

const types = createListCollection({
    items: [
        { value: "Regular", label: "Regular" },
        { value: "Private", label: "Private" },
        { value: "Diploma in Computer", label: "Diploma in Computer" }
    ]
})

const times = createListCollection({
    items: [
        { value: "10:00 AM", label: "10:00 AM" },
        { value: "10:30 AM", label: "10:30 AM" },
        { value: "11:00 AM", label: "11:00 AM" },
        { value: "11:30 AM", label: "11:30 AM" },
        { value: "12:00 PM", label: "12:00 PM" },
        { value: "12:30 PM", label: "12:30 PM" },
        { value: "1:00 PM", label: "1:00 PM" },
        { value: "1:30 PM", label: "1:30 PM" },
        { value: "2:00 PM", label: "2:00 PM" },
        { value: "2:30 PM", label: "2:30 PM" },
        { value: "3:00 PM", label: "3:00 PM" },
        { value: "3:30 PM", label: "3:30 PM" },
        { value: "4:00 PM", label: "4:00 PM" },
        { value: "4:30 PM", label: "4:30 PM" },
        { value: "5:00 PM", label: "5:00 PM" },
        { value: "5:30 PM", label: "5:30 PM" },
        { value: "6:00 PM", label: "6:00 PM" },
        { value: "6:30 PM", label: "6:30 PM" },
        { value: "7:00 PM", label: "7:00 PM" },
        { value: "7:30 PM", label: "7:30 PM" },
        { value: "8:00 PM", label: "8:00 PM" },
        { value: "8:30 PM", label: "8:30 PM" },
        { value: "9:00 PM", label: "9:00 PM" },
        { value: "9:30 PM", label: "9:30 PM" },
        { value: "10:00 PM", label: "10:00 PM" }
    ]
})