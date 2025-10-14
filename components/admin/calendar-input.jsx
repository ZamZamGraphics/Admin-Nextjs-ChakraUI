"use client"

import React, { useEffect, useState } from "react";
import { Box, Input, InputGroup } from "@chakra-ui/react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { LuCalendar } from "react-icons/lu";

const formatDate = (d) => {
    if (!d) return "";
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

const isValidDate = (date) => date instanceof Date && !isNaN(date.getTime());

export default function CalendarInput({ name, value, onChange, placeholder, ...props }) {
    const [open, setOpen] = useState(false);
    const [month, setMonth] = useState(value ? new Date(value.split("-").reverse().join("-")) : new Date())

    useEffect(() => {
        if (value) {
            const parts = value.split("-")
            if (parts.length === 3) {
                const [day, month, year] = parts.map(Number)
                const parsed = new Date(year, month - 1, day)
                if (isValidDate(parsed)) {
                    setMonth(parsed)
                }
            }
        }
    }, [value])

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <InputGroup endElement={<LuCalendar />}>
                        <Input
                            {...props}
                            name={name}
                            value={value}
                            placeholder={placeholder || "DD-MM-YYYY"}
                            onChange={e => {
                                onChange(e)
                            }}
                            onKeyDown={e => {
                                if (e.key === "ArrowDown") {
                                    e.preventDefault()
                                    setOpen(true)
                                }
                            }}
                        />
                    </InputGroup>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto overflow-hidden p-5"
                    align="start"
                    alignOffset={-8}
                    sideOffset={10}
                >
                    <Box p={3}>
                        <Calendar
                            mode="single"
                            selected={value ? new Date(value.split("-").reverse().join("-")) : null}
                            captionLayout="dropdown"
                            formatters={{
                                formatMonthDropdown: (date) =>
                                    date.toLocaleString("default", { month: "long" }),
                            }}
                            month={month}
                            onMonthChange={setMonth}
                            onSelect={d => {
                                const formatted = formatDate(d)
                                onChange({ target: { name, value: formatted } })
                                setOpen(false)
                            }}
                        />
                    </Box>
                </PopoverContent>
            </Popover>
        </>
    );
}

