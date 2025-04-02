"use client"

import { useState } from "react"
import { useFeatureFlags } from "@/lib/feature-flags/context"
import { Button } from "@/components/ui/button"
import { saveFeatureFlagsToJson } from "@/lib/feature-flags/save-flags"
import { Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SaveFlagsButton() {
  const { flags } = useFeatureFlags()
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await saveFeatureFlagsToJson(flags)

      if (result.success) {
        toast({
          title: "Flags saved",
          description: "Feature flags have been saved to the JSON file.",
        })
      } else {
        toast({
          title: "Error saving flags",
          description: result.error || "An unknown error occurred.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error saving flags",
        description: (error as Error).message || "An unknown error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Button onClick={handleSave} disabled={isSaving} variant="outline" size="sm" className="gap-2">
      <Save className="h-4 w-4" />
      {isSaving ? "Saving..." : "Save to JSON"}
    </Button>
  )
}

