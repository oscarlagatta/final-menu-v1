"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Option {
  id: string
  name: string
}

interface MultiSelectDropdownProps {
  options: Option[]
  selectedValues: string[]
  onChange: (selectedIds: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelectDropdown({
  options,
  selectedValues,
  onChange,
  placeholder = "Select options",
  className,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const toggleOption = (id: string) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter((v) => v !== id))
    } else {
      onChange([...selectedValues, id])
    }
  }

  // Filter options based on search term
  const filteredOptions = options.filter((option) => option.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValues.length > 0 ? `${selectedValues.length} selected` : placeholder}
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg overflow-hidden">
          <div className="p-2 border-b sticky top-0 bg-popover z-10">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option.id)
                return (
                  <div
                    key={option.id}
                    className={cn(
                      "relative flex items-center space-x-2 p-2 cursor-pointer hover:bg-muted rounded-sm",
                      isSelected && "bg-muted/50",
                    )}
                    onClick={() => toggleOption(option.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      className="data-[state=checked]:bg-primary data-[state=checked]:text-white"
                    />
                    <span>{option.name}</span>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-2 text-sm text-muted-foreground">
                {searchTerm ? "No matching applications found" : "No options available"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

