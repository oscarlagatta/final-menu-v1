import { BarChart, LineChart, PieChart, TrendingUp } from "lucide-react"

export function AdvancedAnalytics() {
  return (
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
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="h-[160px] bg-white dark:bg-gray-800 rounded-md p-3 shadow-sm">
            <h4 className="text-sm font-medium mb-2">Revenue Breakdown</h4>
            <div className="h-[120px] flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-r from-green-200 to-green-500 rounded-md opacity-70"></div>
            </div>
          </div>
          <div className="h-[160px] bg-white dark:bg-gray-800 rounded-md p-3 shadow-sm">
            <h4 className="text-sm font-medium mb-2">User Growth</h4>
            <div className="h-[120px] flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-r from-blue-200 to-blue-500 rounded-md opacity-70"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

