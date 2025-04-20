### Metric Performance Trend Calculations

The `MetricPerformanceTrend` component performs several calculations to transform the raw metrics data into a visualization that shows the trend of metric performance over time. Let me break down the process in detail:

## 1. Data Retrieval

```typescript
const { sixMonthByMetricPerformance } = useDashboardData()
```

The component starts by retrieving the metrics data from the `useDashboardData` hook. This data contains information about multiple metrics, each with performance data for 6 months.

## 2. Data Processing and Calculations

The core calculations happen inside a `useMemo` hook to ensure they're only recalculated when the data changes:

```typescript
const chartData = useMemo(() => {
  // Processing logic here
}, [sixMonthByMetricPerformance])
```

### 2.1. Month Extraction

```typescript
const firstMetric = sixMonthByMetricPerformance[0]
const months = [
  firstMetric.firstMonth,
  firstMetric.secondMonth,
  firstMetric.thirdMonth,
  firstMetric.fourthMonth,
  firstMetric.fiveMonth,
  firstMetric.sixMonth,
]
```

First, the component extracts the month names from the first metric. These are used as reference points for the x-axis of the chart.

### 2.2. Data Point Creation for Each Month

For each month, the component creates a data point by:

1. Initializing counters for each status:

```typescript
let greenCount = 0
let amberCount = 0
let redCount = 0
let greyCount = 0
```


2. Determining which color field to use for the current month:

```typescript
const colorField = [
  "firstMonth_Color",
  "secondMonth_Color",
  "thirdMonth_Color",
  "fourthMonth_Color",
  "fiveMonth_Color",
  "sixMonth_Color",
][index]
```


3. Counting metrics by status for this month:

```typescript
sixMonthByMetricPerformance.forEach((metric) => {
  const colorKey = colorField as keyof typeof metric
  const color = metric[colorKey] as string

  if (!color) {
    greyCount++
    return
  }

  const colorLower = color.toLowerCase()

  if (colorLower === "green") greenCount++
  else if (colorLower === "amber") amberCount++
  else if (colorLower === "red") redCount++
  else greyCount++
})
```

This loop iterates through all metrics and increments the appropriate counter based on the color status of each metric for the current month.




### 2.3. Calculating Totals and Percentages

```typescript
const totalCount = greenCount + amberCount + redCount + greyCount
const greenPercentage = totalCount > 0 ? Math.round((greenCount / totalCount) * 100) : 0
```

After counting metrics by status, the component:

1. Calculates the total number of metrics (`totalCount`)
2. Calculates the percentage of metrics that are "Green" (`greenPercentage`)

1. This is calculated as: (number of green metrics / total number of metrics) * 100
2. The result is rounded to the nearest integer
3. If there are no metrics (totalCount = 0), the percentage defaults to 0





### 2.4. Creating the Final Data Point

```typescript
return {
  month: formatMonth(monthStr),
  Green: greenCount,
  Amber: amberCount,
  Red: redCount,
  Grey: greyCount,
  Total: totalCount,
  GreenPercentage: greenPercentage,
}
```

For each month, the component creates a data point object containing:

- The formatted month name
- The count of metrics in each status (Green, Amber, Red, Grey)
- The total count of metrics
- The percentage of metrics that are "Green"


### 2.5. Reversing the Data

```typescript
.reverse() // Reverse to show oldest month first
```

The data points are reversed so that the oldest month appears first on the chart (left side) and the most recent month appears last (right side).

## 3. Y-Axis Maximum Calculation

```typescript
const maxCount = useMemo(() => {
  if (chartData.length === 0) return 30 // Default max if no data

  const maxTotal = Math.max(...chartData.map((item) => item.Total))
  // Round up to the nearest 5
  return Math.ceil(maxTotal / 5) * 5
}, [chartData])
```

The component calculates the maximum value for the left y-axis by:

1. Finding the maximum total count across all months
2. Rounding up to the nearest multiple of 5
3. If there's no data, defaulting to 30


## 4. Visualization

The processed data is then visualized using a `ComposedChart` from Recharts, which combines:

1. **Stacked Bar Chart**: Shows the count of metrics in each status (Green, Amber, Red) for each month

```typescript
<Bar yAxisId="left" dataKey="Green" stackId="a" fill="#16a34a" name="Green" />
<Bar yAxisId="left" dataKey="Amber" stackId="a" fill="#ea580c" name="Amber" />
<Bar yAxisId="left" dataKey="Red" stackId="a" fill="#dc2626" name="Red" />
```


2. **Line Chart**: Shows the percentage of metrics that are "Green" for each month

```typescript
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
    formatter: (value) => `${value}%`,
    fontSize: 12,
    fill: "#000000",
  }}
/>
```




## 5. Dual Y-Axes

The chart uses two y-axes:

1. **Left Y-Axis**: Shows the count of metrics (0 to maxCount)

```typescript
<YAxis
  yAxisId="left"
  orientation="left"
  domain={[0, maxCount]}
  tick={{ fontSize: 12 }}
  tickCount={7}
  axisLine={false}
/>
```


2. **Right Y-Axis**: Shows the percentage of "Green" metrics (0 to 100%)

```typescript
<YAxis
  yAxisId="right"
  orientation="right"
  domain={[0, 100]}
  tickFormatter={(value) => `${value}%`}
  tick={{ fontSize: 12 }}
  tickCount={6}
  axisLine={false}
/>
```




## Summary of Calculations

In summary, the key calculations in the component are:

1. **Status Counts**: For each month, count how many metrics are in each status (Green, Amber, Red, Grey)
2. **Total Count**: Sum the status counts to get the total number of metrics for each month
3. **Green Percentage**: Calculate what percentage of metrics are "Green" for each month
4. **Y-Axis Maximum**: Determine the maximum value for the left y-axis based on the maximum total count


These calculations transform the raw metrics data into a visualization that shows:

- How the distribution of metric statuses changes over time (stacked bars)
- How the percentage of "Green" metrics changes over time (line)


This allows users to see both the absolute counts and the relative performance (percentage) in a single chart.