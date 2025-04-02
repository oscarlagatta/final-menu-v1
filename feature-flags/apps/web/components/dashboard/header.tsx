"use client"

import { useFeatureFlags } from "@yourorg/feature-flags"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  const { toggleFeature } = useFeatureFlags()

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to the feature flag demonstration dashboard</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => toggleFeature("advanced-analytics")}>
          Toggle Analytics
        </Button>
        <Button variant="outline" size="sm" onClick={() => toggleFeature("component-data-grid")}>
          Toggle Data Grid
        </Button>
        <Button variant="outline" size="sm" onClick={() => toggleFeature("premium-features")}>
          Toggle Premium
        </Button>
        <Button variant="outline" size="sm" onClick={() => toggleFeature("experimental-ui")}>
          Toggle Experimental UI
        </Button>
      </div>
    </div>
  )
}

