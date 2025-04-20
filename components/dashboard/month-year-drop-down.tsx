"use client"

import { useState } from "react"
import dayjs from "dayjs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

export function MonthYearDropDown({ onDateChange }: { onDateChange?: (date: dayjs.Dayjs) => void }) {
    const [date, setDate] = useState<Date>(new Date())

    // Handle date selection
    const handleSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate)
            if (onDateChange) {
                onDateChange(dayjs(selectedDate))
            }
        }
    }

    return (
        <div className="flex items-center justify-center p-4">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-[200px] justify-start text-left font-normal">
                        {date ? format(date, "MMMM yyyy") : <span>Pick a month and year</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="single"
                        defaultMonth={date}
                        selected={date}
                        onSelect={handleSelect}
                        className="rounded-md border shadow-md"
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
