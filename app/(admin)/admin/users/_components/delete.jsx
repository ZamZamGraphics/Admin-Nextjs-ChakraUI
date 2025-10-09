"use client"

import { deleteUser } from "@/app/actions/users"
import { Dialog, Button, CloseButton, Portal } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeleteDialog({ id }) {
    const [error, setError] = useState("")
    const router = useRouter()

    const handleDelete = async () => {
        console.log("Delete User ID : ", id)
        // try {
        //     await deleteUser(id);
        //     router.push(`/admin/users?deleted=${id}`)
        // } catch (e) {
        //     setError({ message: e.message });
        // }
    }

    return (
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>Delete User</Dialog.Title>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Header>
                    <Dialog.Body>
                        {error?.message && <Text colorPalette="red">{error?.message}</Text>}
                        Are you sure you want to delete this user?
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
