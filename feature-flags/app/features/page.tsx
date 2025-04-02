"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FeatureFlagsDocsPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Feature Flags Documentation</h1>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>What are Feature Flags?</CardTitle>
              <CardDescription>
                Feature flags allow you to toggle features on and off without deploying new code.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Feature flags (also known as feature toggles or feature switches) are a software development technique
                that allows you to enable or disable features in your application without deploying new code. They can
                be used for:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Gradually rolling out features to users</li>
                <li>Testing features in production with a subset of users</li>
                <li>Quickly disabling problematic features</li>
                <li>A/B testing different implementations</li>
                <li>Managing access to premium or beta features</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Using Feature Flags in this Application</CardTitle>
              <CardDescription>How to manage and use feature flags in your application.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This application includes a comprehensive feature flag system that allows you to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Enable or disable features</li>
                <li>Control access to routes</li>
                <li>Conditionally render components</li>
              </ul>
              <p className="mt-4">
                Feature flags can be managed through the Feature Flag Manager button in the header, which is only
                visible in development, UAT, and test environments.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Component</CardTitle>
              <CardDescription>Conditionally render components based on feature flags.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                The <code className="bg-muted px-1 py-0.5 rounded">{"<Feature>"}</code> component allows you to
                conditionally render content based on a feature flag:
              </p>
              <pre className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                {`import { Feature } from "@/lib/feature-flags/guards";

function MyComponent() {
return (
  <div>
    <Feature featureId="advanced-analytics" fallback={<BasicAnalytics />}>
      <AdvancedAnalytics />
    </Feature>
  </div>
);
}`}
              </pre>
              <p className="mt-4">
                If the "advanced-analytics" feature is enabled, the{" "}
                <code className="bg-muted px-1 py-0.5 rounded">{"<AdvancedAnalytics />"}</code> component will be
                rendered. Otherwise, the <code className="bg-muted px-1 py-0.5 rounded">{"<BasicAnalytics />"}</code>{" "}
                component will be rendered (if provided as a fallback).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>withFeatureFlag HOC</CardTitle>
              <CardDescription>Higher-order component for feature-flagged components.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                The <code className="bg-muted px-1 py-0.5 rounded">withFeatureFlag</code> function is a higher-order
                component that wraps a component and only renders it if a feature is enabled:
              </p>
              <pre className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                {`import { withFeatureFlag } from "@/lib/feature-flags/guards";

function ExperimentalComponent() {
return <div>This is an experimental component!</div>;
}

export default withFeatureFlag(ExperimentalComponent, "experimental-ui");`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Protected Routes</CardTitle>
              <CardDescription>Control access to routes with feature flags.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                You can use the <code className="bg-muted px-1 py-0.5 rounded">{"<ProtectedRoute>"}</code> component to
                control access to routes based on feature flags:
              </p>
              <pre className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                {`import { ProtectedRoute } from "@/lib/feature-flags/guards";
import { useRouter } from "next/navigation";

function SettingsPage() {
const router = useRouter();

return (
  <ProtectedRoute 
    featureId="route-settings" 
    fallback={<AccessDenied onBack={() => router.push("/")} />}
  >
    <Settings />
  </ProtectedRoute>
);
}`}
              </pre>
              <p className="mt-4">
                You can also implement route protection at the layout level to protect entire sections of your
                application.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>useFeatureFlags Hook</CardTitle>
              <CardDescription>Access and manage feature flags in your components.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                The <code className="bg-muted px-1 py-0.5 rounded">useFeatureFlags</code> hook provides access to the
                feature flag context:
              </p>
              <pre className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                {`import { useFeatureFlags } from "@/lib/feature-flags/context";

function MyComponent() {
const { 
  flags,                // All feature flags
  isFeatureEnabled,     // Function to check if a feature is enabled
  toggleFeature,        // Function to toggle a feature
  updateFlag,           // Function to update a feature flag
  isManagementVisible   // Whether the management UI should be visible
} = useFeatureFlags();

return (
  <div>
    {isFeatureEnabled("my-feature") && <p>Feature is enabled!</p>}
    <button onClick={() => toggleFeature("my-feature")}>
      Toggle Feature
    </button>
  </div>
);
}`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flag Types</CardTitle>
              <CardDescription>TypeScript types for feature flags.</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                {`export type FeatureFlag = {
id: string;              // Unique identifier
name: string;            // Display name
description: string;     // Description
enabled: boolean;        // Whether the flag is enabled
type: 'feature' | 'route' | 'component';  // Flag type
category?: string;       // Optional category for grouping
};`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

