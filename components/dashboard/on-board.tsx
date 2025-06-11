"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Filter,
  RefreshCw,
  Search,
  X,
  Edit,
  Save,
  MoreHorizontal,
  Eye,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { JSX } from "react"

// Types
interface OnboardingRecord {
  id: string
  controlPartner: string
  status: {
    label: "Approved" | "Pending" | "Rejected" | "Not Applicable"
    color: string
    icon: JSX.Element
  }
  actionedBy: string
  actionedDate: string
  comments: string
}

// Generate random data
const generateRandomData = (): OnboardingRecord[] => {
  const controlPartners = [
    "Business Management",
    "Incident Management",
    "Problem Management",
    "Capacity Management",
    "Security Management",
    "Configuration Management",
    "Change Management",
    "Release Management",
    "Availability Management",
    "Knowledge Management",
    "Service Level Management",
    "Financial Management",
  ]

  const statuses = [
    {
      label: "Approved" as const,
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />,
    },
    { label: "Pending" as const, color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-3.5 w-3.5 mr-1" /> },
    { label: "Rejected" as const, color: "bg-red-100 text-red-800", icon: <X className="h-3.5 w-3.5 mr-1" /> },
    {
      label: "Not Applicable" as const,
      color: "bg-gray-100 text-gray-800",
      icon: <FileText className="h-3.5 w-3.5 mr-1" />,
    },
  ]

  const firstNames = [
    "Alex",
    "Jordan",
    "Taylor",
    "Morgan",
    "Casey",
    "Riley",
    "Jamie",
    "Avery",
    "Quinn",
    "Blake",
    "Cameron",
    "Reese",
    "Finley",
    "Skyler",
    "Dakota",
    "Hayden",
  ]

  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
  ]

  const comments = [
    "All requirements verified and approved",
    "Documentation needs to be updated before approval",
    "Pending security review",
    "Technical requirements met, awaiting business sign-off",
    "Rejected due to missing compliance documentation",
    "Approved with conditions - follow-up required in 30 days",
    "In review by architecture team",
    "Waiting for additional information from requestor",
    "All status set by query",
    "Approved after addressing previous concerns",
    "Rejected - does not meet security standards",
    "Conditionally approved pending final review",
  ]

  // Generate random date within the last month
  const generateRandomDate = () => {
    const today = new Date()
    const pastDate = new Date(today)
    pastDate.setDate(today.getDate() - Math.floor(Math.random() * 30))
    return pastDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  // Generate random name
  const generateRandomName = () => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    return `${lastName}, ${firstName}`
  }

  return controlPartners.map((partner) => ({
    id: Math.random().toString(36).substring(2, 11),
    controlPartner: partner,
    status: statuses[Math.floor(Math.random() * (partner === "Business Management" ? 1 : statuses.length))],
    actionedBy: generateRandomName(),
    actionedDate: generateRandomDate(),
    comments: comments[Math.floor(Math.random() * comments.length)],
  }))
}

export default function OnboardingPage() {
  const [data, setData] = useState<OnboardingRecord[]>(generateRandomData())
  const [originalData, setOriginalData] = useState<OnboardingRecord[]>([])
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingRows, setEditingRows] = useState<Set<string>>(new Set())
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Status options for editing
  const statusOptions = [
    {
      value: "Approved",
      label: "Approved",
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />,
    },
    {
      value: "Pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
      icon: <Clock className="h-3.5 w-3.5 mr-1" />,
    },
    {
      value: "Rejected",
      label: "Rejected",
      color: "bg-red-100 text-red-800",
      icon: <X className="h-3.5 w-3.5 mr-1" />,
    },
    {
      value: "Not Applicable",
      label: "Not Applicable",
      color: "bg-gray-100 text-gray-800",
      icon: <FileText className="h-3.5 w-3.5 mr-1" />,
    },
  ]

  // Count by status
  const statusCounts = {
    total: data.length,
    approved: data.filter((item) => item.status.label === "Approved").length,
    pending: data.filter((item) => item.status.label === "Pending").length,
    rejected: data.filter((item) => item.status.label === "Rejected").length,
    notApplicable: data.filter((item) => item.status.label === "Not Applicable").length,
  }

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditMode && hasUnsavedChanges) {
      const confirmDiscard = window.confirm("You have unsaved changes. Are you sure you want to discard them?")
      if (!confirmDiscard) return
    }

    if (!isEditMode) {
      setOriginalData([...data])
      setIsEditMode(true)
    } else {
      setData([...originalData])
      setIsEditMode(false)
      setEditingRows(new Set())
      setHasUnsavedChanges(false)
      setValidationErrors({})
    }
  }

  // Handle save changes
  const handleSave = () => {
    // Validate all fields before saving
    const errors: Record<string, string> = {}

    // Check if any comments are empty
    data.forEach((item) => {
      if (item.comments.trim() === "") {
        errors[`comments-${item.id}`] = "Comments cannot be empty"
      }
    })

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setIsEditMode(false)
    setEditingRows(new Set())
    setHasUnsavedChanges(false)
    setValidationErrors({})
    setOriginalData([])

    // Here you would typically save to backend
    console.log("Saving changes:", data)

    // Show success message (in real app, this would be a toast notification)
    alert("Onboarding configuration saved successfully!")
  }

  // Handle row editing
  const handleEditRow = (id: string) => {
    setEditingRows((prev) => new Set([...prev, id]))
  }

  // Handle save single row
  const handleSaveRow = (id: string) => {
    // Validate the row before saving
    const item = data.find((item) => item.id === id)
    if (item && item.comments.trim() === "") {
      setValidationErrors((prev) => ({
        ...prev,
        [`comments-${id}`]: "Comments cannot be empty",
      }))
      return
    }

    setEditingRows((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })

    // Clear validation error if it exists
    if (validationErrors[`comments-${id}`]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`comments-${id}`]
        return newErrors
      })
    }
  }

  // Handle status change
  const handleStatusChange = (id: string, newStatus: string) => {
    const statusOption = statusOptions.find((s) => s.value === newStatus)
    if (!statusOption) return

    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: {
                label: statusOption.value as OnboardingRecord["status"]["label"],
                color: statusOption.color,
                icon: statusOption.icon,
              },
            }
          : item,
      ),
    )
    setHasUnsavedChanges(true)
  }

  // Handle comments change
  const handleCommentsChange = (id: string, newComments: string) => {
    setData((prev) => prev.map((item) => (item.id === id ? { ...item, comments: newComments } : item)))
    setHasUnsavedChanges(true)

    // Clear validation error if comment is not empty
    if (newComments.trim() !== "" && validationErrors[`comments-${id}`]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`comments-${id}`]
        return newErrors
      })
    }
  }

  // Handle row selection
  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  // Handle select all
  const toggleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(filteredData.map((item) => item.id))
    }
  }

  // Handle sorting
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Apply sorting
  const sortedData = [...data].sort((a: any, b: any) => {
    if (!sortConfig) return 0

    const aValue = sortConfig.key === "status" ? a[sortConfig.key].label : a[sortConfig.key]
    const bValue = sortConfig.key === "status" ? b[sortConfig.key].label : b[sortConfig.key]

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1
    }
    return 0
  })

  // Apply filters
  const filteredData = sortedData.filter((item) => {
    // Search query filter
    const matchesSearch =
      searchQuery === "" ||
      item.controlPartner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.actionedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.comments.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(item.status.label)

    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Handle status filter toggle
  const toggleStatusFilter = (status: string) => {
    setStatusFilter((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
    setCurrentPage(1)
  }

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("")
    setStatusFilter([])
    setCurrentPage(1)
  }

  // Refresh data
  const refreshData = () => {
    if (isEditMode && hasUnsavedChanges) {
      const confirmDiscard = window.confirm("You have unsaved changes. Are you sure you want to refresh the data?")
      if (!confirmDiscard) return
    }

    setData(generateRandomData())
    setSelectedRows([])
    setCurrentPage(1)
    setIsEditMode(false)
    setEditingRows(new Set())
    setHasUnsavedChanges(false)
    setOriginalData([])
    setValidationErrors({})
  }

  return (
    <div className="w-full">
      {/* Ultra-wide responsive container */}
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto p-4 lg:p-6 xl:p-8">
        {/* Panel Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 lg:mb-6 gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">Onboarding</h2>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs lg:text-sm",
                    isEditMode ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800",
                  )}
                >
                  {isEditMode ? "Edit Mode" : "View Mode"}
                </Badge>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                Manage control partner onboarding status and approvals
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-4 lg:mb-6">
            {!isEditMode ? (
              <Button onClick={handleEditToggle} className="flex items-center space-x-2 h-9 lg:h-10">
                <Edit className="h-4 w-4" />
                <span>Edit Configuration</span>
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  className="flex items-center space-x-2 h-9 lg:h-10 bg-green-600 hover:bg-green-700"
                  disabled={!hasUnsavedChanges || Object.keys(validationErrors).length > 0}
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </Button>
                <Button
                  onClick={handleEditToggle}
                  variant="outline"
                  className="flex items-center space-x-2 h-9 lg:h-10"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </Button>
              </>
            )}
            <Button variant="outline" className="flex items-center space-x-2 h-9 lg:h-10">
              <Eye className="h-4 w-4" />
              <span>View History</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2 h-9 lg:h-10 ml-auto"
              onClick={refreshData}
              disabled={isEditMode && hasUnsavedChanges}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 h-9 lg:h-10" disabled={isEditMode}>
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>

          {/* Validation Errors Alert */}
          {Object.keys(validationErrors).length > 0 && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Please correct the validation errors before saving.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Records</p>
                <p className="text-2xl font-bold">{statusCounts.total}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Approved</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.approved}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.rejected}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <X className="h-5 w-5 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Not Applicable</p>
                <p className="text-2xl font-bold text-gray-600">{statusCounts.notApplicable}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="shadow-sm mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search control partners, users, or comments..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10 h-10"
                  disabled={isEditMode}
                />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2" disabled={isEditMode}>
                      <Filter className="h-4 w-4" />
                      <span>Status Filter</span>
                      {statusFilter.length > 0 && (
                        <Badge className="ml-1 bg-blue-100 text-blue-800">{statusFilter.length}</Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {statusOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onSelect={(e) => {
                          e.preventDefault()
                          toggleStatusFilter(option.value)
                        }}
                        className="flex items-center gap-2"
                      >
                        <Checkbox
                          checked={statusFilter.includes(option.value)}
                          onCheckedChange={() => toggleStatusFilter(option.value)}
                          id={`filter-${option.value.toLowerCase()}`}
                        />
                        <div className={`flex items-center ${option.color} px-2 py-1 rounded text-xs`}>
                          {option.icon}
                          {option.label}
                        </div>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={resetFilters}>Reset Filters</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {selectedRows.length > 0 && !isEditMode && (
                  <Button variant="outline" size="sm">
                    Bulk Action ({selectedRows.length})
                  </Button>
                )}
              </div>
            </div>

            {/* Active filters */}
            {statusFilter.length > 0 && !isEditMode && (
              <div className="mt-3 flex flex-wrap gap-2">
                {statusFilter.map((status) => (
                  <Badge key={status} variant="secondary" className="bg-gray-100 text-gray-800 flex items-center gap-1">
                    Status: {status}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => toggleStatusFilter(status)} />
                  </Badge>
                ))}
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={resetFilters}>
                  Clear all filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                        onCheckedChange={toggleSelectAll}
                        disabled={isEditMode}
                      />
                    </TableHead>
                    <TableHead className="min-w-[200px]">
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => !isEditMode && requestSort("controlPartner")}
                        disabled={isEditMode}
                      >
                        Control Partner
                        {sortConfig?.key === "controlPartner" && (
                          <span className="ml-2">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="min-w-[120px]">
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => !isEditMode && requestSort("status")}
                        disabled={isEditMode}
                      >
                        Status
                        {sortConfig?.key === "status" && (
                          <span className="ml-2">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="min-w-[150px]">
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => !isEditMode && requestSort("actionedBy")}
                        disabled={isEditMode}
                      >
                        Actioned By
                        {sortConfig?.key === "actionedBy" && (
                          <span className="ml-2">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="min-w-[120px]">
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => !isEditMode && requestSort("actionedDate")}
                        disabled={isEditMode}
                      >
                        Actioned Date
                        {sortConfig?.key === "actionedDate" && (
                          <span className="ml-2">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="min-w-[250px]">Comments</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item) => {
                      const isEditing = editingRows.has(item.id)
                      return (
                        <TableRow
                          key={item.id}
                          className={cn(
                            selectedRows.includes(item.id) && "bg-blue-50",
                            isEditing && "bg-yellow-50 border-yellow-200",
                            !isEditMode && "hover:bg-gray-50",
                          )}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedRows.includes(item.id)}
                              onCheckedChange={() => !isEditMode && toggleRowSelection(item.id)}
                              disabled={isEditMode}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{item.controlPartner}</TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Select
                                value={item.status.label}
                                onValueChange={(value) => handleStatusChange(item.id, value)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      <div className="flex items-center">
                                        {option.icon}
                                        {option.label}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge className={`flex items-center w-fit ${item.status.color}`}>
                                {item.status.icon}
                                {item.status.label}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{item.actionedBy}</TableCell>
                          <TableCell>{item.actionedDate}</TableCell>
                          <TableCell>
                            {isEditing ? (
                              <div>
                                <Textarea
                                  value={item.comments}
                                  onChange={(e) => handleCommentsChange(item.id, e.target.value)}
                                  className={cn(
                                    "min-h-[60px] resize-none",
                                    validationErrors[`comments-${item.id}`] && "border-red-300",
                                  )}
                                  placeholder="Enter comments..."
                                />
                                {validationErrors[`comments-${item.id}`] && (
                                  <p className="text-xs text-red-600 mt-1">{validationErrors[`comments-${item.id}`]}</p>
                                )}
                              </div>
                            ) : (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="block max-w-[250px] truncate text-sm text-gray-600">
                                      {item.comments}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">{item.comments}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditMode ? (
                              isEditing ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSaveRow(item.id)}
                                  className="h-8 w-8 p-0"
                                  disabled={!!validationErrors[`comments-${item.id}`]}
                                >
                                  <Save className="h-4 w-4 text-green-600" />
                                  <span className="sr-only">Save changes</span>
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditRow(item.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4 text-blue-600" />
                                  <span className="sr-only">Edit row</span>
                                </Button>
                              )
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Add Comment</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Export Record</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <FileText className="h-8 w-8 mb-2" />
                          <p className="text-sm">No records found matching your criteria</p>
                          {(searchQuery || statusFilter.length > 0) && !isEditMode && (
                            <Button variant="link" size="sm" onClick={resetFilters} className="mt-1">
                              Clear filters to see all records
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value))
                setCurrentPage(1)
              }}
              disabled={isEditMode}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">entries</span>
          </div>

          <div className="text-sm text-gray-600">
            Showing {Math.min((currentPage - 1) * pageSize + 1, filteredData.length)} to{" "}
            {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || isEditMode}
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(pageNumber)}
                    disabled={isEditMode}
                  >
                    {pageNumber}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || isEditMode}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <span className="text-yellow-800 text-sm">
                You have unsaved changes. Remember to save before leaving.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
