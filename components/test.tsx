"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FetchingProgress } from "@/components/ui/fetching-progress"
import { useDashboardData } from "@/lib/hooks/use-dashboard-data"
import { useMetricsData } from "@/lib/hooks/use-metrics-data" // Added import for useMetricsData
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import dayjs from "dayjs"

// Update the type definition to make selectedMonth optional
type NonGreenMetricProps = {
  selectedMonth?: string // Format: "YYYY-MM", undefined means "All Months"
}

export default function NonGreenMetrics({ selectedMonth }: NonGreenMetricProps) {
  // Get the previous month using dayjs
  const previousMonth = dayjs().subtract(1, "month")
  const defaultMonth = previousMonth.format("YYYY-MM")

  // Use the same hooks that MetricsGrid is using
  // Use the selected month if provided, otherwise use the previous month
  const effectiveMonth = selectedMonth || defaultMonth
  const { sixMonthByMetricPerformance, sixMonthByMetricPerformanceQuery } = useDashboardData(undefined, effectiveMonth)

  // Get the useGetMetric hook from useMetricsData
  const { useGetMetric } = useMetricsData()

  // Update the process data section to handle the type issue
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
      .filter((metric: any) => {
        // Use type assertion to access color properties
        const firstMonthColor = (metric as any).firstMonth_Color?.toLowerCase()
        return firstMonthColor === "amber" || firstMonthColor === "red"
      })
      .map((metric: any) => {
        // Extract current and previous month values
        const currentValue = metric.firstMonth_Result ? Number.parseFloat(metric.firstMonth_Result.split("-")[0]) : 0

        const previousValue = metric.secondMonth_Result ? Number.parseFloat(metric.secondMonth_Result.split("-")[0]) : 0

        // Calculate change
        const change = previousValue > 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0

        // Get current month color
        const color = (metric as any).firstMonth_Color?.toLowerCase() || "grey"

        // Get current month result parts (percentage, numerator, denominator)
        const resultParts = metric.firstMonth_Result ? metric.firstMonth_Result.split("-") : ["0", "0", "0"]

        // Calculate breach count (denominator - numerator)
        const breachCount = Number.parseInt(resultParts[2]) - Number.parseInt(resultParts[1])

        return {
          metricId: metric.metricId,
          metricPrefix: metric.metricPrefix || `PM${String(metric.metricId).padStart(4, "0")}`,
          metricName: metric.metricName,
          currentValue,
          previousValue,
          change,
          isImproving: change > 0,
          color,
          breachCount,
          portfolioCount: Number.parseInt(resultParts[2]) || 0,
          resultParts,
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

  // Update the card title to show which month's data is being displayed
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">
          Non-Green Metrics {selectedMonth ? `(${selectedMonth})` : `(All Months - showing data from ${defaultMonth})`}
        </CardTitle>
        <CardDescription>
          Metrics not meeting target performance (Red and Amber) with month-over-month trend
        </CardDescription>
      </CardHeader>
      <CardContent>
        {nonGreenMetrics.length > 0 ? (
          <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-hide">
            {nonGreenMetrics.map((metric) => (
              <MetricCard key={metric.metricId} metric={metric} useGetMetric={useGetMetric} />
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

// Separate component for each metric card to handle individual metric detail fetching
function MetricCard({ metric, useGetMetric }) {
  // Fetch metric details using the provided hook
  const { data: metricDetail, isLoading: isMetricDetailLoading } = useGetMetric(metric.metricId)

  // Get the metric description from the details
  const metricDescription = metricDetail?.metricDescription || "No description available"

  return (
    <div className="p-4 rounded-md bg-gray-50 border border-gray-200 relative">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-medium text-gray-900">
            {metric.metricName} <span className="text-gray-500">({metric.metricPrefix})</span>
          </h3>

          {/* Display the metric description */}
          <p className="text-sm text-gray-600 italic line-clamp-1">
            {isMetricDetailLoading ? (
              <span className="inline-block w-64 h-4 bg-gray-200 animate-pulse rounded"></span>
            ) : (
              metricDescription
            )}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            {metric.resultParts[1]} in compliance across {metric.resultParts[2]} total tickets
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-md text-white font-medium ${
            metric.color === "red" ? "bg-red-600" : "bg-amber-500"
          }`}
        >
          {metric.currentValue.toFixed(2)}%
        </div>
      </div>

      <div className="mt-2 flex items-center text-sm">
        <span className="mr-2">Current vs previous:</span>
        <span className={`flex items-center ${metric.isImproving ? "text-green-600" : "text-red-600"}`}>
          {metric.currentValue.toFixed(2)}% vs {metric.previousValue.toFixed(2)}%
          {metric.isImproving ? <ArrowUpIcon className="h-4 w-4 ml-1" /> : <ArrowDownIcon className="h-4 w-4 ml-1" />}
        </span>
      </div>
    </div>
  )
}
