"use client"

import { useDashboardData } from "@bofa/data-services"
import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

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

type MetricTypeModel = {
  id?: number
  name?: string
  description?: string
  status?: boolean
  createdUserId?: number
  createdDateTime?: string | null
  createdBy?: string | null
  updatedBy?: string | null
  updatedUserId?: number
  updatedDateTime?: string | null
}

const formatMonth = (monthStr: string) => {
  if (!monthStr) return ""

  const [year, month] = monthStr.split("-")
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Convert month string to number and subtract 1 for zero-based index
  const monthIndex = Number.parseInt(month, 10) - 1

  // Format as 'MMM-YY'
  return `${monthNames[monthIndex]}-${year.slice(2)}`
}

interface MetricPerformanceTrendProps {
  selectedMonth?: string
  selectedMetricType?: Partial<MetricTypeModel> | null
  selectedLeader?: { id: string; name: string } | null
}

export default function MetricPerformanceTrend({
  selectedMonth,
  selectedMetricType,
  selectedLeader,
}: MetricPerformanceTrendProps) {
  const { sixMonthByMetricPerformance } = useDashboardData(selectedMonth, selectedLeader?.id, selectedMetricType?.id)

  // Process data for the chart
  const chartData = useMemo(() => {
    if (!sixMonthByMetricPerformance || sixMonthByMetricPerformance.length === 0) {
      return []
    }

    // Get all unique months from all metrics' monthlyData
    const allMonths = new Set<string>()

    // Collect all months from all metrics
    sixMonthByMetricPerformance.forEach((metric: MetricData) => {
      metric.monthlyData.forEach((monthData) => {
        allMonths.add(monthData.month)
      })
    })

    // Convert to array and sort by date (newest first)
    const sortedMonths = Array.from(allMonths).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    // Limit to 12 months if there are more
    const months = sortedMonths.slice(0, 12)

    return months
      .map((monthStr) => {
        // For each month, count the number of metrics in each status
        let greenCount = 0
        let amberCount = 0
        let redCount = 0
        let greyCount = 0

        // Count metrics by status for this month
        sixMonthByMetricPerformance.forEach((metric: MetricData) => {
          // Find the month data for this specific month
          const monthData = metric.monthlyData.find((md) => md.month === monthStr)

          if (!monthData) {
            greyCount++
            return
          }

          const color = monthData.color

          // Guard against null or undefined color values
          if (!color) {
            greyCount++
            return
          }

          // Case-insensitive comparison
          const colorLower = color.toLowerCase()

          if (colorLower === "#009223" || colorLower === "green") greenCount++
          else if (colorLower === "#ffbf00" || colorLower === "amber") amberCount++
          else if (colorLower === "#e61622" || colorLower === "red") redCount++
          else greyCount++
        })

        const totalCount = greenCount + amberCount + redCount + greyCount
        const countExcludingGrey = greenCount + amberCount + redCount

        const greenPercentage = countExcludingGrey > 0 ? Math.round((greenCount / countExcludingGrey) * 100) : 0

        return {
          month: formatMonth(monthStr),
          Green: greenCount,
          Amber: amberCount,
          Red: redCount,
          Grey: greyCount,
          Total: totalCount,
          GreenPercentage: greenPercentage,
          rawMonth: monthStr, // Keep the raw month for sorting
        }
      })
      .sort((a, b) => new Date(a.rawMonth).getTime() - new Date(b.rawMonth).getTime()) // Sort by date (oldest first)
  }, [sixMonthByMetricPerformance])

  // Calculate the maximum count for the y-axis
  const maxCount = useMemo(() => {
    if (chartData.length === 0) return 30 // Default max if no data

    const maxTotal = Math.max(...chartData.map((item) => item.Total))
    // Round up to the nearest 5
    return Math.ceil(maxTotal / 5) * 5
  }, [chartData])

  return (
    <Card className="shadow-xl transition-shadow duration-300 hover:shadow-2xl">
      <CardHeader>
        <CardTitle>
          Metric Performance Trend
          {selectedMetricType ? ` - ${selectedMetricType.name}` : ""}
          {selectedLeader ? ` - ${selectedLeader.name}` : ""}
          {selectedMonth ? ` - (${selectedMonth})` : " (All Months - Trend across all months)"}
        </CardTitle>
        <CardDescription>
          {chartData.length <= 6 ? "Six" : "Twelve"}-month trend showing metric status distribution and percentage of
          metrics meeting target (Green).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/20 flex h-[600px] w-full items-center justify-center rounded-md border border-dashed">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
              <YAxis
                yAxisId="left"
                orientation="left"
                domain={[0, maxCount]}
                tick={{ fontSize: 12 }}
                tickCount={7}
                axisLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12 }}
                tickCount={6}
                axisLine={false}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "GreenPercentage") {
                    return [`${value}%`, "% Green"]
                  }
                  return [value, name]
                }}
              />
              <Legend verticalAlign="bottom" iconType="square" wrapperStyle={{ paddingTop: "10px" }} />
              <Bar yAxisId="left" dataKey="Green" stackId="a" fill="#009223" name="Green" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="Amber" stackId="a" fill="#ffbf00" name="Amber" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="Red" stackId="a" fill="#e61622" name="Red" radius={[4, 4, 0, 0]} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="GreenPercentage"
                stroke="#000000"
                strokeWidth={2}
                name="% Green"
                dot={{ r: 4 }}
                label={{
                  position: "top",
                  formatter: (value: number) => `${value}%`,
                  fontSize: 12,
                  fill: "#000000",
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
