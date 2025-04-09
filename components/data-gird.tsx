"use client"

import { useCallback, useEffect, useState, useMemo, useRef } from "react"

import type { ColDef, GetRowIdParams, ICellRendererParams } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import { ChevronDown, ChevronRight } from "lucide-react"

import { FetchingProgress, LoadingSpinner } from "@bofa/scorecard-ui"
import {
    type CellColorParams,
    type GridRowData,
    type MetricModel,
    type SltMetricPerformance,
    useDashboardData,
    useMetricsData,
} from "@bofa/shared/data-services"
import { metricPerformanceColors } from "@bofa/util"

import { MetricTooltip } from "./MetricTooltip"
import type { ExtendedGridRowData } from "./types"

import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

const MetricsGrid = () => {
    // Store the base parent rows separately from the full grid data
    const [parentRows, setParentRows] = useState<ExtendedGridRowData[]>([])
    const [expandedMetrics, setExpandedMetrics] = useState<number[]>([])
    const [gridData, setGridData] = useState<ExtendedGridRowData[]>([])
    const [hoveredMetricId, setHoveredMetricId] = useState<number | null>(null)
    const [sltDataByMetric, setSltDataByMetric] = useState<{ [metricId: number]: SltMetricPerformance | null }>({})
    const [loadingSltMetrics, setLoadingSltMetrics] = useState<Set<number>>(new Set())

    // Use a ref to track metrics that are currently loading their children
    const loadingMetrics = useRef<Set<number>>(new Set())

    const { sixMonthByMetricPerformance, useGetSltMetricPerformance, sixMonthByMetricPerformanceQuery } =
        useDashboardData()
    const { useGetMetric } = useMetricsData()

    // Custom hook to fetch SLT data for a specific metric
    // const fetchSltData = (metricId: number) => {
    //     const { data, isLoading } = useGetSltMetricPerformance(metricId) as {
    //         data: SltMetricPerformance | null
    //         isLoading: boolean
    //     }
    //     return { data, isLoading }
    // }

    const { data: hoveredMetricData, isLoading: isMetricDataLoading } = useGetMetric(hoveredMetricId ?? 0)

    // Initialize parent rows from sixMonthByMetricPerformance
    useEffect(() => {
        if (sixMonthByMetricPerformance) {
            const baseData = sixMonthByMetricPerformance.map((metric) => ({
                ...metric,
                isParent: true,
            }))
            setParentRows(baseData)
            setGridData(baseData)
        }
    }, [sixMonthByMetricPerformance])

    // Fetch SLT data for expanded metrics
    useEffect(() => {
        const fetchSltData = async () => {
            if (!expandedMetrics.length) return

            const newSltData: { [metricId: number]: SltMetricPerformance | null } = {}
            const loading = new Set<number>()

            for (const metricId of expandedMetrics) {
                loading.add(metricId)
                const { data } = useGetSltMetricPerformance(metricId) as { data: SltMetricPerformance | null }
                newSltData[metricId] = data
            }

            setSltDataByMetric(newSltData)
            setLoadingSltMetrics(loading)
        }

        fetchSltData()
    }, [expandedMetrics, useGetSltMetricPerformance])

    // Function to rebuild the entire grid data based on parent rows and expanded metrics
    const rebuildGridData = useCallback(async () => {
        let newGridData: ExtendedGridRowData[] = [...parentRows]

        // For each expanded metric, fetch and insert its children
        for (const metricId of expandedMetrics) {
            // const { data: sltData } = fetchSltData(metricId)
            const sltData = sltDataByMetric[metricId]

            if (sltData && Array.isArray(sltData)) {
                // Find the index of the parent row
                const parentIndex = newGridData.findIndex((row) => row.metricId === metricId && row.isParent)

                if (parentIndex !== -1) {
                    // Create child rows
                    const childRows = sltData.map((slt) => ({
                        ...slt,
                        metricId,
                        isParent: false,
                        sltName: slt.sltName,
                        sltNBId: slt.sltNBId,
                        firstMonth_Result: slt.firstMonth_Result,
                        secondMonth_Result: slt.secondMonth_Result,
                        thirdMonth_Result: slt.thirdMonth_Result,
                        fourthMonth_Result: slt.fourthMonth_Result,
                        fiveMonth_Result: slt.fiveMonth_Result,
                        sixthMonth_Result: slt.sixthMonth_Result,
                        firstMonth_Color: slt.firstMonth_Color,
                        secondMonth_Color: slt.secondMonth_Color,
                        thirdMonth_Color: slt.thirdMonth_Color,
                        fourthMonth_Color: slt.fourthMonth_Color,
                        fiveMonth_Color: slt.fiveMonth_Color,
                        sixthMonth_Color: slt.sixthMonth_Color,
                    }))

                    // Insert child rows after the parent
                    newGridData = [...newGridData.slice(0, parentIndex + 1), ...childRows, ...newGridData.slice(parentIndex + 1)]
                }
            }
        }

        setGridData(newGridData)
    }, [parentRows, expandedMetrics, sltDataByMetric])

    // Rebuild grid data whenever expanded metrics change
    useEffect(() => {
        rebuildGridData()
    }, [expandedMetrics, rebuildGridData])

    const monthColumns = useMemo(() => {
        if (!sixMonthByMetricPerformance || sixMonthByMetricPerformance.length === 0) return []
        const firstMetric = sixMonthByMetricPerformance[0]
        return [
            { month: firstMetric.firstMonth, result: "firstMonth_Result" },
            { month: firstMetric.secondMonth, result: "secondMonth_Result" },
            { month: firstMetric.thirdMonth, result: "thirdMonth_Result" },
            { month: firstMetric.fourthMonth, result: "fourthMonth_Result" },
            { month: firstMetric.fiveMonth, result: "fiveMonth_Result" },
            { month: firstMetric.sixthMonth, result: "sixthMonth_Result" },
        ]
    }, [sixMonthByMetricPerformance])

    // Handle expanding/collapsing a row
    const handleToggleRow = useCallback(
        (metricId: number) => {
            // If this metric is already loading, ignore the click
            if (loadingMetrics.current.has(metricId)) {
                return
            }

            if (expandedMetrics.includes(metricId)) {
                // Collapse: simply remove from expanded metrics
                setExpandedMetrics((prev) => prev.filter((id) => id !== metricId))
            } else {
                // Expand: add to expanded metrics and mark as loading
                loadingMetrics.current.add(metricId)
                setExpandedMetrics((prev) => [...prev, metricId])

                // Remove from loading after a short delay
                setTimeout(() => {
                    loadingMetrics.current.delete(metricId)
                }, 500)
            }
        },
        [expandedMetrics],
    )

    const getRowId = (params: GetRowIdParams) => {
        return params.data.isParent
            ? `metric-${params.data.metricId}`
            : `slt-${params.data.metricId}-${params.data.sltNBId}`
    }

    const getCellColor = (params: CellColorParams) => {
        const monthField = params.column.getColId()
        if (!monthField) return "white"

        const colorField = monthField.replace("_Result", "_Color")

        // Use a type assertion to tell TypeScript that params.data has the color fields
        const data = params.data as GridRowData & {
            [key: string]: string | number | boolean | undefined
        }

        const isParent = params.data.isParent

        if (!isParent) console.log("data[colorField]:::", data[colorField], isParent)

        if (colorField in data) {
            const color = data[colorField]

            if (typeof color === "string") {
                switch (color.toLowerCase()) {
                    case "red":
                        return isParent ? metricPerformanceColors.parent.bad : metricPerformanceColors.child.bad
                    case "green":
                        return isParent ? metricPerformanceColors.parent.good : metricPerformanceColors.child.good
                    case "amber":
                        return isParent ? metricPerformanceColors.parent.warning : metricPerformanceColors.child.warning
                    case "grey":
                    case "black":
                        return isParent ? metricPerformanceColors.parent.null : metricPerformanceColors.child.null
                    default:
                        return "white"
                }
            }
        }

        return "#f0f0f0"
    }

    const columnDefs = useMemo<ColDef[]>(
        () => [
            {
                headerName: "Metric",
                field: "metricName",
                cellRenderer: (params: ICellRendererParams<GridRowData>) => {
                    if (!params.data) return null

                    const isParent = params.data.isParent
                    const metricId = params.data.metricId
                    const isExpanded = isParent && expandedMetrics.includes(metricId)
                    const isLoading = isParent && loadingMetrics.current.has(metricId)

                    const content = (
                        <div
                            style={{ display: "flex", alignItems: "center" }}
                            onMouseEnter={() => setHoveredMetricId(params.data?.metricId ?? null)}
                            onMouseLeave={() => setHoveredMetricId(null)}
                        >
                            {isParent && (
                                <span
                                    style={{ cursor: "pointer", marginRight: "5px" }}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleToggleRow(metricId)
                                    }}
                                >
                  {isLoading ? (
                      <LoadingSpinner />
                  ) : isExpanded ? (
                      <ChevronDown size={16} data-testid="chevron-down" aria-hidden="true" />
                  ) : (
                      <ChevronRight size={16} data-testid="chevron-right" aria-hidden="true" />
                  )}
                </span>
                            )}
                            {isParent ? params.value : <div style={{ paddingLeft: "24px" }}>{params.data.sltName}</div>}
                        </div>
                    )

                    return (
                        <MetricTooltip
                            metricName={isParent ? (params.data.metricName ?? "") : (params.data.sltName ?? "")}
                            metricDescription={(hoveredMetricData as MetricModel)?.metricDescription ?? ""}
                            metricCalculation={(hoveredMetricData as MetricModel)?.metricCalculation ?? ""}
                            isLoading={isMetricDataLoading && !!hoveredMetricId && hoveredMetricId !== 0}
                        >
                            {content}
                        </MetricTooltip>
                    )
                },
                flex: 2,
                filter: "agTextColumnFilter",
            },
            {
                headerName: "Metric Id",
                field: "metricPrefix",
                flex: 1,
                filter: "agTextColumnFilter",
                cellRenderer: (params: ICellRendererParams<GridRowData>) => {
                    return params.data?.isParent ? params.value : ""
                },
            },
            {
                headerName: "Trigger",
                field: "trigger",
                flex: 1,
                cellStyle: (params: any) => ({
                    textAlign: "center",
                    color: "green",
                }),
                valueFormatter: (params) => {
                    if (params.value === null) return "n/a"
                    if (!params.data?.isParent) return ""
                    return params.data.valueType === "%" ? `${params.value.toFixed(2)}%` : params.value.toFixed(2)
                },
                filter: "agNumberColumnFilter",
            },
            {
                headerName: "Limit",
                field: "limit",
                flex: 1,
                cellStyle: { textAlign: "center", color: "red" },
                valueFormatter: (params) => {
                    if (params.value === null) return "n/a"
                    if (!params.data?.isParent) return ""
                    return params.data.valueType === "%" ? `${params.value.toFixed(2)}%` : params.value.toFixed(2)
                },
                filter: "agNumberColumnFilter",
            },
            {
                headerName: "Source",
                field: "source",
                flex: 1,
                filter: "agTextColumnFilter",
                cellRenderer: (params: ICellRendererParams<GridRowData>) => {
                    return params.data?.isParent ? params.value : ""
                },
            },
            ...monthColumns.map(({ month, result }) => ({
                headerClass: "text-center",
                headerName: typeof month === "string" ? month.toUpperCase() : "N/A",
                field: result,
                flex: 1,
                cellStyle: (params: any) => ({
                    textAlign: "center",
                    backgroundColor: getCellColor(params),
                    color: !params.value || params.value === "NDTR" ? "gray" : "black",
                }),
                valueFormatter: (params: any) => {
                    if (!params.value) return "NDTR"
                    return params.value
                },
                cellRenderer: (params: ICellRendererParams) => {
                    if (!params.value) return "NDTR"
                    if (params.value === "NDTR") return params.value

                    const parts = params.value.split("-")

                    if (parts.length !== 3) return params.value

                    const [percentage, numerator, denominator] = parts
                    const isParent = params.data.isParent
                    const metricColor = params.data.metricColor
                    const formattedPercentage =
                        Number.parseFloat(percentage).toFixed(2) + (params.data.valueType === "%" ? "%" : "")
                    const formattedFraction = `${numerator}/${denominator}`

                    return (
                        <div className="flex h-full flex-col items-center justify-center">
                            <div
                                className="text-sm font-medium"
                                style={{
                                    color: isParent && metricColor !== "lightgreen" ? "#ffffff" : "#595959",
                                }}
                            >
                                {formattedPercentage}
                            </div>
                            <div
                                className="text-xs font-medium"
                                style={{
                                    color: isParent && metricColor !== "lightgreen" ? "#d9d9d9" : "#7f7f7f",
                                }}
                            >
                                {formattedFraction}
                            </div>
                        </div>
                    )
                },
                filter: "agTextColumnFilter",
            })),
        ],
        [
            monthColumns,
            expandedMetrics,
            hoveredMetricData,
            isMetricDataLoading,
            hoveredMetricId,
            handleToggleRow,
            sltDataByMetric,
        ],
    )

    const defaultColDef: ColDef = {
        sortable: true,
        filter: true,
        resizable: true,
    }

    // Fetch SLT data for all metrics on component mount
    useEffect(() => {
        if (sixMonthByMetricPerformance) {
            const allMetricIds = sixMonthByMetricPerformance.map((metric) => metric.metricId)
            const newSltData: { [metricId: number]: SltMetricPerformance | null } = {}
            const loading = new Set<number>()

            const fetchAllSltData = async () => {
                for (const metricId of allMetricIds) {
                    loading.add(metricId)
                    const { data } = useGetSltMetricPerformance(metricId) as { data: SltMetricPerformance | null }
                    newSltData[metricId] = data
                }

                setSltDataByMetric(newSltData)
                setLoadingSltMetrics(loading)
            }

            fetchAllSltData()
        }
    }, [sixMonthByMetricPerformance, useGetSltMetricPerformance])

    if (!sixMonthByMetricPerformance || sixMonthByMetricPerformanceQuery.isLoading) {
        return (
            <div className="flex h-[600px] items-center justify-center">
                <FetchingProgress />
            </div>
        )
    }

    return (
        <div className="ag-theme-alpine h-full w-full">
            <AgGridReact
                rowData={gridData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                getRowId={getRowId}
                suppressRowTransform={true}
            />
        </div>
    )
}

export default MetricsGrid
