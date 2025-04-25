### How the Non-Green Metrics Component Works

The `NonGreenMetrics` component provides a focused view of metrics that aren't meeting their targets. Let me explain how it's built and the calculations it performs:

## 1. Data Selection and Filtering

The component starts by retrieving metrics data using the same hooks that the rest of the dashboard uses:

```typescript
const { sixMonthByMetricPerformance, sixMonthByMetricPerformanceQuery } = useDashboardData()
```

Then it filters the metrics to show only those with "amber" or "red" status for the current month:

```typescript
.filter((metric: any) => {
  const firstMonthColor = (metric as any).firstMonth_Color?.toLowerCase()
  return firstMonthColor === "amber" || firstMonthColor === "red"
})
```

## 2. Key Calculations

For each non-green metric, the component performs several important calculations:

### a) Current Performance Value

```typescript
const currentValue = metric.firstMonth_Result 
  ? Number.parseFloat(metric.firstMonth_Result.split("-")[0]) 
  : 0
```

This extracts the percentage from the result string. For example, from "83.33-125-150", it extracts 83.33.

### b) Previous Month Performance

```typescript
const previousValue = metric.secondMonth_Result 
  ? Number.parseFloat(metric.secondMonth_Result.split("-")[0]) 
  : 0
```

Similarly extracts the percentage from the previous month's result.

### c) Month-over-Month Change

```typescript
const change = previousValue > 0 
  ? ((currentValue - previousValue) / previousValue) * 100 
  : 0
```

This calculates the percentage change between the current and previous month. For example:

- If current = 80% and previous = 75%, change = ((80-75)/75)*100 = 6.67%
- A positive value means improvement, negative means decline


### d) Breach Count

```typescript
const resultParts = metric.firstMonth_Result 
  ? metric.firstMonth_Result.split("-") 
  : ["0", "0", "0"]

const breachCount = Number.parseInt(resultParts[2]) - Number.parseInt(resultParts[1])
```

This calculates how many items failed to meet the target. From the result string "83.33-125-150":

- resultParts[1] = 125 (successful items)
- resultParts[2] = 150 (total items)
- breachCount = 150 - 125 = 25 (failed items)


### e) Portfolio Count

```typescript
const portfolioCount = Number.parseInt(resultParts[2]) || 0
```

This represents the total number of items/portfolios being measured (the denominator).

## 3. Sorting Logic

The component sorts the non-green metrics to prioritize the most critical issues:

```typescript
.sort((a, b) => {
  if (a.color === "red" && b.color !== "red") return -1
  if (a.color !== "red" && b.color === "red") return 1
  return a.currentValue - b.currentValue
})
```

This sorting ensures:

1. Red metrics (most critical) appear first
2. Within each color group, metrics with lower performance values (worse performing) appear first


## 4. Visual Indicators

The component uses several visual indicators to communicate status:

### a) Status Color

```typescript
<div className={`px-3 py-1 rounded-md text-white font-medium ${
  metric.color === "red" ? "bg-red-600" : "bg-amber-500"
}`}>
  {metric.currentValue.toFixed(0)}%
</div>
```

This displays the current performance percentage in a colored badge (red or amber).

### b) Trend Indicator

```typescript
<span className={`flex items-center ${metric.isImproving ? "text-green-600" : "text-red-600"}`}>
  {metric.isImproving ? (
    <ArrowUpIcon className="h-4 w-4 mr-1" />
  ) : (
    <ArrowDownIcon className="h-4 w-4 mr-1" />
  )}
  {Math.abs(metric.change).toFixed(1)}%
</span>
```

This shows:

- An up arrow in green if the metric is improving
- A down arrow in red if the metric is declining
- The percentage change value


## 5. Contextual Information

For each metric, the component displays:

```typescript
<h3 className="font-medium text-gray-900">
  {metric.metricPrefix} {metric.metricName}
</h3>
<p className="text-sm text-gray-500">
  {metric.breachCount} metric breaches across {metric.portfolioCount} portfolios.
</p>
```

This provides:

- The metric ID and name
- The number of breaches (failures)
- The total number of portfolios/items being measured


## Summary of Calculations

To summarize the key calculations:

1. **Performance Value**: The percentage of success (first number in the result string)
2. **Month-over-Month Change**: Percentage change in performance compared to previous month
3. **Improvement Status**: Whether the metric is improving or declining
4. **Breach Count**: Number of items failing to meet the target (total - successful)
5. **Portfolio Count**: Total number of items being measured


These calculations help users quickly identify:

- Which metrics need attention
- How severe the issues are
- Whether the situation is improving or getting worse
- The scale of the problem (how many breaches across how many portfolios)
