import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function FeatureFlagsDocumentationPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Feature Flags Documentation</h1>
      <p className="text-muted-foreground mb-8">
        Comprehensive guide to using the feature flag system in your application
      </p>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage Guide</TabsTrigger>
          <TabsTrigger value="json">JSON Storage</TabsTrigger>
          <TabsTrigger value="examples">Code Examples</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Topics</TabsTrigger>
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
              <CardTitle>Feature Flag System Architecture</CardTitle>
              <CardDescription>How the feature flag system is structured in this application</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                This application includes a comprehensive feature flag system with the following components:
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium">1. Feature Flag Provider</h3>
                  <p className="text-sm text-muted-foreground">
                    A React context provider that manages the state of all feature flags and provides methods to check,
                    toggle, and update flags.
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-medium">2. JSON Storage</h3>
                  <p className="text-sm text-muted-foreground">
                    Feature flag definitions are stored in a JSON file, providing a version-controlled source of truth
                    for default flag states.
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-medium">3. Local Storage</h3>
                  <p className="text-sm text-muted-foreground">
                    Flag states are persisted in the browser's localStorage, allowing for user-specific overrides and
                    persistence between page refreshes.
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-medium">4. UI Components</h3>
                  <p className="text-sm text-muted-foreground">
                    Components for managing feature flags, including a dialog for toggling flags and forms for creating
                    new flags.
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-medium">5. Guard Components</h3>
                  <p className="text-sm text-muted-foreground">
                    Components and HOCs for conditionally rendering content based on feature flag states.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Creating Feature Flags</CardTitle>
              <CardDescription>How to create and manage feature flags in the application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium">Creating a New Flag</h3>
                  <ol className="list-decimal pl-6 mt-2 space-y-2 text-sm">
                    <li>Click the Feature Flags button in the header (gear icon)</li>
                    <li>Click the "Add Feature Flag" button</li>
                    <li>
                      Fill in the following details:
                      <ul className="list-disc pl-6 mt-1 space-y-1">
                        <li>
                          <strong>ID</strong>: A unique identifier (will be converted to kebab-case)
                        </li>
                        <li>
                          <strong>Name</strong>: Display name for the flag
                        </li>
                        <li>
                          <strong>Description</strong>: What the flag controls
                        </li>
                        <li>
                          <strong>Type</strong>: Feature, Route, or Component
                        </li>
                        <li>
                          <strong>Category</strong>: Optional grouping (e.g., "Analytics", "UI")
                        </li>
                      </ul>
                    </li>
                    <li>Click "Create Feature Flag"</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-md font-medium">Managing Existing Flags</h3>
                  <p className="text-sm mb-2">The Feature Flags dialog provides several ways to manage your flags:</p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>
                      <strong>Toggle Flags</strong>: Use the switch to enable or disable a flag
                    </li>
                    <li>
                      <strong>Filter Flags</strong>: Use the search box to find specific flags
                    </li>
                    <li>
                      <strong>View by Type</strong>: Use the tabs to view flags by type (feature, route, component)
                    </li>
                    <li>
                      <strong>View by Category</strong>: Use the Categories tab to view flags grouped by category
                    </li>
                    <li>
                      <strong>Save to JSON</strong>: Click the "Save to JSON" button to persist changes to the JSON file
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Using Feature Flags in Code</CardTitle>
              <CardDescription>How to use feature flags in your React components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium">Feature Component</h3>
                  <p className="text-sm mb-2">
                    Use the <code className="bg-muted px-1 py-0.5 rounded">{"<Feature>"}</code> component to
                    conditionally render content:
                  </p>
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                    {`import { Feature } from "@/lib/feature-flags/guards";

<Feature featureId="advanced-analytics" fallback={<BasicAnalytics />}>
<AdvancedAnalytics />
</Feature>`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-md font-medium">Protected Routes</h3>
                  <p className="text-sm mb-2">
                    Use the <code className="bg-muted px-1 py-0.5 rounded">{"<ProtectedRoute>"}</code> component to
                    control access to routes:
                  </p>
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                    {`import { ProtectedRoute } from "@/lib/feature-flags/guards";

<ProtectedRoute featureId="route-settings" fallback={<AccessDenied />}>
<Settings />
</ProtectedRoute>`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-md font-medium">useFeatureFlags Hook</h3>
                  <p className="text-sm mb-2">Use the hook to check if features are enabled in your components:</p>
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                    {`import { useFeatureFlags } from "@/lib/feature-flags/context";

function MyComponent() {
const { isFeatureEnabled } = useFeatureFlags();

if (isFeatureEnabled("my-feature")) {
  // Feature-specific code
}

return (
  <div>
    {isFeatureEnabled("another-feature") && <NewFeature />}
  </div>
);
}`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-md font-medium">Higher-Order Component</h3>
                  <p className="text-sm mb-2">
                    Use the HOC to wrap components that should only be rendered when a feature is enabled:
                  </p>
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                    {`import { withFeatureFlag } from "@/lib/feature-flags/guards";

function ExperimentalComponent() {
return <div>Experimental UI</div>;
}

export default withFeatureFlag(ExperimentalComponent, "experimental-ui");`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="json" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>JSON Storage</CardTitle>
              <CardDescription>How feature flags are stored in JSON</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium">JSON File Structure</h3>
                  <p className="text-sm mb-2">
                    Feature flags are stored in{" "}
                    <code className="bg-muted px-1 py-0.5 rounded">lib/feature-flags/feature-flags.json</code> with the
                    following structure:
                  </p>
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                    {`{
"feature-id": {
  "id": "feature-id",
  "name": "Feature Name",
  "description": "Description of the feature",
  "enabled": false,
  "type": "feature",
  "category": "Category"
},
"another-feature": {
  "id": "another-feature",
  "name": "Another Feature",
  "description": "Description of another feature",
  "enabled": true,
  "type": "component",
  "category": "UI"
}
}`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-md font-medium">Saving to JSON</h3>
                  <p className="text-sm mb-2">To save your current flag configuration to the JSON file:</p>
                  <ol className="list-decimal pl-6 space-y-1 text-sm">
                    <li>Make your changes to flags in the UI</li>
                    <li>Click the "Save to JSON" button in the Feature Flags dialog</li>
                  </ol>

                  <Alert className="mt-4">
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Important Note</AlertTitle>
                    <AlertDescription>
                      Saving to JSON requires server-side write access and will only work in development or environments
                      that support file system writes. In production environments like Vercel, you might want to adapt
                      this to use a database or API instead.
                    </AlertDescription>
                  </Alert>
                </div>

                <div>
                  <h3 className="text-md font-medium">Loading from JSON</h3>
                  <p className="text-sm">
                    When the application starts, it loads the default flag states from the JSON file. These states can
                    be overridden by user-specific settings stored in localStorage.
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-medium">Benefits of JSON Storage</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>
                      <strong>Version Control</strong>: Flag definitions can be tracked in your repository
                    </li>
                    <li>
                      <strong>Default State</strong>: New deployments start with a consistent set of flags
                    </li>
                    <li>
                      <strong>Documentation</strong>: The JSON file serves as documentation of available flags
                    </li>
                    <li>
                      <strong>Sharing</strong>: Easily share flag configurations across environments
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Common Use Cases</CardTitle>
              <CardDescription>Examples of how to use feature flags in different scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-2">1. Conditional UI Elements</h3>
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                    {`import { Feature } from "@/lib/feature-flags/guards";

function Dashboard() {
return (
  <div className="dashboard">
    <StandardMetrics />
    
    <Feature featureId="advanced-analytics">
      <AdvancedMetrics />
    </Feature>
    
    <Feature 
      featureId="experimental-charts" 
      fallback={<StandardCharts />}
    >
      <ExperimentalCharts />
    </Feature>
  </div>
);
}`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-md font-medium mb-2">2. Protected Routes</h3>
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                    {`// app/admin/page.tsx
import { ProtectedRoute } from "@/lib/feature-flags/guards";
import { AdminDashboard } from "@/components/admin/dashboard";
import { AccessDenied } from "@/components/access-denied";

export default function AdminPage() {
return (
  <ProtectedRoute 
    featureId="admin-dashboard" 
    fallback={<AccessDenied message="Admin dashboard is not available" />}
  >
    <AdminDashboard />
  </ProtectedRoute>
);
}`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-md font-medium mb-2">3. Feature-Dependent Logic</h3>
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                    {`import { useFeatureFlags } from "@/lib/feature-flags/context";

function DataProcessor() {
const { isFeatureEnabled } = useFeatureFlags();

const processData = async (data) => {
  // Basic processing for everyone
  let result = await basicProcessing(data);
  
  // Advanced processing only if the feature is enabled
  if (isFeatureEnabled("advanced-processing")) {
    result = await advancedProcessing(result);
  }
  
  return result;
};

// Rest of component...
}`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-md font-medium mb-2">4. A/B Testing</h3>
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                    {`import { useFeatureFlags } from "@/lib/feature-flags/context";

function SignupForm() {
const { isFeatureEnabled } = useFeatureFlags();

// Determine which variant to show
const showVariantB = isFeatureEnabled("signup-variant-b");

return (
  <div>
    {showVariantB ? (
      <SignupFormVariantB onSubmit={handleSubmit} />
    ) : (
      <SignupFormVariantA onSubmit={handleSubmit} />
    )}
  </div>
);
}`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-md font-medium mb-2">5. Feature-Dependent API Calls</h3>
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                    {`import { useFeatureFlags } from "@/lib/feature-flags/context";

function UserProfile() {
const { isFeatureEnabled } = useFeatureFlags();
const [userData, setUserData] = useState(null);

useEffect(() => {
  async function fetchData() {
    // Determine which API endpoint to use based on feature flag
    const endpoint = isFeatureEnabled("enhanced-user-data")
      ? "/api/users/enhanced"
      : "/api/users/basic";
      
    const response = await fetch(endpoint);
    const data = await response.json();
    setUserData(data);
  }
  
  fetchData();
}, [isFeatureEnabled]);

// Rest of component...
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Topics</CardTitle>
              <CardDescription>Advanced usage and customization of the feature flag system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-2">Extending for Production Use</h3>
                  <p className="text-sm mb-2">
                    For production use, you might want to extend the system to use a database or API instead of file
                    system writes:
                  </p>
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                    {`// Example of modifying the system to use an API
"use client";

// In context.tsx
const saveFlags = async (flags) => {
try {
  const response = await fetch('/api/feature-flags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(flags)
  });
  
  if (!response.ok) {
    throw new Error('Failed to save flags');
  }
  
  return { success: true };
} catch (error) {
  console.error('Error saving flags:', error);
  return { success: false, error: error.message };
}
};

// Then in your API route (app/api/feature-flags/route.ts)
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Your database connection

export async function POST(request) {
try {
  const flags = await request.json();
  
  // Save to database
  await db.featureFlags.updateMany({
    data: flags
  });
  
  return NextResponse.json({ success: true });
} catch (error) {
  return NextResponse.json(
    { success: false, error: error.message },
    { status: 500 }
  );
}
}`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-md font-medium mb-2">User-Specific Flags</h3>
                  <p className="text-sm mb-2">You can extend the system to support user-specific feature flags:</p>
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                    {`// Modify the context to include user-specific flags
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // Or your auth solution

export const FeatureFlagProvider = ({ children }) => {
const [flags, setFlags] = useState([]);
const { data: session } = useSession();
const userId = session?.user?.id;

useEffect(() => {
  async function loadFlags() {
    // Load global flags
    const globalFlags = await fetch('/api/feature-flags').then(res => res.json());
    
    // Load user-specific flags if user is logged in
    let userFlags = [];
    if (userId) {
      userFlags = await fetch(\`/api/users/\${userId}/feature-flags\`).then(res => res.json());
    }
    
    // Merge flags, with user flags taking precedence
    const mergedFlags = [...globalFlags];
    
    userFlags.forEach(userFlag => {
      const index = mergedFlags.findIndex(f => f.id === userFlag.id);
      if (index >= 0) {
        mergedFlags[index] = { ...mergedFlags[index], ...userFlag };
      } else {
        mergedFlags.push(userFlag);
      }
    });
    
    setFlags(mergedFlags);
  }
  
  loadFlags();
}, [userId]);

// Rest of the context...
}`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-md font-medium mb-2">Gradual Rollout</h3>
                  <p className="text-sm mb-2">Implement percentage-based rollouts for features:</p>
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                    {`// Add a percentage field to your feature flag type
export type FeatureFlag = {
id: string;
name: string;
description: string;
enabled: boolean;
type: 'feature' | 'route' | 'component';
category?: string;
rolloutPercentage?: number; // 0-100
};

// Modify isFeatureEnabled to check percentage
const isFeatureEnabled = (featureId: string) => {
const flag = flags.find(f => f.id === featureId);

if (!flag || !flag.enabled) {
  return false;
}

// If no percentage is set, the feature is fully enabled
if (!flag.rolloutPercentage) {
  return true;
}

// Generate a consistent hash for the user
const userId = session?.user?.id || 'anonymous';
const hash = hashString(userId + featureId);
const normalizedHash = (hash % 100) + 1; // 1-100

return normalizedHash <= flag.rolloutPercentage;
};

// Simple string hash function
function hashString(str) {
let hash = 0;
for (let i = 0; i < str.length; i++) {
  const char = str.charCodeAt(i);
  hash = ((hash << 5) - hash) + char;
  hash = hash & hash; // Convert to 32bit integer
}
return Math.abs(hash);
}`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-md font-medium mb-2">Analytics Integration</h3>
                  <p className="text-sm mb-2">Track feature flag usage with analytics:</p>
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                    {`// Modify the isFeatureEnabled function to track usage
const isFeatureEnabled = (featureId: string) => {
const flag = flags.find(f => f.id === featureId);d === featureId);
const isEnabled = flag?.enabled || false;

// Track feature flag check in analytics
trackEvent('feature_flag_check', {
  featureId,
  isEnabled,
  userId: session?.user?.id || 'anonymous',
  timestamp: new Date().toISOString()
});

return isEnabled;
};

// Example analytics tracking function
function trackEvent(eventName, properties) {
// Integration with your analytics provider
analytics.track(eventName, properties);

// You could also log to your own backend
fetch('/api/analytics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ event: eventName, properties })
}).catch(err => console.error('Analytics error:', err));
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Best Practices</CardTitle>
              <CardDescription>Recommendations for effectively using feature flags</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium">Naming Conventions</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Use descriptive, consistent naming patterns</li>
                    <li>
                      Prefix flags by type (e.g., <code>feature-</code>, <code>route-</code>, <code>component-</code>)
                    </li>
                    <li>
                      Use kebab-case for IDs (e.g., <code>feature-advanced-analytics</code>)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-medium">Flag Lifecycle Management</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Regularly review and clean up unused flags</li>
                    <li>Document the purpose and expected lifetime of each flag</li>
                    <li>Remove flags for fully adopted features to keep the system manageable</li>
                    <li>Consider using a "sunset date" field for temporary flags</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-medium">Testing</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Test both enabled and disabled states of each feature</li>
                    <li>Include feature flag states in your test scenarios</li>
                    <li>Consider creating test helpers to easily toggle flags in tests</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-medium">Performance Considerations</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Minimize the number of flag checks in performance-critical paths</li>
                    <li>Consider caching flag values for frequently checked flags</li>
                    <li>Be mindful of the impact of feature flags on bundle size</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-medium">Security</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Restrict access to flag management in production environments</li>
                    <li>Consider implementing role-based access control for flag management</li>
                    <li>Audit flag changes, especially in production environments</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

