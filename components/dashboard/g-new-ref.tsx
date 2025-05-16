"use client"

import { useCallback, useEffect, useState, useMemo } from "react"

import type { ColDef, GetRowIdParams, ICellRendererParams } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import { ChevronDown, ChevronRight } from "lucide-react"

import { type CellColorParams, type GridRowData, useDashboardData } from "@bofa/data-services"
import { metricPerformanceColors } from "@bofa/util"

import { MetricTooltip } from "./MetricTooltip"
import type { ExtendedGridRowData } from "./types"

import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

// Define props interface for the component
interface MetricsGridProps {
  selectedMonth?: string // Format: "YYYY-MM", undefined means "All Months"
  selectedLeader?: { id: string; name: string } | null // null means "All Leaders"
  metricTypeId?: number
}

// Define the new API response structure
interface MonthData {
  month: string
  numerator: string
  denominator: string
  result: string
  color: string
  updatedDateTime: string | null
}

interface MetricData {
  metricId: number
  metricPrefix: string
  metricName: string
  valueType: string
  metricDescription: string
  metricCalculation: string
  serviceAlignment: string
  trigger: number
  limit: number
  source: string
  metricType: string
  thresholdDirection: string | null
  monthlyData: MonthData[]
}

// Define SLT data structure
interface SltMonthData {
  month: string
  numerator: string
  denominator: string
  result: string
  color: string
}

interface SltData {
  sltNbkId: string
  sltName: string
  sltMonthlyData: SltMonthData[]
}

interface SltResponse {
  metricId: number
  sltData: SltData[]
}

const LoadingSpinner = () => (
  <div className="relative h-5 w-5">
    <div className="absolute inset-0 animate-spin rounded-full border-2 border-b-amber-500 border-l-red-500 border-r-green-500 border-t-transparent"></div>
    <div className="absolute inset-1 flex items-center justify-center rounded-full bg-white">
      <div className="h-1 w-1 rounded-full bg-gray-700"></div>
    </div>
  </div>
)

const MetricsGrid = ({ selectedMonth, selectedLeader, metricTypeId }: MetricsGridProps) => {
  const [expandedMetrics, setExpandedMetrics] = useState<number[]>([])
  const [selectedMetricId, setSelectedMetricId] = useState<number | null>(null)
  const [gridData, setGridData] = useState<ExtendedGridRowData[]>([])
  const [pendingAction, setPendingAction] = useState<{
    type: "expand" | "collapse"
    metricId: number
  } | null>(null)

  // Pass selectedLeader and selectedMonth to the useDashboardData hook
  const { sixMonthByMetricPerformance, useGetSltMetricPerformance, sixMonthByMetricPerformanceQuery } =
    useDashboardData(selectedMonth, selectedLeader?.id, metricTypeId)

  // Reset expanded metrics with filters change
  useEffect(() => {
    setExpandedMetrics([])
    setSelectedMetricId(null)
    setPendingAction(null)
  }, [selectedLeader, selectedMonth, metricTypeId])

  // Pass selectedLeader and selectedMonth to the useGetSltMetricPerformance hook
  const { data: sltMetricPerformance, isLoading: isSltDataLoading } = useGetSltMetricPerformance(
    selectedMetricId ?? 0,
    selectedMonth ?? undefined,
    selectedLeader?.id ?? undefined,
  ) as {
    data: SltResponse | null
    isLoading: boolean
  }

  // Initialize grid data with sixMonthByMetricPerformance
  useEffect(() => {
    if (sixMonthByMetricPerformance) {
      const baseData = sixMonthByMetricPerformance.map((metric: MetricData) => {
        // Create a base row with metric data
        const baseRow: any = {
          metricId: metric.metricId,
          metricPrefix: metric.metricPrefix,
          metricName: metric.metricName,
          valueType: metric.valueType,
          metricDescription: metric.metricDescription,
          metricCalculation: metric.metricCalculation,
          serviceAlignment: metric.serviceAlignment,
          trigger: metric.trigger,
          limit: metric.limit,
          source: metric.source,
          metricType: metric.metricType,
          isParent: true,
        }

        // Add monthly data to the row
        metric.monthlyData.forEach((monthData) => {
          // Create month field names based on the month value
          const monthIndex = getMonthIndex(monthData.month)
          if (monthIndex) {
            baseRow[`${monthIndex}Month`] = monthData.month
            baseRow[`${monthIndex}Month_Result`] = monthData.result
            baseRow[`${monthIndex}Month_Color`] = monthData.color
          }
        })

        return baseRow
      })

      setGridData(baseData)
    }
  }, [sixMonthByMetricPerformance])

  // Helper function to get month index (first, second, etc.) based on date
  const getMonthIndex = (monthStr: string): string | null => {
    if (!sixMonthByMetricPerformance || sixMonthByMetricPerformance.length === 0) {
      return null
    }

    // Get all available months from the first metric
    const allMonths = sixMonthByMetricPerformance[0].monthlyData
      .map((m) => m.month)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // Sort newest first

    // Find the index of the month in the sorted array
    const index = allMonths.findIndex((m) => m === monthStr)
    if (index === -1) return null

    // Convert index to month name (first, second, etc.)
    const monthNames = [
      "first",
      "second",
      "third",
      "fourth",
      "five",
      "sixth",
      "seventh",
      "eighth",
      "ninth",
      "tenth",
      "eleventh",
      "twelfth",
    ]
    return index < monthNames.length ? monthNames[index] : null
  }

  // Process SLT data when it's loaded
  useEffect(() => {
    if (sltMetricPerformance && sltMetricPerformance.sltData && selectedMetricId && !isSltDataLoading) {
      // only process if we have a pending expand action
      if (pendingAction?.type === "expand" && pendingAction.metricId === selectedMetricId) {
        // create a new grid data array without modifying the existing one
        const baseGrid = [...gridData]

        // Find the parent row index
        const parentIndex = baseGrid.findIndex((row) => row.metricId === selectedMetricId && row.isParent)

        if (parentIndex !== -1) {
          // create child rows
          const childRows = sltMetricPerformance.sltData.map((slt) => {
            // Create a base row with SLT data
            const childRow: any = {
              metricId: selectedMetricId,
              isParent: false,
              sltName: slt.sltName,
              sltNBId: slt.sltNbkId,
            }

            // Add monthly data to the row
            slt.sltMonthlyData.forEach((monthData) => {
              // Create month field names based on the month value
              const monthIndex = getMonthIndex(monthData.month)
              if (monthIndex) {
                childRow[`${monthIndex}Month`] = monthData.month
                childRow[`${monthIndex}Month_Result`] = monthData.result
                childRow[`${monthIndex}Month_Color`] = monthData.color
              }
            })

            return childRow
          })

          // Insert child rows after the parent
          const newGridData = [...baseGrid.slice(0, parentIndex + 1), ...childRows, ...baseGrid.slice(parentIndex + 1)]

          setGridData(newGridData)

          // Add to expanded metrics
          if (!expandedMetrics.includes(selectedMetricId)) {
            setExpandedMetrics((prev) => [...prev, selectedMetricId])
          }
        }

        // Clear the pending action
        setPendingAction(null)
      }
    }
  }, [sltMetricPerformance, selectedMetricId, isSltDataLoading, pendingAction, gridData, expandedMetrics])

  // process collapse action
  useEffect(() => {
    if (pendingAction?.type === "collapse") {
      const metricId = pendingAction.metricId

      // Remove child rows
      setGridData((prev) => prev.filter((row) => !(row.metricId === metricId && !row.isParent)))

      // Remove expanded metrics
      setExpandedMetrics((prev) => prev.filter((id) => id !== metricId))

      // Clear the pending action
      setPendingAction(null)
    }
  }, [pendingAction])

  // Get available months for display
  const monthColumns = useMemo(() => {
    if (!sixMonthByMetricPerformance || sixMonthByMetricPerformance.length === 0) return []

    // Get all months from the first metric
    const allMonths = sixMonthByMetricPerformance[0].monthlyData
      .map((m) => m.month)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // Sort newest first

    // If a specific month is selected, only show that month
    if (selectedMonth) {
      const filteredMonths = allMonths.filter((month) => month.startsWith(selectedMonth))

      return filteredMonths.map((month) => {
        const monthIndex = getMonthIndex(month)
        return {
          month,
          result: `${monthIndex}Month_Result`,
        }
      })
    }

    // Otherwise, return all months (up to 6 for display)
    return allMonths.slice(0, 6).map((month) => {
      const monthIndex = getMonthIndex(month)
      return {
        month,
        result: `${monthIndex}Month_Result`,
      }
    })
  }, [sixMonthByMetricPerformance, selectedMonth])

  const handleToggleRow = useCallback(
    (metricId: number) => {
      // If there's already a pending action, ignore this click
      if (pendingAction !== null) return

      if (expandedMetrics.includes(metricId)) {
        // Collapse: Set a pending collapse action
        setPendingAction({ type: "collapse", metricId })
      } else {
        // Expand: set the selected metric ID and a pending expand action
        setSelectedMetricId(metricId)
        setPendingAction({ type: "expand", metricId })
      }
    },
    [expandedMetrics, pendingAction],
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

    if (colorField in data) {
      const color = data[colorField]

      if (typeof color === "string") {
        switch (color.toLowerCase()) {
          case "#e61622":
          case "red":
            return isParent ? metricPerformanceColors.parent.bad : metricPerformanceColors.child.bad
          case "#009223":
          case "green":
            return isParent ? metricPerformanceColors.parent.good : metricPerformanceColors.child.good
          case "#ffbf00":
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
        headerName: "Service Alignment",
        field: "serviceAlignment",
        cellRenderer: (params: ICellRendererParams<GridRowData>) => {
          if (!params.data) return null

          const isParent = params.data.isParent
          const metricId = params.data.metricId
          const isExpanded = isParent && expandedMetrics.includes(metricId)
          const isLoading =
            isParent &&
            ((pendingAction?.type === "expand" && pendingAction.metricId === metricId) ||
              (isSltDataLoading && selectedMetricId === metricId))

          const content = (
            <div style={{ display: "flex", alignItems: "center" }}>
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
              metricDescription={isParent ? (params.data.metricDescription ?? "") : ""}
              metricCalculation={isParent ? (params.data.metricCalculation ?? "") : ""}
              isLoading={false}
            >
              {content}
            </MetricTooltip>
          )
        },
        flex: 2,
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Metric",
        field: "metricName",
        flex: 1,
        filter: "agTextColumnFilter",
        cellRenderer: (params: ICellRendererParams<GridRowData>) => {
          return params.data?.isParent ? "[" + params.data.metricPrefix + "] " + params.data.metricName : ""
        },
      },
      {
        headerName: "Metric Type",
        field: "metricType",
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
        headerName: month ? new Date(month).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "N/A",
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
    [monthColumns, expandedMetrics, isSltDataLoading, selectedMetricId, handleToggleRow, pendingAction],
  )

  const defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  }

  if (!sixMonthByMetricPerformance || sixMonthByMetricPerformanceQuery.isLoading) {
    return (
      <div className="h-[600px] w-full p-4">
        <div className="mb-4 h-8 w-40 animate-pulse rounded-md bg-gray-200"></div>

        {/*Skeleton for table header*/}
        <div className="mb-2 flex border-b pb-2">
          <div className="flex-2 mr-4 h-6 w-48 animate-pulse rounded-md bg-gray-200"></div>
          <div className="mr-4 h-6 w-24 flex-1 animate-pulse rounded-md bg-gray-200"></div>
          <div className="mr-4 h-6 w-24 flex-1 animate-pulse rounded-md bg-gray-200"></div>
          <div className="mr-4 h-6 w-24 flex-1 animate-pulse rounded-md bg-gray-200"></div>
          <div className="h-6 w-24 flex-1 animate-pulse rounded-md bg-gray-200"></div>
        </div>

        {/*Skeleton for rows*/}
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex border-b py-3">
            <div className="flex-2 flex items-center">
              <div className="mr-2 h-4 w-4 animate-pulse rounded-md bg-gray-200"></div>
              <div className="h-4 w-40 animate-pulse rounded-md bg-gray-200"></div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="h-4 w-16 animate-pulse rounded-md bg-gray-200"></div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="h-4 w-12 animate-pulse rounded-md bg-gray-200"></div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="h-4 w-12 animate-pulse rounded-md bg-gray-200"></div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="h-4 w-20 animate-pulse rounded-md bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="ag-theme-alpine h-full w-full overflow-hidden">
      <div className="h-full w-full overflow-auto scrollbar-hide">
        <AgGridReact
          key={`metrics-grid-${metricTypeId || "all"}`}
          rowData={gridData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          getRowId={getRowId}
          suppressRowTransform={true}
          domLayout="autoHeight"
        />
      </div>
    </div>
  )
}

export default MetricsGrid
