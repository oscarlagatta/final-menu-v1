'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { BarChart, LineChart, PieChart } from '@/components/ui/chart';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

import MetricsGrid from '@/components/metrics-grid';
import { mainMetrics } from '@/data/metrics-data';

// Define types for our data structures
type MetricDataPoint = {
    month: string;
    [key: string]: string | number; // This allows dynamic properties
};

type ChartDataPoint = {
    name: string;
    value: number;
    color?: string;
};

type MonthChangeResult = {
    change: string;
    isPositive: boolean;
};

export default function Dashboard() {
    // Calculate summary metrics
    const totalMetrics = mainMetrics.length;
    const greenMetrics = mainMetrics.filter(
        (m) => m.firstMonth_Color === 'Green'
    ).length;
    const amberMetrics = mainMetrics.filter(
        (m) => m.firstMonth_Color === 'Amber'
    ).length;
    const redMetrics = mainMetrics.filter(
        (m) => m.firstMonth_Color === 'Red'
    ).length;
    const performanceRate = ((greenMetrics / totalMetrics) * 100).toFixed(1);

    // Prepare data for trend chart - flatten the data for easier charting
    const trendChartData = (() => {
        // Get all months from the first metric
        const months = [
            mainMetrics[0].firstMonth,
            mainMetrics[0].secondMonth,
            mainMetrics[0].thirdMonth,
            mainMetrics[0].fourthMonth,
            mainMetrics[0].fiveMonth,
            mainMetrics[0].sixMonth,
        ];

        // Create a data point for each month
        return months.map((month, i) => {
            const dataPoint: MetricDataPoint = { month };

            // Add each metric's value for this month
            mainMetrics.forEach((metric) => {
                const resultField = [
                    'firstMonth_Result',
                    'secondMonth_Result',
                    'thirdMonth_Result',
                    'fourthMonth_Result',
                    'fiveMonth_Result',
                    'sixMonth_Result',
                ][i];

                const resultKey = resultField as keyof typeof metric;
                if (metric[resultKey]) {
                    const resultValue = metric[resultKey];
                    if (typeof resultValue === 'string') {
                        dataPoint[metric.metricPrefix] = Number.parseFloat(
                            resultValue.split('-')[0]
                        );
                    }
                }
            });

            return dataPoint;
        });
    })();

    // Prepare data for comparison chart
    const comparisonData: ChartDataPoint[] = mainMetrics.map((metric) => ({
        name: metric.metricPrefix,
        value:
            metric.firstMonth_Result && typeof metric.firstMonth_Result === 'string'
                ? Number.parseFloat(metric.firstMonth_Result.split('-')[0])
                : 0,
    }));

    // Prepare data for distribution chart
    const distributionData: ChartDataPoint[] = [
        { name: 'Green', value: greenMetrics, color: '#009922' },
        { name: 'Amber', value: amberMetrics, color: '#EA7600' },
        { name: 'Red', value: redMetrics, color: '#94002B' },
    ].filter((item) => item.value > 0);

    // Prepare data for horizontal status bar chart
    const statusBarData = mainMetrics
        .map((metric) => {
            const color = metric.firstMonth_Color || 'Grey';
            return {
                name: metric.metricPrefix,
                metricName: metric.metricName,
                value:
                    metric.firstMonth_Result &&
                    typeof metric.firstMonth_Result === 'string'
                        ? Number.parseFloat(metric.firstMonth_Result.split('-')[0])
                        : 0,
                status: color,
                green: color === 'Green' ? 1 : 0,
                amber: color === 'Amber' ? 1 : 0,
                red: color === 'Red' ? 1 : 0,
                grey: color === 'Grey' ? 1 : 0,
            };
        })
        .sort((a, b) => {
            // Sort by status (Green, Amber, Red, Grey) and then by value
            const statusOrder = { Green: 0, Amber: 1, Red: 2, Grey: 3 };
            const statusDiff =
                statusOrder[a.status as keyof typeof statusOrder] -
                statusOrder[b.status as keyof typeof statusOrder];
            if (statusDiff !== 0) return statusDiff;
            return b.value - a.value;
        });

    // Calculate month-over-month change
    const getMonthOverMonthChange = (): MonthChangeResult => {
        let currentSum = 0;
        let previousSum = 0;
        let count = 0;

        mainMetrics.forEach((metric) => {
            if (
                metric.firstMonth_Result &&
                metric.secondMonth_Result &&
                typeof metric.firstMonth_Result === 'string' &&
                typeof metric.secondMonth_Result === 'string'
            ) {
                const current = Number.parseFloat(
                    metric.firstMonth_Result.split('-')[0]
                );
                const previous = Number.parseFloat(
                    metric.secondMonth_Result.split('-')[0]
                );
                currentSum += current;
                previousSum += previous;
                count++;
            }
        });

        if (count === 0) return { change: '0', isPositive: true };

        const currentAvg = currentSum / count;
        const previousAvg = previousSum / count;
        const change = ((currentAvg - previousAvg) / previousAvg) * 100;

        return {
            change: Math.abs(change).toFixed(1),
            isPositive: change >= 0,
        };
    };

    const momChange = getMonthOverMonthChange();

    // Get metric prefixes for the line chart
    const metricPrefixes = mainMetrics.map((metric) => metric.metricPrefix);

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-50 pointer-events-none" />
                    <CardHeader className="pb-2 relative">
                        <CardDescription>Overall Performance</CardDescription>
                        <CardTitle className="text-2xl text-blue-700">
                            {performanceRate}%
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <div className="text-sm text-muted-foreground flex items-center">
              <span
                  className={
                      momChange.isPositive ? 'text-green-600' : 'text-red-600'
                  }
                  style={{ display: 'flex', alignItems: 'center' }}
              >
                {momChange.isPositive ? (
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                  {momChange.change}%
              </span>
                            <span className="ml-1">vs previous month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-600 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-transparent opacity-50 pointer-events-none" />
                    <CardHeader className="pb-2 relative">
                        <CardDescription>Green Metrics</CardDescription>
                        <CardTitle className="text-2xl text-green-700">
                            {greenMetrics}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <div className="text-sm text-muted-foreground">
                            {((greenMetrics / totalMetrics) * 100).toFixed(1)}% of total
                            metrics
                        </div>
                        <div className="absolute top-1 right-2 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-green-600"></div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-transparent opacity-50 pointer-events-none" />
                    <CardHeader className="pb-2 relative">
                        <CardDescription>Amber Metrics</CardDescription>
                        <CardTitle className="text-2xl text-amber-700">
                            {amberMetrics}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <div className="text-sm text-muted-foreground">
                            {((amberMetrics / totalMetrics) * 100).toFixed(1)}% of total
                            metrics
                        </div>
                        <div className="absolute top-1 right-2 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-600 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-transparent opacity-50 pointer-events-none" />
                    <CardHeader className="pb-2 relative">
                        <CardDescription>Red Metrics</CardDescription>
                        <CardTitle className="text-2xl text-red-700">
                            {redMetrics}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <div className="text-sm text-muted-foreground">
                            {((redMetrics / totalMetrics) * 100).toFixed(1)}% of total metrics
                        </div>
                        <div className="absolute top-1 right-2 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-red-600"></div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Horizontal Status Bar Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Metrics Status Overview</CardTitle>
                    <CardDescription>
                        Current performance status of each metric
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <HorizontalStatusChart data={statusBarData} />
                </CardContent>
            </Card>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trends Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Metrics Performance Trends</CardTitle>
                        <CardDescription>
                            Performance percentage over the last 6 months
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <TrendChart data={trendChartData} metrics={metricPrefixes} />
                    </CardContent>
                </Card>

                {/* Comparison Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Current Month Metrics Comparison</CardTitle>
                        <CardDescription>
                            Performance percentage for the current month across all metrics
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <BarChart
                            data={comparisonData}
                            index="name"
                            categories={['value']}
                            colors={['#2563eb']} // blue-600
                            valueFormatter={(value) => `${value.toFixed(2)}%`}
                            yAxisWidth={60}
                            showLegend={false}
                            showXGrid={false}
                            showYGrid={true}
                        />
                    </CardContent>
                </Card>

                {/* Distribution Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Metrics Status Distribution</CardTitle>
                        <CardDescription>
                            Distribution of metrics by status (Green, Amber, Red)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] flex items-center justify-center">
                        <div className="w-full h-full max-w-[400px] mx-auto">
                            <PieChart
                                data={distributionData}
                                index="name"
                                category="value"
                                colors={distributionData.map((d) => d.color || '')}
                                valueFormatter={(value) => `${value} metrics`}
                                showAnimation={true}
                                showLegend={true}
                                showTooltip={true}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Metrics Grid */}
            <Card>
                <CardHeader>
                    <CardTitle>Metrics Data Grid</CardTitle>
                    <CardDescription>
                        Detailed metrics data with expandable rows for detailed records
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 sm:p-2">
                    <MetricsGrid />
                </CardContent>
            </Card>
        </div>
    );
}

// Horizontal Status Bar Chart Component
function HorizontalStatusChart({ data }: { data: any[] }) {
    return (
        <div className="w-full h-full overflow-y-auto">
            <div
                className="min-h-full"
                style={{ minHeight: data.length * 40 + 'px' }}
            >
                {data.map((item, index) => (
                    <div key={index} className="flex items-center mb-3">
                        <div
                            className="w-24 text-sm font-medium text-gray-700 truncate mr-2"
                            title={item.metricPrefix}
                        >
                            {item.metricPrefix}
                        </div>
                        <div className="flex-1 relative h-8">
                            <div className="absolute inset-0 bg-gray-100 rounded-md"></div>
                            <div
                                className={`absolute top-0 left-0 h-full rounded-md ${
                                    item.status === 'Green'
                                        ? 'bg-green-600'
                                        : item.status === 'Amber'
                                            ? 'bg-amber-500'
                                            : item.status === 'Red'
                                                ? 'bg-red-600'
                                                : 'bg-gray-400'
                                }`}
                                style={{ width: `${item.value}%` }}
                            ></div>
                            <div className="absolute inset-0 flex items-center px-3 justify-between">
                <span
                    className="text-xs font-medium truncate max-w-[70%] text-gray-700"
                    title={item.metricName}
                >
                  {item.metricName}
                </span>
                                <span className="text-xs font-bold text-gray-800">
                  {item.value.toFixed(2)}%
                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Define types for chart components
type TrendChartProps = {
    data: MetricDataPoint[];
    metrics: string[];
};

// Custom trend chart component specifically for our data format
function TrendChart({ data, metrics }: TrendChartProps) {
    const colors = [
        '#2563eb', // blue-600
        '#16a34a', // green-600
        '#ea580c', // orange-600
        '#8b5cf6', // violet-500
        '#ec4899', // pink-500
    ];

    return (
        <div className="w-full h-full">
            <ResponsiveLineChart
                data={data}
                metrics={metrics}
                colors={colors}
                valueFormatter={(value: number) => `${value.toFixed(2)}%`}
            />
        </div>
    );
}

// Define types for responsive line chart
type ResponsiveLineChartProps = {
    data: MetricDataPoint[];
    metrics: string[];
    colors: string[];
    valueFormatter: (value: number) => string;
};

// Responsive line chart component
function ResponsiveLineChart({
                                 data,
                                 metrics,
                                 colors,
                                 valueFormatter,
                             }: ResponsiveLineChartProps) {
    return (
        <div className="w-full h-full">
            <LineChart
                data={data}
                index="month"
                categories={metrics}
                colors={colors}
                valueFormatter={valueFormatter}
                yAxisWidth={60}
                showLegend={true}
                showXGrid={true}
                showYGrid={true}
            />
        </div>
    );
}
