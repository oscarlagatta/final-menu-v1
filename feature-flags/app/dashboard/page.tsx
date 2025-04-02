import { Feature } from "@/lib/feature-flags/guards"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  LineChart,
  PieChart,
  Activity,
  Users,
  TrendingUp,
  Zap,
  Layers,
  Search,
  Filter,
  Download,
  Crown,
} from "lucide-react"
import Link from "next/link"
import { FeatureFlagStatus } from "@/components/feature-flag-status"
import { DashboardHeader } from "@/components/dashboard/header"

export default function DashboardPage() {
  return (
    <div className="container py-10">
      <DashboardHeader />

      <div className="grid gap-6 mt-8">
        {/* Analytics Section */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>View your key performance metrics</CardDescription>
              </div>
              <FeatureFlagStatus featureId="advanced-analytics" />
            </div>
          </CardHeader>
          <CardContent>
            <Feature
              featureId="advanced-analytics"
              fallback={
                <div className="space-y-4">
                  <div className="bg-muted/40 p-4 rounded-md border">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-medium">Basic Analytics</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      This is the basic analytics view. Enable the "advanced-analytics" feature flag to see the enhanced
                      version.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-[120px] bg-muted/60 rounded-md flex items-center justify-center">
                        <p className="text-xs text-muted-foreground">Basic Chart 1</p>
                      </div>
                      <div className="h-[120px] bg-muted/60 rounded-md flex items-center justify-center">
                        <p className="text-xs text-muted-foreground">Basic Chart 2</p>
                      </div>
                    </div>
                  </div>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-md border border-green-200 dark:border-green-900">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium text-green-800 dark:text-green-400">Advanced Analytics Enabled</h3>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                    You're viewing the advanced analytics dashboard with enhanced visualizations and metrics.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Revenue</h4>
                        <BarChart className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-2xl font-bold">$48,234</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-green-500">↑ 12%</span>
                        <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Users</h4>
                        <LineChart className="h-4 w-4 text-blue-500" />
                      </div>
                      <p className="text-2xl font-bold">12,543</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-green-500">↑ 8%</span>
                        <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Conversion</h4>
                        <PieChart className="h-4 w-4 text-purple-500" />
                      </div>
                      <p className="text-2xl font-bold">24.8%</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-red-500">↓ 3%</span>
                        <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Feature>
          </CardContent>
        </Card>

        {/* Data Grid Section */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Data Explorer</CardTitle>
                <CardDescription>Explore and analyze your data</CardDescription>
              </div>
              <FeatureFlagStatus featureId="component-data-grid" />
            </div>
          </CardHeader>
          <CardContent>
            <Feature
              featureId="component-data-grid"
              fallback={
                <div className="space-y-4">
                  <div className="bg-muted/40 p-4 rounded-md border">
                    <h3 className="font-medium mb-4">Standard Data Table</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This is the standard data table. Enable the "component-data-grid" feature flag to see the enhanced
                      version.
                    </p>
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="p-2 text-left">ID</th>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Status</th>
                            <th className="p-2 text-left">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="border-t">
                              <td className="p-2">PRJ-{1000 + i}</td>
                              <td className="p-2">Project {i + 1}</td>
                              <td className="p-2">{i % 2 === 0 ? "Active" : "Completed"}</td>
                              <td className="p-2">2023-0{i + 1}-01</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-md border border-blue-200 dark:border-blue-900">
                  <h3 className="font-medium text-blue-800 dark:text-blue-400 mb-4">Advanced Data Grid</h3>

                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="search"
                        placeholder="Search..."
                        className="w-full pl-8 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-9">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm" className="h-9">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md border overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="p-2 text-left">ID</th>
                          <th className="p-2 text-left">Name</th>
                          <th className="p-2 text-left">Status</th>
                          <th className="p-2 text-left">Category</th>
                          <th className="p-2 text-left">Progress</th>
                          <th className="p-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 5 }).map(
                          (_, i) =>
                            (
                              <tr key={i} className="bg-white dark:bg-length: 5}).map((_, i) => (
                        <tr key={i} className="bg-white dark:bg-gray-800 border-t">\
                          <td className="p-2 font-medium">PRJ-{1000 + i}</td>
                          <td className="p-2">Enhanced Project {i + 1}</td>
                          <td className="p-2">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              i % 2 === 0 
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                                : "bg-muted/50 text-muted-foreground"
                            }`}>
                              {i % 2 === 0 ? "Active" : "Completed"}
                            </span>
                          </td>
                          <td className="p-2">{i % 3 === 0 ? "Marketing" : i % 3 === 1 ? "Development" : "Design"}</td>
                          <td className="p-2">
                            <div className="w-full bg-muted rounded-full h-2.5 dark:bg-gray-700">
                              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(i + 1) * 20}%` }}></div>
                            </div>
                            <span className="text-xs text-muted-foreground">{(i + 1) * 20}%</span>
                          </td>
                          <td className="p-2 text-right">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                            ),
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">Showing 5 of 25 entries</div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm">
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Feature>
          </CardContent>
        </Card>

        {/* Premium Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Feature featureId="premium-features">
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
                    <BarChart className="h-5 w-5" />
                    <CardTitle className="text-lg">Advanced Reporting</CardTitle>
                  </div>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </span>
                </div>
                <CardDescription className="text-yellow-700 dark:text-yellow-300/70">
                  Generate custom reports with advanced filtering and export options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[100px] bg-yellow-100/50 dark:bg-yellow-900/20 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">Premium feature content</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600">
                  Access Feature
                </Button>
              </CardFooter>
            </Card>
          </Feature>

          <Feature featureId="premium-features">
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
                    <Users className="h-5 w-5" />
                    <CardTitle className="text-lg">User Insights</CardTitle>
                  </div>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </span>
                </div>
                <CardDescription className="text-yellow-700 dark:text-yellow-300/70">
                  Detailed user behavior analytics and engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[100px] bg-yellow-100/50 dark:bg-yellow-900/20 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">Premium feature content</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600">
                  Access Feature
                </Button>
              </CardFooter>
            </Card>
          </Feature>
        </div>

        {/* Experimental UI Section */}
        <Feature featureId="experimental-ui">
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-blue-600" />
                    Experimental UI
                  </CardTitle>
                  <CardDescription>You're previewing our new experimental user interface</CardDescription>
                </div>
                <FeatureFlagStatus featureId="experimental-ui" />
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border shadow-sm dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Total Users</h3>
                        <Users className="h-4 w-4 text-blue-500" />
                      </div>
                      <p className="text-2xl font-bold mt-2">12,543</p>
                      <p className="text-xs text-green-500 mt-1">↑ 12% from last month</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border shadow-sm dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Revenue</h3>
                        <Activity className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-2xl font-bold mt-2">$48,234</p>
                      <p className="text-xs text-green-500 mt-1">↑ 8% from last month</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border shadow-sm dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Active Projects</h3>
                        <Layers className="h-4 w-4 text-purple-500" />
                      </div>
                      <p className="text-2xl font-bold mt-2">237</p>
                      <p className="text-xs text-red-500 mt-1">↓ 3% from last month</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="analytics" className="p-4">
                  <div className="h-[200px] flex items-center justify-center border rounded-md bg-muted/40">
                    <p className="text-muted-foreground">Analytics charts would appear here</p>
                  </div>
                </TabsContent>
                <TabsContent value="reports" className="p-4">
                  <div className="h-[200px] flex items-center justify-center border rounded-md bg-muted/40">
                    <p className="text-muted-foreground">Reports would appear here</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="bg-blue-100/50 dark:bg-blue-900/20">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                This is an experimental UI. Please provide feedback on your experience.
              </p>
            </CardFooter>
          </Card>
        </Feature>

        {/* Feature Flag Management Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Feature Flag Demo</CardTitle>
            <CardDescription>
              This dashboard demonstrates the feature flag system in action. Toggle flags using the Feature Flag Manager
              in the header.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>This dashboard demonstrates several feature flags:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>advanced-analytics</strong> - Toggles between basic and advanced analytics visualizations
                </li>
                <li>
                  <strong>component-data-grid</strong> - Toggles between a standard table and an advanced data grid
                </li>
                <li>
                  <strong>premium-features</strong> - Controls visibility of premium feature cards
                </li>
                <li>
                  <strong>experimental-ui</strong> - Shows or hides the experimental UI section
                </li>
              </ul>
              <p className="mt-4">
                Use the Feature Flag Manager in the header to toggle these flags and see the changes in real-time.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/feature-flags/manage">
              <Button>Manage Feature Flags</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

