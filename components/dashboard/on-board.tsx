"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle2, Clock, Download, FileText, Filter, MoreHorizontal, RefreshCw, Search, X } from "lucide-react"

// Generate random data
const generateRandomData = () => {
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
    { label: "Approved", color: "bg-green-100 text-green-800", icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> },
    { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-3.5 w-3.5 mr-1" /> },
    { label: "In Review", color: "bg-blue-100 text-blue-800", icon: <FileText className="h-3.5 w-3.5 mr-1" /> },
    { label: "Rejected", color: "bg-red-100 text-red-800", icon: <X className="h-3.5 w-3.5 mr-1" /> },
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
  const [data, setData] = useState(generateRandomData())
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)

  // Count by status
  const statusCounts = {
    total: data.length,
    approved: data.filter((item) => item.status.label === "Approved").length,
    pending: data.filter((item) => item.status.label === "Pending").length,
    inReview: data.filter((item) => item.status.label === "In Review").length,
    rejected: data.filter((item) => item.status.label === "Rejected").length,
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
    setData(generateRandomData())
    setSelectedRows([])
    setCurrentPage(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-2xl font-bold">{statusCounts.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold text-green-600">{statusCounts.approved}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">In Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold text-blue-600">{statusCounts.inReview}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <X className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-2xl font-bold text-red-600">{statusCounts.rejected}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search control partners, users, or comments..."
                  className="pl-9 w-full sm:w-80"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Filter className="h-4 w-4 mr-1" />
                    Status Filter
                    {statusFilter.length > 0 && (
                      <Badge className="ml-1 bg-blue-100 text-blue-800 hover:bg-blue-100">{statusFilter.length}</Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0 focus:bg-transparent">
                    <div className="px-2 py-1.5 w-full">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-approved"
                          checked={statusFilter.includes("Approved")}
                          onCheckedChange={() => toggleStatusFilter("Approved")}
                        />
                        <label htmlFor="filter-approved" className="text-sm flex items-center cursor-pointer">
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-600" />
                          Approved
                        </label>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0 focus:bg-transparent">
                    <div className="px-2 py-1.5 w-full">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-pending"
                          checked={statusFilter.includes("Pending")}
                          onCheckedChange={() => toggleStatusFilter("Pending")}
                        />
                        <label htmlFor="filter-pending" className="text-sm flex items-center cursor-pointer">
                          <Clock className="h-3.5 w-3.5 mr-1 text-yellow-600" />
                          Pending
                        </label>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0 focus:bg-transparent">
                    <div className="px-2 py-1.5 w-full">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-in-review"
                          checked={statusFilter.includes("In Review")}
                          onCheckedChange={() => toggleStatusFilter("In Review")}
                        />
                        <label htmlFor="filter-in-review" className="text-sm flex items-center cursor-pointer">
                          <FileText className="h-3.5 w-3.5 mr-1 text-blue-600" />
                          In Review
                        </label>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0 focus:bg-transparent">
                    <div className="px-2 py-1.5 w-full">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filter-rejected"
                          checked={statusFilter.includes("Rejected")}
                          onCheckedChange={() => toggleStatusFilter("Rejected")}
                        />
                        <label htmlFor="filter-rejected" className="text-sm flex items-center cursor-pointer">
                          <X className="h-3.5 w-3.5 mr-1 text-red-600" />
                          Rejected
                        </label>
                      </div>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={resetFilters} className="justify-center">
                    <Button variant="ghost" size="sm" className="w-full">
                      Reset Filters
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex gap-2">
              {selectedRows.length > 0 && (
                <Button variant="outline" size="sm">
                  Bulk Action ({selectedRows.length})
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>

          {/* Active filters */}
          {statusFilter.length > 0 && (
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
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="cursor-pointer min-w-[200px]" onClick={() => requestSort("controlPartner")}>
                  <div className="flex items-center">
                    Control Partner
                    {sortConfig?.key === "controlPartner" && (
                      <span className="ml-1">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer min-w-[120px]" onClick={() => requestSort("status")}>
                  <div className="flex items-center">
                    Status
                    {sortConfig?.key === "status" && (
                      <span className="ml-1">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer min-w-[150px]" onClick={() => requestSort("actionedBy")}>
                  <div className="flex items-center">
                    Actioned By
                    {sortConfig?.key === "actionedBy" && (
                      <span className="ml-1">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer min-w-[120px]" onClick={() => requestSort("actionedDate")}>
                  <div className="flex items-center">
                    Actioned Date
                    {sortConfig?.key === "actionedDate" && (
                      <span className="ml-1">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="min-w-[250px]">Comments</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <TableRow key={item.id} className={selectedRows.includes(item.id) ? "bg-blue-50" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(item.id)}
                        onCheckedChange={() => toggleRowSelection(item.id)}
                        aria-label={`Select ${item.controlPartner}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.controlPartner}</TableCell>
                    <TableCell>
                      <Badge className={`flex items-center w-fit ${item.status.color}`}>
                        {item.status.icon}
                        {item.status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{item.actionedBy}</TableCell>
                    <TableCell className="text-sm">{item.actionedDate}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="block max-w-[250px] truncate text-sm text-gray-600">{item.comments}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{item.comments}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu for {item.controlPartner}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Status</DropdownMenuItem>
                          <DropdownMenuItem>Add Comment</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FileText className="h-8 w-8 mb-2" />
                      <p className="text-sm">No records found matching your criteria</p>
                      {(searchQuery || statusFilter.length > 0) && (
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

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{Math.min((currentPage - 1) * pageSize + 1, filteredData.length)}</span>{" "}
                to <span className="font-medium">{Math.min(currentPage * pageSize, filteredData.length)}</span> of{" "}
                <span className="font-medium">{filteredData.length}</span> results
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="rounded-r-none border-r-0"
                >
                  <span className="sr-only">First page</span>
                  <span aria-hidden="true">«</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-none"
                >
                  <span className="sr-only">Previous page</span>
                  <span aria-hidden="true">‹</span>
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Calculate page numbers to show around current page
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <Button
                      key={i}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="icon"
                      onClick={() => setCurrentPage(pageNum)}
                      className="rounded-none"
                    >
                      {pageNum}
                    </Button>
                  )
                })}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="rounded-none"
                >
                  <span className="sr-only">Next page</span>
                  <span aria-hidden="true">›</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="rounded-l-none border-l-0"
                >
                  <span className="sr-only">Last page</span>
                  <span aria-hidden="true">»</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
