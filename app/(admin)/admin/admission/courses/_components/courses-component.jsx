import { Alert, Table } from "@chakra-ui/react";
import Action from "./action";

function CoursesComponent({ data }) {
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
