"use client"

import { deleteEmployee } from "@/app/actions/employee";
import {
    Dialog,
    Button,
    CloseButton,
    Portal,
    Text,
} from "@chakra-ui/react"
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function DeleteDialog({ id }) {
    const [error, setError] = useState("");

    const router = useRouter();

    const handleDelete = async () => {
        try {
            await deleteEmployee(id);
            router.push(`/admin/employee?deleted=${id}`)
        } catch (e) {
            setError({ message: e.message });
        }
    }

    return (
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>Delete Employee</Dialog.Title>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Header>
                    <Dialog.Body>
                        {error?.message && <Text colorPalette="red">{error?.message}</Text>}
                        Are you sure you want to delete this employee?
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                        </Dialog.ActionTrigger>
                        <Button colorPalette="red" onClick={handleDelete}>
                            Delete
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Portal>
    )
}
