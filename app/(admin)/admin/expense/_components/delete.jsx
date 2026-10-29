"use client"

import {
    Dialog,
    Button,
    CloseButton,
    Portal,
    Text,
} from "@chakra-ui/react"
import { useState } from "react"
import { deleteExpense } from "@/app/actions/expenses";

export default function DeleteDialog({ id, onDeleted }) {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)
        
    const handleDelete = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await deleteExpense(id);
            if (res && res.success === false) {
                setError(res.message || "Delete failed");
                return;
            }
            await onDeleted?.(id);
        } catch (e) {
            setError(e.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>Delete Expense</Dialog.Title>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" disabled={loading} />
                        </Dialog.CloseTrigger>
                    </Dialog.Header>
                    <Dialog.Body>
                        {error && <Text colorPalette="red">{error}</Text>}
                        Are you sure you want to delete this expense?
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                            <Button variant="outline" disabled={loading}>Cancel</Button>
                        </Dialog.ActionTrigger>
                        <Button colorPalette="red" onClick={handleDelete} loading={loading}>
                            Delete
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Portal>
    )
}
