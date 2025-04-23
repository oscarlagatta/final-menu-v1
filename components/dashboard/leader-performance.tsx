"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FetchingProgress } from "@/components/ui/fetching-progress"
import { useMetricPerformanceData } from "@/lib/hooks/use-metrics"

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

interface LeaderData {
  id: string
  name: string
  green: number
  amber: number
  red: number
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
      leaderData = typedData.metricColorStatusByLeaders.map((leader: LeaderColorStatus) => ({
        id: leader.leaderId || "",
        name: leader.leaderName || "",
        green: leader.colorStatusByLeader?.greenCount || 0,
        amber: leader.colorStatusByLeader?.amberCount || 0,
        red: leader.colorStatusByLeader?.redCount || 0,
      }))
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
        <CardTitle className="text-xl font-bold">
          Leader Performance {selectedLeader ? `- ${selectedLeader.name}` : ""}
        </CardTitle>
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
          {leaderData.length > 0 ? (
            leaderData.map((leader) => (
              <div key={leader.id} className="mb-4">
                <div className="font-medium mb-1">{leader.name}</div>
                <div className="flex items-center">
                  {leader.green > 0 && (
                    <div
                      className="h-8 bg-green-600 text-white flex items-center justify-center rounded-md mr-1"
                      style={{
                        width: `${(leader.green / maxCount) * 100}%`,
                        minWidth: leader.green > 0 ? "40px" : "0",
                      }}
                    >
                      {leader.green}
                    </div>
                  )}
                  {leader.amber > 0 && (
                    <div
                      className="h-8 bg-amber-500 text-white flex items-center justify-center rounded-md mr-1"
                      style={{
                        width: `${(leader.amber / maxCount) * 100}%`,
                        minWidth: leader.amber > 0 ? "40px" : "0",
                      }}
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
            ))
          ) : (
            <div className="text-center text-gray-500">No leader data available</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
