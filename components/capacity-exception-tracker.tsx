"use client"

import { useState, useRef } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { EditExceptionForm } from "./edit-exception-form"
import { Badge } from "@/components/ui/badge"
import { DownloadIcon, FileUpIcon, FilterX, PlusCircle, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "./data-table"
import type { ColumnDef } from "@tanstack/react-table"

// Define types
type ExceptionStatus = "Open" | "In Progress" | "Assigned" | "Closed"
type CapacityType = "FileSystem" | "CPU" | "Memory"
type UCALLevel = "High" | "Medium" | "Low"

interface CapacityException {
    id: string
    portfolio: string
    appId: string
    ucal: UCALLevel
    capacityType: CapacityType
    exceptionDetail: string
    firstReported: string
    status: ExceptionStatus
    pbiPke: string
    nextSteps: string
    fixTargetDate: string
    l2Name: string
    l2Comments: string
}

export default function CapacityExceptionTracker() {
    const [selectedException, setSelectedException] = useState<CapacityException | null>(null)
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
    // Use a ref instead of state for selected rows to avoid re-renders
    const selectedRowsRef = useRef<string[]>([])

    // Sample data based on the image
    const exceptions: CapacityException[] = [
        {
            id: "EMEA001",
            portfolio: "EMEA - Team A",
            appId: "22506",
            ucal: "High",
            capacityType: "FileSystem",
            exceptionDetail: "4 servers Filesystem exceptions",
            firstReported: "Apr-2023",
            status: "Open",
            pbiPke: "PBI000000905329, PKE000000823118",
            nextSteps: "",
            fixTargetDate: "Jan-2024",
            l2Name: "Ahmed, Irfan",
            l2Comments: "4 servers Filesystem exceptions",
        },
        {
            id: "EMEA002",
            portfolio: "EMEA - Team A",
            appId: "35418",
            ucal: "High",
            capacityType: "FileSystem",
            exceptionDetail: "1 server filesystem exceptions",
            firstReported: "Aug-2023",
            status: "Assigned",
            pbiPke: "PBI000000946622 || PKE Assigned",
            nextSteps: "Increase disk space",
            fixTargetDate: "Apr-2024",
            l2Name: "Narra, Venkateshwar",
            l2Comments: "1 server filesystem exceptions",
        },
        {
            id: "EMEA003",
            portfolio: "EMEA - Team A",
            appId: "35424",
            ucal: "High",
            capacityType: "FileSystem",
            exceptionDetail: "1 server filesystem exceptions",
            firstReported: "Nov-2023",
            status: "Assigned",
            pbiPke: "PBI000000946622 || PKE Assigned",
            nextSteps: "Increase disk space",
            fixTargetDate: "Apr-2024",
            l2Name: "Shah, Prerana P.",
            l2Comments: "1 server filesystem exceptions",
        },
        {
            id: "EMEA004",
            portfolio: "EMEA - Team A",
            appId: "577",
            ucal: "High",
            capacityType: "CPU",
            exceptionDetail: "3 servers CPU exceptions",
            firstReported: "Oct-2023",
            status: "Assigned",
            pbiPke: "PKE000000823839 Assigned",
            nextSteps: "",
            fixTargetDate: "May-2024",
            l2Name: "Shah, Prerana P.",
            l2Comments: "3 servers CPU exceptions",
        },
        {
            id: "EMEA005",
            portfolio: "EMEA - Team A",
            appId: "551",
            ucal: "High",
            capacityType: "CPU",
            exceptionDetail: "2 shared Citrix Server CPU exceptions",
            firstReported: "Sept-2023",
            status: "Assigned",
            pbiPke: "PBI000000965079 || PKE Assigned",
            nextSteps: "CPU increase",
            fixTargetDate: "May-2024",
            l2Name: "Watkins, John",
            l2Comments: "2 shared Citrix Server CPU exceptions",
        },
        {
            id: "EMEA006",
            portfolio: "APAC",
            appId: "23069",
            ucal: "High",
            capacityType: "CPU",
            exceptionDetail: "2 shared Citrix Server CPU exceptions",
            firstReported: "Sept-2023",
            status: "Assigned",
            pbiPke: "PBI000000965079 || PKE Assigned",
            nextSteps: "CPU increase",
            fixTargetDate: "May-2024",
            l2Name: "Shah, Prerana P.",
            l2Comments: "2 shared Citrix Server CPU exceptions",
        },
        {
            id: "EMEA007",
            portfolio: "EMEA - Team A",
            appId: "23193",
            ucal: "High",
            capacityType: "CPU",
            exceptionDetail: "2 shared Citrix Server CPU exceptions",
            firstReported: "Sept-2023",
            status: "Assigned",
            pbiPke: "PBI000000965079 || PKE Assigned",
            nextSteps: "CPU increase",
            fixTargetDate: "May-2024",
            l2Name: "Shah, Prerana P.",
            l2Comments: "2 shared Citrix Server CPU exceptions",
        },
        {
            id: "EMEA008",
            portfolio: "EMEA - Team A",
            appId: "23229",
            ucal: "High",
            capacityType: "CPU",
            exceptionDetail: "2 shared Citrix Server CPU exceptions",
            firstReported: "Sept-2023",
            status: "Assigned",
            pbiPke: "PBI000000965079 || PKE Assigned",
            nextSteps: "CPU increase",
            fixTargetDate: "May-2024",
            l2Name: "Shah, Prerana P.",
            l2Comments: "2 shared Citrix Server CPU exceptions",
        },
        {
            id: "EMEA009",
            portfolio: "EMEA - Team A",
            appId: "23232",
            ucal: "High",
            capacityType: "CPU",
            exceptionDetail: "2 shared Citrix Server CPU exceptions",
            firstReported: "Sept-2023",
            status: "Assigned",
            pbiPke: "PBI000000965079 || PKE Assigned",
            nextSteps: "CPU increase",
            fixTargetDate: "May-2024",
            l2Name: "Shah, Prerana P.",
            l2Comments: "2 shared Citrix Server CPU exceptions",
        },
        {
            id: "EMEA011",
            portfolio: "EMEA - Team A",
            appId: "61115",
            ucal: "High",
            capacityType: "CPU",
            exceptionDetail: "2 shared Citrix Server CPU exceptions",
            firstReported: "Sept-2023",
            status: "Assigned",
            pbiPke: "PBI000000965079 || PKE Assigned",
            nextSteps: "CPU increase",
            fixTargetDate: "May-2024",
            l2Name: "Shah, Prerana P.",
            l2Comments: "2 shared Citrix Server CPU exceptions",
        },
        {
            id: "EMEA012",
            portfolio: "EMEA - Team B",
            appId: "72023",
            ucal: "High",
            capacityType: "CPU",
            exceptionDetail: "1 server CPU exceptions",
            firstReported: "Jul-2023",
            status: "Assigned",
            pbiPke: "PBI000000927592 || PKE Assigned",
            nextSteps: "Code changes",
            fixTargetDate: "May-2024",
            l2Name: "Kalahatina, Venkat",
            l2Comments: "1 server CPU exceptions",
        },
        {
            id: "EMEA013",
            portfolio: "EMEA - Team A",
            appId: "47072",
            ucal: "High",
            capacityType: "FileSystem",
            exceptionDetail: "1 server filesystem exceptions",
            firstReported: "Aug-2023",
            status: "Assigned",
            pbiPke: "PKE000000825435 Assigned",
            nextSteps: "",
            fixTargetDate: "Jun-2024",
            l2Name: "Waghmare, Sumit",
            l2Comments: "1 server filesystem exceptions",
        },
        {
            id: "EMEA014",
            portfolio: "EMEA - Team A",
            appId: "538",
            ucal: "High",
            capacityType: "FileSystem",
            exceptionDetail: "1 server FileSystem exceptions",
            firstReported: "Aug-2022",
            status: "Closed",
            pbiPke: "PKE000000842794 Closed",
            nextSteps: "Windows team update",
            fixTargetDate: "Nov-2022",
            l2Name: "Sedgwick, Robert",
            l2Comments: "1 server FileSystem exceptions",
        },
        {
            id: "EMEA015",
            portfolio: "EMEA - Team A",
            appId: "538",
            ucal: "High",
            capacityType: "FileSystem",
            exceptionDetail: "96% utilization on WCAM12995",
            firstReported: "Mar-2023",
            status: "Closed",
            pbiPke: "PKE000000739858 Closed",
            nextSteps: "NFT remediation",
            fixTargetDate: "Jan-1970",
            l2Name: "Sedgwick, Robert",
            l2Comments: "96% utilization on WCAM12995",
        },
        {
            id: "EMEA016",
            portfolio: "EMEA - Team A",
            appId: "22970",
            ucal: "High",
            capacityType: "Memory",
            exceptionDetail: "1 server Memory exceptions",
            firstReported: "Aug-2022",
            status: "Closed",
            pbiPke: "PBI000000844450 || PKE Closed",
            nextSteps: "Memory increase",
            fixTargetDate: "Jan-1970",
            l2Name: "Ashokan, Arun",
            l2Comments: "1 server Memory exceptions",
        },
    ]

    const handleEdit = (exception: CapacityException) => {
        setSelectedException(exception)
        setIsEditSheetOpen(true)
    }

    const handleSave = (updatedException: CapacityException) => {
        // In a real app, you would update the data here
        console.log("Saving updated exception:", updatedException)
        setIsEditSheetOpen(false)
    }

    // Handle row selection changes without causing re-renders
    const handleRowSelectionChange = (rows: string[]) => {
        selectedRowsRef.current = rows
    }

    const getUcalBadge = (level: UCALLevel) => {
        const colorMap = {
            High: "bg-red-500 hover:bg-red-600",
            Medium: "bg-orange-500 hover:bg-orange-600",
            Low: "bg-green-500 hover:bg-green-600",
        }

        return <Badge className={`${colorMap[level]} text-white text-xs py-0.5 px-1.5`}>{level.charAt(0)}</Badge>
    }

    const columns: ColumnDef<CapacityException>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="h-4 w-4"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="h-4 w-4"
                />
            ),
            enableSorting: false,
            enableHiding: false,
            enableResizing: false,
            size: 40,
        },
        {
            accessorKey: "id",
            header: "Exception ID",
            cell: ({ row }) => <div className="text-sm font-medium">{row.getValue("id")}</div>,
            enableSorting: true,
            enableColumnFilter: true,
            enableResizing: true,
            size: 120,
        },
        {
            accessorKey: "portfolio",
            header: "Portfolio",
            cell: ({ row }) => <div className="text-sm">{row.getValue("portfolio")}</div>,
            enableSorting: true,
            enableResizing: true,
            size: 150,
        },
        {
            accessorKey: "appId",
            header: "App Id",
            cell: ({ row }) => <div className="text-sm">{row.getValue("appId")}</div>,
            enableSorting: true,
            enableColumnFilter: true,
            enableResizing: true,
            size: 80,
        },
        {
            accessorKey: "ucal",
            header: "UCAL",
            cell: ({ row }) => getUcalBadge(row.getValue("ucal")),
            enableSorting: true,
            enableResizing: true,
            size: 60,
        },
        {
            accessorKey: "capacityType",
            header: "Capacity Exception",
            cell: ({ row }) => <div className="text-sm">{row.getValue("capacityType")}</div>,
            enableSorting: true,
            enableResizing: true,
            size: 150,
        },
        {
            accessorKey: "exceptionDetail",
            header: "Exception Detail",
            cell: ({ row }) => (
                <div
                    className="text-sm whitespace-normal overflow-hidden text-ellipsis"
                    title={row.getValue("exceptionDetail")}
                >
                    {row.getValue("exceptionDetail")}
                </div>
            ),
            enableResizing: true,
            size: 200,
        },
        {
            accessorKey: "firstReported",
            header: "First Reported",
            cell: ({ row }) => <div className="text-sm">{row.getValue("firstReported")}</div>,
            enableSorting: true,
            enableResizing: true,
            size: 120,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <div className="text-sm">{row.getValue("status")}</div>,
            enableSorting: true,
            enableResizing: true,
            size: 100,
        },
        {
            accessorKey: "pbiPke",
            header: "PBI/PKE",
            cell: ({ row }) => (
                <div className="text-sm overflow-hidden text-ellipsis" title={row.getValue("pbiPke")}>
                    {row.getValue("pbiPke")}
                </div>
            ),
            enableResizing: true,
            size: 150,
        },
        {
            accessorKey: "nextSteps",
            header: "Next Steps",
            cell: ({ row }) => <div className="text-sm">{row.getValue("nextSteps")}</div>,
            enableResizing: true,
            size: 150,
        },
        {
            accessorKey: "fixTargetDate",
            header: "Fix Target Date",
            cell: ({ row }) => <div className="text-sm">{row.getValue("fixTargetDate")}</div>,
            enableSorting: true,
            enableResizing: true,
            size: 120,
        },
        {
            accessorKey: "l2Name",
            header: "L2 Name",
            cell: ({ row }) => <div className="text-sm">{row.getValue("l2Name")}</div>,
            enableSorting: true,
            enableResizing: true,
            size: 150,
        },
        {
            accessorKey: "l2Comments",
            header: "L2 Comments",
            cell: ({ row }) => (
                <div className="text-sm whitespace-normal overflow-hidden text-ellipsis" title={row.getValue("l2Comments")}>
                    {row.getValue("l2Comments")}
                </div>
            ),
            enableResizing: true,
            size: 200,
        },
        {
            id: "actions",
            header: "Action",
            cell: ({ row }) => {
                const exception = row.original

                return (
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => handleEdit(exception)}>
                            Edit
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                            Delete
                        </Button>
                    </div>
                )
            },
            enableResizing: true,
            size: 120,
        },
    ]

    return (
        <div className="w-full px-4 py-4">
            <h1 className="text-2xl font-bold mb-4">Capacity Exceptions</h1>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 h-8"
                        disabled={selectedRowsRef.current.length === 0}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete Selected</span>
                    </Button>
                    <Button size="sm" className="flex items-center gap-1 h-8 bg-blue-600 hover:bg-blue-700">
                        <PlusCircle className="h-4 w-4" />
                        <span>Add</span>
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1 h-8">
                        <FileUpIcon className="h-4 w-4" />
                        <span>Import</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1 h-8">
                        <DownloadIcon className="h-4 w-4" />
                        <span>Export</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1 h-8">
                        <FilterX className="h-4 w-4" />
                        <span>Reset Filter</span>
                    </Button>
                </div>
            </div>

            {/* Data Table */}
            <div className="w-full overflow-hidden">
                <div className="overflow-x-auto">
                    <DataTable columns={columns} data={exceptions} onRowSelectionChange={handleRowSelectionChange} />
                </div>
            </div>

            {/* Edit Exception Sheet */}
            <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
                <SheetContent className="sm:max-w-[600px] overflow-y-auto p-0">
                    <SheetHeader className="p-6 pb-2">
                        <SheetTitle>Edit Capacity Exception</SheetTitle>
                    </SheetHeader>
                    {selectedException && (
                        <div className="overflow-y-auto max-h-[calc(100vh-80px)]">
                            <EditExceptionForm exception={selectedException} onSave={handleSave} />
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}

