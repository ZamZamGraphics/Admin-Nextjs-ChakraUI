"use client"

import { IconButton } from "@chakra-ui/react"
import { LuPrinter } from "react-icons/lu"

function PrintButton() {

    const handlePrint = () => {
        window.print();
    };

    return (
        <IconButton variant="ghost" onClick={handlePrint}>
            <LuPrinter />
        </IconButton>
    )
}

export default PrintButton
