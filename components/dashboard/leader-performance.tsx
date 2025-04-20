"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboardData } from "@/lib/hooks/use-dashboard-data"
import { FetchingProgress } from "@/components/ui/fetching-progress"

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
    // Use the dashboard data hooks to get the main metrics data
    const { sixMonthByMetricPerformance, sixMonthByMetricPerformanceQuery } = useDashboardData()

    // Process data for the chart
    const { leaderData, totals, isLoading, maxCount } = useMemo(() => {
        if (
            sixMonthByMetricPerformanceQuery.isLoading ||
            !sixMonthByMetricPerformance ||
            sixMonthByMetricPerformance.length === 0
        ) {
            return {
                leaderData: [],
                totals: { green: 0, amber: 0, red: 0, grey: 0 },
                isLoading: true,
                maxCount: 10,
            }
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

        // Create a set of leader names (in a real app, these would come from the SLT data)
        // For this simulation, we'll create leaders based on the metrics themselves
        const leaders = [
            "John Wilson",
            "Sarah Brown",
            "William Smith",
            "Emma Rodriguez",
            "Michael Johnson",
            "Lisa Davis",
            "David Miller",
            "Robert Garcia",
            "Jane Williams",
            "Olivia Jones",
        ]

        // Initialize leader map
        const leaderMap = new Map<string, { green: number; amber: number; red: number; grey: number }>()
        leaders.forEach((leader) => {
            leaderMap.set(leader, { green: 0, amber: 0, red: 0, grey: 0 })
        })

        // Track totals for the top-level summary
        const totals = { green: 0, amber: 0, red: 0, grey: 0 }

        // Distribute metrics among leaders
        sixMonthByMetricPerformance.forEach((metric, index) => {
            // Assign each metric to 1-3 random leaders
            const numLeaders = Math.floor(Math.random() * 3) + 1
            const assignedLeaders = new Set<string>()

            while (assignedLeaders.size < numLeaders) {
                const leaderIndex = Math.floor(Math.random() * leaders.length)
                assignedLeaders.add(leaders[leaderIndex])
            }

            // Get the color for the selected month
            const colorKey = colorField as keyof typeof metric
            const color = metric[colorKey] as string

            // Increment counters for each assigned leader
            assignedLeaders.forEach((leaderName) => {
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
        })

        // Convert map to array for rendering
        const leaderData: LeaderPerformanceData[] = Array.from(leaderMap.entries())
            .map(([name, counts]) => ({
                name,
                ...counts,
            }))
            // Filter out leaders with no metrics
            .filter((leader) => leader.green + leader.amber + leader.red + leader.grey > 0)

        // Sort leaders by name
        leaderData.sort((a, b) => a.name.localeCompare(b.name))

        // Calculate the maximum count for bar width scaling
        const maxCount = Math.max(
            10, // Minimum value to avoid division by zero
            ...leaderData.map((leader) => leader.green + leader.amber + leader.red + leader.grey),
        )

        return {
            leaderData,
            totals,
            isLoading: false,
            maxCount,
        }
    }, [sixMonthByMetricPerformance, sixMonthByMetricPerformanceQuery.isLoading, selectedMonth])

    if (isLoading) {
        return (
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold">Leader Performance</CardTitle>
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
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
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
