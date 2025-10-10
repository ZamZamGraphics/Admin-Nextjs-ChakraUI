"use client"

import { Alert, Box, Button, createListCollection, Field, Flex, Input, Portal, Select } from "@chakra-ui/react"
import CalendarInput from "@/components/admin/calendar-input";
import { addBatch } from "@/app/actions/batches";
import { parseDate } from "@/lib/utils";
import { useFormStatus } from "react-dom"
import { useEffect, useState } from "react"

function NewBatch() {
    const { pending } = useFormStatus();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [courseType, setCourseType] = useState("");
    const [courseList, setCourseList] = useState(createListCollection({
        items: []
    }));
    const [courseId, setCourseId] = useState("");
    const [batchNo, setBatchNo] = useState("");
    const [student, setStudent] = useState("");
    const [startDate, setStartDate] = useState("");
    const [classDays, setClassDays] = useState("");
    const [classTime, setClassTime] = useState("");

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
                    setCourseId(""); // reset courseId
                }
            } catch (e) {
                setError({ message: e.message });
            }
        }

        fetchCourses();
    }, [courseType]);

    const reset = () => {
        setCourseType([])
        setCourseList(
            createListCollection({ items: [] })
        );
        setCourseId("")
        setBatchNo("")
        setStudent("")
        setStartDate("")
        setClassDays([])
        setClassTime([])
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const formData = {
            batchNo,
            course: courseId,
            student,
            startDate: parseDate(startDate) || "",
            classDays,
            classTime,
        }

        try {
            const response = await addBatch(formData)
            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (response?.success) {
                setSuccess({ message: response?.message })
                reset()
            }

            if (response?.errors) {
                setError({ ...response?.errors });
            }
        } catch (e) {
            setError({ message: e.message });
        }
    }

    return (
        <Flex direction="column" gap={5}>
            {error?.message &&
                <Alert.Root status="error">
                    <Alert.Indicator />
                    <Alert.Title>{error?.message}</Alert.Title>
                </Alert.Root>
            }
            {success?.message &&
                <Alert.Root status="success">
                    <Alert.Indicator />
                    <Alert.Title>{success?.message}</Alert.Title>
                </Alert.Root>
            }
            <form onSubmit={handleSubmit}>
                <Flex
                    direction="column"
                    gap={4}
                    bg="bg"
                    p={5}
                    rounded="2xl"
                    shadow="sm"
                >
                    <Field.Root invalid={error?.batchNo}>
                        <Input
                            name='batchNo'
                            value={batchNo}
                            onChange={(e) => setBatchNo(e.target.value)}
                            placeholder="Batch No"
                        />
                        <Field.ErrorText>{error?.batchNo?.msg}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root>
                        <Select.Root
                            collection={types}
                            size="md"
                            width="full"
                            value={[courseType]}
                            onValueChange={(e) =>
                                setCourseType(e.value[0])
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
                            value={[courseId]}
                            onValueChange={(e) => {
                                setCourseId(e.value[0])
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
                    <Field.Root invalid={error?.student}>
                        <Input
                            name='student'
                            value={student}
                            onChange={(e) => setStudent(e.target.value)}
                            placeholder="Student ID"
                        />
                        <Field.ErrorText>{error?.student?.msg}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={error?.startDate}>
                        <CalendarInput
                            name='startDate'
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder="Approximate Start Date"
                        />
                        <Field.ErrorText>{error?.startDate?.msg}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={error?.classDays}>
                        <Select.Root
                            collection={days}
                            size="md"
                            width="full"
                            value={[classDays]}
                            onValueChange={(e) =>
                                setClassDays(e.value[0])
                            }
                        >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText placeholder="Select Class Days" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content>
                                        {days.items.map((time) => (
                                            <Select.Item item={time} key={time.value}>
                                                {time.label}
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                        <Field.ErrorText>{error?.classDays?.msg}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={error?.classTime}>
                        <Select.Root
                            collection={times}
                            size="md"
                            width="full"
                            value={[classTime]}
                            onValueChange={(e) =>
                                setClassTime(e.value[0])
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
                        <Field.ErrorText>{error?.classTime?.msg}</Field.ErrorText>
                    </Field.Root>
                    <Box mx="auto">
                        <Button
                            type='submit'
                            colorPalette="gray"
                            loading={pending}
                        >
                            Add New Batch
                        </Button>
                    </Box>
                </Flex>
            </form>
        </Flex>
    )
}

export default NewBatch

const types = createListCollection({
    items: [
        { value: "Regular", label: "Regular" },
        { value: "Private", label: "Private" },
        { value: "Diploma in Computer", label: "Diploma in Computer" }
    ]
})

const days = createListCollection({
    items: [
        { value: "-1", label: "Select Days" },
        {
            value: "Sat, Mon, Wed",
            label: "Sat, Mon, Wed",
        },
        {
            value: "Sun, Tues, Thurs",
            label: "Sun, Tues, Thurs",
        },
        {
            value: "Every day",
            label: "Every day",
        },
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