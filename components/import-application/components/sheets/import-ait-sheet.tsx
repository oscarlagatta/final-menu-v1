"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X, Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface ImportAitSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (aitNumber: string, applicationName: string) => Promise<void>
}

// Sample AIT data for the combobox
const aitOptions = [
  { value: "12534", label: "12534", description: "Commercial Loss Forecasting" },
  { value: "26125", label: "26125", description: "Supervision Personnel Tracking" },
  { value: "71259", label: "71259", description: "Performance Scorecard Management & Analytics" },
  { value: "21252", label: "21252", description: "Centralized Credit Card Processing" },
  { value: "66125", label: "66125", description: "Sponsor Locker" },
  { value: "68125", label: "68125", description: "Product Integration Pricing Engine Rules" },
  { value: "69125", label: "69125", description: "Capital Rock - Right Bridge Tool" },
  { value: "73456", label: "73456", description: "Work Force Management Portal (WFMP)" },
  { value: "12302", label: "12302", description: "Enterprise Referrals" },
  { value: "25334", label: "25334", description: "Proprietary Resource Allocation" },
  { value: "12303", label: "12303", description: "Nationwide Field Activities Engine" },
  { value: "23872", label: "23872", description: "SWIFT Utility - AMRS" },
]

export function ImportAitSheet({ open, onOpenChange, onImport }: ImportAitSheetProps) {
  const [inputValue, setInputValue] = useState("")
  const [selectedAit, setSelectedAit] = useState<string | null>(null)
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Filter options based on input value
  const filteredOptions = aitOptions.filter((option) => option.value.toLowerCase().includes(inputValue.toLowerCase()))

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
    setSelectedAit(null)
    setSelectedApplication(null)
    setError("")
    setShowDropdown(false)
  }

  const handleOptionSelect = (option: (typeof aitOptions)[0]) => {
    setInputValue(option.value)
    setSelectedAit(option.value)
    setSelectedApplication(option.description)
    setShowDropdown(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!inputValue.trim()) {
      setError("AIT Number is required")
      return
    }

    // Format validation (numeric only)
    if (!/^\d+$/.test(inputValue)) {
      setError("AIT Number must contain only digits")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await onImport(inputValue, selectedApplication || "")

      // Show success toast
      toast({
        title: "AIT Number imported",
        description: `Successfully imported AIT Number "${inputValue}"`,
        variant: "default",
      })

      // Reset form and close sheet
      resetForm()
      onOpenChange(false)
    } catch (err) {
      setError("Failed to import AIT Number. Please try again.")
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
          <SheetTitle>Import AIT Number</SheetTitle>
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="border-y py-4 px-6 flex-1">
            <div className="grid grid-cols-[auto_1fr] items-center gap-4">
              <Label htmlFor="aitNumber" className="text-right whitespace-nowrap">
                AIT Number
              </Label>
              <div className="relative">
                <div className="relative w-full">
                  <Input
                    id="aitNumber"
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value)
                      setError("")
                      setShowDropdown(true)
                      if (e.target.value === "") {
                        setSelectedAit(null)
                        setSelectedApplication(null)
                      }
                    }}
                    onClick={() => setShowDropdown(true)}
                    placeholder="AIT Number"
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
                    className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
                  >
                    <div className="py-1">
                      {filteredOptions.map((option) => (
                        <div
                          key={option.value}
                          className={cn(
                            "flex flex-col px-3 py-2 cursor-pointer hover:bg-muted",
                            selectedAit === option.value && "bg-muted",
                          )}
                          onClick={() => handleOptionSelect(option)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{option.value}</span>
                            {selectedAit === option.value && <Check className="h-4 w-4" />}
                          </div>
                          <span className="text-xs text-blue-600">({option.description})</span>
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

