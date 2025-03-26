"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface AddTagDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (tag: string, description: string) => Promise<void>
}

export function AddTagDialog({ open, onOpenChange, onAdd }: AddTagDialogProps) {
  const [tag, setTag] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    tag?: string
    description?: string
  }>({})
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    const newErrors: {
      tag?: string
      description?: string
    } = {}

    if (!tag.trim()) {
      newErrors.tag = "Tag name is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      await onAdd(tag, description)

      // Show success toast
      toast({
        title: "Tag added",
        description: `Successfully added tag "${tag}"`,
        variant: "default",
      })

      // Reset form and close dialog
      resetForm()
      onOpenChange(false)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add tag. Please try again.",
        variant: "destructive",
      })
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setTag("")
    setDescription("")
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
          <DialogTitle className="text-xl">Add Tag</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tag" className="font-medium">
              Tag Name
            </Label>
            <Input
              id="tag"
              value={tag}
              onChange={(e) => {
                setTag(e.target.value)
                setErrors((prev) => ({ ...prev, tag: undefined }))
              }}
              placeholder="Enter tag name"
              className="w-full"
              autoComplete="off"
              autoFocus
              aria-invalid={!!errors.tag}
              aria-describedby={errors.tag ? "tag-error" : undefined}
            />
            {errors.tag && (
              <p id="tag-error" className="text-sm text-destructive">
                {errors.tag}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-medium">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                setErrors((prev) => ({ ...prev, description: undefined }))
              }}
              placeholder="Enter tag description"
              className="w-full resize-none"
              rows={3}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "description-error" : undefined}
            />
            {errors.description && (
              <p id="description-error" className="text-sm text-destructive">
                {errors.description}
              </p>
            )}
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

