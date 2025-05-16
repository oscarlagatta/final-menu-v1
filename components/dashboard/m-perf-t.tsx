"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useDashboardData } from "@/lib/hooks/use-dashboard-data"
import { FetchingProgress } from "@/components/ui/fetching-progress"

// Define the new API response structure
interface MonthData {
  month: string
  numerator: string
  denominator: string
  result: string
  color: string
  updatedDateTime: string | null
}

interface MetricData {
  metricId: number
  metricPrefix: string
  metricName: string
  valueType: string
  metricDescription: string
  metricCalculation: string
  serviceAlignment: string
  trigger: number
  limit: number
  source: string
  metricType: string
  thresholdDirection: string | null
  monthlyData: MonthData[]
}

type MetricPerformanceTrendProps = {
  selectedMonth?: string // Format: "YYYY-MM", undefined means "All Months"
  selectedLeader?: { id: string; name: string } | null // null means "All Leaders"
  metricTypeId?: number
}

export default function MetricPerformanceTrend({
  selectedMonth,
  selectedLeader,
  metricTypeId,
}: MetricPerformanceTrendProps) {
  const { sixMonthByMetricPerformance, sixMonthByMetricPerformanceQuery } = useDashboardData(
    selectedMonth,
    selectedLeader?.id,
    metricTypeId,
  )

  const chartData = useMemo(() => {
    if (!sixMonthByMetricPerformance || sixMonthByMetricPerformance.length === 0) {
      return []
    }

    // Collect all unique months across all metrics
    const uniqueMonths = new Set<string>()

    // Loop through all metrics to collect all available months
    sixMonthByMetricPerformance.forEach((metric: MetricData) => {
      metric.monthlyData.forEach((monthData: MonthData) => {
        uniqueMonths.add(monthData.month)
      })
    })

    // Convert to array and sort (newest first)
    const allMonths = Array.from(uniqueMonths).sort(
      (a: string, b: string) => new Date(b).getTime() - new Date(a).getTime(),
    )

    console.log(`Performance Trend: Found ${allMonths.length} unique months across all metrics:`, allMonths)

    // For each month, calculate the percentage of metrics that are green, amber, and red
    return allMonths.map((month) => {
      // Initialize counters
      let greenCount = 0
      let amberCount = 0
      let redCount = 0
      let totalCount = 0

      // Count metrics by color for this month
      sixMonthByMetricPerformance.forEach((metric: MetricData) => {
        // Find the month data for this metric
        const monthData = metric.monthlyData.find((m) => m.month === month)

        if (monthData) {
          totalCount++

          // Normalize color values
          const color = monthData.color.toLowerCase()
          if (color === "#009223" || color === "green") {
            greenCount++
          } else if (color === "#ffbf00" || color === "amber") {
            amberCount++
          } else if (color === "#e61622" || color === "red") {
            redCount++
          }
        }
      })

      // Calculate percentages - ensure proper rounding to whole numbers
      const greenPercent = totalCount > 0 ? Math.round((greenCount / totalCount) * 100) : 0
      const amberPercent = totalCount > 0 ? Math.round((amberCount / totalCount) * 100) : 0
      const redPercent = totalCount > 0 ? Math.round((redCount / totalCount) * 100) : 0

      // Format the month for display
      const monthDate = new Date(month)
      const formattedMonth = monthDate.toLocaleDateString("en-US", { year: "numeric", month: "short" })

      return {
        name: formattedMonth,
        Green: greenPercent,
        Amber: amberPercent,
        Red: redPercent,
        // Add raw counts for tooltip display
        greenCount,
        amberCount,
        redCount,
        totalCount,
        // Store original month string for filtering
        originalMonth: month,
      }
    })
  }, [sixMonthByMetricPerformance])

  // Filter chart data if a specific month is selected
  const filteredChartData = useMemo(() => {
    if (!selectedMonth || !chartData.length) return chartData

    return chartData.filter((data) => data.originalMonth.startsWith(selectedMonth))
  }, [chartData, selectedMonth])

  // Custom tooltip to show both percentage and raw counts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{label}</p>
          <p className="text-green-600">
            Green: {data.greenCount}/{data.totalCount} ({data.Green}%)
          </p>
          <p className="text-amber-500">
            Amber: {data.amberCount}/{data.totalCount} ({data.Amber}%)
          </p>
          <p className="text-red-600">
            Red: {data.redCount}/{data.totalCount} ({data.Red}%)
          </p>
        </div>
      )
    }
    return null
  }

  if (sixMonthByMetricPerformanceQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Metric Performance Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <FetchingProgress />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metric Performance Trend</CardTitle>
        <CardDescription>
          Percentage of metrics by performance status over time
          {selectedMonth ? ` (Filtered to ${selectedMonth})` : ""}
          {selectedLeader ? ` (Leader: ${selectedLeader.name})` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        {filteredChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredChartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
                label={{ value: "Percentage", angle: -90, position: "insideLeft" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="Green" stackId="a" name="Green" fill="#009223" />
              <Bar dataKey="Amber" stackId="a" name="Amber" fill="#ffbf00" />
              <Bar dataKey="Red" stackId="a" name="Red" fill="#e61622" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">No data available for the selected filters.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
