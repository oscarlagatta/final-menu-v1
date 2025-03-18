"use client"

import { useState, useEffect, useRef } from "react"
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type PaginationState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onRowSelectionChange?: (selectedRowIds: string[]) => void
    pageSize?: number
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             onRowSelectionChange,
                                             pageSize = 10,
                                         }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = useState({})
    const [columnResizeMode, setColumnResizeMode] = useState<"onChange" | "onEnd">("onChange")
    const [columnSizing, setColumnSizing] = useState({})
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: pageSize,
    })

    // Use a ref to track previous selection to avoid unnecessary updates
    const prevSelectionRef = useRef<Record<string, boolean>>({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        columnResizeMode,
        onColumnSizingChange: setColumnSizing,
        state: {
            sorting,
            rowSelection,
            columnFilters,
            columnSizing,
            pagination,
        },
        enableColumnResizing: true,
        defaultColumn: {
            minSize: 40,
            maxSize: 500,
        },
    })

    // Use useEffect to notify parent component of selection changes
    useEffect(() => {
        // Only notify parent if selection has actually changed
        if (onRowSelectionChange && !areSelectionsEqual(prevSelectionRef.current, rowSelection)) {
            const selectedRows = Object.keys(rowSelection)
            onRowSelectionChange(selectedRows)
            // Update the previous selection ref
            prevSelectionRef.current = { ...rowSelection }
        }
    }, [rowSelection, onRowSelectionChange])

    // Helper function to compare selections
    function areSelectionsEqual(prev: Record<string, boolean>, current: Record<string, boolean>) {
        const prevKeys = Object.keys(prev)
        const currentKeys = Object.keys(current)

        if (prevKeys.length !== currentKeys.length) return false

        return prevKeys.every((key) => prev[key] === current[key])
    }

    return (
        <div className="w-full">
            {/* Filter inputs */}
            <div className="flex flex-wrap gap-2 py-4">
                <Input
                    placeholder="Filter Exception ID..."
                    value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("id")?.setFilterValue(event.target.value)}
                    className="max-w-sm h-8 text-sm"
                />
                <Input
                    placeholder="Filter App ID..."
                    value={(table.getColumn("appId")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("appId")?.setFilterValue(event.target.value)}
                    className="max-w-sm h-8 text-sm"
                />
            </div>

            <div className="rounded-md border w-full overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <Table className="w-full">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="h-9 bg-gray-50">
                                    {headerGroup.headers.map((header) => {
                                        // Set initial width based on column type
                                        // let initialWidth = 150
                                        // if (header.id === "select") initialWidth = 40
                                        // else if (header.id === "actions") initialWidth = 120
                                        // else if (header.column.id === "id") initialWidth = 120
                                        // else if (header.column.id === "appId") initialWidth = 80
                                        // else if (header.column.id === "ucal") initialWidth = 60
                                        // else if (header.column.id === "status") initialWidth = 100
                                        // else if (header.column.id === "exceptionDetail" || header.column.id === "l2Comments")
                                        //   initialWidth = 200

                                        return (
                                            <TableHead
                                                key={header.id}
                                                className="py-2 px-3 h-9 relative"
                                                style={{
                                                    width: header.getSize(),
                                                }}
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        className={`${header.column.getCanSort() ? "cursor-pointer select-none" : ""} flex items-center overflow-hidden`}
                                                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                                        title={
                                                            typeof header.column.columnDef.header === "string" ? header.column.columnDef.header : ""
                                                        }
                                                    >
                            <span className="truncate">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </span>
                                                        {{
                                                                asc: <ArrowUp className="ml-1 h-4 w-4 flex-shrink-0" />,
                                                                desc: <ArrowDown className="ml-1 h-4 w-4 flex-shrink-0" />,
                                                            }[header.column.getIsSorted() as string] ??
                                                            (header.column.getCanSort() ? (
                                                                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50 flex-shrink-0" />
                                                            ) : null)}
                                                    </div>
                                                )}
                                                {header.column.getCanResize() && (
                                                    <div
                                                        onMouseDown={header.getResizeHandler()}
                                                        onTouchStart={header.getResizeHandler()}
                                                        className={`absolute right-0 top-0 h-full w-1 bg-gray-300 cursor-col-resize select-none touch-none ${
                                                            header.column.getIsResizing() ? "bg-blue-500 opacity-100" : "opacity-0 hover:opacity-100"
                                                        }`}
                                                    />
                                                )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row, index) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className={`h-10 ${index % 2 === 0 ? "bg-gray-50" : ""} hover:bg-gray-100`}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="py-1.5 px-3 overflow-hidden text-ellipsis"
                                                style={{
                                                    width: cell.column.getSize(),
                                                }}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
                    selected.
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to first page</span>
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to last page</span>
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Optional: Add a note about column resizing */}
            <div className="text-xs text-gray-500 mt-2">Tip: Drag the edge of column headers to resize columns.</div>
        </div>
    )
}

