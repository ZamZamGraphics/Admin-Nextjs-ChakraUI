"use client"

import {
    Dialog,
    Button,
    CloseButton,
    Portal,
} from "@chakra-ui/react"

export default function DeleteDialog({ id }) {
    const handleDelete = () => {
        console.log("Deleting student with id:", id)
        // fetch("/api/students/" + id, { method: "DELETE" })
    }

    return (
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>Delete Expense</Dialog.Title>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Header>
                    <Dialog.Body>
                        Are you sure you want to delete this student?
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
