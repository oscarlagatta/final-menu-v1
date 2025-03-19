"use client"

import * as React from "react"
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
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Filter,
    Mail,
    Pencil,
    SortAsc,
    SortDesc,
    Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

// Define the data type for our resources
type Resource = {
    id: string
    name: string
    applicationId: string
    application: string
    manager: string
    managerSecondary?: string
    portfolio?: string
    team?: string
    resourceFunction?: string
}

// Sample data with fictional names
const data: Resource[] = [
    {
        id: "1",
        name: "Smith, John R.",
        applicationId: "30787",
        application: "Navigator Analytics",
        manager: "Johnson, Emily K.",
        managerSecondary: "Williams, Robert",
        portfolio: "WCBT",
        team: "Sales Applications",
    },
    {
        id: "2",
        name: "Smith, John R.",
        applicationId: "46236",
        application: "GCB Navigator Profitability",
        manager: "Johnson, Emily K.",
        managerSecondary: "Williams, Robert",
        portfolio: "WCBT",
        team: "Sales Applications",
    },
    {
        id: "3",
        name: "Smith, John R.",
        applicationId: "24561",
        application: "Sales Data Warehouse",
        manager: "Johnson, Emily K.",
        managerSecondary: "Williams, Robert",
        portfolio: "WCBT",
        team: "Sales Applications",
    },
    {
        id: "4",
        name: "Smith, John R.",
        applicationId: "49294",
        application: "GCB Navigator BBS",
        manager: "Johnson, Emily K.",
        managerSecondary: "Williams, Robert",
        portfolio: "WCBT",
        team: "Sales Applications",
    },
    {
        id: "5",
        name: "Smith, John R.",
        applicationId: "25286",
        application: "Sales and Performance Rep...",
        manager: "Johnson, Emily K.",
        managerSecondary: "Williams, Robert",
        portfolio: "WCBT",
        team: "Sales Applications",
    },
    {
        id: "6",
        name: "Smith, John R.",
        applicationId: "43679",
        application: "Navigator Pipeline",
        manager: "Johnson, Emily K.",
        managerSecondary: "Williams, Robert",
        portfolio: "WCBT",
        team: "Sales Applications",
        resourceFunction: "L1 Support",
    },
    {
        id: "7",
        name: "Smith, John R.",
        applicationId: "43269",
        application: "Navigator Client",
        manager: "Johnson, Emily K.",
        managerSecondary: "Williams, Robert",
        portfolio: "WCBT",
        team: "Sales Applications",
    },
    {
        id: "8",
        name: "Smith, John R.",
        applicationId: "43209",
        application: "GDH Warehouse",
        manager: "Johnson, Emily K.",
        managerSecondary: "Williams, Robert",
        portfolio: "WCBT",
        team: "Sales Applications",
    },
    {
        id: "9",
        name: "Brown, Michael T.",
        applicationId: "18868",
        application: "Mark to Market Assessmen...",
        manager: "Davis, Sarah L.",
        managerSecondary: "Davis, Sarah L.",
        portfolio: "WCBT",
        team: "Underwriting",
    },
    {
        id: "10",
        name: "Brown, Michael T.",
        applicationId: "1103",
        application: "Global Monitoring Solution",
        manager: "Davis, Sarah L.",
        managerSecondary: "Davis, Sarah L.",
        portfolio: "WCBT",
        team: "Underwriting",
    },
    {
        id: "11",
        name: "Brown, Michael T.",
        applicationId: "1141",
        application: "Compliance Tracking Syste...",
        manager: "Davis, Sarah L.",
        managerSecondary: "Davis, Sarah L.",
        portfolio: "WCBT",
        team: "Underwriting",
    },
    {
        id: "12",
        name: "Brown, Michael T.",
        applicationId: "62546",
        application: "CreditToolkit",
        manager: "Davis, Sarah L.",
        managerSecondary: "Davis, Sarah L.",
        portfolio: "WCBT",
        team: "Underwriting",
    },
    {
        id: "13",
        name: "Brown, Michael T.",
        applicationId: "13373",
        application: "Warehouse Tracking System",
        manager: "Davis, Sarah L.",
        managerSecondary: "Davis, Sarah L.",
        portfolio: "WCBT",
        team: "Underwriting",
    },
    {
        id: "14",
        name: "Brown, Michael T.",
        applicationId: "8761",
        application: "Global Underwriting Solution",
        manager: "Davis, Sarah L.",
        managerSecondary: "Davis, Sarah L.",
        portfolio: "WCBT",
        team: "Underwriting",
    },
    {
        id: "15",
        name: "Brown, Michael T.",
        applicationId: "72335",
        application: "Video & Broadcast storage",
        manager: "Davis, Sarah L.",
        managerSecondary: "Davis, Sarah L.",
        portfolio: "WCBT",
    },
    {
        id: "16",
        name: "Garcia, Maria C.",
        applicationId: "59656",
        application: "Document Management Po...",
        manager: "Wilson, Thomas J.",
        managerSecondary: "Miller, Jennifer A.",
    },
    {
        id: "17",
        name: "Garcia, Maria C.",
        applicationId: "60697",
        application: "Data Transaction Services Tr...",
        manager: "Wilson, Thomas J.",
        managerSecondary: "Miller, Jennifer A.",
        portfolio: "Payments Services",
        team: "DTS Service Integration",
    },
    {
        id: "18",
        name: "Smith, John R.",
        applicationId: "44390",
        application: "Navigator Dashboards",
        manager: "Johnson, Emily K.",
        managerSecondary: "Williams, Robert",
        portfolio: "WCBT",
        team: "Sales Applications",
    },
    {
        id: "19",
        name: "Brown, Michael T.",
        applicationId: "60196",
        application: "Credit Monitoring and Und...",
        manager: "Davis, Sarah L.",
        managerSecondary: "Davis, Sarah L.",
        portfolio: "WCBT",
        team: "Underwriting",
    },
    {
        id: "20",
        name: "Garcia, Maria C.",
        applicationId: "67356",
        application: "SecureWrite",
        manager: "Wilson, Thomas J.",
        managerSecondary: "Miller, Jennifer A.",
        portfolio: "Payments Services",
        team: "DTS Service Integration",
    },
]

// Define form validation schema
const formSchema = z
    .object({
        function: z.string({
            required_error: "Please select a function",
        }),
        allocatedToApplication: z.coerce.number().min(0, "Must be at least 0").max(100, "Must be at most 100"),
        allocatedToIncident: z.coerce.number().min(0, "Must be at least 0").max(100, "Must be at most 100"),
        allocatedToProblem: z.coerce.number().min(0, "Must be at least 0").max(100, "Must be at most 100"),
        allocatedToChangeRelease: z.coerce.number().min(0, "Must be at least 0").max(100, "Must be at most 100"),
        allocatedToOther: z.coerce.number().min(0, "Must be at least 0").max(100, "Must be at most 100"),
    })
    .refine(
        (data) => {
            const sum =
                data.allocatedToApplication +
                data.allocatedToIncident +
                data.allocatedToProblem +
                data.allocatedToChangeRelease +
                data.allocatedToOther
            return Math.round(sum) === 100
        },
        {
            message: "Percentages must sum to 100%",
            path: ["allocatedToApplication"],
        },
    )

export default function ResourceList() {
    const [selectedResource, setSelectedResource] = React.useState<Resource | null>(null)
    const [isEditSheetOpen, setIsEditSheetOpen] = React.useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
    const [globalFilter, setGlobalFilter] = React.useState("")

    // Initialize form with react-hook-form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            function: "",
            allocatedToApplication: 2,
            allocatedToIncident: 1,
            allocatedToProblem: 0,
            allocatedToChangeRelease: 0,
            allocatedToOther: 97,
        },
    })

    const handleEditClick = (resource: Resource) => {
        setSelectedResource(resource)

        // Reset form with default values
        form.reset({
            function: resource.resourceFunction || "",
            allocatedToApplication: 2,
            allocatedToIncident: 1,
            allocatedToProblem: 0,
            allocatedToChangeRelease: 0,
            allocatedToOther: 97,
        })

        setIsEditSheetOpen(true)
    }

    const handleDeleteClick = (resource: Resource) => {
        setSelectedResource(resource)
        setIsDeleteDialogOpen(true)
    }

    const handleSave = (values: z.infer<typeof formSchema>) => {
        // Here you would implement the save logic
        console.log("Saving resource:", selectedResource)
        console.log("Form data:", values)

        toast({
            title: "Resource updated",
            description: `${selectedResource?.name} has been updated successfully.`,
        })

        setIsEditSheetOpen(false)
    }

    const handleDelete = () => {
        // Here you would implement the delete logic
        console.log("Deleting resource:", selectedResource)

        toast({
            title: "Resource deleted",
            description: `${selectedResource?.name} has been deleted.`,
            variant: "destructive",
        })

        setIsDeleteDialogOpen(false)
    }

    // Define columns for the data table
    const columns: ColumnDef<Resource>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <div className="flex items-center space-x-1">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        <span>Name</span>
                        {column.getIsSorted() === "asc" ? (
                            <SortAsc className="ml-1 h-4 w-4" />
                        ) : column.getIsSorted() === "desc" ? (
                            <SortDesc className="ml-1 h-4 w-4" />
                        ) : null}
                    </Button>
                    <ColumnFilterDropdown column={column} title="Name" />
                </div>
            ),
            cell: ({ row }) => <div>{row.getValue("name")}</div>,
            filterFn: (row, id, value) => {
                return row.getValue(id).toLowerCase().includes(value.toLowerCase())
            },
        },
        {
            accessorKey: "applicationId",
            header: ({ column }) => (
                <div className="flex items-center space-x-1">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        <span>Application Id</span>
                        {column.getIsSorted() === "asc" ? (
                            <SortAsc className="ml-1 h-4 w-4" />
                        ) : column.getIsSorted() === "desc" ? (
                            <SortDesc className="ml-1 h-4 w-4" />
                        ) : null}
                    </Button>
                    <ColumnFilterDropdown column={column} title="Application Id" />
                </div>
            ),
            cell: ({ row }) => <div>{row.getValue("applicationId")}</div>,
            filterFn: (row, id, value) => {
                return row.getValue(id).toLowerCase().includes(value.toLowerCase())
            },
        },
        {
            accessorKey: "application",
            header: ({ column }) => (
                <div className="flex items-center space-x-1">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        <span>Application</span>
                        {column.getIsSorted() === "asc" ? (
                            <SortAsc className="ml-1 h-4 w-4" />
                        ) : column.getIsSorted() === "desc" ? (
                            <SortDesc className="ml-1 h-4 w-4" />
                        ) : null}
                    </Button>
                    <ColumnFilterDropdown column={column} title="Application" />
                </div>
            ),
            cell: ({ row }) => <div>{row.getValue("application")}</div>,
            filterFn: (row, id, value) => {
                return row.getValue(id).toLowerCase().includes(value.toLowerCase())
            },
        },
        {
            accessorKey: "manager",
            header: ({ column }) => (
                <div className="flex items-center space-x-1">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        <span>Manager/ Four-Dot Ma...</span>
                        {column.getIsSorted() === "asc" ? (
                            <SortAsc className="ml-1 h-4 w-4" />
                        ) : column.getIsSorted() === "desc" ? (
                            <SortDesc className="ml-1 h-4 w-4" />
                        ) : null}
                    </Button>
                    <ColumnFilterDropdown column={column} title="Manager" />
                </div>
            ),
            cell: ({ row }) => (
                <div>
                    <div>{row.getValue("manager")}</div>
                    {row.original.managerSecondary && <div>{row.original.managerSecondary}</div>}
                </div>
            ),
            filterFn: (row, id, value) => {
                return row.getValue(id).toLowerCase().includes(value.toLowerCase())
            },
        },
        {
            accessorKey: "portfolio",
            header: ({ column }) => (
                <div className="flex items-center space-x-1">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        <span>Portfolio/Team</span>
                        {column.getIsSorted() === "asc" ? (
                            <SortAsc className="ml-1 h-4 w-4" />
                        ) : column.getIsSorted() === "desc" ? (
                            <SortDesc className="ml-1 h-4 w-4" />
                        ) : null}
                    </Button>
                    <ColumnFilterDropdown column={column} title="Portfolio" />
                </div>
            ),
            cell: ({ row }) => (
                <div>
                    {row.original.portfolio && <div>{row.original.portfolio}</div>}
                    {row.original.team && <div>{row.original.team}</div>}
                </div>
            ),
            filterFn: (row, id, value) => {
                return row.getValue(id).toLowerCase().includes(value.toLowerCase())
            },
        },
        {
            accessorKey: "resourceFunction",
            header: ({ column }) => (
                <div className="flex items-center space-x-1">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        <span>Resource Function</span>
                        {column.getIsSorted() === "asc" ? (
                            <SortAsc className="ml-1 h-4 w-4" />
                        ) : column.getIsSorted() === "desc" ? (
                            <SortDesc className="ml-1 h-4 w-4" />
                        ) : null}
                    </Button>
                    <ColumnFilterDropdown column={column} title="Function" />
                </div>
            ),
            cell: ({ row }) => <div>{row.original.resourceFunction || ""}</div>,
            filterFn: (row, id, value) => {
                const resourceFunction = row.original.resourceFunction || ""
                return resourceFunction.toLowerCase().includes(value.toLowerCase())
            },
        },
        {
            id: "actions",
            header: "Action",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(row.original)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteClick(row.original)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
        },
    ]

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [pageSize, setPageSize] = React.useState(20)
    const [pageIndex, setPageIndex] = React.useState(0)

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
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
            pagination: {
                pageIndex,
                pageSize,
            },
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    })

    // Set initial page size
    React.useEffect(() => {
        table.setPageSize(20)
    }, [table])

    // Column filter dropdown component
    function ColumnFilterDropdown({ column, title }: { column: any; title: string }) {
        const [open, setOpen] = React.useState(false)
        const [value, setValue] = React.useState("")

        const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setValue(e.target.value)
            column.setFilterValue(e.target.value)
        }

        const clearFilter = () => {
            setValue("")
            column.setFilterValue("")
            setOpen(false)
        }

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Filter className="h-3 w-3" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60 p-2" align="start">
                    <div className="space-y-2">
                        <h4 className="font-medium">Filter {title}</h4>
                        <Input
                            placeholder={`Filter ${title.toLowerCase()}...`}
                            value={value}
                            onChange={handleFilterChange}
                            className="h-8"
                        />
                        <div className="flex justify-between">
                            <Button variant="outline" size="sm" onClick={clearFilter}>
                                Clear
                            </Button>
                            <Button size="sm" onClick={() => setOpen(false)}>
                                Apply
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        )
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Resource List</h1>
                <Button className="bg-blue-900 hover:bg-blue-800">Export Resource</Button>
            </div>

            <div className="space-y-2 mb-4">
                <Alert className="bg-red-100 border-red-200 text-red-800">
                    <AlertDescription>Resource has been terminated</AlertDescription>
                </Alert>
                <Alert className="bg-amber-100 border-amber-200 text-amber-800">
                    <AlertDescription>Resource is not aligned to a BPS hierarchy or management chain</AlertDescription>
                </Alert>
            </div>

            <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search all columns..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-sm"
                    />
                    <Button variant="outline" onClick={() => setGlobalFilter("")} className="h-10">
                        Reset
                    </Button>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id === "manager"
                                            ? "Manager"
                                            : column.id === "resourceFunction"
                                                ? "Resource Function"
                                                : column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="bg-gray-50">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Page Size:</p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">
                            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                            {Math.min(
                                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                table.getFilteredRowModel().rows.length,
                            )}{" "}
                            of {table.getFilteredRowModel().rows.length}
                        </p>
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
                        <div className="flex items-center">
              <span className="text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
                        </div>
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

            {/* Edit Resource Sheet */}
            <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
                <SheetContent className="sm:max-w-md">
                    <SheetHeader className="border-b pb-4">
                        <SheetTitle>Edit App Resource</SheetTitle>
                    </SheetHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6 py-6">
                            <div className="space-y-2">
                                <Label>Application</Label>
                                <div className="bg-gray-100 p-2 rounded-md">{selectedResource?.application}</div>
                            </div>

                            <div className="space-y-2">
                                <Label>Resource</Label>
                                <div className="bg-gray-100 p-2 rounded-md">{selectedResource?.name}</div>
                            </div>

                            <FormField
                                control={form.control}
                                name="function"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Function</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Function" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="l1-support">L1 Support</SelectItem>
                                                <SelectItem value="l2-support">L2 Support</SelectItem>
                                                <SelectItem value="development">Development</SelectItem>
                                                <SelectItem value="testing">Testing</SelectItem>
                                                <SelectItem value="management">Management</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="allocatedToApplication"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>% Allocated to Application</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="allocatedToIncident"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>% Allocated to Incident</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="allocatedToProblem"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>% Allocated to Problem</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="allocatedToChangeRelease"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>% Allocated to Change/Release</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="allocatedToOther"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>% Allocated to Other (Not Listed)</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <SheetFooter className="flex justify-end space-x-2 border-t pt-4">
                                <SheetClose asChild>
                                    <Button variant="outline" type="button">
                                        Cancel
                                    </Button>
                                </SheetClose>
                                <Button className="bg-blue-900 hover:bg-blue-800" type="submit">
                                    Save
                                </Button>
                            </SheetFooter>
                        </form>
                    </Form>
                </SheetContent>
            </Sheet>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Resource</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this resource? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm font-medium">Resource: {selectedResource?.name}</p>
                        <p className="text-sm font-medium">Application: {selectedResource?.application}</p>
                    </div>
                    <DialogFooter className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

