"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useFeatureFlags } from "@/lib/feature-flags/context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { FeatureFlag } from "@/lib/feature-flags/types"

type EditFeatureFlagProps = {
  flag: FeatureFlag | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditFeatureFlag({ flag, open, onOpenChange }: EditFeatureFlagProps) {
  const { updateFlag } = useFeatureFlags()
  const [formData, setFormData] = useState<Omit<FeatureFlag, "id">>({
    name: "",
    description: "",
    type: "feature",
    enabled: false,
    category: "",
  })
  const [error, setError] = useState("")

  // Update form data when flag changes
  useEffect(() => {
    if (flag) {
      setFormData({
        name: flag.name,
        description: flag.description,
        type: flag.type,
        enabled: flag.enabled,
        category: flag.category || "",
      })
      setError("")
    }
  }, [flag])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name) {
      setError("Name is a required field")
      return
    }

    if (!flag) return

    // Update the flag
    updateFlag({
      id: flag.id,
      name: formData.name,
      description: formData.description,
      type: formData.type as "feature" | "route" | "component",
      enabled: formData.enabled,
      category: formData.category || undefined,
    })

    // Close dialog
    onOpenChange(false)
  }

  if (!flag) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Feature Flag</DialogTitle>
          <DialogDescription>Modify the details of this feature flag.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-id" className="text-right">
                ID
              </Label>
              <Input id="edit-id" value={flag.id} className="col-span-3" disabled />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Feature Name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what this feature flag controls"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                Type
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger id="edit-type" className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="route">Route</SelectItem>
                  <SelectItem value="component">Component</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Category
              </Label>
              <Input
                id="edit-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Optional category"
                className="col-span-3"
              />
            </div>
            {error && <div className="text-sm text-destructive text-center">{error}</div>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

