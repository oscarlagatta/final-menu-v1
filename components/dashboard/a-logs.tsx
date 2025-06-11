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
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  User,
  FileText,
  Activity,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
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
    fieldName: "Status",
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
    fieldName: "Allocation",
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
    fieldName: "Service Function",
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
    fieldName: "Comments",
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
const modules = [
  "All Modules",
  "Onboarding",
  "Resource Alignment",
  "Service Alignment",
  "Application Details",
  "Additional Details",
]

type SortField = "timestamp" | "userName" | "action" | "module" | "fieldName"
type SortDirection = "asc" | "desc"

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAction, setSelectedAction] = useState("All Actions")
  const [selectedModule, setSelectedModule] = useState("All Modules")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortField, setSortField] = useState<SortField>("timestamp")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

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
      const matchesModule = selectedModule === "All Modules" || log.module === selectedModule

      return matchesSearch && matchesAction && matchesModule
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
  }, [searchTerm, selectedAction, selectedModule, sortField, sortDirection])

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

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "UPDATE":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "DELETE":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "VIEW":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getModuleBadgeColor = (module: string) => {
    const colors = [
      "bg-purple-100 text-purple-800",
      "bg-indigo-100 text-indigo-800",
      "bg-cyan-100 text-cyan-800",
      "bg-teal-100 text-teal-800",
      "bg-orange-100 text-orange-800",
    ]
    const index = modules.indexOf(module) % colors.length
    return colors[index] || "bg-gray-100 text-gray-800"
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

  const activeFiltersCount = [
    searchTerm !== "",
    selectedAction !== "All Actions",
    selectedModule !== "All Modules",
  ].filter(Boolean).length

  return (
    <div className="space-y-6">
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
            <div className="text-2xl font-bold text-green-600">{actionCounts.CREATE || 0}</div>
            <p className="text-xs text-muted-foreground">New records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Updates</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{actionCounts.UPDATE || 0}</div>
            <p className="text-xs text-muted-foreground">Modified records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deletes</CardTitle>
            <FileText className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{actionCounts.DELETE || 0}</div>
            <p className="text-xs text-muted-foreground">Removed records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views</CardTitle>
            <Eye className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{actionCounts.VIEW || 0}</div>
            <p className="text-xs text-muted-foreground">Access logs</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters & Search</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">
                {activeFiltersCount} active filter{activeFiltersCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search logs by user, description, field, or resource..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {actionTypes.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modules.map((module) => (
                  <SelectItem key={module} value={module}>
                    {module}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <Badge variant="outline" className="gap-1">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                    ×
                  </button>
                </Badge>
              )}
              {selectedAction !== "All Actions" && (
                <Badge variant="outline" className="gap-1">
                  Action: {selectedAction}
                  <button
                    onClick={() => setSelectedAction("All Actions")}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedModule !== "All Modules" && (
                <Badge variant="outline" className="gap-1">
                  Module: {selectedModule}
                  <button
                    onClick={() => setSelectedModule("All Modules")}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedAction("All Actions")
                  setSelectedModule("All Modules")
                }}
                className="text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRows(paginatedData.map((log) => log.id))
                        } else {
                          setSelectedRows([])
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-medium"
                      onClick={() => handleSort("timestamp")}
                    >
                      Timestamp
                      {getSortIcon("timestamp")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-medium"
                      onClick={() => handleSort("userName")}
                    >
                      User
                      {getSortIcon("userName")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-medium"
                      onClick={() => handleSort("action")}
                    >
                      Action
                      {getSortIcon("action")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-medium"
                      onClick={() => handleSort("module")}
                    >
                      Module
                      {getSortIcon("module")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-medium"
                      onClick={() => handleSort("fieldName")}
                    >
                      Field
                      {getSortIcon("fieldName")}
                    </Button>
                  </TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Previous Value</TableHead>
                  <TableHead>Updated Value</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((log) => (
                  <TableRow key={log.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(log.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedRows([...selectedRows, log.id])
                          } else {
                            setSelectedRows(selectedRows.filter((id) => id !== log.id))
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {formatTimestamp(log.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{log.userName}</div>
                          <div className="text-xs text-gray-500">{log.userId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getActionBadgeColor(log.action)}>{log.action}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getModuleBadgeColor(log.module)}>
                        {log.module}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{log.fieldName}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={log.resourceName}>
                      {log.resourceName}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate" title={log.previousValue || "N/A"}>
                      {log.previousValue || <span className="text-gray-400">N/A</span>}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate" title={log.updatedValue || "N/A"}>
                      {log.updatedValue || <span className="text-gray-400">N/A</span>}
                    </TableCell>
                    <TableCell className="max-w-[250px] truncate" title={log.description}>
                      {log.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
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
            <div className="flex items-center space-x-6 lg:space-x-8">
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
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredData.length)} of {filteredData.length}{" "}
            entries
            {selectedRows.length > 0 && (
              <span className="ml-4">
                {selectedRows.length} row{selectedRows.length !== 1 ? "s" : ""} selected
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
