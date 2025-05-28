"use client"

import { useCallback, useEffect, useState, useMemo, useRef } from "react"

import type { ColDef, GetRowIdParams, ICellRendererParams } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"

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

// Define the grid row data structure for master grid
interface MasterRowData {
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
  // Dynamic month fields will be added at runtime
  [key: string]: any
}

// Define the detail row data structure for SLT grid
interface DetailRowData {
  sltNbkId: string
  sltName: string
  // Dynamic month fields will be added at runtime
  [key: string]: any
}

const MetricsGrid = ({ selectedMonth, selectedLeader, metricTypeId }: MetricsGridProps) => {
  const gridApiRef = useRef<any>(null)
  const [masterRowData, setMasterRowData] = useState<MasterRowData[]>([])
  const [sltDataCache, setSltDataCache] = useState<Map<number, DetailRowData[]>>(new Map())
  const [pendingSltRequests, setPendingSltRequests] = useState<Map<number, any>>(new Map())
  const { sixMonthByMetricPerformance, useGetSltMetricPerformance, sixMonthByMetricPerformanceQuery } =
    useDashboardData(selectedMonth, selectedLeader?.id, metricTypeId)

  const [isLoading, setIsLoading] = useState(true)
  const [isGridMounted, setIsGridMounted] = useState(false)

  useEffect(() => {
    setIsLoading(sixMonthByMetricPerformanceQuery.isLoading)
  }, [sixMonthByMetricPerformanceQuery.isLoading])

  // Helper function to get month index (first, second, etc.) based on date
  const getMonthIndex = useCallback(
    (monthStr: string): string | null => {
      if (!sixMonthByMetricPerformance || sixMonthByMetricPerformance.length === 0) {
        return null
      }

      // Get all available months from the first metric
      const allMonths = sixMonthByMetricPerformance[0].monthlyData
        .map((m: MonthData) => m.month)
        .sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime()) // Sort newest first

      // Find the index of the month in the sorted array
      const index = allMonths.findIndex((m: string) => m === monthStr)
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
    },
    [sixMonthByMetricPerformance],
  )

  // Initialize master grid data
  useEffect(() => {
    if (sixMonthByMetricPerformance) {
      const masterData = sixMonthByMetricPerformance.map((metric: MetricData) => {
        // Create a master row with metric data
        const masterRow: MasterRowData = {
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
        }

        // Add monthly data to the row
        metric.monthlyData.forEach((monthData) => {
          const monthIndex = getMonthIndex(monthData.month)
          if (monthIndex) {
            masterRow[`${monthIndex}Month`] = monthData.month
            masterRow[`${monthIndex}Month_Result`] = monthData.result
            masterRow[`${monthIndex}Month_Color`] = monthData.color
          }
        })

        return masterRow
      })

      setMasterRowData(masterData)
    }
  }, [sixMonthByMetricPerformance, getMonthIndex])

  // Get available months for display
  const monthColumns = useMemo(() => {
    if (!sixMonthByMetricPerformance || sixMonthByMetricPerformance.length === 0) return []

    // Get all months from the first metric
    const allMonths = sixMonthByMetricPerformance[0].monthlyData
      .map((m: MonthData) => m.month)
      .sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime()) // Sort newest first

    // If a specific month is selected, only show that month
    if (selectedMonth) {
      const filteredMonths = allMonths.filter((month: string) => month.startsWith(selectedMonth))

      return filteredMonths.map((month: string) => {
        const monthIndex = getMonthIndex(month)
        return {
          month,
          result: `${monthIndex}Month_Result` as string,
        }
      })
    }

    // Return all available months (up to 12)
    return allMonths.map((month: string) => {
      const monthIndex = getMonthIndex(month)
      return {
        month,
        result: `${monthIndex}Month_Result` as string,
      }
    })
  }, [sixMonthByMetricPerformance, selectedMonth, getMonthIndex])

  const getRowId = (params: GetRowIdParams) => {
    return `metric-${params.data.metricId}`
  }

  const getCellColor = (params: CellColorParams) => {
    const monthField = params.column.getColId()
    if (!monthField) return "#f8f9fa"

    const colorField = monthField.replace("_Result", "_Color")
    const data = params.data as MasterRowData

    if (colorField in data) {
      const color = data[colorField]

      if (typeof color === "string") {
        switch (color.toLowerCase()) {
          case "#e61622":
          case "red":
            return metricPerformanceColors.parent.bad
          case "#009223":
          case "green":
            return metricPerformanceColors.parent.good
          case "#ffbf00":
          case "amber":
            return metricPerformanceColors.parent.warning
          case "grey":
          case "black":
            return metricPerformanceColors.parent.null
          default:
            return "#f8f9fa"
        }
      }
    }

    return "#f0f0f0"
  }

  // Detail cell color function for SLT data
  const getDetailCellColor = (params: CellColorParams) => {
    const monthField = params.column.getColId()
    if (!monthField) return "#f8f9fa"

    const colorField = monthField.replace("_Result", "_Color")
    const data = params.data as DetailRowData

    if (colorField in data) {
      const color = data[colorField]

      if (typeof color === "string") {
        switch (color.toLowerCase()) {
          case "#e61622":
          case "red":
            return metricPerformanceColors.child.bad
          case "#009223":
          case "green":
            return metricPerformanceColors.child.good
          case "#ffbf00":
          case "amber":
            return metricPerformanceColors.child.warning
          case "grey":
          case "black":
            return metricPerformanceColors.child.null
          default:
            return "#f8f9fa"
        }
      }
    }

    return "#f0f0f0"
  }

  // Function to fetch SLT data using the hook
  const fetchSltData = useCallback(
    async (metricId: number): Promise<DetailRowData[]> => {
      const sltResponse = await useGetSltMetricPerformanceInner(
        metricId,
        selectedMonth ?? undefined,
        selectedLeader?.id ?? undefined,
      )
      try {
        if (sltResponse && Array.isArray(sltResponse.sltData)) {
          const detailData = sltResponse.sltData.map((slt: SltData) => {
            // Create a properly typed DetailRowData object
            const detailRow: DetailRowData = {
              sltNbkId: slt.sltNbkId,
              sltName: slt.sltName,
            }

            // Add monthly data to the detail row
            slt.sltMonthlyData.forEach((monthData: SltMonthData) => {
              const monthIndex = getMonthIndex(monthData.month)
              if (monthIndex) {
                // Use type assertion for dynamic properties
                ;(detailRow as any)[`${monthIndex}Month`] = monthData.month
                ;(detailRow as any)[`${monthIndex}Month_Result`] = monthData.result
                ;(detailRow as any)[`${monthIndex}Month_Color`] = monthData.color
              }
            })

            return detailRow
          })

          return detailData
        }

        return []
      } catch (error) {
        console.error("Error fetching SLT data:", error)
        return []
      }
    },
    [selectedMonth, selectedLeader, getMonthIndex],
  )

  const useGetSltMetricPerformanceInner = useCallback(
    async (metricId: number, selectedMonth?: string, selectedLeaderId?: string) => {
      return await useGetSltMetricPerformance(metricId, selectedMonth, selectedLeaderId)
    },
    [useGetSltMetricPerformance],
  )

  // Function to load SLT data for detail grid
  const getDetailRowData = useCallback(
    async (params: any) => {
      const metricId = params.data.metricId

      try {
        // Check if data is already cached
        if (sltDataCache.has(metricId)) {
          params.successCallback(sltDataCache.get(metricId))
          return
        }

        // Check if there's already a pending request for this metric
        if (pendingSltRequests.has(metricId)) {
          const existingRequest = pendingSltRequests.get(metricId)
          const result = await existingRequest
          params.successCallback(result)
          return
        }

        // Create new request
        const requestPromise = fetchSltData(metricId)
        setPendingSltRequests((prev) => new Map(prev).set(metricId, requestPromise))

        const detailData = await requestPromise

        // Cache the data
        setSltDataCache((prev) => new Map(prev).set(metricId, detailData))

        // Remove from pending requests
        setPendingSltRequests((prev) => {
          const newMap = new Map(prev)
          newMap.delete(metricId)
          return newMap
        })

        params.successCallback(detailData)
      } catch (error) {
        console.error("Error loading detail data:", error)

        // Remove from pending requests on error
        setPendingSltRequests((prev) => {
          const newMap = new Map(prev)
          newMap.delete(metricId)
          return newMap
        })

        params.successCallback([])
      }
    },
    [sltDataCache, pendingSltRequests, fetchSltData],
  )

  // Master grid column definitions
  const masterColumnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "Service Alignment",
        field: "serviceAlignment",
        cellRenderer: (params: ICellRendererParams) => {
          if (!params.data) return null

          const data = params.data as MasterRowData

          return (
            <MetricTooltip
              metricName={data.metricName ?? ""}
              metricDescription={data.metricDescription ?? ""}
              metricCalculation={data.metricCalculation ?? ""}
              isLoading={false}
            >
              <span>{params.value}</span>
            </MetricTooltip>
          )
        },
        flex: 2,
        filter: "agTextColumnFilter",
        pinned: "left",
      },
      {
        headerName: "Metric",
        field: "metricName",
        flex: 1,
        filter: "agTextColumnFilter",
        cellRenderer: (params: ICellRendererParams) => {
          const data = params.data as MasterRowData
          return "[" + data.metricPrefix + "] " + data.metricName
        },
        pinned: "left",
      },
      {
        headerName: "Metric Type",
        field: "metricType",
        flex: 1,
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Thresholds",
        field: "trigger",
        flex: 1,
        filter: "agTextColumnFilter",
        cellRenderer: (params: ICellRendererParams) => {
          const data = params.data as MasterRowData
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
      },
      {
        headerName: "Source",
        field: "source",
        flex: 1,
        filter: "agTextColumnFilter",
      },
      ...monthColumns.map(({ month, result }) => ({
        headerClass: "text-center",
        headerName: month ? new Date(month).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "N/A",
        field: result,
        flex: 1,
        cellStyle: (params: any) => {
          const backgroundColor = getCellColor(params)
          const isLightBackground = backgroundColor === "#f8f9fa" || backgroundColor === "#f0f0f0"

          return {
            textAlign: "center",
            backgroundColor: backgroundColor,
            color: !params.value || params.value === "NDTR" ? "gray" : "black",
            border: isLightBackground ? "1px solid #e2e8f0" : "none",
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

          const [percentage, numerator, denominator] = parts
          const data = params.data as MasterRowData
          // Use safe access for dynamic properties
          const metricColor = data && typeof data === "object" ? (data as any)["metricColor"] : undefined
          const formattedPercentage = Number.parseFloat(percentage).toFixed(2) + (data.valueType === "%" ? "%" : "")
          const formattedFraction = `${numerator}/${denominator}`

          return (
            <div className="flex h-full flex-col items-center justify-center">
              <div
                className="text-sm font-medium"
                style={{
                  color: metricColor !== "lightgreen" ? "#ffffff" : "#595959",
                }}
              >
                {formattedPercentage}
              </div>
              <div
                className="text-xs font-medium"
                style={{
                  color: metricColor !== "lightgreen" ? "#d9d9d9" : "#7f7f7f",
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
    [monthColumns],
  )

  // Detail grid column definitions for SLT data
  const detailColumnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "SLT Name",
        field: "sltName",
        flex: 2,
        filter: "agTextColumnFilter",
        pinned: "left",
      },
      {
        headerName: "SLT ID",
        field: "sltNbkId",
        flex: 1,
        filter: "agTextColumnFilter",
      },
      ...monthColumns.map(({ month, result }) => ({
        headerClass: "text-center",
        headerName: month ? new Date(month).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "N/A",
        field: result,
        flex: 1,
        cellStyle: (params: any) => {
          const backgroundColor = getDetailCellColor(params)
          const isLightBackground = backgroundColor === "#f8f9fa" || backgroundColor === "#f0f0f0"

          return {
            textAlign: "center",
            backgroundColor: backgroundColor,
            color: !params.value || params.value === "NDTR" ? "gray" : "black",
            border: isLightBackground ? "1px solid #e2e8f0" : "none",
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

          const [percentage, numerator, denominator] = parts
          // No need for type assertion here as we're not accessing any specific properties
          const formattedPercentage = Number.parseFloat(percentage).toFixed(2) + "%"
          const formattedFraction = `${numerator}/${denominator}`

          return (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="text-sm font-medium text-gray-700">{formattedPercentage}</div>
              <div className="text-xs font-medium text-gray-500">{formattedFraction}</div>
            </div>
          )
        },
        filter: "agTextColumnFilter",
      })),
    ],
    [monthColumns],
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
        <div className="mb-2 flex border-b pb-2">
          <div className="flex-2 mr-4 h-6 w-48 animate-pulse rounded-md bg-gray-200"></div>
          <div className="mr-4 h-6 w-24 flex-1 animate-pulse rounded-md bg-gray-200"></div>
          <div className="mr-4 h-6 w-24 flex-1 animate-pulse rounded-md bg-gray-200"></div>
          <div className="mr-4 h-6 w-24 flex-1 animate-pulse rounded-md bg-gray-200"></div>
          <div className="h-6 w-24 flex-1 animate-pulse rounded-md bg-gray-200"></div>
        </div>
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

  // Add CSS for better horizontal scrolling
  useEffect(() => {
    if (!isGridMounted) return
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
    .ag-details-grid {
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      margin: 4px;
      border-radius: 4px;
    }
    .ag-details-grid .ag-header {
      background-color: #e9ecef;
    }
  `
    document.head.appendChild(styleElement)

    return () => {
      const existingStyle = document.getElementById("grid-horizontal-scroll-styles")
      if (existingStyle) {
        document.head.removeChild(existingStyle)
      }
    }
  }, [isGridMounted])

  const onGridReady = useCallback((params: any) => {
    gridApiRef.current = params.api
  }, [])

  const onFirstDataRendered = useCallback(() => {
    if (gridApiRef.current) {
      gridApiRef.current.sizeColumnsToFit()
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
          rowData={masterRowData}
          columnDefs={masterColumnDefs}
          defaultColDef={defaultColDef}
          getRowId={getRowId}
          masterDetail={true}
          detailCellRendererParams={{
            detailGridOptions: {
              columnDefs: detailColumnDefs,
              defaultColDef: {
                sortable: true,
                filter: true,
                resizable: true,
              },
              domLayout: "autoHeight",
              suppressHorizontalScroll: false,
            },
            getDetailRowData: getDetailRowData,
            template: `
              <div class="ag-details-grid ag-theme-alpine" style="height: 100%;">
                <div ref="eDetailGrid" style="height: 100%;"></div>
              </div>
            `,
          }}
          suppressRowTransform={true}
          domLayout="autoHeight"
          onGridReady={onGridReady}
          onFirstDataRendered={onFirstDataRendered}
          animateRows={true}
        />
      </div>
    </div>
  )
}

export default MetricsGrid
