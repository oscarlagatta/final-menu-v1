"use client"

import type { ReactNode } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DashboardLayoutProps {
  children?: ReactNode
  dataGrid?: ReactNode
  charts?: ReactNode[]
  timeOptions?: string[]
  userOptions?: string[]
  onTimeChange?: (value: string) => void
  onUserChange?: (value: string) => void
}

export function DashboardLayout({
  children,
  dataGrid,
  charts = [],
  timeOptions = [],
  userOptions = [],
  onTimeChange,
  onUserChange,
}: DashboardLayoutProps) {
  // Generate last 6 months if no timeOptions provided
  const defaultTimeOptions =
    timeOptions.length > 0
      ? timeOptions
      : (() => {
          const months = []
          const currentDate = new Date()

          for (let i = 0; i < 6; i++) {
            const date = new Date(currentDate)
            date.setMonth(currentDate.getMonth() - i)
            const monthYear = date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
            months.push(monthYear)
          }

          return months
        })()

  // Default user options if none provided
  const defaultUserOptions =
    userOptions.length > 0 ? userOptions : ["All Users", "John Doe", "Jane Smith", "Robert Johnson", "Emily Davis"]

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="w-full sm:w-auto sm:min-w-[200px] md:min-w-[240px]">
          <label htmlFor="month-select" className="block text-sm font-medium mb-2">
            Time Period
          </label>
          <Select defaultValue={defaultTimeOptions[0]} onValueChange={onTimeChange}>
            <SelectTrigger id="month-select" className="w-full">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              {defaultTimeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-auto sm:min-w-[200px] md:min-w-[240px]">
          <label htmlFor="user-select" className="block text-sm font-medium mb-2">
            User
          </label>
          <Select defaultValue={defaultUserOptions[0]} onValueChange={onUserChange}>
            <SelectTrigger id="user-select" className="w-full">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {defaultUserOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {children}

      {/* Data Grid Section */}
      {dataGrid && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Data Overview</h2>
          {dataGrid}
        </section>
      )}

      {/* Charts Section */}
      {charts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {charts.map((chart, index) => (
              <div key={index}>{chart}</div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
