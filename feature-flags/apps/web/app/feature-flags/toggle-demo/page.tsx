"use client"

import { useFeatureFlags } from "@yourorg/feature-flags"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, Info } from "lucide-react"
import Link from "next/link"

export default function FeatureFlagToggleDemoPage() {
  const { flags, toggleFeature } = useFeatureFlags()

  // Filter to just the flags we're demonstrating
  const demoFlags = flags.filter((flag) =>
    ["advanced-analytics", "component-data-grid", "premium-features", "experimental-ui"].includes(flag.id),
  )

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Feature Flag Toggle Demo</h1>
          <p className="text-muted-foreground mt-1">Toggle feature flags and see the changes in real-time</p>
        </div>
        <Link href="/dashboard">
          <Button>View Dashboard</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {demoFlags.map((flag) => (
          <Card key={flag.id} className={flag.enabled ? "border-green-200 dark:border-green-900" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>{flag.name}</CardTitle>
                <Switch checked={flag.enabled} onCheckedChange={() => toggleFeature(flag.id)} />
              </div>
              <CardDescription>{flag.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {flag.type}
                  </Badge>
                  {flag.category && (
                    <Badge variant="secondary" className="capitalize">
                      {flag.category}
                    </Badge>
                  )}
                </div>

                <div
                  className={`p-4 rounded-md ${
                    flag.enabled
                      ? "bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-900"
                      : "bg-gray-50 border border-gray-200 dark:bg-gray-800/20 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {flag.enabled ? (
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <X className="h-5 w-5 text-gray-400 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">{flag.enabled ? "Feature is enabled" : "Feature is disabled"}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {flag.enabled
                          ? "Visit the dashboard to see this feature in action."
                          : "Enable this feature to see it on the dashboard."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-950/20 dark:border-blue-900">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-400">How this affects the dashboard</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      {flag.id === "advanced-analytics" &&
                        "Toggles between basic and advanced analytics visualizations."}
                      {flag.id === "component-data-grid" &&
                        "Switches between a standard table and an enhanced data grid with filtering and pagination."}
                      {flag.id === "premium-features" &&
                        "Controls visibility of premium feature cards in the dashboard."}
                      {flag.id === "experimental-ui" &&
                        "Shows or hides the experimental UI section with tabs and enhanced styling."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>How Feature Flags Work</CardTitle>
            <CardDescription>Understanding the feature flag system in this demo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                This demo showcases how feature flags can be used to control the visibility and behavior of components
                in your application:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Toggle flags above to see immediate changes</li>
                <li>Visit the dashboard to see how components respond to flag changes</li>
                <li>Use the Feature Flag Manager in the header for more advanced management</li>
              </ul>
              <p className="mt-4">In a real application, feature flags can be used for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gradual rollout of new features</li>
                <li>A/B testing different implementations</li>
                <li>Controlling access to premium features</li>
                <li>Quickly disabling problematic features without a deployment</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

