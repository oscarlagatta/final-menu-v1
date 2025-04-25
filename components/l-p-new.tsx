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
  total: number
  greenPercentage: number
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
        totals: { green: 0, amber: 0, red: 0, total: 0, greenPercentage: 0 },
        maxCount: 10,
      }
    }

    // Cast the data to our defined type
    const typedData = performanceData as PerformanceData

    // Get the summary totals - ensure defaults if properties don't exist
    const greenCount = typedData.colorStatus?.greenCount || 0
    const amberCount = typedData.colorStatus?.amberCount || 0
    const redCount = typedData.colorStatus?.redCount || 0
    const totalCount = greenCount + amberCount + redCount

    const totals = {
      green: greenCount,
      amber: amberCount,
      red: redCount,
      total: totalCount,
      greenPercentage: totalCount > 0 ? Math.round((greenCount / totalCount) * 100) : 0,
    }

    // Get leader data - ensure we have an array to map over
    let leaderData: LeaderData[] = []

    if (typedData.metricColorStatusByLeaders && Array.isArray(typedData.metricColorStatusByLeaders)) {
      leaderData = typedData.metricColorStatusByLeaders
        .map((leader: LeaderColorStatus) => {
          const green = leader.colorStatusByLeader?.greenCount || 0
          const amber = leader.colorStatusByLeader?.amberCount || 0
          const red = leader.colorStatusByLeader?.redCount || 0
          const total = green + amber + red

          return {
            id: leader.leaderId || "",
            name: leader.leaderName || "",
            green,
            amber,
            red,
            total,
            greenPercentage: total > 0 ? Math.round((green / total) * 100) : 0,
          }
        })
        // Filter out leaders with no metrics (all counts are 0)
        .filter((leader) => leader.total > 0)
        // Sort by green percentage (highest first)
        .sort((a, b) => b.greenPercentage - a.greenPercentage)
    }

    // If a leader is selected, filter to show only that leader
    if (selectedLeader) {
      leaderData = leaderData.filter((leader) => leader.id === selectedLeader.id)
    }

    // Calculate the maximum count for bar width scaling
    const maxCount = Math.max(
      10, // Minimum value to avoid division by zero
      ...leaderData.map((leader) => leader.total),
      totals.total,
    )

    return {
      leaderData,
      totals,
      maxCount,
    }
  }, [performanceData, selectedLeader])

  // Prepare data for the stacked bar chart
  const chartData = useMemo(() => {
    return [
      {
        name: "Overall",
        green: totals.green,
        amber: totals.amber,
        red: totals.red,
        total: totals.total,
        greenPercentage: totals.greenPercentage,
      },
      ...leaderData.map((leader) => ({
        name: leader.name,
        green: leader.green,
        amber: leader.amber,
        red: leader.red,
        total: leader.total,
        greenPercentage: leader.greenPercentage,
      })),
    ]
  }, [leaderData, totals])

  // Prepare data for the performance percentage chart
  const percentageData = useMemo(() => {
    return chartData.map((item) => ({
      name: item.name,
      value: item.greenPercentage,
      total: item.total,
    }))
  }, [chartData])

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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-gray-600">Total Metrics: {payload[0].payload.total}</p>
          <div className="mt-2">
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 bg-green-600 rounded-sm mr-2"></div>
              <span className="text-sm">Green: {payload[0].payload.green}</span>
            </div>
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 bg-amber-500 rounded-sm mr-2"></div>
              <span className="text-sm">Amber: {payload[0].payload.amber}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-600 rounded-sm mr-2"></div>
              <span className="text-sm">Red: {payload[0].payload.red}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white border-b">
        <CardTitle className="text-xl font-bold">
          Leader Performance {selectedLeader ? `- ${selectedLeader.name}` : ""}
        </CardTitle>
        <CardDescription>
          Distribution of metrics by status (Green, Amber, Red) for each leader compared to overall performance
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Performance Percentage Chart */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Performance Rating (% Green Metrics)</h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={percentageData} margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`${value}%`, "Green Metrics"]} labelFormatter={(name) => `${name}`} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {percentageData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.value >= 80
                          ? "#16a34a"
                          : entry.value >= 60
                            ? "#65a30d"
                            : entry.value >= 40
                              ? "#d97706"
                              : "#dc2626"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Metric Distribution Chart */}
        <div>
          <h3 className="text-lg font-medium mb-4">Metric Distribution</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                barSize={24}
                barGap={0}
              >
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="green" stackId="a" fill="#16a34a" name="Green" />
                <Bar dataKey="amber" stackId="a" fill="#d97706" name="Amber" />
                <Bar dataKey="red" stackId="a" fill="#dc2626" name="Red" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center mt-6 space-x-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-600 rounded-sm mr-2"></div>
            <span className="text-sm">Green</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-amber-500 rounded-sm mr-2"></div>
            <span className="text-sm">Amber</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-600 rounded-sm mr-2"></div>
            <span className="text-sm">Red</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
