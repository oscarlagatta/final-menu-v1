"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Paperclip } from "lucide-react"
import { cn } from "@/lib/utils"
import { SheetClose } from "@/components/ui/sheet"

// Define types
type ExceptionStatus = "Open" | "In Progress" | "Assigned" | "Closed"
type CapacityType = "FileSystem" | "CPU" | "Memory"
type UCALLevel = "High" | "Medium" | "Low"

interface CapacityException {
    id: string
    portfolio: string
    appId: string
    ucal: UCALLevel
    capacityType: CapacityType
    exceptionDetail: string
    firstReported: string
    status: ExceptionStatus
    pbiPke: string
    nextSteps: string
    fixTargetDate: string
    l2Name: string
    l2Comments: string
}

interface EditExceptionFormProps {
    exception: CapacityException
    onSave: (updatedException: CapacityException) => void
}

export function EditExceptionForm({ exception, onSave }: EditExceptionFormProps) {
    const [formData, setFormData] = useState<CapacityException>(exception)
    const [firstReportedDate, setFirstReportedDate] = useState<Date | undefined>(
        exception.firstReported ? new Date(parseDate(exception.firstReported)) : undefined,
    )
    const [fixTargetDate, setFixTargetDate] = useState<Date | undefined>(
        exception.fixTargetDate ? new Date(parseDate(exception.fixTargetDate)) : undefined,
    )

    // Helper function to parse date strings like "Apr-2023" to a valid date
    function parseDate(dateStr: string): string {
        const months: Record<string, string> = {
            Jan: "01",
            Feb: "02",
            Mar: "03",
            Apr: "04",
            May: "05",
            Jun: "06",
            Jul: "07",
            Aug: "08",
            Sept: "09",
            Sep: "09",
            Oct: "10",
            Nov: "11",
            Dec: "12",
        }

        const parts = dateStr.split("-")
        if (parts.length === 2) {
            const month = months[parts[0]] || "01"
            const year = parts[1]
            return `${year}-${month}-01`
        }
        return "2023-01-01" // Default date if parsing fails
    }

    const handleInputChange = (field: keyof CapacityException, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleFirstReportedChange = (date: Date | undefined) => {
        setFirstReportedDate(date)
        if (date) {
            const formattedDate = format(date, "MMM-yyyy")
            handleInputChange("firstReported", formattedDate)
        }
    }

    const handleFixTargetDateChange = (date: Date | undefined) => {
        setFixTargetDate(date)
        if (date) {
            const formattedDate = format(date, "MMM-yyyy")
            handleInputChange("fixTargetDate", formattedDate)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="exceptionId" className="text-sm font-medium">
                        Exception Id
                    </Label>
                    <Input
                        id="exceptionId"
                        value={formData.id}
                        onChange={(e) => handleInputChange("id", e.target.value)}
                        disabled
                        className="h-9"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="application" className="text-sm font-medium">
                        Application
                    </Label>
                    <Input
                        id="application"
                        value={formData.appId}
                        onChange={(e) => handleInputChange("appId", e.target.value)}
                        className="h-9"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="capacityException" className="text-sm font-medium">
                        Capacity Exception
                    </Label>
                    <Select
                        value={formData.capacityType}
                        onValueChange={(value) => handleInputChange("capacityType", value as CapacityType)}
                    >
                        <SelectTrigger id="capacityException" className="h-9">
                            <SelectValue placeholder="Select Capacity Exception" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="FileSystem">FileSystem</SelectItem>
                            <SelectItem value="CPU">CPU</SelectItem>
                            <SelectItem value="Memory">Memory</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="firstReported" className="text-sm font-medium">
                        First Reported
                    </Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="firstReported"
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal h-9",
                                    !firstReportedDate && "text-muted-foreground",
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {firstReportedDate ? format(firstReportedDate, "MM/dd/yyyy") : "Select date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={firstReportedDate} onSelect={handleFirstReportedChange} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="fixTargetDate" className="text-sm font-medium">
                        Fix Target Date
                    </Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="fixTargetDate"
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal h-9",
                                    !fixTargetDate && "text-muted-foreground",
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {fixTargetDate ? format(fixTargetDate, "MM/dd/yyyy") : "Select date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={fixTargetDate} onSelect={handleFixTargetDateChange} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="exceptionStatus" className="text-sm font-medium">
                        Exception Status
                    </Label>
                    <Select
                        value={formData.status}
                        onValueChange={(value) => handleInputChange("status", value as ExceptionStatus)}
                    >
                        <SelectTrigger id="exceptionStatus" className="h-9">
                            <SelectValue placeholder="Exception Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Assigned">Assigned</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="details" className="text-sm font-medium">
                    Details
                </Label>
                <Textarea
                    id="details"
                    value={formData.exceptionDetail}
                    onChange={(e) => handleInputChange("exceptionDetail", e.target.value)}
                    rows={3}
                    className="resize-none"
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="pbiPke" className="text-sm font-medium">
                    PBI/PKE
                </Label>
                <Input
                    id="pbiPke"
                    value={formData.pbiPke}
                    onChange={(e) => handleInputChange("pbiPke", e.target.value)}
                    className="h-9"
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="nextAction" className="text-sm font-medium">
                    Next Action
                </Label>
                <Textarea
                    id="nextAction"
                    value={formData.nextSteps}
                    onChange={(e) => handleInputChange("nextSteps", e.target.value)}
                    rows={3}
                    className="resize-none"
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="l2Comments" className="text-sm font-medium">
                    L2 Comments
                </Label>
                <Textarea
                    id="l2Comments"
                    value={formData.l2Comments}
                    onChange={(e) => handleInputChange("l2Comments", e.target.value)}
                    rows={3}
                    className="resize-none"
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="uploadImage" className="text-sm font-medium">
                    Upload Image
                </Label>
                <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" className="h-9">
                        <Paperclip className="h-4 w-4 mr-2" />
                        Choose Files
                    </Button>
                    <span className="text-sm text-gray-500">No file chosen</span>
                </div>
            </div>

            <div className="space-y-1.5">
                <Label className="text-sm font-medium">Supporting Documents (1 attached)</Label>
                <div className="border rounded-md p-3 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                        <span>document1.pdf</span>
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                            View
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                <SheetClose asChild>
                    <Button type="button" variant="outline" className="h-9">
                        Cancel
                    </Button>
                </SheetClose>
                <Button type="submit" className="bg-blue-900 hover:bg-blue-800 h-9">
                    Save
                </Button>
            </div>
        </form>
    )
}

