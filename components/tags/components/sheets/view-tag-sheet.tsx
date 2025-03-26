"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { DeleteConfirmationDialog } from "@/features/tags/components/dialogs/delete-confirmation-dialog"
import type { TagData } from "@/features/tags/types/tag-data"

interface ViewTagSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tag: TagData | null
}

// Sample applications data
const applications = [
  { id: "1", name: "Bank Funds Transfer" },
  { id: "2", name: "Bank Master" },
  { id: "3", name: "Wire Transfer System" },
  { id: "4", name: "Payment Processing" },
  { id: "5", name: "Customer Portal" },
]

export function ViewTagSheet({ open, onOpenChange, tag }: ViewTagSheetProps) {
  const [tagName, setTagName] = useState("")
  const [description, setDescription] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [selectedApplications, setSelectedApplications] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  // Initialize form with tag data when it changes
  useEffect(() => {
    if (tag) {
      setTagName(tag.tag)
      setDescription(tag.description || "")
      setIsActive(tag.status === "Active")

      // For demo purposes, we'll use the first 3 applications if the tag has AITs
      if (tag.aitsInTag > 0) {
        setSelectedApplications(applications.slice(0, Math.min(tag.aitsInTag, 3)).map((app) => app.id))
      } else {
        setSelectedApplications([])
      }
    }
  }, [tag])

  const handleSave = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Tag updated",
        description: `Successfully updated tag "${tagName}"`,
        variant: "default",
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tag. Please try again.",
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

  if (!tag) return null

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-md w-[500px] p-0 flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-2 flex flex-row justify-between items-center">
            <SheetTitle className="text-xl">Tag Details</SheetTitle>
            <div className="flex space-x-2">
              <Button
                variant="default"
                size="sm"
                className="bg-[#00205b] hover:bg-[#00205b]/90 text-white"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)} disabled={isLoading}>
                Delete
              </Button>
              <SheetClose asChild>
                <Button variant="outline" size="sm">
                  Back
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-auto p-6 space-y-6">
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

            <div className="flex items-center space-x-2">
              <Label htmlFor="active" className="text-right font-medium">
                Active
              </Label>
              <Checkbox id="active" checked={isActive} onCheckedChange={(checked) => setIsActive(checked as boolean)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="applications" className="text-right font-medium">
                Applications
              </Label>
              <Select>
                <SelectTrigger id="applications" className="w-full">
                  <SelectValue placeholder="Select an application" />
                </SelectTrigger>
                <SelectContent>
                  {applications.map((app) => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedApplications.length > 0 && (
              <div className="space-y-2 border rounded-md p-2">
                {selectedApplications.map((appId) => {
                  const app = applications.find((a) => a.id === appId)
                  if (!app) return null

                  return (
                    <div key={app.id} className="flex justify-between items-center border-b last:border-b-0 py-2">
                      <span>{app.name}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleRemoveApplication(app.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

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

