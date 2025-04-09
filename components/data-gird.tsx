"use client"

import { useCallback, useEffect, useState, useMemo } from "react"

import type { ColDef, GetRowIdParams, ICellRendererParams, RowClickedEvent } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import { ChevronDown, ChevronRight } from "lucide-react"

import { FetchingProgress } from "@bofa/scorecard-ui"
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
    const [expandedMetrics, setExpandedMetrics] = useState<number[]>([])
    const [selectedMetricId, setSelectedMetricId] = useState<number | null>(null)
    const [gridData, setGridData] = useState<ExtendedGridRowData[]>([])
    const [hoveredMetricId, setHoveredMetricId] = useState<number | null>(null)

    const { sixMonthByMetricPerformance, useGetSltMetricPerformance, sixMonthByMetricPerformanceQuery } =
        useDashboardData()
    const { useGetMetric } = useMetricsData()
    const { data: sltMetricPerformance, isLoading: isSltDataLoading } = useGetSltMetricPerformance(
        selectedMetricId ?? 0,
    ) as {
        data: SltMetricPerformance | null
        isLoading: boolean
    }
    const { data: hoveredMetricData, isLoading: isMetricDataLoading } = useGetMetric(hoveredMetricId ?? 0)

    // Initialize grid data with sixMonthByMetricPerformance
    useEffect(() => {
        if (sixMonthByMetricPerformance) {
            const baseData = sixMonthByMetricPerformance.map((metric) => ({
                ...metric,
                isParent: true,
            }))
            setGridData(baseData)
        }
    }, [sixMonthByMetricPerformance])

    // Update grid data when SLT performance data is loaded
    useEffect(() => {
        if (sltMetricPerformance && Array.isArray(sltMetricPerformance) && selectedMetricId) {
            // First, create a clean base grid without any children of the current selectedMetricId
            const baseGrid = gridData.filter((row) => !(row.metricId === selectedMetricId && !row.isParent))

            // Create the child rows for the selected metric
            const childRows = sltMetricPerformance.map((slt) => ({
                ...slt,
                metricId: selectedMetricId,
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

            // Find the index of the parent row
            const parentIndex = baseGrid.findIndex((row) => row.metricId === selectedMetricId && row.isParent)

            if (parentIndex !== -1) {
                // Insert child rows after the parent
                const newGridData = [...baseGrid.slice(0, parentIndex + 1), ...childRows, ...baseGrid.slice(parentIndex + 1)]

                setGridData(newGridData)
                setExpandedMetrics((prev) => (prev.includes(selectedMetricId) ? prev : [...prev, selectedMetricId]))
            }
        }
    }, [sltMetricPerformance, selectedMetricId, gridData])

    const monthColumns = useMemo(() => {
        if (!sixMonthByMetricPerformance || sixMonthByMetricPerformance.length === 0) return []
        const firstMetric = sixMonthByMetricPerformance[0]
        return [
            { month: firstMetric.firstMonth, result: "firstMonth_Result" },
            { month: firstMetric.secondMonth, result: "secondMonth_Result" },
            { month: firstMetric.thirdMonth, result: "thirdMonth_Result" },
            { month: firstMetric.fourthMonth, result: "fourthMonth_Result" },
            { month: firstMetric.fivehMonth, result: "fiveMonth_Result" },
            { month: firstMetric.sixthMonth, result: "sixthMonth_Result" },
        ]
    }, [sixMonthByMetricPerformance])

    const handleRowClicked = useCallback(
        (event: RowClickedEvent<GridRowData>) => {
            if (event.data?.isParent && event.data?.metricId) {
                const metricId = event.data.metricId
                if (expandedMetrics.includes(metricId)) {
                    // Collapse: Remove child rows and update expandedMetrics
                    setExpandedMetrics((prev) => prev.filter((id) => id !== metricId))
                    setGridData((prev) => prev.filter((row) => !(row.metricId === metricId && !row.isParent)))
                } else {
                    // Expand: Set selectedMetricId to trigger the useEffect that loads child data
                    setSelectedMetricId(metricId)
                }
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
                    // case 'amber':
                    //   return isParent
                    //     ? metricPerformanceColors.parent.warning
                    //     : metricPerformanceColors.child.warning;
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
                    const isExpanded = isParent && expandedMetrics.includes(params.data.metricId)
                    const isLoading = isParent && isSltDataLoading && selectedMetricId === params.data.metricId

                    const content = (
                        <div
                            style={{ display: "flex", alignment: "center" }}
                            onMouseEnter={() => setHoveredMetricId(params.data?.metricId ?? null)}
                            onMouseLeave={() => setHoveredMetricId(null)}
                        >
                            {isParent &&
                                (isLoading ? (
                                    <LoadingSpinner />
                                ) : (
                                    <span
                                        style={{ cursor: "pointer", marginRight: "5px" }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleRowClicked({
                                                data: params.data,
                                            } as RowClickedEvent<GridRowData>)
                                        }}
                                    >
                    {isExpanded ? (
                        <ChevronDown size={16} data-testid="chevron-down" aria-hidden="true" />
                    ) : (
                        <ChevronRight size={16} data-testid="chevron-right" aria-hidden="true" />
                    )}
                  </span>
                                ))}
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
                filed: "source",
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
            isSltDataLoading,
            selectedMetricId,
            hoveredMetricData,
            isMetricDataLoading,
            hoveredMetricId,
            handleRowClicked,
        ],
    )

    const defaultColDef: ColDef = {
        sortable: true,
        filter: true,
        resizable: true,
    }

    // For debugging purposes
    const logGridState = () => {
        console.log("Current grid data:", gridData)
        console.log("Expanded metrics:", expandedMetrics)
        console.log("Selected metric ID:", selectedMetricId)
    }

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
                onRowClicked={handleRowClicked}
            />
        </div>
    )
}

export default MetricsGrid
