"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom";
import { Alert, Box, Button, createListCollection, Field, Grid, GridItem, Input, Portal, Select, Text, Textarea } from "@chakra-ui/react"
import CalendarInput from "@/components/admin/calendar-input";
import { addExpense } from "@/app/actions/expenses";
import { parseDate } from "@/lib/utils";

function NewExpensePage() {
    const { pending } = useFormStatus();
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const [spender, setSpender] = useState({
        name: "",
        description: "",
        type: "",
        amount: "",
        date: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSpender((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("")
        setSuccess("")

        try {
            const data = {
                ...spender,
                "date": parseDate(spender.date),
            }
            const response = await addExpense(data);

            if (response?.success) {
                setSpender({
                    name: "",
                    description: "",
                    type: [],
                    amount: "",
                    date: "",
                })
                setSuccess({ message: response?.message });
            }

            if (response?.errors) {
                setError({ ...response?.errors });
            }
        } catch (e) {
            setError({ message: e.message });
        }
    }

    return (
        <Box
            p={8}
            mx="auto"
            bg="bg"
            textAlign="center"
            maxW="800px"
            rounded="2xl"
            shadow="sm"
        >
            <Text mb={5} textStyle="2xl" fontWeight="semibold">New Expense</Text>
            {success?.message &&
                <Alert.Root status="success">
                    <Alert.Indicator />
                    <Alert.Title>{success?.message}</Alert.Title>
                </Alert.Root>
            }
            {error?.message &&
                <Alert.Root status="error">
                    <Alert.Indicator />
                    <Alert.Title>{error?.message}</Alert.Title>
                </Alert.Root>
            }
            <form onSubmit={handleSubmit}>
                <Grid templateColumns="1fr" mt={5} gap="6">
                    <GridItem>
                        <Field.Root invalid={error?.name}>
                            <Input
                                name='name'
                                value={spender.name}
                                onChange={handleChange}
                                placeholder="Spender Name"
                            />
                            <Field.ErrorText>{error?.name?.msg}</Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.description}>
                            <Textarea
                                rows={5}
                                name='description'
                                value={spender.description}
                                onChange={handleChange}
                                placeholder="Description"
                            />
                            <Field.ErrorText>
                                {error?.description?.msg}
                            </Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.type}>
                            <Select.Root
                                collection={expenseType}
                                size="md"
                                width="full"
                                name="type"
                                value={spender.type}
                                onValueChange={(e) =>
                                    setSpender((prev) => ({ ...prev, type: e.value }))
                                }
                            >
                                <Select.HiddenSelect />
                                <Select.Control>
                                    <Select.Trigger>
                                        <Select.ValueText
                                            placeholder="Select Expense Type"
                                        />
                                    </Select.Trigger>
                                    <Select.IndicatorGroup>
                                        <Select.Indicator />
                                    </Select.IndicatorGroup>
                                </Select.Control>
                                <Portal>
                                    <Select.Positioner>
                                        <Select.Content>
                                            {expenseType.items.map((type) => (
                                                <Select.Item item={type} key={type.value}>
                                                    {type.label}
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>
                            <Field.ErrorText>{error?.type?.msg}</Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.date}>
                            <CalendarInput
                                name='date'
                                value={spender.date}
                                onChange={handleChange}
                                placeholder="Expense Date"
                            />
                            <Field.ErrorText>{error?.date?.msg}</Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                    <GridItem>
                        <Field.Root invalid={error?.amount}>
                            <Input
                                name='amount'
                                value={spender.amount}
                                onChange={handleChange}
                                placeholder="Spender amount"
                            />
                            <Field.ErrorText>{error?.amount?.msg}</Field.ErrorText>
                        </Field.Root>
                    </GridItem>
                </Grid>
                <Button
                    mt={8}
                    type='submit'
                    colorPalette="gray"
                    loading={pending}
                >Add New Expense</Button>
            </form>
        </Box>
    )
}

export default NewExpensePage

const expenseType = createListCollection({
    items: [
        { value: "Breakfast", label: "Breakfast" },
        { value: "Office Rent", label: "Office Rent" },
        { value: "Electricity Bill", label: "Electricity Bill" },
        { value: "Salary", label: "Salary" },
        { value: "Personal expenses", label: "Personal expenses" },
        { value: "Donation", label: "Donation" },
        { value: "Others", label: "Others" },
    ]
});
