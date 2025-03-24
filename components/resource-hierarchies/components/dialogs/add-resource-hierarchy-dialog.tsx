"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface AddResourceHierarchyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (hierarchy: string) => Promise<void>
}

export function AddResourceHierarchyDialog({ open, onOpenChange, onAdd }: AddResourceHierarchyDialogProps) {
  const [hierarchy, setHierarchy] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!hierarchy.trim()) {
      setError("Hierarchy code is required")
      return
    }

    // Format validation (example: only uppercase letters and numbers)
    if (!/^[A-Z0-9]+$/.test(hierarchy)) {
      setError("Hierarchy code must contain only uppercase letters and numbers")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await onAdd(hierarchy)

      // Show success toast
      toast({
        title: "Resource Hierarchy added",
        description: `Successfully added hierarchy "${hierarchy}"`,
        variant: "default",
      })

      // Reset form and close dialog
      setHierarchy("")
      onOpenChange(false)
    } catch (err) {
      setError("Failed to add hierarchy. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setHierarchy("")
    setError("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Resource Hierarchy</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hierarchy" className="font-medium">
              Hierarchy
            </Label>
            <Input
              id="hierarchy"
              value={hierarchy}
              onChange={(e) => {
                setHierarchy(e.target.value.toUpperCase())
                setError("")
              }}
              placeholder="Enter hierarchy code"
              className="w-full"
              autoComplete="off"
              autoFocus
              aria-invalid={!!error}
              aria-describedby={error ? "hierarchy-error" : undefined}
            />
            {error && (
              <p id="hierarchy-error" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>

          <DialogFooter className="mt-6 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading} className="h-9">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="h-9 bg-[#00205b] hover:bg-[#00205b]/90 text-white">
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>

        <div className="text-xs text-muted-foreground text-center mt-4">
          {new Date().toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

