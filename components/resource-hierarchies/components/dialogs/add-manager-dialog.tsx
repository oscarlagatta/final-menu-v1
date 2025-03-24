"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface AddManagerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (nbkId: string, manager: string) => Promise<void>
}

export function AddManagerDialog({ open, onOpenChange, onAdd }: AddManagerDialogProps) {
  const [nbkId, setNbkId] = useState("")
  const [manager, setManager] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    nbkId?: string
    manager?: string
  }>({})
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    const newErrors: {
      nbkId?: string
      manager?: string
    } = {}

    if (!nbkId.trim()) {
      newErrors.nbkId = "NBKID is required"
    } else if (!/^NBK[A-Z0-9]{3,5}$/.test(nbkId)) {
      newErrors.nbkId = "NBKID must be in format NBK followed by 3-5 letters/numbers"
    }

    if (!manager.trim()) {
      newErrors.manager = "Manager name is required"
    } else if (!/^[A-Za-z]+, [A-Za-z]+$/.test(manager)) {
      newErrors.manager = "Manager name must be in format 'Last, First'"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      await onAdd(nbkId, manager)

      // Show success toast
      toast({
        title: "Manager added",
        description: `Successfully added manager "${manager}"`,
        variant: "default",
      })

      // Reset form and close dialog
      resetForm()
      onOpenChange(false)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add manager. Please try again.",
        variant: "destructive",
      })
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setNbkId("")
    setManager("")
    setErrors({})
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Manager</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nbkId" className="font-medium">
              NBKID
            </Label>
            <Input
              id="nbkId"
              value={nbkId}
              onChange={(e) => {
                setNbkId(e.target.value.toUpperCase())
                setErrors((prev) => ({ ...prev, nbkId: undefined }))
              }}
              placeholder="Enter NBKID (e.g., NBKPNKL)"
              className="w-full"
              autoComplete="off"
              autoFocus
              aria-invalid={!!errors.nbkId}
              aria-describedby={errors.nbkId ? "nbkid-error" : undefined}
            />
            {errors.nbkId && (
              <p id="nbkid-error" className="text-sm text-destructive">
                {errors.nbkId}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="manager" className="font-medium">
              Manager
            </Label>
            <Input
              id="manager"
              value={manager}
              onChange={(e) => {
                setManager(e.target.value)
                setErrors((prev) => ({ ...prev, manager: undefined }))
              }}
              placeholder="Enter manager name (Last, First)"
              className="w-full"
              autoComplete="off"
              aria-invalid={!!errors.manager}
              aria-describedby={errors.manager ? "manager-error" : undefined}
            />
            {errors.manager && (
              <p id="manager-error" className="text-sm text-destructive">
                {errors.manager}
              </p>
            )}
            <p className="text-sm text-muted-foreground">Format: Last name, First name (e.g., "Smith, John")</p>
          </div>

          <DialogFooter className="mt-6 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading} className="h-9">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="h-9 bg-[#00205b] hover:bg-[#00205b]/90 text-white">
              {isLoading ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

