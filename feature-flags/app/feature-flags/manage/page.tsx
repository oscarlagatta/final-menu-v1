import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedFlagVisualization } from "@/components/feature-flags/enhanced-flag-visualization"
import { AddFeatureFlag } from "@/components/feature-flags/add-feature-flag"
import { SaveFlagsButton } from "@/components/feature-flags/save-flags-button"

export default function ManageFeatureFlagsPage() {
  return (
    <div className="container max-w-[1400px] py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Feature Flag Management</h1>
          <p className="text-muted-foreground mt-1">Manage and configure feature flags for your application</p>
        </div>
        <div className="flex items-center gap-2">
          <AddFeatureFlag />
          <SaveFlagsButton />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
          <CardDescription>
            Toggle features, routes, and components on or off without deploying new code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnhancedFlagVisualization />
        </CardContent>
      </Card>
    </div>
  )
}

