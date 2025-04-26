"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FetchingProgress } from "@/components/ui/fetching-progress"
import { useMetricPerformanceData } from "@/lib/hooks/use-metrics"
// First, import the Tooltip components at the top of the file
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// First, update the interface definitions to include detailed metrics information

// Add this interface for detailed metric information
interface MetricDetail {
  metricId: number
  metricName: string
  metricPrefix: string
  currentValue: number
  target: number
  status: "Green" | "Amber" | "Red"
}

// Define types for the API response
interface ColorStatus {
  greenCount: number
  amberCount: number
  redCount: number
}

interface LeaderColorStatus {
  leaderId: string
  leaderName: string
  colorStatusByLeader: ColorStatus
}

interface PerformanceData {
  reportingMonth: string
  colorStatus: ColorStatus
  metricColorStatusByLeaders: LeaderColorStatus[]
}

// Update the LeaderData interface to include metrics details
interface LeaderData {
  id: string
  name: string
  green: number
  amber: number
  red: number
  // Add metrics details
  metrics?: MetricDetail[]
}

type LeaderPerformanceProps = {
  selectedMonth: string // Format: "YYYY-MM"
  selectedLeader: { id: string; name: string } | null
}

export default function LeaderPerformance({ selectedMonth, selectedLeader }: LeaderPerformanceProps) {
  // Get metric performance data using the provided hook
  const { data: performanceData, isLoading: performanceLoading } = useMetricPerformanceData(
    selectedMonth,
    selectedLeader?.id,
  )

  // Process data for the chart
  const { leaderData, totals, maxCount } = useMemo(() => {
    if (!performanceData) {
      return {
        leaderData: [] as LeaderData[],
        totals: { green: 0, amber: 0, red: 0 },
        maxCount: 10,
      }
    }

    // Cast the data to our defined type
    const typedData = performanceData as PerformanceData

    // Get the summary totals - ensure defaults if properties don't exist
    const totals = {
      green: typedData.colorStatus?.greenCount || 0,
      amber: typedData.colorStatus?.amberCount || 0,
      red: typedData.colorStatus?.redCount || 0,
    }

    // Get leader data - ensure we have an array to map over
    let leaderData: LeaderData[] = []

    if (typedData.metricColorStatusByLeaders && Array.isArray(typedData.metricColorStatusByLeaders)) {
      // In the useMemo function where we process the data, add mock metrics details
      // Find the section where we map the leader data and add:

      leaderData = typedData.metricColorStatusByLeaders
        .map((leader: LeaderColorStatus) => {
          // Create mock metrics details for demonstration
          // In a real implementation, this would come from your API
          const mockMetrics: MetricDetail[] = []

          // Add some mock green metrics
          for (let i = 0; i < Math.min(leader.colorStatusByLeader?.greenCount || 0, 3); i++) {
            mockMetrics.push({
              metricId: 1000 + i,
              metricPrefix: `PM${(1000 + i).toString().substring(1)}`,
              metricName: `Performance Metric ${i + 1}`,
              currentValue: 85 + Math.floor(Math.random() * 10),
              target: 80,
              status: "Green",
            })
          }

          // Add some mock amber metrics
          for (let i = 0; i < Math.min(leader.colorStatusByLeader?.amberCount || 0, 3); i++) {
            mockMetrics.push({
              metricId: 2000 + i,
              metricPrefix: `PM${(2000 + i).toString().substring(1)}`,
              metricName: `Response Time Metric ${i + 1}`,
              currentValue: 65 + Math.floor(Math.random() * 10),
              target: 75,
              status: "Amber",
            })
          }

          // Add some mock red metrics
          for (let i = 0; i < Math.min(leader.colorStatusByLeader?.redCount || 0, 3); i++) {
            mockMetrics.push({
              metricId: 3000 + i,
              metricPrefix: `PM${(3000 + i).toString().substring(1)}`,
              metricName: `Critical Metric ${i + 1}`,
              currentValue: 50 + Math.floor(Math.random() * 10),
              target: 70,
              status: "Red",
            })
          }

          return {
            id: leader.leaderId || "",
            name: leader.leaderName || "",
            green: leader.colorStatusByLeader?.greenCount || 0,
            amber: leader.colorStatusByLeader?.amberCount || 0,
            red: leader.colorStatusByLeader?.redCount || 0,
            metrics: mockMetrics,
          }
        })
        // Filter out leaders with no metrics (all counts are 0)
        .filter((leader) => leader.green > 0 || leader.amber > 0 || leader.red > 0)
    }

    // If a leader is selected, filter to show only that leader
    if (selectedLeader) {
      leaderData = leaderData.filter((leader) => leader.id === selectedLeader.id)
    }

    // Calculate the maximum count for bar width scaling
    // Use a safe approach to calculate max count
    const leaderSums =
      leaderData.length > 0 ? leaderData.map((leader) => leader.green + leader.amber + leader.red) : [0]

    const maxCount = Math.max(
      10, // Minimum value to avoid division by zero
      ...leaderSums,
      totals.green + totals.amber + totals.red,
    )

    return {
      leaderData,
      totals,
      maxCount,
    }
  }, [performanceData, selectedLeader])

  if (performanceLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-7 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="h-[400px]">
          {/* Top-Level Performance Summary Skeleton */}
          <div className="mb-6">
            <Skeleton className="h-6 w-48 mb-3" />
            <div className="flex items-center">
              <Skeleton className="h-8 w-1/3 rounded-md mr-1" />
              <Skeleton className="h-8 w-1/4 rounded-md mr-1" />
              <Skeleton className="h-8 w-1/5 rounded-md" />
            </div>
          </div>

          {/* Individual Leader Performance Skeletons */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="mb-4">
                <Skeleton className="h-5 w-40 mb-1" />
                <div className="flex items-center">
                  <Skeleton className="h-8 w-1/3 rounded-md mr-1" />
                  <Skeleton className="h-8 w-1/4 rounded-md mr-1" />
                  <Skeleton className="h-8 w-1/5 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">
          Leader Performance {selectedLeader ? `- ${selectedLeader.name}` : ""}
        </CardTitle>
        <CardDescription>
          Distribution of metrics by status (Green, Amber, Red) for each leader compared to overall performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Top-Level Performance Summary */}
        <div className="mb-6">
          <div className="text-lg font-medium mb-2">Top-Level Performance</div>
          <div className="flex items-center">
            {totals.green > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="h-8 bg-green-600 text-white flex items-center justify-center rounded-md mr-1 cursor-help"
                      style={{
                        width: `${(totals.green / maxCount) * 100}%`,
                        minWidth: totals.green > 0 ? "40px" : "0",
                      }}
                    >
                      {totals.green}
                    </div>
                  </TooltipTrigger>
                  {/* Also update the top-level tooltips to show summary information
                  // For the green top-level tooltip: */}
                  <TooltipContent side="top" className="max-w-md p-4">
                    <div className="space-y-2">
                      <p className="font-medium">Green Metrics: {totals.green}</p>
                      <p className="text-xs text-muted-foreground">Metrics meeting or exceeding target performance</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round((totals.green / (totals.green + totals.amber + totals.red)) * 100)}% of total
                        metrics
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {totals.amber > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="h-8 bg-amber-500 text-white flex items-center justify-center rounded-md mr-1 cursor-help"
                      style={{
                        width: `${(totals.amber / maxCount) * 100}%`,
                        minWidth: totals.amber > 0 ? "40px" : "0",
                      }}
                    >
                      {totals.amber}
                    </div>
                  </TooltipTrigger>
                  {/* For the amber top-level tooltip: */}
                  <TooltipContent side="top" className="max-w-md p-4">
                    <div className="space-y-2">
                      <p className="font-medium">Amber Metrics: {totals.amber}</p>
                      <p className="text-xs text-muted-foreground">Metrics between limit and target performance</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round((totals.amber / (totals.green + totals.amber + totals.red)) * 100)}% of total
                        metrics
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {totals.red > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="h-8 bg-red-600 text-white flex items-center justify-center rounded-md cursor-help"
                      style={{ width: `${(totals.red / maxCount) * 100}%`, minWidth: totals.red > 0 ? "40px" : "0" }}
                    >
                      {totals.red}
                    </div>
                  </TooltipTrigger>
                  {/* For the red top-level tooltip: */}
                  <TooltipContent side="top" className="max-w-md p-4">
                    <div className="space-y-2">
                      <p className="font-medium">Red Metrics: {totals.red}</p>
                      <p className="text-xs text-muted-foreground">Metrics below limit performance</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round((totals.red / (totals.green + totals.amber + totals.red)) * 100)}% of total metrics
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        {/* Individual Leader Performance */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {leaderData.length > 0 ? (
            leaderData.map((leader) => (
              <div key={leader.id} className="mb-4">
                <div className="font-medium mb-1">{leader.name}</div>
                <div className="flex items-center">
                  {leader.green > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="h-8 bg-green-600 text-white flex items-center justify-center rounded-md mr-1 cursor-help"
                            style={{
                              width: `${(leader.green / maxCount) * 100}%`,
                              minWidth: leader.green > 0 ? "40px" : "0",
                            }}
                          >
                            {leader.green}
                          </div>
                        </TooltipTrigger>
                        {/* Now update the tooltip content for the leader metrics to include the summary
                        // Find the TooltipContent for green metrics and replace with: */}
                        <TooltipContent side="top" className="max-w-md p-4">
                          <div className="space-y-2">
                            <p className="font-medium">
                              {leader.name} - Green Metrics: {leader.green}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Metrics meeting or exceeding target performance
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {Math.round((leader.green / (leader.green + leader.amber + leader.red)) * 100)}% of total
                              metrics
                            </p>

                            {leader.metrics && leader.metrics.filter((m) => m.status === "Green").length > 0 && (
                              <div className="mt-2 border-t pt-2">
                                <p className="text-sm font-medium mb-1">Top performing metrics:</p>
                                <div className="space-y-1 max-h-40 overflow-y-auto">
                                  {leader.metrics
                                    .filter((m) => m.status === "Green")
                                    .slice(0, 3)
                                    .map((metric) => (
                                      <div key={metric.metricId} className="text-xs p-1 bg-green-50 rounded">
                                        <div className="font-medium">
                                          {metric.metricPrefix}: {metric.metricName}
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Current: {metric.currentValue}%</span>
                                          <span>Target: {metric.target}%</span>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {leader.amber > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="h-8 bg-amber-500 text-white flex items-center justify-center rounded-md mr-1 cursor-help"
                            style={{
                              width: `${(leader.amber / maxCount) * 100}%`,
                              minWidth: leader.amber > 0 ? "40px" : "0",
                            }}
                          >
                            {leader.amber}
                          </div>
                        </TooltipTrigger>
                        {/* Do the same for amber metrics tooltip: */}
                        <TooltipContent side="top" className="max-w-md p-4">
                          <div className="space-y-2">
                            <p className="font-medium">
                              {leader.name} - Amber Metrics: {leader.amber}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Metrics between limit and target performance
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {Math.round((leader.amber / (leader.green + leader.amber + leader.red)) * 100)}% of total
                              metrics
                            </p>

                            {leader.metrics && leader.metrics.filter((m) => m.status === "Amber").length > 0 && (
                              <div className="mt-2 border-t pt-2">
                                <p className="text-sm font-medium mb-1">Metrics needing attention:</p>
                                <div className="space-y-1 max-h-40 overflow-y-auto">
                                  {leader.metrics
                                    .filter((m) => m.status === "Amber")
                                    .slice(0, 3)
                                    .map((metric) => (
                                      <div key={metric.metricId} className="text-xs p-1 bg-amber-50 rounded">
                                        <div className="font-medium">
                                          {metric.metricPrefix}: {metric.metricName}
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Current: {metric.currentValue}%</span>
                                          <span>Target: {metric.target}%</span>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {leader.red > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="h-8 bg-red-600 text-white flex items-center justify-center rounded-md cursor-help"
                            style={{
                              width: `${(leader.red / maxCount) * 100}%`,
                              minWidth: leader.red > 0 ? "40px" : "0",
                            }}
                          >
                            {leader.red}
                          </div>
                        </TooltipTrigger>
                        {/* And for red metrics tooltip: */}
                        <TooltipContent side="top" className="max-w-md p-4">
                          <div className="space-y-2">
                            <p className="font-medium">
                              {leader.name} - Red Metrics: {leader.red}
                            </p>
                            <p className="text-xs text-muted-foreground">Metrics below limit performance</p>
                            <p className="text-xs text-muted-foreground">
                              {Math.round((leader.red / (leader.green + leader.amber + leader.red)) * 100)}% of total
                              metrics
                            </p>

                            {leader.metrics && leader.metrics.filter((m) => m.status === "Red").length > 0 && (
                              <div className="mt-2 border-t pt-2">
                                <p className="text-sm font-medium mb-1">Critical metrics:</p>
                                <div className="space-y-1 max-h-40 overflow-y-auto">
                                  {leader.metrics
                                    .filter((m) => m.status === "Red")
                                    .slice(0, 3)
                                    .map((metric) => (
                                      <div key={metric.metricId} className="text-xs p-1 bg-red-50 rounded">
                                        <div className="font-medium">
                                          {metric.metricPrefix}: {metric.metricName}
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Current: {metric.currentValue}%</span>
                                          <span>Target: {metric.target}%</span>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No leader data available</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
