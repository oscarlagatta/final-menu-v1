### Understanding the Metrics Dashboard Charts

Let me explain the purpose and interpretation of each chart in the dashboard:

## 1. Summary Cards

**Purpose:** Provide a quick overview of the overall performance status across all metrics.

**How to understand:**

- **Overall Performance (Blue)**: Shows the percentage of metrics meeting their targets. Higher is better, with the arrow indicating month-over-month change.
- **Green Metrics (Green)**: Count of metrics performing above the trigger threshold. These are your best-performing metrics.
- **Amber Metrics (Amber)**: Count of metrics performing between the limit and trigger thresholds. These metrics need monitoring.
- **Red Metrics (Red)**: Count of metrics performing below the limit threshold. These require immediate attention.


**Insights:** Use these cards to quickly assess the health of your metrics portfolio. A high percentage of green metrics indicates good overall performance, while a high number of red metrics signals problems requiring attention.

## 2. Metrics Status Overview (Horizontal Bar Chart)

**Purpose:** Visualize the performance of each individual metric in a single view, sorted by status and performance level.

**How to understand:**

- Each horizontal bar represents one metric
- The color indicates the status (Green, Amber, Red, or Grey for no data)
- The length of the bar represents the performance percentage
- Metrics are sorted by status (Green first, then Amber, then Red) and then by performance value


**Insights:** This chart allows you to:

- Quickly identify which specific metrics are performing well or poorly
- See the actual performance percentage for each metric
- Compare the relative performance across all metrics
- Identify patterns in metric performance by category (based on metric IDs)


## 3. Metrics Performance Trends (Line Chart)

**Purpose:** Track how each metric's performance has changed over time (the last 6 months).

**How to understand:**

- Each colored line represents a different metric (see legend)
- The X-axis shows months (most recent on the right)
- The Y-axis shows performance percentage
- Rising lines indicate improving performance, falling lines indicate declining performance


**Insights:** Use this chart to:

- Identify trends in metric performance over time
- Spot seasonal patterns or cyclical behavior
- See which metrics are improving or declining
- Identify correlations between different metrics (lines moving together)
- Evaluate the impact of improvement initiatives over time


## 4. Current Month Metrics Comparison (Bar Chart)

**Purpose:** Compare the current month's performance across all metrics in a standardized format.

**How to understand:**

- Each vertical bar represents one metric
- The height of the bar shows the performance percentage
- Higher bars indicate better performance
- All metrics are shown with the same scale for easy comparison


**Insights:** This chart helps you:

- Compare performance across different metrics regardless of their type
- Identify which metrics are outperforming or underperforming relative to others
- Spot outliers or metrics with unusual performance
- Prioritize which metrics need attention based on relative performance


## 5. Metrics Status Distribution (Pie Chart)

**Purpose:** Show the proportion of metrics in each status category (Green, Amber, Red).

**How to understand:**

- Each colored segment represents a status category
- Green segment: Percentage of metrics with "Green" status
- Amber segment: Percentage of metrics with "Amber" status
- Red segment: Percentage of metrics with "Red" status
- The size of each segment is proportional to the number of metrics in that category


**Insights:** This chart provides:

- A visual breakdown of your metrics portfolio health
- The balance between well-performing and problematic metrics
- A quick way to see if your overall metrics program is healthy (mostly green) or needs attention (large amber/red segments)


## 6. Metrics Data Grid

**Purpose:** Provide detailed data for each metric, including historical performance and the ability to drill down into sub-metrics.

**How to understand:**

- Each row represents a metric or sub-metric
- Parent rows can be expanded to show child metrics (click the chevron)
- Columns show metric details and monthly performance
- Color coding indicates status (Green, Amber, Red, Grey)
- Each cell shows both percentage and raw values (numerator/denominator)


**Insights:** The grid allows you to:

- Examine detailed performance data for each metric
- See the raw numbers behind the percentages
- Drill down into sub-metrics to identify specific problem areas
- Track performance across multiple time periods
- Filter and sort to focus on specific metrics or performance levels


## How the Charts Work Together

These visualizations work together to provide a complete picture of your metrics performance:

1. **Summary Cards** give you the big picture at a glance
2. **Horizontal Status Chart** shows individual metric performance in the current month
3. **Performance Trends** reveal how metrics have changed over time
4. **Metrics Comparison** allows direct comparison between different metrics
5. **Status Distribution** shows the overall health balance of your metrics portfolio
6. **Data Grid** provides the detailed data behind all the visualizations


By using these charts together, you can quickly identify issues, track improvements, and make data-driven decisions about where to focus your attention.

## Understanding Performance Percentage Calculation

The performance percentage is a key metric throughout the dashboard, and it's important to understand how it's calculated and what it represents.

### Individual Metric Performance Percentage

For each individual metric, the performance percentage is calculated as follows:

1. **Raw Data Format**: Each metric result is stored in the format `"percentage-numerator-denominator"`. For example, `"83.33-125-150"`.
2. **Calculation**: The percentage is calculated as:

```plaintext
Performance Percentage = (Numerator / Denominator) × 100
```

For example, in `"83.33-125-150"`:

1. Numerator = 125
2. Denominator = 150
3. Performance Percentage = (125 / 150) × 100 = 83.33%



3. **Interpretation**: This percentage represents the success rate or completion rate for the specific metric. For example:

1. For "Incident Resolution within SLA", it represents the percentage of incidents resolved within the SLA timeframe
2. For "Change Request Approval Rate", it represents the percentage of change requests that were approved





### Status Determination (Green, Amber, Red)

The color status of each metric is determined by comparing the performance percentage to two threshold values:

1. **Trigger**: The target threshold (higher value). If the performance percentage is at or above this value, the metric is considered "Green".
2. **Limit**: The minimum acceptable threshold (lower value). If the performance percentage is below this value, the metric is considered "Red".
3. **Between Thresholds**: If the performance percentage is between the limit and trigger values, the metric is considered "Amber".


For example, if a metric has:

- Trigger = 85%
- Limit = 70%
- Performance = 83%


The status would be "Amber" because 83% is between the limit (70%) and trigger (85%).

### Overall Performance Percentage

The overall performance percentage shown in the blue summary card at the top of the dashboard is calculated differently:

```plaintext
Overall Performance = (Number of Green Metrics / Total Number of Metrics) × 100
```

This represents the percentage of metrics that are meeting their targets (in "Green" status). It's a high-level indicator of how well your metrics program is performing overall.

### In the Code

You can see these calculations in the dashboard code:

1. **Individual metric percentage extraction**:

```typescript
Number.parseFloat(metric.firstMonth_Result.split("-")[0])
```

This extracts the percentage from the result string.


2. **Overall performance calculation**:

```typescript
const performanceRate = ((greenMetrics / totalMetrics) * 100).toFixed(1)
```

This calculates the percentage of metrics in "Green" status.




### Business Context

Understanding these percentages in business terms:

- **High percentages** generally indicate better performance (more incidents resolved within SLA, more change requests approved, etc.)
- **The trigger threshold** represents the target you aim to achieve
- **The limit threshold** represents the minimum acceptable performance
- **Overall performance** tells you what percentage of your metrics are meeting their targets


By monitoring these percentages over time, you can track improvements, identify declining areas, and focus resources on the metrics that need the most attention.