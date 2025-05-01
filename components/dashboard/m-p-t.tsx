"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useDashboardData } from "@/lib/hooks/use-dashboard-data"
import { FetchingProgress } from "@/components/ui/fetching-progress"

type MetricPerformanceTrendProps = {
  selectedMonth?: string // Format: "YYYY-MM", undefined means "All Months"
}

export default function MetricPerformanceTrend({ selectedMonth }: MetricPerformanceTrendProps) {
  const { sixMonthByMetricPerformance, sixMonthByMetricPerformanceQuery } = useDashboardData(selectedMonth)

  const chartData = useMemo(() => {
    if (!sixMonthByMetricPerformance || sixMonthByMetricPerformance.length === 0) {
      return []
    }

    // Get the first metric to extract month names
    const firstMetric = sixMonthByMetricPerformance[0]
    const months = [
      firstMetric.firstMonth,
      firstMetric.secondMonth,
      firstMetric.thirdMonth,
      firstMetric.fourthMonth,
      firstMetric.fivehMonth,
      firstMetric.sixthMonth,
    ].filter(Boolean) // Filter out any undefined months

    // For each month, calculate the percentage of metrics that are green, amber, and red
    return months.map((month) => {
      // Initialize counters
      let greenCount = 0
      let amberCount = 0
      let redCount = 0
      let totalCount = 0

      // Count metrics by color for this month
      sixMonthByMetricPerformance.forEach((metric) => {
        let monthIndex = 0
        let monthColor = ""

        // Determine which month we're looking at and get its color
        if (month === metric.firstMonth) {
          monthColor = metric.firstMonth_Color?.toLowerCase() || ""
          monthIndex = 1
        } else if (month === metric.secondMonth) {
          monthColor = metric.secondMonth_Color?.toLowerCase() || ""
          monthIndex = 2
        } else if (month === metric.thirdMonth) {
          monthColor = metric.thirdMonth_Color?.toLowerCase() || ""
          monthIndex = 3
        } else if (month === metric.fourthMonth) {
          monthColor = metric.fourthMonth_Color?.toLowerCase() || ""
          monthIndex = 4
        } else if (month === metric.fivehMonth) {
          monthColor = metric.fiveMonth_Color?.toLowerCase() || ""
          monthIndex = 5
        } else if (month === metric.sixthMonth) {
          monthColor = metric.sixthMonth_Color?.toLowerCase() || ""
          monthIndex = 6
        }

        // Only count if we have a color
        if (monthColor) {
          totalCount++

          // Normalize color values
          if (monthColor === "#009223" || monthColor === "green") {
            greenCount++
          } else if (monthColor === "#ffbf00" || monthColor === "amber") {
            amberCount++
          } else if (monthColor === "#e61622" || monthColor === "red") {
            redCount++
          }
        }
      })

      // Calculate percentages - Fix: ensure proper rounding to whole numbers
      const greenPercent = totalCount > 0 ? Math.round((greenCount / totalCount) * 100) : 0
      const amberPercent = totalCount > 0 ? Math.round((amberCount / totalCount) * 100) : 0
      const redPercent = totalCount > 0 ? Math.round((redCount / totalCount) * 100) : 0

      // Add debug information to verify counts
      console.log(`Month: ${month}, Green: ${greenCount}/${totalCount} = ${greenPercent}%`)

      return {
        name: month,
        Green: greenPercent,
        Amber: amberPercent,
        Red: redPercent,
        // Add raw counts for tooltip display
        greenCount,
        amberCount,
        redCount,
        totalCount,
      }
    })
  }, [sixMonthByMetricPerformance])

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
        <CardDescription>Percentage of metrics by performance status over time</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
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
      </CardContent>
    </Card>
  )
}
