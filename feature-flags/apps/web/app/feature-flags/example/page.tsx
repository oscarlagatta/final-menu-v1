"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code } from "@/components/ui/code"

export default function FeatureFlagExamplePage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Feature Flag System Usage</h1>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList>
          <TabsTrigger value="basic">Basic Usage</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Usage</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Setting Up Feature Flags</CardTitle>
              <CardDescription>How to set up and use feature flags in your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">1. Provider Setup</h3>
                <p className="mb-2">First, wrap your application with the FeatureFlagProvider:</p>
                <Code className="mb-4">
                  {`// In your app's main layout or provider
import { FeatureFlagProvider } from "@yourorg/feature-flags";

// Wrap your app
<FeatureFlagProvider>
  <YourApp />
</FeatureFlagProvider>`}
                </Code>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">2. Using Feature Components</h3>
                <p className="mb-2">Use the Feature component to conditionally render content:</p>
                <Code className="mb-4">
                  {`import { Feature } from "@yourorg/feature-flags";

// Basic usage
<Feature featureId="your-feature-id">
  <YourFeatureComponent />
</Feature>

// With fallback
<Feature featureId="your-feature-id" fallback={<BasicComponent />}>
  <EnhancedComponent />
</Feature>`}
                </Code>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">3. Using the Hook</h3>
                <p className="mb-2">Use the useFeatureFlags hook in your components:</p>
                <Code className="mb-4">
                  {`import { useFeatureFlags } from "@yourorg/feature-flags";

function YourComponent() {
  const { isFeatureEnabled, toggleFeature } = useFeatureFlags();
  
  const isEnabled = isFeatureEnabled("your-feature-id");
  
  return (
    <div>
      <p>Feature is {isEnabled ? "enabled" : "disabled"}</p>
      <button onClick={() => toggleFeature("your-feature-id")}>
        Toggle Feature
      </button>
    </div>
  );
}`}
                </Code>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feature Flag Types</CardTitle>
              <CardDescription>Different types of feature flags you can use</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li>
                  <h3 className="text-lg font-medium">Feature Flags</h3>
                  <p className="text-muted-foreground">Control access to specific features in your application</p>
                  <Code className="mt-2">
                    {`<Feature featureId="premium-dashboard">
  <PremiumDashboard />
</Feature>`}
                  </Code>
                </li>
                <li>
                  <h3 className="text-lg font-medium">Component Flags</h3>
                  <p className="text-muted-foreground">Control which components are rendered</p>
                  <Code className="mt-2">
                    {`<Feature featureId="component-new-header">
  <NewHeader />
</Feature>`}
                  </Code>
                </li>
                <li>
                  <h3 className="text-lg font-medium">Route Flags</h3>
                  <p className="text-muted-foreground">Control access to specific routes</p>
                  <Code className="mt-2">
                    {`// In your route component
import { RouteGuard } from "@yourorg/feature-flags";

export default function ProtectedPage() {
  return (
    <RouteGuard featureId="route-admin-dashboard">
      <AdminDashboard />
    </RouteGuard>
  );
}`}
                  </Code>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Usage</CardTitle>
              <CardDescription>More advanced feature flag patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Environment-Based Flags</h3>
                <p className="mb-2">Configure flags based on the current environment:</p>
                <Code className="mb-4">
                  {`// In your feature-flags.config.js
export const featureFlagConfig = {
  development: {
    "experimental-ui": true,
    "debug-tools": true
  },
  production: {
    "experimental-ui": false,
    "debug-tools": false
  }
};

// In your provider
<FeatureFlagProvider 
  environment={process.env.NODE_ENV}
  config={featureFlagConfig}
>
  <YourApp />
</FeatureFlagProvider>`}
                </Code>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">User-Based Flags</h3>
                <p className="mb-2">Enable features for specific user roles or groups:</p>
                <Code className="mb-4">
                  {`// In your app
const user = {
  id: "user-123",
  role: "admin",
  subscriptionTier: "premium"
};

<FeatureFlagProvider 
  userContext={user}
  userRules={{
    "admin-panel": (user) => user.role === "admin",
    "premium-features": (user) => user.subscriptionTier === "premium"
  }}
>
  <YourApp />
</FeatureFlagProvider>`}
                </Code>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Percentage Rollouts</h3>
                <p className="mb-2">Gradually roll out features to a percentage of users:</p>
                <Code className="mb-4">
                  {`// In your feature-flags.config.js
export const featureFlagConfig = {
  "new-ui": {
    enabled: true,
    rolloutPercentage: 25 // Only 25% of users will see this feature
  }
};

// In your provider
<FeatureFlagProvider 
  config={featureFlagConfig}
  getUserId={() => currentUser.id} // Function to get stable user ID for consistent rollout
>
  <YourApp />
</FeatureFlagProvider>`}
                </Code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Reference</CardTitle>
              <CardDescription>Complete API reference for the feature flag system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">FeatureFlagProvider Props</h3>
                <ul className="space-y-2">
                  <li>
                    <strong>flags</strong>: Initial feature flag configuration
                  </li>
                  <li>
                    <strong>environment</strong>: Current environment (development, production, etc.)
                  </li>
                  <li>
                    <strong>config</strong>: Environment-specific configuration
                  </li>
                  <li>
                    <strong>userContext</strong>: User information for user-based flags
                  </li>
                  <li>
                    <strong>userRules</strong>: Rules for enabling features based on user properties
                  </li>
                  <li>
                    <strong>storage</strong>: Custom storage implementation (defaults to localStorage)
                  </li>
                  <li>
                    <strong>onChange</strong>: Callback when flags change
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">useFeatureFlags Hook</h3>
                <ul className="space-y-2">
                  <li>
                    <strong>flags</strong>: Current feature flag state
                  </li>
                  <li>
                    <strong>isFeatureEnabled(id)</strong>: Check if a feature is enabled
                  </li>
                  <li>
                    <strong>toggleFeature(id)</strong>: Toggle a feature on/off
                  </li>
                  <li>
                    <strong>enableFeature(id)</strong>: Enable a feature
                  </li>
                  <li>
                    <strong>disableFeature(id)</strong>: Disable a feature
                  </li>
                  <li>
                    <strong>setFeatureValue(id, value)</strong>: Set a feature's value
                  </li>
                  <li>
                    <strong>resetFeatures()</strong>: Reset all features to their default values
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Feature Component Props</h3>
                <ul className="space-y-2">
                  <li>
                    <strong>featureId</strong>: ID of the feature to check
                  </li>
                  <li>
                    <strong>fallback</strong>: Optional component to render when feature is disabled
                  </li>
                  <li>
                    <strong>children</strong>: Content to render when feature is enabled
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">RouteGuard Component Props</h3>
                <ul className="space-y-2">
                  <li>
                    <strong>featureId</strong>: ID of the feature to check
                  </li>
                  <li>
                    <strong>redirectTo</strong>: Optional path to redirect to when feature is disabled
                  </li>
                  <li>
                    <strong>fallback</strong>: Optional component to render when feature is disabled
                  </li>
                  <li>
                    <strong>children</strong>: Content to render when feature is enabled
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

