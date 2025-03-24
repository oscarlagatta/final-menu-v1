"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface ImportHierarchyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (hierarchy: string) => Promise<void>
}

export function ImportHierarchyDialog({ open, onOpenChange, onImport }: ImportHierarchyDialogProps) {
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
      await onImport(hierarchy)

      // Show success toast
      toast({
        title: "Hierarchy imported",
        description: `Successfully imported hierarchy "${hierarchy}"`,
        variant: "default",
      })

      // Reset form and close dialog
      setHierarchy("")
      onOpenChange(false)
    } catch (err) {
      setError("Failed to import hierarchy. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Hierarchy</DialogTitle>
          <DialogDescription>
            Enter the hierarchy code to import. This will be used to track and manage application data.
          </DialogDescription>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="hierarchy" className="text-left">
                Hierarchy Code
              </Label>
              <Input
                id="hierarchy"
                value={hierarchy}
                onChange={(e) => {
                  setHierarchy(e.target.value)
                  setError("")
                }}
                placeholder="Enter hierarchy code (e.g., VMN)"
                className="col-span-3"
                autoComplete="off"
                autoFocus
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <p className="text-sm text-muted-foreground">
                The hierarchy code should follow your organization's naming convention.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Importing..." : "Import"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

