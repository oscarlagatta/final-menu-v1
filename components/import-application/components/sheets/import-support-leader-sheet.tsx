"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X, Check, ChevronsUpDown, Mail, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface ImportSupportLeaderSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (nbkId: string, supportLeader: string) => Promise<void>
}

// Sample support leader data for the dropdown with fictional names
const supportLeaderOptions = [
  {
    id: "NBKPNKL",
    name: "Anderson, Robert",
    displayName: "Anderson, Robert(Rob)",
    title: "Fulfillment Advisor I",
    email: "robert.anderson@company.com",
    manager: "Thompson, James R.",
  },
  {
    id: "NBKY3MG",
    name: "Martinez, Carlos",
    displayName: "Martinez, Carlos(Carl)",
    title: "Cons Prod Strategy Mgr I",
    email: "carlos.martinez@company.com",
    manager: "Wilson, Michael",
  },
  {
    id: "NBDUWUM",
    name: "Johnson, David",
    displayName: "Johnson, David(Dave)",
    title: "Senior Technology Architect",
    email: "david.johnson@company.com",
    manager: "Smith, Robert A.",
  },
  {
    id: "NBKR7TY",
    name: "Williams, Thomas",
    displayName: "Williams, Thomas(Tom)",
    title: "Application Developer Lead",
    email: "thomas.williams@company.com",
    manager: "Brown, Sarah J.",
  },
  {
    id: "NBKL9PO",
    name: "Taylor, Richard",
    displayName: "Taylor, Richard(Rick)",
    title: "Business Systems Analyst",
    email: "richard.taylor@company.com",
    manager: "Davis, John L.",
  },
]

export function ImportSupportLeaderSheet({ open, onOpenChange, onImport }: ImportSupportLeaderSheetProps) {
  const [inputValue, setInputValue] = useState("")
  const [selectedLeader, setSelectedLeader] = useState<(typeof supportLeaderOptions)[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Filter options based on input value
  const filteredOptions = supportLeaderOptions.filter(
    (option) =>
      option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      option.displayName.toLowerCase().includes(inputValue.toLowerCase()),
  )

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const resetForm = () => {
    setInputValue("")
    setSelectedLeader(null)
    setError("")
    setShowDropdown(false)
  }

  const handleOptionSelect = (option: (typeof supportLeaderOptions)[0]) => {
    setInputValue(option.displayName)
    setSelectedLeader(option)
    setShowDropdown(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!selectedLeader) {
      setError("Support Leader selection is required")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await onImport(selectedLeader.id, selectedLeader.displayName)

      // Show success toast
      toast({
        title: "Support Leader imported",
        description: `Successfully imported ${selectedLeader.displayName}`,
        variant: "default",
      })

      // Reset form and close sheet
      resetForm()
      onOpenChange(false)
    } catch (err) {
      setError("Failed to import Support Leader. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        if (!open) resetForm()
        onOpenChange(open)
      }}
    >
      <SheetContent className="sm:max-w-md w-[400px] p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetTitle>Import 2nd Level Support Leader</SheetTitle>
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="border-y py-4 px-6 flex-1">
            <div className="grid grid-cols-[auto_1fr] items-center gap-4">
              <Label htmlFor="supportLeader" className="text-right whitespace-nowrap">
                2nd Level
                <br />
                Support Leader
              </Label>
              <div className="relative">
                <div className="relative w-full">
                  <Input
                    id="supportLeader"
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value)
                      setError("")
                      setShowDropdown(true)
                      if (e.target.value === "") {
                        setSelectedLeader(null)
                      }
                    }}
                    onClick={() => setShowDropdown(true)}
                    placeholder="Search by name"
                    className={cn(error ? "border-destructive" : "", "pr-8")}
                    autoComplete="off"
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  </Button>
                </div>

                {showDropdown && filteredOptions.length > 0 && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-80 overflow-auto"
                  >
                    <div className="py-1">
                      {filteredOptions.map((option) => (
                        <div
                          key={option.id}
                          className={cn(
                            "flex flex-col px-3 py-3 cursor-pointer hover:bg-muted border-b last:border-b-0",
                            selectedLeader?.id === option.id && "bg-muted",
                          )}
                          onClick={() => handleOptionSelect(option)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{option.displayName}</span>
                            {selectedLeader?.id === option.id && <Check className="h-4 w-4" />}
                          </div>
                          <span className="text-sm text-muted-foreground mt-1">{option.title}</span>
                          <div className="flex items-center text-xs text-blue-600 mt-1">
                            <Mail className="h-3 w-3 mr-1" />
                            <span>{option.email}</span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <User className="h-3 w-3 mr-1" />
                            <span>Manager: {option.manager}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {error && <p className="text-sm text-destructive mt-2 text-right">{error}</p>}
          </div>

          <div className="px-6 py-4 flex justify-end space-x-2 border-t mt-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                onOpenChange(false)
              }}
              disabled={isLoading}
              className="h-9"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="h-9 bg-[#00205b] hover:bg-[#00205b]/90">
              {isLoading ? "Importing..." : "Save"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

