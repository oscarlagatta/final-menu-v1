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
import { Search, Plus, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DataTablePagination } from "@/features/tags/components/data-table/data-table-pagination"
import { DataTableColumnHeader } from "@/features/tags/components/data-table/data-table-column-header"
import type { TagData } from "@/features/tags/types/tag-data"
import { useToast } from "@/components/ui/use-toast"
import { TagFormSheet } from "./dialogs/view-tag-sheet"

// Dummy data for tags
const tagData: TagData[] = [
  {
    tag: "Tag 1",
    description: "Description for Tag 1",
    aitsInTag: 10,
    status: "Active",
    updatedUser: "User 1",
    updatedDate: "2023-01-01",
  },
  {
    tag: "Tag 2",
    description: "Description for Tag 2",
    aitsInTag: 5,
    status: "Inactive",
    updatedUser: "User 2",
    updatedDate: "2023-02-15",
  },
  {
    tag: "Tag 3",
    description: "Description for Tag 3",
    aitsInTag: 12,
    status: "Active",
    updatedUser: "User 3",
    updatedDate: "2023-03-20",
  },
]

export function TagsContent() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false)
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<TagData | null>(null)
  const { toast } = useToast()

  const columns: ColumnDef<TagData>[] = [
    {
      accessorKey: "tag",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tag" />,
      cell: ({ row }) => <div className="font-medium">{row.getValue("tag")}</div>,
    },
    {
      accessorKey: "description",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
      cell: ({ row }) => <div>{row.getValue("description") || "-"}</div>,
    },
    {
      accessorKey: "aitsInTag",
      header: ({ column }) => <DataTableColumnHeader column={column} title="AITs in Tag" />,
      cell: ({ row }) => <div className="text-center">{row.getValue("aitsInTag")}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-green-600 hover:bg-green-600 text-white border-none">
          {row.getValue("status")}
        </Badge>
      ),
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
            className="h-8 flex items-center"
            onClick={() => handleViewClick(row.original)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
        )
      },
    },
  ]

  const handleViewClick = (tag: TagData) => {
    setSelectedTag(tag)
    setIsViewSheetOpen(true)
  }

  const handleAddTag = async (tag: string, description: string): Promise<void> => {
    // Simulate API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Adding tag: ${tag} with description: ${description}`)
        resolve()
      }, 1000)
    })
  }

  const table = useReactTable({
    data: tagData,
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Tags"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button
          variant="default"
          className="bg-[#00205b] hover:bg-[#00205b]/90 text-white"
          onClick={() => setIsAddSheetOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Tag
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

      {/* Use the TagFormSheet for both adding and viewing/editing */}
      <TagFormSheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen} mode="add" />

      <TagFormSheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen} tag={selectedTag} mode="view" />
    </div>
  )
}

