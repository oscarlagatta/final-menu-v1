"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Info, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { useToast } from "@/components/ui/use-toast"
import {AitData} from "@/components/import-application/types/ait-data";
import {DataTableColumnHeader} from "@/components/import-application/components/data-table/data-table-column-header";
import {aitData} from "@/components/import-application/data/ait-data";
import {DataTablePagination} from "@/components/import-application/components/data-table/data-table-pagination";
import {ImportAitSheet} from "@/components/import-application/components/sheets/import-ait-sheet";

export function ImportAitTab() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { toast } = useToast()

  const columns: ColumnDef<AitData>[] = [
    {
      accessorKey: "aitNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="AIT Number" />,
      cell: ({ row }) => <div className="font-medium">{row.getValue("aitNumber")}</div>,
    },
    {
      accessorKey: "applicationName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Application Name" />,
      cell: ({ row }) => <div className="font-medium">{row.getValue("applicationName")}</div>,
    },
    {
      accessorKey: "updatedUser",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Updated User" />,
      cell: ({ row }) => <div>{row.getValue("updatedUser")}</div>,
    },
    {
      accessorKey: "updatedDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Updated Date" />,
      cell: ({ row }) => <div>{row.getValue("updatedDate")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => handleDelete(row.original.id, row.original.aitNumber)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )
      },
    },
  ]

  const handleDelete = (id: string, aitNumber: string) => {
    // In a real application, this would call an API to delete the item
    console.log(`Deleting AIT with ID: ${id}`)

    toast({
      title: "AIT Number deleted",
      description: `AIT Number ${aitNumber} has been successfully deleted.`,
      variant: "default",
    })
  }

  const handleImport = async (aitNumber: string, applicationName: string): Promise<void> => {
    // Simulate API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Importing AIT Number: ${aitNumber} for application: ${applicationName}`)
        resolve()
      }, 1000)
    })
  }

  const table = useReactTable({
    data: aitData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  })

  return (
    <div className="space-y-4 mt-4">
      <Alert variant="default" className="bg-muted border-muted-foreground/20">
        <Info className="h-4 w-4" />
        <AlertDescription>
          If a user un-imports or deletes data associated with an AIT or application hierarchy, all metadata will be
          deleted after 90 days unless the AIT or application hierarchy is reimported.
        </AlertDescription>
      </Alert>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search AIT Number"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="default" className="bg-primary text-primary-foreground" onClick={() => setIsSheetOpen(true)}>
          Import AIT Number
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
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

      <ImportAitSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} onImport={handleImport} />
    </div>
  )
}

