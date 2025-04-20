"use client"

import { useState } from "react"
import dayjs from "dayjs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function MonthYearDropDown() {
    const [date, setDate] = useState<dayjs.Dayjs>(dayjs())

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
                        mode="month"
                        defaultMonth={date}
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border shadow-md"
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
