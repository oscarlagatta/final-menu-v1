"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FetchingProgress } from "@/components/ui/fetching-progress"
import { useDashboardData } from "@/lib/hooks/use-dashboard-data"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

type NonGreenMetricProps = {
  selectedMonth: string // Format: "YYYY-MM"
}

export default function NonGreenMetrics({ selectedMonth }: NonGreenMetricProps) {
  // Use the same hooks that MetricsGrid is using
  const { sixMonthByMetricPerformance, sixMonthByMetricPerformanceQuery } = useDashboardData()

  // Process data for the component
  const { nonGreenMetrics, isLoading } = useMemo(() => {
    if (
      sixMonthByMetricPerformanceQuery.isLoading ||
      !sixMonthByMetricPerformance ||
      sixMonthByMetricPerformance.length === 0
    ) {
      return {
        nonGreenMetrics: [],
        isLoading: true,
      }
    }

    // Filter metrics that are not green (amber or red) in the selected month
    const nonGreenMetrics = sixMonthByMetricPerformance
      .filter((metric) => {
        const firstMonthColor = metric.firstMonth_Color?.toLowerCase()
        return firstMonthColor === "amber" || firstMonthColor === "red"
      })
      .map((metric) => {
        // Extract current and previous month values
        const currentValue = metric.firstMonth_Result ? Number.parseFloat(metric.firstMonth_Result.split("-")[0]) : 0

        const previousValue = metric.secondMonth_Result ? Number.parseFloat(metric.secondMonth_Result.split("-")[0]) : 0

        // Calculate change
        const change = previousValue > 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0

        // Get current month color
        const color = metric.firstMonth_Color?.toLowerCase() || "grey"

        // Get current month result parts (percentage, numerator, denominator)
        const resultParts = metric.firstMonth_Result ? metric.firstMonth_Result.split("-") : ["0", "0", "0"]

        // Calculate breach count (denominator - numerator)
        const breachCount = Number.parseInt(resultParts[2]) - Number.parseInt(resultParts[1])

        return {
          metricId: metric.metricId,
          metricPrefix: metric.metricPrefix || `PM${String(metric.metricId).padStart(3, "0")}`,
          metricName: metric.metricName,
          currentValue,
          previousValue,
          change,
          isImproving: change > 0,
          color,
          breachCount,
          portfolioCount: Number.parseInt(resultParts[2]) || 0,
        }
      })
      // Sort by color (red first, then amber) and then by performance value (ascending)
      .sort((a, b) => {
        if (a.color === "red" && b.color !== "red") return -1
        if (a.color !== "red" && b.color === "red") return 1
        return a.currentValue - b.currentValue
      })

    return {
      nonGreenMetrics,
      isLoading: false,
    }
  }, [sixMonthByMetricPerformance, sixMonthByMetricPerformanceQuery.isLoading])

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">Non-Green Metrics</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <FetchingProgress />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Non-Green Metrics</CardTitle>
        <CardDescription>
          Metrics not meeting target performance (Red and Amber) with month-over-month trend
        </CardDescription>
      </CardHeader>
      <CardContent>
        {nonGreenMetrics.length > 0 ? (
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {nonGreenMetrics.map((metric) => (
              <div key={metric.metricId} className="p-4 rounded-md bg-gray-50 border border-gray-200 relative">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-medium text-gray-900">
                      {metric.metricPrefix} {metric.metricName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {metric.breachCount} metric breaches across {metric.portfolioCount} portfolios.
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-md text-white font-medium ${
                      metric.color === "red" ? "bg-red-600" : "bg-amber-500"
                    }`}
                  >
                    {metric.currentValue.toFixed(0)}%
                  </div>
                </div>

                <div className="mt-2 flex items-center text-sm">
                  <span className="mr-2">vs previous month:</span>
                  <span className={`flex items-center ${metric.isImproving ? "text-green-600" : "text-red-600"}`}>
                    {metric.isImproving ? (
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(metric.change).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px]">
            <p className="text-gray-500">No non-green metrics for the selected month.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
