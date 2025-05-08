"use client"

import { useState } from "react"
import { X, ChevronDown, Filter, CalendarIcon, Users, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import dayjs from "dayjs"
import type { MetricTypeModel } from "@/lib/hooks/use-metrics-data"

interface DashboardFiltersProps {
  // Month/Year filter
  selectedDate: dayjs.Dayjs | null
  onDateChange: (date: dayjs.Dayjs | null) => void

  // Leader filter
  selectedLeader: { id: string; name: string } | null
  onLeaderChange: (leader: { id: string; name: string } | null) => void
  leaderOptions: { sltNBKID: string; sltName: string }[] | undefined
  leadersLoading: boolean

  // Metric Type filter
  selectedMetricType: MetricTypeModel | null
  onMetricTypeChange: (metricType: MetricTypeModel | null) => void
  metricTypeOptions: MetricTypeModel[]
  metricTypesLoading: boolean
}

export function DashboardFilters({
  selectedDate,
  onDateChange,
  selectedLeader,
  onLeaderChange,
  leaderOptions,
  leadersLoading,
  selectedMetricType,
  onMetricTypeChange,
  metricTypeOptions,
  metricTypesLoading,
}: DashboardFiltersProps) {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [leaderDropdownOpen, setLeaderDropdownOpen] = useState(false)
  const [metricTypeDropdownOpen, setMetricTypeDropdownOpen] = useState(false)
  const [filtersExpanded, setFiltersExpanded] = useState(true)

  // Count active filters
  const activeFilterCount = [selectedDate !== null, selectedLeader !== null, selectedMetricType !== null].filter(
    Boolean,
  ).length

  // Handle clearing all filters
  const clearAllFilters = () => {
    onDateChange(null)
    onLeaderChange(null)
    onMetricTypeChange(null)
  }

  // Format date for display
  const formatDate = (date: dayjs.Dayjs | null) => {
    return date ? date.format("MMMM YYYY") : "All Months"
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          {/* Header with expand/collapse and clear all */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-medium">Dashboard Filters</h3>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount} active
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 px-2 text-xs">
                  Clear all
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                className="h-8 px-2"
              >
                {filtersExpanded ? "Collapse" : "Expand"}
              </Button>
            </div>
          </div>

          {/* Filter controls */}
          {filtersExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Month/Year Filter */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Reporting Period</span>
                </div>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-between text-left font-normal", selectedDate && "text-foreground")}
                    >
                      <div className="flex items-center">
                        <div className={`mr-2 h-2 w-2 rounded-full ${selectedDate ? "bg-green-500" : "bg-blue-500"}`} />
                        {formatDate(selectedDate)}
                      </div>
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate?.toDate() || undefined}
                      onSelect={(date) => {
                        onDateChange(date ? dayjs(date) : null)
                        setCalendarOpen(false)
                      }}
                      initialFocus
                      disabled={(date) => {
                        // Disable future months and dates more than 12 months in the past
                        const now = new Date()
                        const twelveMonthsAgo = new Date()
                        twelveMonthsAgo.setMonth(now.getMonth() - 12)
                        return (
                          date > now || date < twelveMonthsAgo || date.getDate() !== 1 // Only allow selecting the 1st of each month
                        )
                      }}
                    />
                    <div className="p-3 border-t">
                      <Button
                        variant="ghost"
                        className="w-full justify-center"
                        onClick={() => {
                          onDateChange(null)
                          setCalendarOpen(false)
                        }}
                      >
                        Show All Months
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                {selectedDate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-1 h-7 text-xs"
                    onClick={() => onDateChange(null)}
                  >
                    <X className="mr-1 h-3 w-3" />
                    Clear
                  </Button>
                )}
              </div>

              {/* Leader Filter */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Leader</span>
                </div>
                <Popover open={leaderDropdownOpen} onOpenChange={setLeaderDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between text-left font-normal">
                      <div className="flex items-center">
                        <div
                          className={`mr-2 h-2 w-2 rounded-full ${selectedLeader ? "bg-green-500" : "bg-blue-500"}`}
                        />
                        {selectedLeader ? selectedLeader.name : "All Leaders"}
                      </div>
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start" side="bottom" sideOffset={5} style={{ width: "250px" }}>
                    <Command>
                      <CommandInput placeholder="Search leaders..." />
                      <CommandList>
                        <CommandEmpty>No leaders found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => {
                              onLeaderChange(null)
                              setLeaderDropdownOpen(false)
                            }}
                            className="cursor-pointer"
                          >
                            All Leaders
                          </CommandItem>
                          <Separator />
                          {!leadersLoading &&
                            leaderOptions?.map((leader) => (
                              <CommandItem
                                key={leader.sltNBKID}
                                onSelect={() => {
                                  onLeaderChange({
                                    id: leader.sltNBKID,
                                    name: leader.sltName,
                                  })
                                  setLeaderDropdownOpen(false)
                                }}
                                className="cursor-pointer"
                              >
                                {leader.sltName}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedLeader && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-1 h-7 text-xs"
                    onClick={() => onLeaderChange(null)}
                  >
                    <X className="mr-1 h-3 w-3" />
                    Clear
                  </Button>
                )}
              </div>

              {/* Metric Type Filter */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Metric Type</span>
                </div>
                <Popover open={metricTypeDropdownOpen} onOpenChange={setMetricTypeDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between text-left font-normal">
                      <div className="flex items-center">
                        <div
                          className={`mr-2 h-2 w-2 rounded-full ${selectedMetricType ? "bg-green-500" : "bg-blue-500"}`}
                        />
                        {selectedMetricType ? selectedMetricType.name : "All Metric Types"}
                      </div>
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start" side="bottom" sideOffset={5} style={{ width: "250px" }}>
                    <Command>
                      <CommandInput placeholder="Search metric types..." />
                      <CommandList>
                        <CommandEmpty>No metric types found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => {
                              onMetricTypeChange(null)
                              setMetricTypeDropdownOpen(false)
                            }}
                            className="cursor-pointer"
                          >
                            All Metric Types
                          </CommandItem>
                          <Separator />
                          {!metricTypesLoading &&
                            metricTypeOptions.map((metricType) => (
                              <CommandItem
                                key={metricType.id}
                                onSelect={() => {
                                  onMetricTypeChange(metricType)
                                  setMetricTypeDropdownOpen(false)
                                }}
                                className="cursor-pointer"
                              >
                                {metricType.name}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedMetricType && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-1 h-7 text-xs"
                    onClick={() => onMetricTypeChange(null)}
                  >
                    <X className="mr-1 h-3 w-3" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Active filters summary (shown when collapsed) */}
          {!filtersExpanded && activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedDate && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  {formatDate(selectedDate)}
                  <Button variant="ghost" size="sm" onClick={() => onDateChange(null)} className="h-4 w-4 p-0 ml-1">
                    <X className="h-3 w-3" />
                    <span className="sr-only">Clear date</span>
                  </Button>
                </Badge>
              )}
              {selectedLeader && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {selectedLeader.name}
                  <Button variant="ghost" size="sm" onClick={() => onLeaderChange(null)} className="h-4 w-4 p-0 ml-1">
                    <X className="h-3 w-3" />
                    <span className="sr-only">Clear leader</span>
                  </Button>
                </Badge>
              )}
              {selectedMetricType && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" />
                  {selectedMetricType.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMetricTypeChange(null)}
                    className="h-4 w-4 p-0 ml-1"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Clear metric type</span>
                  </Button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
