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
import { useLastPublishedUpcoming } from "@/lib/hooks/use-last-published-upcoming" // Add this import

export function MonthYearDropDown({ onDateChange }: { onDateChange?: (date: dayjs.Dayjs | null) => void }) {
  // Add null as a possible value to represent "All Months"
  // Initialize with null to show "All Months" by default, but trigger the onDateChange with the previous month
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)

  // Get the last published date from the hook
  const {
    lastPulbishedUpcoming: { data = { publishDate: "", upcomingDate: "" }, isLoading },
  } = useLastPublishedUpcoming()

  // Call onDateChange with the previous month on initial render
  useEffect(() => {
    if (onDateChange) {
      // Only trigger the callback, don't update the UI state
      onDateChange(null)
    }
  }, [onDateChange])

  // Update the generateMonthOptions function to use the publishDate from the hook
  const generateMonthOptions = () => {
    const options = []

    // Parse the publishDate from the hook (format: "Mar, 2025")
    let baseDate
    if (data.publishDate) {
      // Parse the date string (e.g., "Mar, 2025")
      const [month, year] = data.publishDate.split(", ")
      const monthIndex = dayjs().month(month).month() // Convert month name to month index
      baseDate = dayjs(`${year}-${monthIndex + 1}-01`) // Create a dayjs object for the 1st of the month
    } else {
      // Fallback to previous month if no publishDate is available
      baseDate = dayjs().subtract(1, "month")
    }

    // Generate 6 months going backward from the base date
    for (let i = 0; i < 6; i++) {
      const date = baseDate.subtract(i, "month")
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

          {/* Show loading state if data is being fetched */}
          {isLoading ? (
            <DropdownMenuItem disabled>Loading months...</DropdownMenuItem>
          ) : (
            generateMonthOptions().map((date) => (
              <DropdownMenuItem key={date.valueOf()} onSelect={() => handleDateSelect(date)}>
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                  {date.format("MMMM YYYY")}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}




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
import { useLastPublishedUpcoming } from "@/lib/hooks/use-last-published-upcoming"

// Define the expected type for the data
interface PublishDateData {
  publishDate: string
  upcomingDate: string
}

export function MonthYearDropDown({ onDateChange }: { onDateChange?: (date: dayjs.Dayjs | null) => void }) {
  // Add null as a possible value to represent "All Months"
  // Initialize with null to show "All Months" by default, but trigger the onDateChange with the previous month
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)

  // Get the last published date from the hook
  const { lastPulbishedUpcoming } = useLastPublishedUpcoming()

  // Safely extract and type the data
  const publishData = lastPulbishedUpcoming.data as PublishDateData | undefined
  const isLoading = lastPulbishedUpcoming.isLoading

  // Call onDateChange with the previous month on initial render
  useEffect(() => {
    if (onDateChange) {
      // Only trigger the callback, don't update the UI state
      onDateChange(null)
    }
  }, [onDateChange])

  // Update the generateMonthOptions function to use the publishDate from the hook
  const generateMonthOptions = () => {
    const options = []

    // Parse the publishDate from the hook (format: "Mar, 2025")
    let baseDate
    if (publishData?.publishDate) {
      try {
        // Parse the date string (e.g., "Mar, 2025")
        const [month, year] = publishData.publishDate.split(", ")
        if (month && year) {
          const monthIndex = dayjs().month(month).month() // Convert month name to month index
          baseDate = dayjs(`${year}-${monthIndex + 1}-01`) // Create a dayjs object for the 1st of the month

          // Validate that we got a valid date
          if (!baseDate.isValid()) {
            console.error("Invalid date parsed from publishDate:", publishData.publishDate)
            baseDate = dayjs().subtract(1, "month") // Fallback
          }
        } else {
          baseDate = dayjs().subtract(1, "month") // Fallback
        }
      } catch (error) {
        console.error("Error parsing publishDate:", error)
        baseDate = dayjs().subtract(1, "month") // Fallback
      }
    } else {
      // Fallback to previous month if no publishDate is available
      baseDate = dayjs().subtract(1, "month")
    }

    // Generate 6 months going backward from the base date
    for (let i = 0; i < 6; i++) {
      const date = baseDate.subtract(i, "month")
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

          {/* Show loading state if data is being fetched */}
          {isLoading ? (
            <DropdownMenuItem disabled>Loading months...</DropdownMenuItem>
          ) : (
            generateMonthOptions().map((date) => (
              <DropdownMenuItem key={date.valueOf()} onSelect={() => handleDateSelect(date)}>
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                  {date.format("MMMM YYYY")}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}


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
import { useLastPublishedUpcoming } from "@/lib/hooks/use-last-published-upcoming"

// Define the expected type for the data
interface PublishDateData {
  publishDate: string
  upcomingDate: string
}

// Define a month mapping for clearer code
const monthMap: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
}

export function MonthYearDropDown({ onDateChange }: { onDateChange?: (date: dayjs.Dayjs | null) => void }) {
  // Add null as a possible value to represent "All Months"
  // Initialize with null to show "All Months" by default
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)

  // Get the last published date from the hook
  const { lastPulbishedUpcoming } = useLastPublishedUpcoming()

  // Safely extract and type the data
  const publishData = lastPulbishedUpcoming.data as PublishDateData | undefined
  const isLoading = lastPulbishedUpcoming.isLoading

  // Call onDateChange with null on initial render to indicate "All Months"
  useEffect(() => {
    if (onDateChange) {
      onDateChange(null)
    }
  }, [onDateChange])

  // Generate month options based on the publishDate
  const generateMonthOptions = () => {
    const options = []

    // Parse the publishDate from the hook (format: "Mar, 2025")
    let baseDate
    if (publishData?.publishDate) {
      try {
        // Parse the date string (e.g., "Mar, 2025")
        const parts = publishData.publishDate.split(", ")
        if (parts.length === 2) {
          const monthName = parts[0]
          const year = parts[1]

          // Use the month mapping for clearer conversion
          const monthIndex = monthMap[monthName]

          if (monthIndex !== undefined && !isNaN(Number(year))) {
            // Create a dayjs object for the 1st of the month
            baseDate = dayjs(`${year}-${monthIndex + 1}-01`)

            // Validate that we got a valid date
            if (!baseDate.isValid()) {
              console.error("Invalid date parsed from publishDate:", publishData.publishDate)
              baseDate = dayjs().subtract(1, "month") // Fallback
            }
          } else {
            console.error("Invalid month or year in publishDate:", publishData.publishDate)
            baseDate = dayjs().subtract(1, "month") // Fallback
          }
        } else {
          console.error("Unexpected format for publishDate:", publishData.publishDate)
          baseDate = dayjs().subtract(1, "month") // Fallback
        }
      } catch (error) {
        console.error("Error parsing publishDate:", error)
        baseDate = dayjs().subtract(1, "month") // Fallback
      }
    } else {
      // Fallback to previous month if no publishDate is available
      baseDate = dayjs().subtract(1, "month")
    }

    // Generate 6 months going backward from the base date (including the base date)
    for (let i = 0; i < 6; i++) {
      const date = baseDate.subtract(i, "month")
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

  // Generate the month options
  const monthOptions = generateMonthOptions()

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

          {/* Show loading state if data is being fetched */}
          {isLoading ? (
            <DropdownMenuItem disabled>Loading months...</DropdownMenuItem>
          ) : (
            monthOptions.map((date) => (
              <DropdownMenuItem key={date.valueOf()} onSelect={() => handleDateSelect(date)}>
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                  {date.format("MMMM YYYY")}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

