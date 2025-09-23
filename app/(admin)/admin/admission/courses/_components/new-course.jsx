"use client"

import { addCourse } from "@/app/actions/courses";
import { Alert, Box, Button, createListCollection, Field, Flex, Input, Portal, Select, Textarea } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useFormStatus } from "react-dom"

function NewCourse() {
  const { pending } = useFormStatus();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [courseType, setCourseType] = useState("");
  const [course, setCourse] = useState({
    name: "",
    slug: "",
    description: "",
    duration: "",
    courseFee: "",
  });

  const reset = () => {
    setCourse({
      name: "",
      slug: "",
      description: "",
      duration: "",
      courseFee: "",
    })
    setCourseType([])
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setCourse((prev) => ({
        ...prev,
        "name": value,
        "slug": value.split(" ").join("-").toLowerCase(),
      }));
    } else if (name === "slug") {
      setCourse((prev) => ({
        ...prev,
        "slug": value.split(" ").join("-").toLowerCase(),
      }));
    } else {
      setCourse((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    if (!courseType) return;
    setCourse((prev) => ({
      ...prev,
      "courseType": courseType[0],
    }));
  }, [courseType])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await addCourse(course)

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
          <Field.Root invalid={error?.name}>
            <Input
              name='name'
              value={course.name}
              onChange={handleChange}
              placeholder="Course Name"
            />
            <Field.ErrorText>{error?.name?.msg}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={error?.slug}>
            <Input
              name='slug'
              value={course.slug}
              onChange={handleChange}
              placeholder="Course Slug"
            />
            <Field.ErrorText>{error?.slug?.msg}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={error?.courseType}>
            <Select.Root
              collection={types}
              size="md"
              width="full"
              value={courseType}
              onValueChange={(e) => setCourseType(e.value)}
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
            <Field.ErrorText>{error?.courseType?.msg}</Field.ErrorText>
          </Field.Root>
          <Field.Root>
            <Textarea
              rows={5}
              name='description'
              value={course.description}
              onChange={handleChange}
              placeholder="Description"
            />
          </Field.Root>
          <Field.Root invalid={error?.duration}>
            <Input
              name='duration'
              value={course.duration}
              onChange={handleChange}
              placeholder="Duration"
            />
            <Field.ErrorText>{error?.duration?.msg}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={error?.courseFee}>
            <Input
              name='courseFee'
              value={course.courseFee}
              onChange={handleChange}
              placeholder="Course Fee"
            />
            <Field.ErrorText>{error?.courseFee?.msg}</Field.ErrorText>
          </Field.Root>
          <Box mx="auto">
            <Button
              type='submit'
              colorPalette="gray"
              loading={pending}
            >
              Add New Course
            </Button>
          </Box>
        </Flex>
      </form>
    </Flex>
  )
}

export default NewCourse

const types = createListCollection({
  items: [
    { value: "Regular", label: "Regular" },
    { value: "Private", label: "Private" },
    { value: "Diploma in Computer", label: "Diploma in Computer" }
  ]
})