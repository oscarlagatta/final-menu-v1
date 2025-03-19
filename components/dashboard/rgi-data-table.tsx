"use client"

import { useState } from "react"
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


import { Badge } from "@/components/ui/badge"

import { Card, CardContent } from "@/components/ui/card"
import {rgiData} from "@/components/dashboard/data/rgi-data";
import {DataTableFacetedFilter} from "@/components/dashboard/data-table-faceted-filter";
import {DataTableViewOptions} from "@/components/dashboard/data-table-view-options";
import {DataTablePagination} from "@/components/dashboard/data-table-pagination";
import {DataTableColumnHeader} from "@/components/dashboard/data-table-column-header";
import {RGIData} from "@/components/dashboard/types/rgi";




export function RGIDataTable() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState("")

    const columns: ColumnDef<RGIData>[] = [
        {
            accessorKey: "condition",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Condition" />,
            cell: ({ row }) => {
                const condition = row.getValue("condition") as string
                const colorMap: Record<string, string> = {
                    critical: "bg-red-500",
                    high: "bg-orange-500",
                    medium: "bg-blue-500",
                    low: "bg-green-500",
                    none: "bg-gray-300",
                }

                return (
                    <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${colorMap[condition.toLowerCase()]}`} />
                    </div>
                )
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: "id",
            header: ({ column }) => <DataTableColumnHeader column={column} title="RGI ID" />,
            cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
        },
        {
            accessorKey: "title",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
            cell: ({ row }) => <div className="max-w-[300px] truncate font-medium">{row.getValue("title")}</div>,
        },
        {
            accessorKey: "type",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
            cell: ({ row }) => {
                const type = row.original.type
                const subType = row.original.subType

                return (
                    <div className="flex flex-col">
                        <span>{type}</span>
                        <span className="text-xs text-muted-foreground">{subType}</span>
                    </div>
                )
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Status/Stage" />,
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                const stage = row.original.stage

                const getStatusColor = (status: string) => {
                    switch (status.toLowerCase()) {
                        case "cancelled":
                            return "text-red-500"
                        case "backlog":
                            return "text-amber-500"
                        case "closed":
                            return "text-green-500"
                        case "in progress":
                            return "text-blue-500"
                        case "on hold":
                            return "text-purple-500"
                        default:
                            return "text-gray-500"
                    }
                }

                return (
                    <div className="flex flex-col">
                        <span className={getStatusColor(status)}>{status}</span>
                        <span className="text-xs text-muted-foreground">{stage}</span>
                    </div>
                )
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: "nextActionDue",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Next Action Due" />,
            cell: ({ row }) => {
                const daysOverdue = row.original.daysOverdue

                return (
                    <div>
                        {daysOverdue && daysOverdue < 0 ? (
                            <Badge variant="destructive" className="font-mono">
                                {daysOverdue} Days
                            </Badge>
                        ) : null}
                    </div>
                )
            },
        },
        {
            accessorKey: "createdDate",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Created Date" />,
            cell: ({ row }) => <div>{row.getValue("createdDate")}</div>,
        },
        {
            accessorKey: "lastUpdatedDate",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Last Updated Date" />,
            cell: ({ row }) => <div>{row.getValue("lastUpdatedDate")}</div>,
        },
        {
            accessorKey: "deliveryLead",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Delivery Lead" />,
            cell: ({ row }) => <div>{row.getValue("deliveryLead")}</div>,
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <Button variant="outline" size="sm" className="h-8 w-16">
                        View
                    </Button>
                )
            },
        },
    ]

    const table = useReactTable({
        data: rgiData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
    })

    const typeOptions = [
        { label: "Issue", value: "Issue" },
        { label: "Governance & Controls", value: "Governance & Controls" },
        { label: "Gap", value: "Gap" },
        { label: "Improvement", value: "Improvement" },
    ]

    const statusOptions = [
        { label: "Cancelled", value: "Cancelled" },
        { label: "Backlog", value: "Backlog" },
        { label: "Closed", value: "Closed" },
        { label: "In Progress", value: "In Progress" },
        { label: "On Hold", value: "On Hold" },
    ]

    const conditionOptions = [
        { label: "Critical", value: "critical" },
        { label: "High", value: "high" },
        { label: "Medium", value: "medium" },
        { label: "Low", value: "low" },
        { label: "None", value: "none" },
    ]

    const deliveryLeadOptions = [
        { label: "Anderson, Thomas", value: "Anderson, Thomas" },
        { label: "Smith, Emily", value: "Smith, Emily" },
        { label: "Johnson, Michael", value: "Johnson, Michael" },
        { label: "Williams, Sarah", value: "Williams, Sarah" },
        { label: "Brown, David", value: "Brown, David" },
    ]

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search RGI..."
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="pl-8"
                            />
                            {globalFilter && (
                                <Button
                                    variant="ghost"
                                    onClick={() => setGlobalFilter("")}
                                    className="absolute right-0 top-0 h-full px-3"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <div className="flex flex-1 items-center space-x-2">
                            {table.getColumn("type") && (
                                <DataTableFacetedFilter column={table.getColumn("type")} title="Type" options={typeOptions} />
                            )}
                            {table.getColumn("status") && (
                                <DataTableFacetedFilter column={table.getColumn("status")} title="Status" options={statusOptions} />
                            )}
                            {table.getColumn("condition") && (
                                <DataTableFacetedFilter
                                    column={table.getColumn("condition")}
                                    title="Condition"
                                    options={conditionOptions}
                                />
                            )}
                            {table.getColumn("deliveryLead") && (
                                <DataTableFacetedFilter
                                    column={table.getColumn("deliveryLead")}
                                    title="Delivery Lead"
                                    options={deliveryLeadOptions}
                                />
                            )}
                            {columnFilters.length > 0 && (
                                <Button variant="ghost" onClick={() => setColumnFilters([])} className="h-8 px-2 lg:px-3">
                                    Reset Filters
                                    <X className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <DataTableViewOptions table={table} />
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No results found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <DataTablePagination table={table} />
                </div>
            </CardContent>
        </Card>
    )
}

