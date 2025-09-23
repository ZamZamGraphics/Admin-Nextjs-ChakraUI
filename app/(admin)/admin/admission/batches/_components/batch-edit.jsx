"use client"

import { Alert, Box, Button, createListCollection, Field, Flex, Input, Portal, Select } from "@chakra-ui/react"
import CalendarInput from "@/components/admin/calendar-input";
import { getBatch, updateBatch } from "@/app/actions/batches";
import { parseDate } from "@/lib/utils";
import { useFormStatus } from "react-dom"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";

function BatchEdit() {
  const searchParams = useSearchParams();
  const id = searchParams.get("edit");
  const { pending } = useFormStatus();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [courseName, setCourseName] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [student, setStudent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [classDays, setClassDays] = useState("");
  const [classTime, setClassTime] = useState("");

  useEffect(() => {
    async function fetchBatch() {
      try {
        const response = await getBatch(id);
        if (response) {
          setBatchNo(response?.batchNo)
          setStudent(response?.student)
          setCourseName(`${response?.course?.name} (${response?.course?.courseType})`)
          setStartDate(dayjs(response?.startDate).format("DD-MM-YYYY"))
          setClassDays(response?.classDays)
          setClassTime(response?.classTime)
        }
      } catch (e) {
        setError({ message: e.message });
      }

    }
    fetchBatch()
    setError("");
    setSuccess("");
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = {
      student,
      startDate: parseDate(startDate) || "",
      classDays,
      classTime,
    }

    try {
      const response = await updateBatch(id, formData)
      if (response?.success) {
        setSuccess({ message: response?.message })
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
          <Field.Root>
            <Input defaultValue={batchNo} disabled />
          </Field.Root>
          <Field.Root>
            <Input defaultValue={courseName} disabled />
          </Field.Root>
          <Field.Root>
            <Input defaultValue={student} disabled />
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
              Update Batch
            </Button>
          </Box>
        </Flex>
      </form>
    </Flex>
  )
}

export default BatchEdit

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