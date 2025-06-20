"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Filter,
  Download,
  RefreshCw,
  Eye,
  FileText,
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  EyeOff,
} from "lucide-react"

// Anonymized audit log data
const auditLogData = [
  {
    id: "AL001",
    timestamp: "2024-01-15T14:32:15Z",
    userId: "USR_7A2B9C",
    userName: "J. Anderson",
    action: "UPDATE",
    module: "Onboarding",
    fieldName: "Lob",
    resourceName: "Control Partner Alpha",
    previousValue: "Pending",
    updatedValue: "Approved",
    description: "Status updated from Pending to Approved",
    ipAddress: "192.168.1.***",
    sessionId: "SES_9X4K2L",
  },
  {
    id: "AL002",
    timestamp: "2024-01-15T14:28:42Z",
    userId: "USR_3F8E1D",
    userName: "M. Chen",
    action: "CREATE",
    module: "Resource Alignment",
    fieldName: "Organization",
    resourceName: "Project Beta",
    previousValue: null,
    updatedValue: "5",
    description: "New resource allocation created",
    ipAddress: "10.0.0.***",
    sessionId: "SES_2Y7P9M",
  },
  {
    id: "AL003",
    timestamp: "2024-01-15T14:25:18Z",
    userId: "USR_5K9L3N",
    userName: "R. Johnson",
    action: "DELETE",
    module: "Service Alignment",
    fieldName: "NextAttestationDueDate",
    resourceName: "Function Gamma",
    previousValue: "Active",
    updatedValue: null,
    description: "Service function removed from alignment",
    ipAddress: "172.16.0.***",
    sessionId: "SES_8W1Q4R",
  },
  {
    id: "AL004",
    timestamp: "2024-01-15T14:20:33Z",
    userId: "USR_7A2B9C",
    userName: "J. Anderson",
    action: "UPDATE",
    module: "Onboarding",
    fieldName: "AttestationUserId",
    resourceName: "Control Partner Delta",
    previousValue: "Initial review pending",
    updatedValue: "Documentation verified and approved",
    description: "Comments updated with approval details",
    ipAddress: "192.168.1.***",
    sessionId: "SES_9X4K2L",
  },
  {
    id: "AL005",
    timestamp: "2024-01-15T14:15:07Z",
    userId: "USR_2H6J8K",
    userName: "S. Williams",
    action: "VIEW",
    module: "Application Details",
    fieldName: "Configuration",
    resourceName: "App Config Set 1",
    previousValue: null,
    updatedValue: null,
    description: "Configuration details accessed",
    ipAddress: "10.1.1.***",
    sessionId: "SES_5T3U7V",
  },
  {
    id: "AL006",
    timestamp: "2024-01-15T14:12:54Z",
    userId: "USR_9P4Q2R",
    userName: "L. Davis",
    action: "UPDATE",
    module: "Resource Alignment",
    fieldName: "Skill Level",
    resourceName: "Developer Pool",
    previousValue: "Intermediate",
    updatedValue: "Advanced",
    description: "Skill level upgraded based on assessment",
    ipAddress: "192.168.2.***",
    sessionId: "SES_6N8M1O",
  },
  {
    id: "AL007",
    timestamp: "2024-01-15T14:08:21Z",
    userId: "USR_3F8E1D",
    userName: "M. Chen",
    action: "CREATE",
    module: "Additional Details",
    fieldName: "Compliance Record",
    resourceName: "Compliance Set A",
    previousValue: null,
    updatedValue: "Compliant",
    description: "New compliance record added",
    ipAddress: "10.0.0.***",
    sessionId: "SES_2Y7P9M",
  },
  {
    id: "AL008",
    timestamp: "2024-01-15T14:05:39Z",
    userId: "USR_8B5C7D",
    userName: "K. Thompson",
    action: "UPDATE",
    module: "Onboarding",
    fieldName: "Due Date",
    resourceName: "Control Partner Epsilon",
    previousValue: "2024-01-20",
    updatedValue: "2024-01-25",
    description: "Due date extended by 5 days",
    ipAddress: "172.16.1.***",
    sessionId: "SES_4A9B2C",
  },
]

const actionTypes = ["All Actions", "CREATE", "UPDATE", "DELETE", "VIEW"]

type SortField = "timestamp" | "userName" | "action" | "fieldName" | "resourceName"
type SortDirection = "asc" | "desc"

interface Column {
  id: string
  label: string
  sortable: boolean
  visible: boolean
}

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAction, setSelectedAction] = useState("All Actions")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortField, setSortField] = useState<SortField>("timestamp")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [columns, setColumns] = useState<Column[]>([
    { id: "fieldName", label: "Field Name", sortable: true, visible: true },
    { id: "resourceName", label: "Resource Name", sortable: true, visible: true },
    { id: "updatedValue", label: "Updated Value", sortable: false, visible: true },
    { id: "previousValue", label: "Previous Value", sortable: false, visible: true },
    { id: "action", label: "Action", sortable: true, visible: true },
    { id: "userName", label: "Who", sortable: true, visible: true },
    { id: "timestamp", label: "When", sortable: true, visible: true },
  ])

  // Filter and sort data
  const filteredData = useMemo(() => {
    const filtered = auditLogData.filter((log) => {
      const matchesSearch =
        searchTerm === "" ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resourceName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesAction = selectedAction === "All Actions" || log.action === selectedAction

      return matchesSearch && matchesAction
    })

    // Sort data
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === "timestamp") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [searchTerm, selectedAction, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "text-green-600"
      case "UPDATE":
        return "text-blue-600"
      case "DELETE":
        return "text-red-600"
      case "VIEW":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "CREATE":
        return "○"
      case "UPDATE":
        return "◐"
      case "DELETE":
        return "⊘"
      case "VIEW":
        return "◯"
      default:
        return "○"
    }
  }

  // Summary statistics
  const totalLogs = filteredData.length
  const actionCounts = auditLogData.reduce(
    (acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const defaultActionCounts = {
    CREATE: 0,
    UPDATE: 0,
    DELETE: 0,
    VIEW: 0,
    ...actionCounts,
  }

  const activeFiltersCount = [searchTerm !== "", selectedAction !== "All Actions"].filter(Boolean).length

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedData.map((log) => log.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (logId: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, logId])
    } else {
      setSelectedRows(selectedRows.filter((id) => id !== logId))
    }
  }

  const toggleColumnVisibility = (columnId: string) => {
    setColumns(columns.map((col) => (col.id === columnId ? { ...col, visible: !col.visible } : col)))
  }

  const visibleColumns = columns.filter((col) => col.visible)

  return (
    <div className="mx-auto max-w-[1400px] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Audit Logs</h1>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              View Mode
            </Badge>
          </div>
          <p className="text-sm text-gray-600">Track system activities and monitor user actions across all modules</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View History
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLogs}</div>
            <p className="text-xs text-muted-foreground">Filtered results</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Creates</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{defaultActionCounts.CREATE}</div>
            <p className="text-xs text-muted-foreground">New records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Updates</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{defaultActionCounts.UPDATE}</div>
            <p className="text-xs text-muted-foreground">Modified records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deletes</CardTitle>
            <FileText className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{defaultActionCounts.DELETE}</div>
            <p className="text-xs text-muted-foreground">Removed records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views</CardTitle>
            <Eye className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{defaultActionCounts.VIEW}</div>
            <p className="text-xs text-muted-foreground">Access logs</p>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between py-4">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Filter audit logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
          <Button variant="outline" size="sm" className="h-8 border-dashed" onClick={() => {}}>
            <Filter className="mr-2 h-4 w-4" />
            Action
            {selectedAction !== "All Actions" && (
              <Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal">
                1
              </Badge>
            )}
          </Button>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm("")
                setSelectedAction("All Actions")
              }}
              className="h-8 px-2 lg:px-3"
            >
              Reset
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              {visibleColumns.map((column) => (
                <TableHead key={column.id}>
                  {column.sortable ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
                          <span>{column.label}</span>
                          {getSortIcon(column.id as SortField)}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => handleSort(column.id as SortField)}>
                          <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                          Asc
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSort(column.id as SortField)}>
                          <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                          Desc
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toggleColumnVisibility(column.id)}>
                          <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                          Hide
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <span className="font-medium">{column.label}</span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((log) => (
              <TableRow key={log.id} className={selectedRows.includes(log.id) ? "bg-muted/50" : ""}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(log.id)}
                    onCheckedChange={(checked) => handleSelectRow(log.id, checked as boolean)}
                    aria-label={`Select row ${log.id}`}
                  />
                </TableCell>
                {visibleColumns.map((column) => (
                  <TableCell key={column.id}>
                    {column.id === "fieldName" && <div className="font-medium">{log.fieldName}</div>}
                    {column.id === "resourceName" && (
                      <div className="max-w-[200px] truncate" title={log.resourceName}>
                        {log.resourceName}
                      </div>
                    )}
                    {column.id === "updatedValue" && (
                      <div className="max-w-[150px] truncate" title={log.updatedValue || "N/A"}>
                        {log.updatedValue || <span className="text-muted-foreground">N/A</span>}
                      </div>
                    )}
                    {column.id === "previousValue" && (
                      <div className="max-w-[150px] truncate" title={log.previousValue || "N/A"}>
                        {log.previousValue || <span className="text-muted-foreground">N/A</span>}
                      </div>
                    )}
                    {column.id === "action" && (
                      <div className={`flex items-center ${getActionColor(log.action)}`}>
                        <span className="mr-2">{getActionIcon(log.action)}</span>
                        {log.action}
                      </div>
                    )}
                    {column.id === "userName" && <div className="font-medium">{log.userName}</div>}
                    {column.id === "timestamp" && (
                      <div className="font-mono text-sm">{formatTimestamp(log.timestamp)}</div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
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
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
