"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { DeleteConfirmationDialog } from "@/features/tags/components/dialogs/delete-confirmation-dialog"
import { MultiSelectDropdown } from "@/features/tags/components/dialogs/multi-select-dropdown"
import type { TagData } from "@/features/tags/types/tag-data"
import { Switch } from "@/components/ui/switch"
import { X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Add the interface at the top of the file
interface TagFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tag?: TagData | null
  mode?: "view" | "add"
}

// Sample applications data
const applications = [
  { id: "1", name: "Account Analysis Receivables (AAR)" },
  { id: "2", name: "Account Analysis (APX)" },
  { id: "3", name: "Bank Funds Transfer" },
  { id: "4", name: "Bank Master" },
  { id: "5", name: "Customer and Product Profitability (CPP)" },
  { id: "6", name: "Global Product Solutions Locator" },
  { id: "7", name: "Image Lockbox - Remittance Processing" },
  { id: "8", name: "Mainframe Funds Transfer" },
  { id: "9", name: "Automated Clearing House in Texas" },
  { id: "10", name: "Wire Transfer System" },
  { id: "11", name: "Corporate Payment System" },
  { id: "12", name: "Treasury Management Portal" },
  { id: "13", name: "Fraud Detection System" },
  { id: "14", name: "Credit Risk Assessment Tool" },
  { id: "15", name: "Loan Origination System" },
  { id: "16", name: "Mortgage Processing Platform" },
  { id: "17", name: "Investment Portfolio Manager" },
  { id: "18", name: "Wealth Management Dashboard" },
  { id: "19", name: "Regulatory Compliance Monitor" },
  { id: "20", name: "Anti-Money Laundering (AML) System" },
  { id: "21", name: "Customer Relationship Management" },
  { id: "22", name: "Digital Banking Platform" },
  { id: "23", name: "Mobile Banking Application" },
  { id: "24", name: "Payment Gateway Integration" },
  { id: "25", name: "Financial Reporting Tool" },
  { id: "26", name: "Asset Management System" },
  { id: "27", name: "Trade Finance Platform" },
  { id: "28", name: "Cash Management Solution" },
  { id: "29", name: "Foreign Exchange Trading System" },
  { id: "30", name: "Securities Settlement System" },
]

// Rename the component to TagFormSheet to better reflect its dual purpose
export function TagFormSheet({ open, onOpenChange, tag, mode = "view" }: TagFormSheetProps) {
  const [tagName, setTagName] = useState("")
  const [description, setDescription] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [selectedApplications, setSelectedApplications] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const [initialFormState, setInitialFormState] = useState({
    tagName: "",
    description: "",
    isActive: true,
    selectedApplications: [] as string[],
  })
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  // Initialize form with tag data when it changes or when mode changes
  useEffect(() => {
    if (mode === "add") {
      // Initialize with empty values for add mode
      const initialState = {
        tagName: "",
        description: "",
        isActive: true,
        selectedApplications: [] as string[],
      }
      setTagName(initialState.tagName)
      setDescription(initialState.description)
      setIsActive(initialState.isActive)
      setSelectedApplications(initialState.selectedApplications)
      setInitialFormState(initialState)
      setHasUnsavedChanges(false)
    } else if (tag) {
      // Initialize with tag data for view/edit mode
      const initialState = {
        tagName: tag.tag,
        description: tag.description || "",
        isActive: tag.status === "Active",
        selectedApplications: [] as string[],
      }

      // For demo purposes, we'll use specific applications if the tag has AITs
      if (tag.aitsInTag > 0) {
        // Select multiple applications for demo to show scrolling
        const demoAppCount = Math.min(tag.aitsInTag * 2, 15) // Select more apps to demonstrate scrolling
        const demoAppIds = Array.from({ length: demoAppCount }, (_, i) => (i + 1).toString())
        initialState.selectedApplications = demoAppIds
      }

      setTagName(initialState.tagName)
      setDescription(initialState.description)
      setIsActive(initialState.isActive)
      setSelectedApplications(initialState.selectedApplications)
      setInitialFormState(initialState)
      setHasUnsavedChanges(false)
    }
  }, [tag, mode])

  useEffect(() => {
    const currentState = {
      tagName,
      description,
      isActive,
      selectedApplications,
    }

    // Check if any values have changed
    const hasChanges =
      currentState.tagName !== initialFormState.tagName ||
      currentState.description !== initialFormState.description ||
      currentState.isActive !== initialFormState.isActive ||
      JSON.stringify(currentState.selectedApplications) !== JSON.stringify(initialFormState.selectedApplications)

    setHasUnsavedChanges(hasChanges)
  }, [tagName, description, isActive, selectedApplications, initialFormState])

  const handleSheetCloseAttempt = () => {
    if (hasUnsavedChanges) {
      setIsConfirmDialogOpen(true)
    } else {
      onOpenChange(false)
    }
  }

  const handleConfirmedClose = () => {
    setIsConfirmDialogOpen(false)
    onOpenChange(false)
  }

  const handleSave = async () => {
    if (!tagName.trim()) {
      toast({
        title: "Validation Error",
        description: "Tag name is required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const action = mode === "add" ? "created" : "updated"
      toast({
        title: `Tag ${action}`,
        description: `Successfully ${action} tag "${tagName}"`,
        variant: "default",
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode === "add" ? "create" : "update"} tag. Please try again.`,
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Tag deleted",
        description: `Successfully deleted tag "${tagName}"`,
        variant: "default",
      })

      setIsDeleteDialogOpen(false)
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete tag. Please try again.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleRemoveApplication = (appId: string) => {
    setSelectedApplications((prev) => prev.filter((id) => id !== appId))
  }

  // Only require tag in view/edit mode
  if (mode === "view" && !tag) return null

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen && hasUnsavedChanges) {
            // Prevent automatic closing and show confirmation dialog
            setIsConfirmDialogOpen(true)
            return
          }
          onOpenChange(isOpen)
        }}
      >
        <SheetContent className="sm:max-w-md w-[500px] p-0 flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-2">
            <SheetTitle className="text-xl">{mode === "add" ? "Add Tag" : "Tag Details"}</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-auto px-6 py-4 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-right font-medium">
                Name
              </Label>
              <Input id="name" value={tagName} onChange={(e) => setTagName(e.target.value)} className="w-full" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-right font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[100px]"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="active" className="font-medium">
                Active
              </Label>
              <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="applications" className="text-right font-medium">
                Applications
              </Label>
              <MultiSelectDropdown
                options={applications}
                selectedValues={selectedApplications}
                onChange={setSelectedApplications}
                placeholder="Select applications"
              />
            </div>

            {selectedApplications.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Selected Applications</Label>
                  <span className="text-xs text-muted-foreground">{selectedApplications.length} selected</span>
                </div>
                <div className="border rounded-md bg-muted/30 overflow-hidden">
                  <div className="max-h-[200px] overflow-y-auto p-3 flex flex-wrap gap-2">
                    {selectedApplications.map((appId) => {
                      const app = applications.find((a) => a.id === appId)
                      if (!app) return null

                      // Generate a consistent color based on the application name
                      const colorIndex = app.name.charCodeAt(0) % 5
                      const colorClasses = [
                        "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200",
                        "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
                        "bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200",
                        "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200",
                        "bg-pink-100 text-pink-800 border-pink-300 hover:bg-pink-200",
                      ]

                      return (
                        <div
                          key={app.id}
                          className={`group flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium ${colorClasses[colorIndex]} transition-colors`}
                        >
                          <span className="truncate max-w-[180px]">{app.name}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleRemoveApplication(app.id)
                            }}
                            className="ml-0.5 rounded-full p-0.5 hover:bg-white/50 transition-colors"
                            aria-label={`Remove ${app.name}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t px-6 py-4 flex items-center justify-between bg-background sticky bottom-0">
            <Button variant="outline" onClick={handleSheetCloseAttempt}>
              {mode === "add" ? "Cancel" : "Back"}
            </Button>

            <div className="flex space-x-2">
              {mode === "view" && (
                <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)} disabled={isLoading}>
                  Delete
                </Button>
              )}
              <Button
                variant="default"
                className="bg-[#00205b] hover:bg-[#00205b]/90 text-white"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave without saving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmedClose}>Leave</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Tag"
        description={`Are you sure you want to delete the tag "${tagName}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  )
}

