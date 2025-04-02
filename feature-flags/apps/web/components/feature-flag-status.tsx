"use client"

import { useFeatureFlags } from "@yourorg/feature-flags"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

interface FeatureFlagStatusProps {
  featureId: string
}

export function FeatureFlagStatus({ featureId }: FeatureFlagStatusProps) {
  const { isFeatureEnabled } = useFeatureFlags()
  const enabled = isFeatureEnabled(featureId)

  return (
    <Badge
      variant={enabled ? "default" : "outline"}
      className={`
        ${enabled ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" : ""}
        flex items-center gap-1
      `}
    >
      {enabled ? (
        <>
          <Check className="h-3 w-3" />
          <span>Enabled</span>
        </>
      ) : (
        <>
          <X className="h-3 w-3" />
          <span>Disabled</span>
        </>
      )}
    </Badge>
  )
}

