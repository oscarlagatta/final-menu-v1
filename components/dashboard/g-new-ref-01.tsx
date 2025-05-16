"use client"

import { useCallback, useEffect, useState, useMemo, useRef } from "react"

import type { ColDef, GetRowIdParams, ICellRendererParams } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import { ChevronDown, ChevronRight } from "lucide-react"

import { type CellColorParams, useDashboardData } from "@bofa/data-services"
import { metricPerformanceColors } from "@bofa/util"

import { MetricTooltip } from "./MetricTooltip"

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

// Define the grid row data structure
interface GridRowData {
  metricId: number
  metricPrefix?: string
  metricName?: string
  valueType?: string
  metricDescription?: string
  metricCalculation?: string
  serviceAlignment?: string
  trigger?: number
  limit?: number
  source?: string
  metricType?: string
  isParent: boolean
  sltName?: string
  sltNBId?: string
  // Dynamic month fields will be added at runtime
  [key: string]: any
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
  const gridApiRef = useRef<any>(null)
  const [expandedMetrics, setExpandedMetrics] = useState<number[]>([])
  const [selectedMetricId, setSelectedMetricId] = useState<number | null>(null)
  const [gridData, setGridData] = useState<GridRowData[]>([])
  const [pendingAction, setPendingAction] = useState<{
    type: "expand" | "collapse"
    metricId: number
  } | null>(null)

  // Store all unique months across all metrics
  const [allUniqueMonths, setAllUniqueMonths] = useState<string[]>([])

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

  const [isLoading, setIsLoading] = useState(true)
  const [isGridMounted, setIsGridMounted] = useState(false)

  useEffect(() => {
    setIsLoading(sixMonthByMetricPerformanceQuery.isLoading)
  }, [sixMonthByMetricPerformanceQuery.isLoading])

  // Collect all unique months across all metrics
  useEffect(() => {
    if (sixMonthByMetricPerformance && sixMonthByMetricPerformance.length > 0) {
      const uniqueMonths = new Set<string>()

      // Loop through all metrics to collect all available months
      sixMonthByMetricPerformance.forEach((metric: MetricData) => {
        metric.monthlyData.forEach((monthData: MonthData) => {
          uniqueMonths.add(monthData.month)
        })
      })

      // Convert to array and sort (newest first)
      const sortedMonths = Array.from(uniqueMonths).sort(
        (a: string, b: string) => new Date(b).getTime() - new Date(a).getTime(),
      )

      setAllUniqueMonths(sortedMonths)

      console.log(`Found ${sortedMonths.length} unique months across all metrics:`, sortedMonths)

      // Debug specific metric
      const metric71 = sixMonthByMetricPerformance.find((m) => m.metricId === 71)
      if (metric71) {
        console.log("Metric 71 data:", metric71.metricName)
        console.log(
          "Metric 71 months:",
          metric71.monthlyData.map((m) => m.month),
        )
      }
    }
  }, [sixMonthByMetricPerformance])

  // Initialize grid data with sixMonthByMetricPerformance
  useEffect(() => {
    if (sixMonthByMetricPerformance && allUniqueMonths.length > 0) {
      const baseData = sixMonthByMetricPerformance.map((metric: MetricData) => {
        // Create a base row with metric data
        const baseRow: GridRowData = {
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

        // Create a map of month to month data for quick lookup
        const monthDataMap = new Map<string, MonthData>()
        metric.monthlyData.forEach((monthData) => {
          monthDataMap.set(monthData.month, monthData)
        })

        // Add data for all unique months, using NDTR for missing months
        allUniqueMonths.forEach((month, index) => {
          const monthIndex = index + 1 // 1-based index
          const monthName = getMonthNameByIndex(monthIndex)

          if (monthName) {
            const monthData = monthDataMap.get(month)

            if (monthData) {
              // Month data exists for this metric
              baseRow[`${monthName}Month`] = month
              baseRow[`${monthName}Month_Result`] = monthData.result
              baseRow[`${monthName}Month_Color`] = monthData.color
            } else {
              // No data for this month, set NDTR
              baseRow[`${monthName}Month`] = month
              baseRow[`${monthName}Month_Result`] = "NDTR"
              baseRow[`${monthName}Month_Color`] = "grey"
            }
          }
        })

        // Debug for metric 71
        if (metric.metricId === 71) {
          console.log("Metric 71 grid data:", baseRow)
        }

        return baseRow
      })

      setGridData(baseData)
    }
  }, [sixMonthByMetricPerformance, allUniqueMonths])

  // Helper function to get month name by index
  const getMonthNameByIndex = (index: number): string | null => {
    const monthNames = [
      "first",
      "second",
      "third",
      "fourth",
      "fifth",
      "sixth",
      "seventh",
      "eighth",
      "ninth",
      "tenth",
      "eleventh",
      "twelfth",
      "thirteenth",
      "fourteenth",
      "fifteenth",
      "sixteenth",
      "seventeenth",
      "eighteenth",
      "nineteenth",
      "twentieth",
      "twentyFirst",
      "twentySecond",
      "twentyThird",
      "twentyFourth",
    ]
    return index <= monthNames.length ? monthNames[index - 1] : null
  }

  // Helper function to get month index from month string
  const getMonthIndex = (monthStr: string): string | null => {
    if (!allUniqueMonths || allUniqueMonths.length === 0) {
      return null
    }

    // Find the index of the month in the sorted array
    const index = allUniqueMonths.findIndex((m: string) => m === monthStr)
    if (index === -1) return null

    // Convert to 1-based index and get month name
    return getMonthNameByIndex(index + 1)
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
          const childRows = sltMetricPerformance.sltData.map((slt: SltData) => {
            // Create a base row with SLT data
            const childRow: GridRowData = {
              metricId: selectedMetricId,
              isParent: false,
              sltName: slt.sltName,
              sltNBId: slt.sltNbkId,
            }

            // Create a map of month to month data for quick lookup
            const monthDataMap = new Map<string, SltMonthData>()
            slt.sltMonthlyData.forEach((monthData) => {
              monthDataMap.set(monthData.month, monthData)
            })

            // Add data for all unique months, using NDTR for missing months
            allUniqueMonths.forEach((month, index) => {
              const monthIndex = index + 1 // 1-based index
              const monthName = getMonthNameByIndex(monthIndex)

              if (monthName) {
                const monthData = monthDataMap.get(month)

                if (monthData) {
                  // Month data exists for this SLT
                  childRow[`${monthName}Month`] = month
                  childRow[`${monthName}Month_Result`] = monthData.result
                  childRow[`${monthName}Month_Color`] = monthData.color
                } else {
                  // No data for this month, set NDTR
                  childRow[`${monthName}Month`] = month
                  childRow[`${monthName}Month_Result`] = "NDTR"
                  childRow[`${monthName}Month_Color`] = "grey"
                }
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
  }, [
    sltMetricPerformance,
    selectedMetricId,
    isSltDataLoading,
    pendingAction,
    gridData,
    expandedMetrics,
    allUniqueMonths,
  ])

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
    if (!allUniqueMonths || allUniqueMonths.length === 0) return []

    // If a specific month is selected, only show that month
    if (selectedMonth) {
      const filteredMonths = allUniqueMonths.filter((month: string) => month.startsWith(selectedMonth))

      return filteredMonths.map((month: string, index: number) => {
        const monthName = getMonthNameByIndex(index + 1)
        return {
          month,
          result: `${monthName}Month_Result`,
        }
      })
    }

    // Return all available months (up to 24)
    return allUniqueMonths.slice(0, 24).map((month: string, index: number) => {
      const monthName = getMonthNameByIndex(index + 1)
      return {
        month,
        result: `${monthName}Month_Result`,
      }
    })
  }, [allUniqueMonths, selectedMonth])

  // Add this debug function to inspect the data structure
  useEffect(() => {
    if (sixMonthByMetricPerformance && sixMonthByMetricPerformance.length > 0) {
      console.log("Data inspection:")
      console.log("Number of metrics:", sixMonthByMetricPerformance.length)

      // Check column definitions
      console.log("Month columns:", monthColumns)
    }
  }, [sixMonthByMetricPerformance, monthColumns])

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
    if (!monthField) return "#f8f9fa" // Light gray instead of white

    const colorField = monthField.replace("_Result", "_Color")

    // Use our new GridRowData interface
    const data = params.data as GridRowData

    const isParent = data.isParent

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
            return "#f8f9fa" // Light gray instead of white
        }
      }
    }

    return "#f0f0f0" // Slightly darker gray for default
  }

  // Function to determine if a background color is light
  const isLightColor = (color: string): boolean => {
    return color === "#f8f9fa" || color === "#f0f0f0"
  }

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "Service Alignment",
        field: "serviceAlignment",
        cellRenderer: (params: ICellRendererParams) => {
          if (!params.data) return null

          const data = params.data as GridRowData
          const isParent = data.isParent
          const metricId = data.metricId
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
              {isParent ? params.value : <div style={{ paddingLeft: "24px" }}>{data.sltName}</div>}
            </div>
          )

          return (
            <MetricTooltip
              metricName={isParent ? (data.metricName ?? "") : (data.sltName ?? "")}
              metricDescription={isParent ? (data.metricDescription ?? "") : ""}
              metricCalculation={isParent ? (data.metricCalculation ?? "") : ""}
              isLoading={false}
            >
              {content}
            </MetricTooltip>
          )
        },
        flex: 2,
        filter: "agTextColumnFilter",
        pinned: "left", // Pin this column to the left
        cellStyle: {
          border: "1px solid #000000", // Black border for all cells
        },
      },
      {
        headerName: "Metric",
        field: "metricName",
        flex: 1,
        filter: "agTextColumnFilter",
        cellRenderer: (params: ICellRendererParams) => {
          const data = params.data as GridRowData
          return data.isParent ? "[" + data.metricPrefix + "] " + data.metricName : ""
        },
        pinned: "left", // Pin this column to the left
        cellStyle: {
          border: "1px solid #000000", // Black border for all cells
        },
      },
      {
        headerName: "Metric Type",
        field: "metricType",
        flex: 1,
        filter: "agTextColumnFilter",
        cellRenderer: (params: ICellRendererParams) => {
          const data = params.data as GridRowData
          return data.isParent ? params.value : ""
        },
        cellStyle: {
          border: "1px solid #000000", // Black border for all cells
        },
      },
      {
        headerName: "Thresholds",
        field: "trigger", // Using trigger as the base field
        flex: 1,
        filter: "agTextColumnFilter",
        cellRenderer: (params: ICellRendererParams) => {
          const data = params.data as GridRowData

          if (!data.isParent) return ""

          const trigger = data.trigger
          const limit = data.limit
          const valueType = data.valueType
          const suffix = valueType === "%" ? "%" : ""

          const formatValue = (value: number | undefined) => {
            if (value === null || value === undefined) return "n/a"
            return `${value.toFixed(2)}${suffix}`
          }

          return (
            <div className="flex items-center justify-center space-x-1">
              <span className="text-green-600 font-medium">{formatValue(trigger)}</span>
              <span className="text-gray-500">/</span>
              <span className="text-red-600 font-medium">{formatValue(limit)}</span>
            </div>
          )
        },
        cellStyle: {
          border: "1px solid #000000", // Black border for all cells
        },
      },
      {
        headerName: "Source",
        field: "source",
        flex: 1,
        filter: "agTextColumnFilter",
        cellRenderer: (params: ICellRendererParams) => {
          const data = params.data as GridRowData
          return data.isParent ? params.value : ""
        },
        cellStyle: {
          border: "1px solid #000000", // Black border for all cells
        },
      },
      ...monthColumns.map(({ month, result }) => ({
        headerClass: "text-center",
        headerName: month ? new Date(month).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "N/A",
        field: result,
        flex: 1,
        cellStyle: (params: any) => {
          const backgroundColor = getCellColor(params)

          return {
            textAlign: "center",
            backgroundColor: backgroundColor,
            color: !params.value || params.value === "NDTR" ? "gray" : "black",
            border: "1px solid #000000", // Black border for all cells
          }
        },
        valueFormatter: (params: any) => {
          if (!params.value) return "NDTR"
          return params.value
        },
        cellRenderer: (params: ICellRendererParams) => {
          if (!params.value) return "NDTR"
          if (params.value === "NDTR") return params.value

          const parts = params.value.split("-")

          if (parts.length !== 3) return params.value

          const data = params.data as GridRowData
          const [percentage, numerator, denominator] = parts
          const isParent = data.isParent

          // Get the cell color to determine text color
          const colorField = params.column.getColId().replace("_Result", "_Color")
          const cellColor = data[colorField]

          // Determine if this is a light background cell
          let isLightBg = true
          if (typeof cellColor === "string") {
            const color = cellColor.toLowerCase()
            isLightBg =
              color !== "#e61622" &&
              color !== "red" &&
              color !== "#009223" &&
              color !== "green" &&
              color !== "#ffbf00" &&
              color !== "amber"
          }

          const formattedPercentage = Number.parseFloat(percentage).toFixed(2) + (data.valueType === "%" ? "%" : "")
          const formattedFraction = `${numerator}/${denominator}`

          return (
            <div className="flex h-full flex-col items-center justify-center">
              <div
                className="text-sm font-medium"
                style={{
                  color: isLightBg ? "#000000" : "#ffffff", // Black text for light backgrounds, white for dark
                }}
              >
                {formattedPercentage}
              </div>
              <div
                className="text-xs font-medium"
                style={{
                  color: isLightBg ? "#000000" : "#d9d9d9", // Black text for light backgrounds, light gray for dark
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

  useEffect(() => {
    setIsGridMounted(true)
  }, [])

  const renderLoadingSkeleton = () => {
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

  // Add CSS for better horizontal scrolling and grid styling
  useEffect(() => {
    if (!isGridMounted) return
    // Create a style element for grid styles
    const styleElement = document.createElement("style")
    styleElement.id = "grid-horizontal-scroll-styles"
    styleElement.textContent = `
    .ag-root-wrapper {
      width: 100% !important;
      overflow-x: auto;
    }
    .ag-center-cols-container {
      width: 100% !important;
      min-width: max-content;
    }
    .ag-header-container, .ag-center-cols-container, .ag-body-viewport {
      width: 100% !important;
    }
    .ag-body-viewport {
      overflow-x: auto !important;
    }
    .ag-header-cell {
      border: 1px solid #000000 !important;
    }
    .ag-row {
      border-color: #000000 !important;
    }
  `
    document.head.appendChild(styleElement)

    // Clean up on component unmount
    return () => {
      const existingStyle = document.getElementById("grid-horizontal-scroll-styles")
      if (existingStyle) {
        document.head.removeChild(existingStyle)
      }
    }
  }, [isGridMounted])

  useEffect(() => {
    const handleResize = () => {
      if (gridApiRef.current) {
        gridApiRef.current.sizeColumnsToFit()
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const onGridReady = useCallback((params: any) => {
    gridApiRef.current = params.api
  }, [])

  const onFirstDataRendered = useCallback(() => {
    if (gridApiRef.current) {
      // Fit columns to their content
      gridApiRef.current.sizeColumnsToFit()

      // Ensure the grid fits its container
      setTimeout(() => {
        gridApiRef.current.sizeColumnsToFit()
      }, 100)
    }
  }, [])

  if (isLoading) {
    return renderLoadingSkeleton()
  }

  return (
    <div className="ag-theme-alpine w-full h-full">
      <div className="w-full h-full overflow-auto scrollbar-hide">
        <AgGridReact
          key={`metrics-grid-${metricTypeId || "all"}`}
          rowData={gridData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          getRowId={getRowId}
          suppressRowTransform={true}
          domLayout="autoHeight"
          onGridReady={onGridReady}
          onFirstDataRendered={onFirstDataRendered}
        />
      </div>
    </div>
  )
}

export default MetricsGrid
