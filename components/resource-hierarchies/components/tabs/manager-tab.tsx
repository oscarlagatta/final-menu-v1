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
import { AddManagerDialog } from "@/features/resource-hierarchies/components/dialogs/add-manager-dialog"
import { DeleteConfirmationDialog } from "@/features/resource-hierarchies/components/dialogs/delete-confirmation-dialog"
import { managerData } from "@/features/resource-hierarchies/data/manager-data"
import type { ManagerHierarchy } from "@/features/resource-hierarchies/types/manager-hierarchy"
import { useToast } from "@/components/ui/use-toast"

export function ManagerTab() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedManager, setSelectedManager] = useState<ManagerHierarchy | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const columns: ColumnDef<ManagerHierarchy>[] = [
    {
      accessorKey: "nbkId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="NBKID" />,
      cell: ({ row }) => <div className="font-medium">{row.getValue("nbkId")}</div>,
    },
    {
      accessorKey: "manager",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Manager" />,
      cell: ({ row }) => <div className="font-medium">{row.getValue("manager")}</div>,
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

  const handleDeleteClick = (manager: ManagerHierarchy) => {
    setSelectedManager(manager)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedManager) return

    setIsDeleting(true)

    try {
      // In a real application, this would call an API to delete the item
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      console.log(`Deleting manager with ID: ${selectedManager.id} and NBKID: ${selectedManager.nbkId}`)

      toast({
        title: "Manager deleted",
        description: `Manager with NBKID ${selectedManager.nbkId} has been successfully deleted.`,
        variant: "default",
      })

      setIsDeleteDialogOpen(false)
      setSelectedManager(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete manager. Please try again.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleAddManager = async (nbkId: string, manager: string): Promise<void> => {
    // Simulate API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Adding manager: ${manager} with NBKID: ${nbkId}`)
        resolve()
      }, 1000)
    })
  }

  const table = useReactTable({
    data: managerData,
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
            placeholder="Search Manager"
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
          Add Manager
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

      <AddManagerDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={handleAddManager} />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Manager"
        description={`Are you sure you want to delete the manager "${selectedManager?.manager}" with NBKID "${selectedManager?.nbkId}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  )
}

