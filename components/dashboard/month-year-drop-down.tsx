"use client"

import { useState } from "react"
import dayjs from "dayjs"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function MonthYearDropDown({ onDateChange }: { onDateChange?: (date: dayjs.Dayjs) => void }) {
    const [selectedDate, setSelectedDate] = useState(dayjs())

    const generateMonthOptions = () => {
        const options = []

        for (let i = 0; i <= 5; i++) {
            const date = dayjs().subtract(i, "month")
            options.push(date)
        }
        return options
    }

    // Handle date selection
    const handleDateSelect = (date: dayjs.Dayjs) => {
        setSelectedDate(date)
        if (onDateChange) {
            onDateChange(date)
        }
    }

    return (
        <div className="space-y-2">
            <div className="text-md text-lg font-medium tracking-widest text-gray-500">SCORECARD PERFORMANCE</div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-[200px] justify-between">
                        <div className="flex items-center">
                            <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                            {selectedDate.format("MMMM YYYY")}
                        </div>
                        <ChevronDown className="ml-2 w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                    {generateMonthOptions().map((date) => (
                        <DropdownMenuItem key={date.valueOf()} onSelect={() => handleDateSelect(date)}>
                            {date.format("MMMM YYYY")}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
