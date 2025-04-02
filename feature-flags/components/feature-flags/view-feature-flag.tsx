"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { useFeatureFlags } from "@/lib/feature-flags/context"
import type { FeatureFlag } from "@/lib/feature-flags/types"
import { CalendarClock, Check, Clock, Code, FileCode, Tag, X } from "lucide-react"

type ViewFeatureFlagProps = {
  flag: FeatureFlag | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (flag: FeatureFlag) => void
}

export function ViewFeatureFlag({ flag, open, onOpenChange, onEdit }: ViewFeatureFlagProps) {
  const { toggleFeature } = useFeatureFlags()

  if (!flag) return null

  const handleToggle = () => {
    toggleFeature(flag.id)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Feature Flag Details</DialogTitle>
          <DialogDescription>Detailed information about this feature flag.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">{flag.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">{flag.enabled ? "Enabled" : "Disabled"}</span>
              <Switch checked={flag.enabled} onCheckedChange={handleToggle} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Code className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">ID</p>
                <code className="text-sm bg-muted px-1.5 py-0.5 rounded">{flag.id}</code>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileCode className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground">{flag.description || "No description provided"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Type</p>
                <Badge variant="outline" className="capitalize mt-1">
                  {flag.type}
                </Badge>
              </div>
            </div>

            {flag.category && (
              <div className="flex items-start gap-3">
                <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <Badge variant="secondary" className="capitalize mt-1">
                    {flag.category}
                  </Badge>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Status</p>
                <div className="flex items-center mt-1">
                  {flag.enabled ? (
                    <Badge variant="success" className="flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      <span>Enabled</span>
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="flex items-center gap-1 bg-muted">
                      <X className="h-3 w-3" />
                      <span>Disabled</span>
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarClock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Usage</p>
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {flag.type === "feature" && "Use with the Feature component or useFeatureFlags hook"}
                    {flag.type === "route" && "Use with the ProtectedRoute component"}
                    {flag.type === "component" && "Use with the Feature component or withFeatureFlag HOC"}
                  </p>
                  <code className="text-xs block bg-muted p-2 rounded">
                    {flag.type === "feature" &&
                      `<Feature featureId="${flag.id}">
  {/* Your feature content */}
</Feature>`}
                    {flag.type === "route" &&
                      `<ProtectedRoute featureId="${flag.id}">
  {/* Your route content */}
</ProtectedRoute>`}
                    {flag.type === "component" &&
                      `<Feature featureId="${flag.id}">
  <YourComponent />
</Feature>`}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false)
              onEdit(flag)
            }}
          >
            Edit Flag
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

