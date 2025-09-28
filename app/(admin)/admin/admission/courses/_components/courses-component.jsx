import { Alert, Table } from "@chakra-ui/react";
import { serverFetch } from "@/utils";
import Action from "./action";

async function CoursesComponent({ queryString }) {
    let data, error;

    try {
        const response = await serverFetch('courses', queryString)
        data = response?.courses || {};
    } catch (err) {
        error = err;
    }

    if (error) {
        return (
            <Table.Row>
                <Table.Cell colSpan={5}>
                    <Alert.Root status="error">
                        <Alert.Indicator />
                        <Alert.Title>{error.message}</Alert.Title>
                    </Alert.Root>
                </Table.Cell>
            </Table.Row>
        )
    }

    return (
        <>
            {data?.length > 0 ? data.map((course) => (
                <Table.Row key={course._id}>
                    <Table.Cell>{course?.name}</Table.Cell>
                    <Table.Cell>{course?.courseType}</Table.Cell>
                    <Table.Cell>{course?.duration}</Table.Cell>
                    <Table.Cell>{course?.courseFee}</Table.Cell>
                    <Table.Cell textAlign="center">
                        <Action id={course?._id} />
                    </Table.Cell>
                </Table.Row>
            )) : (
                <Table.Row>
                    <Table.Cell colSpan={5}>
                        <Alert.Root status="warning">
                            <Alert.Indicator />
                            <Alert.Title>Course Not Found</Alert.Title>
                        </Alert.Root>
                    </Table.Cell>
                </Table.Row>
            )}
        </>
    )
}

export default CoursesComponent
