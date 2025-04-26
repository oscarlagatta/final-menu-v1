"use client"

import { useState, useEffect } from "react"
import dayjs from "dayjs"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export function MonthYearDropDown({ onDateChange }: { onDateChange?: (date: dayjs.Dayjs | null) => void }) {
  // Add null as a possible value to represent "All Months"
  // Initialize with null to show "All Months" by default, but trigger the onDateChange with the previous month
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)

  // Call onDateChange with the previous month on initial render
  useEffect(() => {
    if (onDateChange) {
      // Get the previous month
      const previousMonth = dayjs().subtract(1, "month")
      // Only trigger the callback, don't update the UI state
      onDateChange(null)
    }
  }, [onDateChange])

  // Update the generateMonthOptions function to start from the previous month
  const generateMonthOptions = () => {
    const options = []

    // Start from the previous month (subtract 1 from current month)
    // Then generate a total of 6 months going backward
    for (let i = 0; i < 6; i++) {
      const date = dayjs().subtract(i + 1, "month")
      options.push(date)
    }
    return options
  }

  // Handle date selection
  const handleDateSelect = (date: dayjs.Dayjs | null) => {
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
              <div className={`mr-2 h-2 w-2 rounded-full ${selectedDate ? "bg-green-500" : "bg-blue-500"}`} />
              {selectedDate ? selectedDate.format("MMMM YYYY") : "All Months"}
            </div>
            <ChevronDown className="ml-2 w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          {/* Always include "All Months" option */}
          <DropdownMenuItem key="all-months" onSelect={() => handleDateSelect(null)}>
            <div className="flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
              All Months
            </div>
          </DropdownMenuItem>

          {/* Add a separator between "All Months" and specific months */}
          <DropdownMenuSeparator />

          {generateMonthOptions().map((date) => (
            <DropdownMenuItem key={date.valueOf()} onSelect={() => handleDateSelect(date)}>
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                {date.format("MMMM YYYY")}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
