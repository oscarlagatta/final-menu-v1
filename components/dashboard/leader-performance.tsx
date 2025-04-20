"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboardData } from "@/lib/hooks/use-dashboard-data"

// Type for leader performance data
type LeaderPerformanceData = {
    name: string
    green: number
    amber: number
    red: number
    grey: number
}

type LeaderPerformanceProps = {
    selectedMonth: string // Format: "YYYY-MM"
}

export default function LeaderPerformance({ selectedMonth }: LeaderPerformanceProps) {
    // Use the same hooks that MetricsGrid is using
    const { sixMonthByMetricPerformance } = useDashboardData()

    // Process data for the chart
    const { leaderData, totals } = useMemo(() => {
        if (!sixMonthByMetricPerformance || sixMonthByMetricPerformance.length === 0) {
            return { leaderData: [], totals: { green: 0, amber: 0, red: 0, grey: 0 } }
        }

        // Find the month index that matches the selected month
        let monthIndex = 0
        const firstMetric = sixMonthByMetricPerformance[0]
        const months = [
            firstMetric.firstMonth,
            firstMetric.secondMonth,
            firstMetric.thirdMonth,
            firstMetric.fourthMonth,
            firstMetric.fiveMonth,
            firstMetric.sixMonth,
        ]

        monthIndex = months.findIndex((month) => month === selectedMonth)
        if (monthIndex === -1) monthIndex = 0 // Default to first month if not found

        // Map month index to color field
        const colorField = [
            "firstMonth_Color",
            "secondMonth_Color",
            "thirdMonth_Color",
            "fourthMonth_Color",
            "fiveMonth_Color",
            "sixMonth_Color",
        ][monthIndex]

        // Group metrics by leader (using serviceAlignment as leader name)
        // This is a simplification - you may need to adjust based on your actual data structure
        const leaderMap = new Map<string, { green: number; amber: number; red: number; grey: number }>()

        // Track totals for the top-level summary
        const totals = { green: 0, amber: 0, red: 0, grey: 0 }

        sixMonthByMetricPerformance.forEach((metric) => {
            // Use serviceAlignment as leader name, or "Unassigned" if null
            const leaderName = metric.serviceAlignment || "Unassigned"

            // Get the color for the selected month
            const colorKey = colorField as keyof typeof metric
            const color = metric[colorKey] as string

            // Initialize leader data if not exists
            if (!leaderMap.has(leaderName)) {
                leaderMap.set(leaderName, { green: 0, amber: 0, red: 0, grey: 0 })
            }

            // Get current counts for this leader
            const leaderCounts = leaderMap.get(leaderName)!

            // Increment the appropriate counter based on color (case-insensitive)
            if (!color) {
                leaderCounts.grey++
                totals.grey++
            } else {
                const colorLower = color.toLowerCase()
                if (colorLower === "green") {
                    leaderCounts.green++
                    totals.green++
                } else if (colorLower === "amber") {
                    leaderCounts.amber++
                    totals.amber++
                } else if (colorLower === "red") {
                    leaderCounts.red++
                    totals.red++
                } else {
                    leaderCounts.grey++
                    totals.grey++
                }
            }
        })

        // Convert map to array for rendering
        const leaderData: LeaderPerformanceData[] = Array.from(leaderMap.entries()).map(([name, counts]) => ({
            name,
            ...counts,
        }))

        // Sort leaders by name
        leaderData.sort((a, b) => a.name.localeCompare(b.name))

        return { leaderData, totals }
    }, [sixMonthByMetricPerformance, selectedMonth])

    // Calculate the maximum count for bar width scaling
    const maxCount = useMemo(() => {
        if (leaderData.length === 0) return 10

        return Math.max(...leaderData.map((leader) => leader.green + leader.amber + leader.red + leader.grey))
    }, [leaderData])

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">Leader Performance</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Top-Level Performance Summary */}
                <div className="mb-6">
                    <div className="text-lg font-medium mb-2">Top-Level Performance</div>
                    <div className="flex items-center">
                        {totals.green > 0 && (
                            <div
                                className="h-8 bg-green-600 text-white flex items-center justify-center rounded-md mr-1"
                                style={{ width: `${(totals.green / maxCount) * 100}%`, minWidth: totals.green > 0 ? "40px" : "0" }}
                            >
                                {totals.green}
                            </div>
                        )}
                        {totals.amber > 0 && (
                            <div
                                className="h-8 bg-amber-500 text-white flex items-center justify-center rounded-md mr-1"
                                style={{ width: `${(totals.amber / maxCount) * 100}%`, minWidth: totals.amber > 0 ? "40px" : "0" }}
                            >
                                {totals.amber}
                            </div>
                        )}
                        {totals.red > 0 && (
                            <div
                                className="h-8 bg-red-600 text-white flex items-center justify-center rounded-md"
                                style={{ width: `${(totals.red / maxCount) * 100}%`, minWidth: totals.red > 0 ? "40px" : "0" }}
                            >
                                {totals.red}
                            </div>
                        )}
                    </div>
                </div>

                {/* Individual Leader Performance */}
                <div className="space-y-4">
                    {leaderData.map((leader) => (
                        <div key={leader.name} className="mb-4">
                            <div className="font-medium mb-1">{leader.name}</div>
                            <div className="flex items-center">
                                {leader.green > 0 && (
                                    <div
                                        className="h-8 bg-green-600 text-white flex items-center justify-center rounded-md mr-1"
                                        style={{ width: `${(leader.green / maxCount) * 100}%`, minWidth: leader.green > 0 ? "40px" : "0" }}
                                    >
                                        {leader.green}
                                    </div>
                                )}
                                {leader.amber > 0 && (
                                    <div
                                        className="h-8 bg-amber-500 text-white flex items-center justify-center rounded-md mr-1"
                                        style={{ width: `${(leader.amber / maxCount) * 100}%`, minWidth: leader.amber > 0 ? "40px" : "0" }}
                                    >
                                        {leader.amber}
                                    </div>
                                )}
                                {leader.red > 0 && (
                                    <div
                                        className="h-8 bg-red-600 text-white flex items-center justify-center rounded-md"
                                        style={{ width: `${(leader.red / maxCount) * 100}%`, minWidth: leader.red > 0 ? "40px" : "0" }}
                                    >
                                        {leader.red}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
