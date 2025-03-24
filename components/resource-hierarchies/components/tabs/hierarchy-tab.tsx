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
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DataTablePagination } from "@/features/resource-hierarchies/components/data-table/data-table-pagination"
import { DataTableColumnHeader } from "@/features/resource-hierarchies/components/data-table/data-table-column-header"
import { AddResourceHierarchyDialog } from "@/features/resource-hierarchies/components/dialogs/add-resource-hierarchy-dialog"
import { DeleteConfirmationDialog } from "@/features/resource-hierarchies/components/dialogs/delete-confirmation-dialog"
import { hierarchyData } from "@/features/resource-hierarchies/data/hierarchy-data"
import type { ResourceHierarchy } from "@/features/resource-hierarchies/types/resource-hierarchy"
import { useToast } from "@/components/ui/use-toast"

export function HierarchyTab() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedHierarchy, setSelectedHierarchy] = useState<ResourceHierarchy | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const columns: ColumnDef<ResourceHierarchy>[] = [
    {
      accessorKey: "hierarchy",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Hierarchy" />,
      cell: ({ row }) => <div className="font-medium">{row.getValue("hierarchy")}</div>,
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
            onClick={() => handleDeleteClick(row.original)}
          >
            Delete
          </Button>
        )
      },
    },
  ]

  const handleDeleteClick = (hierarchy: ResourceHierarchy) => {
    setSelectedHierarchy(hierarchy)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedHierarchy) return

    setIsDeleting(true)

    try {
      // In a real application, this would call an API to delete the item
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      console.log(`Deleting hierarchy with ID: ${selectedHierarchy.id}`)

      toast({
        title: "Hierarchy deleted",
        description: `Hierarchy "${selectedHierarchy.hierarchy}" has been successfully deleted.`,
        variant: "default",
      })

      setIsDeleteDialogOpen(false)
      setSelectedHierarchy(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete hierarchy. Please try again.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleAdd = async (hierarchy: string): Promise<void> => {
    // Simulate API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Adding hierarchy: ${hierarchy}`)
        resolve()
      }, 1000)
    })
  }

  const table = useReactTable({
    data: hierarchyData,
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
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Hierarchy"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button
          variant="default"
          className="bg-[#00205b] hover:bg-[#00205b]/90 text-white"
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add Hierarchy
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

      <AddResourceHierarchyDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={handleAdd} />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Hierarchy"
        description={`Are you sure you want to delete the hierarchy "${selectedHierarchy?.hierarchy}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  )
}

