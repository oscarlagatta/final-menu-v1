"use client"

import { useState } from "react"
import dayjs from "dayjs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function MonthYearDropDown({ onDateChange }: { onDateChange?: (date: dayjs.Dayjs) => void }) {
    const [date, setDate] = useState<dayjs.Dayjs>(dayjs())

    // Handle date selection with proper type conversion
    const handleSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            const newDate = dayjs(selectedDate)
            setDate(newDate)
            if (onDateChange) {
                onDateChange(newDate)
            }
        }
    }

    return (
        <div className="flex items-center justify-center p-4">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-[200px] justify-start text-left font-normal">
                        {date ? date.format("MMMM YYYY") : <span>Pick a month and year</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="single"
                        defaultMonth={date.toDate()}
                        selected={date.toDate()}
                        onSelect={handleSelect}
                        className="rounded-md border shadow-md"
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
