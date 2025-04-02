import type React from "react"
export type FeatureFlag = {
  id: string
  name: string
  description: string
  enabled: boolean
  type: "feature" | "route" | "component"
  category?: string
}

export type FeatureFlagContextType = {
  flags: FeatureFlag[]
  isFeatureEnabled: (featureId: string) => boolean
  toggleFeature: (featureId: string) => void
  updateFlag: (flag: FeatureFlag) => void
  addFlag: (flag: Omit<FeatureFlag, "enabled">) => void
  isManagementVisible: boolean
}

export type FeatureFlagProviderProps = {
  children: React.ReactNode
  initialFlags?: FeatureFlag[]
}

