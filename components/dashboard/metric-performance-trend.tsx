
"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useDashboardData } from "@/lib/hooks/use-dashboard-data"

// Helper function to format month string
const formatMonth = (monthStr: string) => {
    if (!monthStr) return ""

    const [year, month] = monthStr.split("-")
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Convert month string to number and subtract 1 for zero-based index
    const monthIndex = Number.parseInt(month, 10) - 1

    // Format as "MMM-YY"
    return `${monthNames[monthIndex]}-${year.slice(2)}`
}

export default function MetricPerformanceTrend() {
    // Use the same hooks that MetricsGrid is using
    const { sixMonthByMetricPerformance } = useDashboardData()

    // Process data for the chart
    const chartData = useMemo(() => {
        if (!sixMonthByMetricPerformance || sixMonthByMetricPerformance.length === 0) {
            return []
        }

        // Get all months from the metrics data (6 months total)
        // We'll use the months from the first metric as they should be the same for all metrics
        const firstMetric = sixMonthByMetricPerformance[0]
        const months = [
            firstMetric.firstMonth,
            firstMetric.secondMonth,
            firstMetric.thirdMonth,
            firstMetric.fourthMonth,
            firstMetric.fiveMonth,
            firstMetric.sixMonth,
        ]

        // Create data points for each month
        return months
            .map((monthStr, index) => {
                // For each month, count the number of metrics in each status
                let greenCount = 0
                let amberCount = 0
                let redCount = 0
                let greyCount = 0

                // Map month index to color field (6 months total)
                const colorField = [
                    "firstMonth_Color",
                    "secondMonth_Color",
                    "thirdMonth_Color",
                    "fourthMonth_Color",
                    "fiveMonth_Color",
                    "sixMonth_Color",
                ][index]

                // Count metrics by status for this month using the color properties directly
                // Using case-insensitive comparison for robustness
                sixMonthByMetricPerformance.forEach((metric:any) => {
                    const colorKey = colorField as keyof typeof metric
                    const color = metric[colorKey] as string

                    // Guard against null or undefined color values
                    if (!color) {
                        greyCount++
                        return
                    }

                    // Case-insensitive comparison
                    const colorLower = color.toLowerCase()

                    if (colorLower === "green") greenCount++
                    else if (colorLower === "amber") amberCount++
                    else if (colorLower === "red") redCount++
                    else greyCount++ // Default to grey for any other value
                })

                const totalCount = greenCount + amberCount + redCount + greyCount
                const greenPercentage = totalCount > 0 ? Math.round((greenCount / totalCount) * 100) : 0

                return {
                    month: formatMonth(monthStr),
                    Green: greenCount,
                    Amber: amberCount,
                    Red: redCount,
                    Grey: greyCount,
                    Total: totalCount,
                    GreenPercentage: greenPercentage,
                }
            })
            .reverse() // Reverse to show oldest month first
    }, [sixMonthByMetricPerformance])

    // Calculate the maximum count for the y-axis
    const maxCount = useMemo(() => {
        if (chartData.length === 0) return 30 // Default max if no data

        const maxTotal = Math.max(...chartData.map((item) => item.Total))
        // Round up to the nearest 5
        return Math.ceil(maxTotal / 5) * 5
    }, [chartData])

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">METRIC PERFORMANCE TREND</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
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
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
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
                        <Bar yAxisId="left" dataKey="Green" stackId="a" fill="#16a34a" name="Green" />
                        <Bar yAxisId="left" dataKey="Amber" stackId="a" fill="#ea580c" name="Amber" />
                        <Bar yAxisId="left" dataKey="Red" stackId="a" fill="#dc2626" name="Red" />
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
            </CardContent>
        </Card>
    )
}
