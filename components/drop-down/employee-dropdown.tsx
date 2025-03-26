import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Sample employee data
const employees = [
    {
        id: "1",
        name: "Martinez, Elena",
        title: "Delivery Lead - Technology",
        email: "elena.martinez@example.com",
        supervisor: "Wilson, Thomas K.",
        initials: "EM",
    },
    {
        id: "2",
        name: "Taylor, Alex",
        title: "Sr Account Manager I",
        email: "alex.taylor@example.com",
        supervisor: "Rodriguez, Sarah L.",
        initials: "AT",
    },
    {
        id: "3",
        name: "Taylor-Johnson, Rebecca(Becky)",
        title: "Relationship Banker",
        email: "becky.taylor-johnson@example.com",
        supervisor: "Chen, David A.",
        initials: "RT",
    },
    {
        id: "4",
        name: "Patel, Raj",
        title: "Product Manager",
        email: "raj.patel@example.com",
        supervisor: "Thompson, Lisa R.",
        initials: "RP",
    },
    {
        id: "5",
        name: "Kim, Min-ji",
        title: "UX Designer",
        email: "minji.kim@example.com",
        supervisor: "Garcia, Carlos T.",
        initials: "MK",
    },
]

export function EmployeeDropdown() {
    const [open, setOpen] = React.useState(false)
    const [selectedEmployee, setSelectedEmployee] = React.useState(employees[0])
    const [searchQuery, setSearchQuery] = React.useState("")

    const filteredEmployees = React.useMemo(() => {
        if (!searchQuery) return employees

        return employees.filter(
            (employee) =>
                employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                employee.email.toLowerCase().includes(searchQuery.toLowerCase()),
        )
    }, [searchQuery])

    return (
        <div className="w-full max-w-[600px]">
            <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-700">Portfolio Lead</h3>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between bg-white border-gray-200 hover:bg-gray-50"
                        >
              <span className="truncate">
                {selectedEmployee.name} - {selectedEmployee.title}
              </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                        <Command className="w-full">
                            <div className="flex items-center border-b px-3">
                                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                <CommandInput
                                    placeholder="Search portfolio lead"
                                    className="h-9 flex-1"
                                    value={searchQuery}
                                    onValueChange={setSearchQuery}
                                />
                            </div>
                            <CommandList>
                                <CommandEmpty>No employees found.</CommandEmpty>
                                <CommandGroup>
                                    {filteredEmployees.map((employee) => (
                                        <CommandItem
                                            key={employee.id}
                                            value={employee.id}
                                            onSelect={() => {
                                                setSelectedEmployee(employee)
                                                setOpen(false)
                                            }}
                                            className="py-3 px-0"
                                        >
                                            <div className="flex w-full items-start gap-3 px-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-xs font-medium text-gray-600">
                                                    {employee.initials}
                                                </div>
                                                <div className="flex flex-col gap-1 text-sm">
                                                    <div className="font-medium">{employee.name}</div>
                                                    <div className="flex items-center gap-1 text-gray-500">
                                                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                        <span>{employee.title}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-gray-500">
                                                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M22 6L12 13L2 6"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                        <span>{employee.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-gray-500">
                                                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                        <span>Supervisor:</span>
                                                        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                              {employee.supervisor}
                            </span>
                                                    </div>
                                                </div>
                                                <Check
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        selectedEmployee.id === employee.id ? "opacity-100" : "opacity-0",
                                                    )}
                                                />
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

