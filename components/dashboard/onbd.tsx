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
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import {
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Filter,
  RefreshCw,
  X,
  Edit,
  Save,
  Eye,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  EyeOff,
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
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([])
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<OnboardingRecord | null>(null)
  const [editFormData, setEditFormData] = useState<{ status: string; comments: string }>({ status: "", comments: "" })
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

  // Column definitions
  const columns = [
    { key: "controlPartner", label: "Control Partner", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "actionedBy", label: "Actioned By", sortable: true },
    { key: "actionedDate", label: "Actioned Date", sortable: true },
    { key: "comments", label: "Comments", sortable: false },
  ]

  // Count by status
  const statusCounts = {
    total: data.length,
    approved: data.filter((item) => item.status.label === "Approved").length,
    pending: data.filter((item) => item.status.label === "Pending").length,
    rejected: data.filter((item) => item.status.label === "Rejected").length,
    notApplicable: data.filter((item) => item.status.label === "Not Applicable").length,
  }

  // Handle edit record
  const handleEditRecord = (record: OnboardingRecord) => {
    setEditingRecord(record)
    setEditFormData({
      status: record.status.label,
      comments: record.comments,
    })
    setValidationErrors({})
    setIsEditSheetOpen(true)
  }

  // Handle save edit
  const handleSaveEdit = () => {
    // Validate form
    const errors: Record<string, string> = {}
    if (editFormData.comments.trim() === "") {
      errors.comments = "Comments cannot be empty"
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    if (!editingRecord) return

    // Update the record
    const statusOption = statusOptions.find((s) => s.value === editFormData.status)
    if (!statusOption) return

    setData((prev) =>
      prev.map((item) =>
        item.id === editingRecord.id
          ? {
              ...item,
              status: {
                label: statusOption.value as OnboardingRecord["status"]["label"],
                color: statusOption.color,
                icon: statusOption.icon,
              },
              comments: editFormData.comments,
            }
          : item,
      ),
    )

    // Close sheet
    setIsEditSheetOpen(false)
    setEditingRecord(null)
    setValidationErrors({})
  }

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditSheetOpen(false)
    setEditingRecord(null)
    setValidationErrors({})
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

  // Handle column visibility
  const toggleColumnVisibility = (columnKey: string) => {
    setHiddenColumns((prev) =>
      prev.includes(columnKey) ? prev.filter((key) => key !== columnKey) : [...prev, columnKey],
    )
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
    setData(generateRandomData())
    setSelectedRows([])
    setCurrentPage(1)
  }

  // Get sort icon
  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return sortConfig.direction === "ascending" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    )
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
                <Badge variant="secondary" className="text-xs lg:text-sm bg-blue-100 text-blue-800">
                  View Mode
                </Badge>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                Manage control partner onboarding status and approvals
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-4 lg:mb-6">
            <Button variant="outline" className="flex items-center space-x-2 h-9 lg:h-10">
              <Eye className="h-4 w-4" />
              <span>View History</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 h-9 lg:h-10 ml-auto" onClick={refreshData}>
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 h-9 lg:h-10">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
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

        {/* Toolbar - matching tasks example */}
        <div className="flex items-center justify-between py-4">
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Filter control partners..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="h-8 w-[150px] lg:w-[250px]"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                  <Filter className="mr-2 h-4 w-4" />
                  Status
                  {statusFilter.length > 0 && (
                    <>
                      <div className="mx-2 h-4 w-px bg-gray-300" />
                      <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                        {statusFilter.length}
                      </Badge>
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                <div className="px-2 py-1.5 text-sm font-semibold">Filter by status</div>
                <DropdownMenuSeparator />
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onSelect={(e) => {
                      e.preventDefault()
                      toggleStatusFilter(option.value)
                    }}
                  >
                    <Checkbox checked={statusFilter.includes(option.value)} className="mr-2" />
                    <div className="flex items-center">
                      <div className={cn("mr-2", option.color.replace("bg-", "text-").replace("-100", "-600"))}>
                        {option.icon}
                      </div>
                      {option.label}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8">
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
            <Button variant="outline" className="h-8" onClick={refreshData}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Table - matching tasks example */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                {columns.map((column) => (
                  <TableHead key={column.key} className={cn(hiddenColumns.includes(column.key) && "hidden")}>
                    {column.sortable ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
                            <span>{column.label}</span>
                            {getSortIcon(column.key)}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => requestSort(column.key)}>
                            <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                            Asc
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => requestSort(column.key)}>
                            <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                            Desc
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toggleColumnVisibility(column.key)}>
                            <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                            Hide
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <div className="px-3 py-2">
                        <span>{column.label}</span>
                      </div>
                    )}
                  </TableHead>
                ))}
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <TableRow key={item.id} className={cn(selectedRows.includes(item.id) && "bg-muted/50")}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(item.id)}
                        onCheckedChange={() => toggleRowSelection(item.id)}
                      />
                    </TableCell>
                    <TableCell className={cn("font-medium", hiddenColumns.includes("controlPartner") && "hidden")}>
                      {item.controlPartner}
                    </TableCell>
                    <TableCell className={cn(hiddenColumns.includes("status") && "hidden")}>
                      <div className="flex items-center">
                        <div className={cn("mr-2", item.status.color.replace("bg-", "text-").replace("-100", "-600"))}>
                          {item.status.icon}
                        </div>
                        <span className={item.status.color.replace("bg-", "text-").replace("-100", "-600")}>
                          {item.status.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className={cn(hiddenColumns.includes("actionedBy") && "hidden")}>
                      {item.actionedBy}
                    </TableCell>
                    <TableCell className={cn(hiddenColumns.includes("actionedDate") && "hidden")}>
                      {item.actionedDate}
                    </TableCell>
                    <TableCell className={cn(hiddenColumns.includes("comments") && "hidden")}>
                      <div className="max-w-[300px] truncate">{item.comments}</div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleEditRecord(item)} className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit record</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination - matching tasks example */}
        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {selectedRows.length} of {filteredData.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Go to first page</span>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Go to next page</span>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Go to last page</span>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Edit Onboarding Record</SheetTitle>
            <SheetDescription>
              Update the status and comments for {editingRecord?.controlPartner}. Only these fields can be modified.
            </SheetDescription>
          </SheetHeader>

          {editingRecord && (
            <div className="grid gap-4 py-4">
              {/* Read-only fields */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-sm font-medium text-gray-500">Control Partner</Label>
                <div className="col-span-3">
                  <Input value={editingRecord.controlPartner} disabled className="bg-gray-50" />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-sm font-medium text-gray-500">Actioned By</Label>
                <div className="col-span-3">
                  <Input value={editingRecord.actionedBy} disabled className="bg-gray-50" />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-sm font-medium text-gray-500">Actioned Date</Label>
                <div className="col-span-3">
                  <Input value={editingRecord.actionedDate} disabled className="bg-gray-50" />
                </div>
              </div>

              {/* Editable fields */}
              <div className="border-t pt-4 mt-2">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Editable Fields</h4>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right font-medium">
                    Status *
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={editFormData.status}
                      onValueChange={(value) => setEditFormData((prev) => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
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
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4 mt-4">
                  <Label htmlFor="comments" className="text-right font-medium mt-2">
                    Comments *
                  </Label>
                  <div className="col-span-3">
                    <Textarea
                      id="comments"
                      value={editFormData.comments}
                      onChange={(e) => {
                        setEditFormData((prev) => ({ ...prev, comments: e.target.value }))
                        // Clear validation error when user starts typing
                        if (validationErrors.comments && e.target.value.trim() !== "") {
                          setValidationErrors((prev) => {
                            const newErrors = { ...prev }
                            delete newErrors.comments
                            return newErrors
                          })
                        }
                      }}
                      placeholder="Enter comments about this onboarding record..."
                      className={cn("min-h-[100px] resize-none", validationErrors.comments && "border-red-300")}
                    />
                    {validationErrors.comments && (
                      <p className="text-xs text-red-600 mt-1">{validationErrors.comments}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Validation Alert */}
              {Object.keys(validationErrors).length > 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Please correct the validation errors before saving.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <SheetFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={Object.keys(validationErrors).length > 0}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
