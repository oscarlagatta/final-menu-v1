import { Button } from "@/components/ui/button"
import { Feature } from "@/lib/feature-flags/guards"

export default function Home() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Application</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Standard Features</h2>
          <p className="text-muted-foreground mb-4">These features are always available in the application.</p>
          <Button variant="outline" className="w-full">
            Access Features
          </Button>
        </div>

        <Feature featureId="advanced-analytics">
          <div className="p-6 border rounded-lg border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
            <h2 className="text-xl font-semibold mb-4">Advanced Analytics</h2>
            <p className="text-muted-foreground mb-4">Access advanced analytics and reporting features.</p>
            <Button variant="outline" className="w-full">
              Open Analytics
            </Button>
          </div>
        </Feature>

        <Feature featureId="experimental-ui">
          <div className="p-6 border rounded-lg border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
            <h2 className="text-xl font-semibold mb-4">Experimental UI</h2>
            <p className="text-muted-foreground mb-4">Try out our experimental user interface components.</p>
            <Button variant="outline" className="w-full">
              Explore UI
            </Button>
          </div>
        </Feature>

        <Feature featureId="component-data-grid">
          <div className="p-6 border rounded-lg border-purple-200 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-900">
            <h2 className="text-xl font-semibold mb-4">Advanced Data Grid</h2>
            <p className="text-muted-foreground mb-4">Use our powerful data grid component for complex data.</p>
            <Button variant="outline" className="w-full">
              Open Data Grid
            </Button>
          </div>
        </Feature>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
        <p className="mb-4">
          This application uses feature flags to control features, routes, and components. To learn more about feature
          flags and how to use them, visit the{" "}
          <a href="/features" className="font-medium underline">
            documentation page
          </a>
          .
        </p>
        <p>
          In development, UAT, and test environments, you can manage feature flags using the Feature Flag Manager in the
          header.
        </p>
      </div>
    </div>
  )
}

