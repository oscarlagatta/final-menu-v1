"use client"

import { useFeatureFlags } from "@/lib/feature-flags/context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { Settings } from "lucide-react"
import { AddFeatureFlag } from "./add-feature-flag"
import { SaveFlagsButton } from "./save-flags-button"
import { EnhancedFlagVisualization } from "./enhanced-flag-visualization"

export function FeatureFlagDialog() {
  const { flags, isManagementVisible } = useFeatureFlags()
  const [open, setOpen] = useState(false)

  // Don't render the dialog if management UI should not be visible
  if (!isManagementVisible) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative" title="Feature Flags">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            {flags.filter((flag) => flag.enabled).length}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[95vw] md:max-w-[1000px] lg:max-w-[1200px] max-h-[90vh] w-full">
        <DialogHeader>
          <DialogTitle>Feature Flag Management</DialogTitle>
          <DialogDescription>
            Configure which features, routes, and components are enabled for your application.
          </DialogDescription>
          <div className="flex justify-between items-center mt-2">
            <AddFeatureFlag />
            <SaveFlagsButton />
          </div>
        </DialogHeader>

        <Tabs defaultValue="manage">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="manage">Manage Flags</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="manage">
            <div className="h-[450px] overflow-y-auto pr-1">
              <EnhancedFlagVisualization />
            </div>
          </TabsContent>

          <TabsContent value="docs">
            <ScrollArea className="h-[500px]">
              <div className="pr-4 pb-4 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Using Feature Flags</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      Feature flags allow you to toggle features on and off without deploying new code. This system
                      supports three types of flags:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        <strong>Features</strong>: Control application functionality
                      </li>
                      <li>
                        <strong>Routes</strong>: Control access to specific pages
                      </li>
                      <li>
                        <strong>Components</strong>: Control rendering of UI components
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Creating Feature Flags</h3>
                  <div className="space-y-2 text-sm">
                    <p>To create a new feature flag:</p>
                    <ol className="list-decimal pl-6 space-y-1">
                      <li>Click the "Add Feature Flag" button</li>
                      <li>Fill in the ID, name, description, type, and optional category</li>
                      <li>Click "Create Feature Flag"</li>
                    </ol>
                    <p className="text-xs text-muted-foreground mt-2">
                      Note: IDs are automatically converted to kebab-case and must be unique
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">JSON Storage</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      Feature flags are stored in{" "}
                      <code className="bg-muted px-1 py-0.5 rounded">lib/feature-flags/feature-flags.json</code>. To
                      save your current flag configuration to this file:
                    </p>
                    <ol className="list-decimal pl-6 space-y-1">
                      <li>Make your changes to flags in the UI</li>
                      <li>Click the "Save to JSON" button</li>
                    </ol>
                    <p className="text-xs text-muted-foreground mt-2">
                      Note: Saving to JSON requires server-side write access and will only work in development or
                      environments that support file system writes.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Code Examples</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-medium">Using the Feature Component</h4>
                      <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto mt-1">
                        {`import { Feature } from "@/lib/feature-flags/guards";

<Feature featureId="advanced-analytics" fallback={<BasicAnalytics />}>
<AdvancedAnalytics />
</Feature>`}
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-medium">Protecting Routes</h4>
                      <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto mt-1">
                        {`import { ProtectedRoute } from "@/lib/feature-flags/guards";

<ProtectedRoute featureId="route-settings" fallback={<AccessDenied />}>
<Settings />
</ProtectedRoute>`}
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-medium">Using the Hook</h4>
                      <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto mt-1">
                        {`import { useFeatureFlags } from "@/lib/feature-flags/context";

function MyComponent() {
const { isFeatureEnabled } = useFeatureFlags();

if (isFeatureEnabled("my-feature")) {
  // Feature-specific code
}
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

