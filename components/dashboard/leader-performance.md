### Backend API Endpoint Requirements for Leader Performance Component

## Endpoint Specification

### GET /api/v2/metric-performances/leader-metrics

This endpoint would return all leader-related metric performance data in a single call, eliminating the need for multiple requests per metric ID.

### Request Parameters

| Parameter | Type | Required | Description
|-----|-----|-----|-----
| `month` | string | Yes | Month in YYYY-MM format (e.g., "2025-03")
| `includeDetails` | boolean | No | Whether to include detailed breakdown data (default: false)
| `status` | string | No | Filter by status (e.g., "Green", "Amber", "Red")
| `leaderName` | string | No | Filter by leader name


### Response Structure

```typescript
interface LeaderMetricsResponse {
  // Summary data
  summary: {
    totalMetrics: number;
    statusCounts: {
      green: number;
      amber: number;
      red: number;
      grey: number;
    };
  };
  
  // Leader performance data
  leaders: Array<{
    leaderId: number;
    leaderName: string;
    statusCounts: {
      green: number;
      amber: number;
      red: number;
      grey: number;
    };
    metrics?: Array<{  // Only included if includeDetails=true
      metricId: number;
      metricPrefix: string;
      metricName: string;
      status: string;  // "Green", "Amber", "Red", or "Grey"
      value: number;   // Performance percentage
      numerator: number;
      denominator: number;
    }>;
  }>;
}
```

### Example Response

```json
{
  "summary": {
    "totalMetrics": 25,
    "statusCounts": {
      "green": 15,
      "amber": 7,
      "red": 2,
      "grey": 1
    }
  },
  "leaders": [
    {
      "leaderId": 101,
      "leaderName": "John Wilson",
      "statusCounts": {
        "green": 4,
        "amber": 2,
        "red": 0,
        "grey": 0
      },
      "metrics": [
        {
          "metricId": 1,
          "metricPrefix": "PM001",
          "metricName": "PBI Record has Coordinator 24 hours after creation PBI",
          "status": "Green",
          "value": 82.35,
          "numerator": 28,
          "denominator": 34
        },
        // Additional metrics...
      ]
    },
    // Additional leaders...
  ]
}
```

## Implementation Notes for Backend Developers

1. **Performance Considerations**:

1. This endpoint consolidates multiple requests into one, reducing network overhead
2. Consider caching responses with appropriate cache headers
3. For large datasets, implement pagination using `limit` and `offset` parameters



2. **Data Aggregation**:

1. The endpoint should aggregate data across all metrics for each leader
2. Status counts should be pre-calculated on the server side
3. The `metrics` array should only be included when `includeDetails=true` to reduce payload size



3. **Error Handling**:

1. Return appropriate HTTP status codes (e.g., 400 for invalid parameters)
2. Include descriptive error messages in the response body
3. Handle missing data gracefully (e.g., return empty arrays rather than null)



4. **Security Considerations**:

1. Ensure proper authentication and authorization
2. Validate and sanitize all input parameters
3. Consider rate limiting to prevent abuse





## How This Endpoint Would Be Used in the Frontend

```typescript
// Custom hook to fetch leader metrics data
function useLeaderMetrics(month: string) {
  return useQuery({
    queryKey: ['leaderMetrics', month],
    queryFn: () => fetch(`/api/v2/metric-performances/leader-metrics?month=${month}`)
      .then(res => res.json()),
    enabled: !!month
  });
}

// In the LeaderPerformance component
const { data, isLoading, error } = useLeaderMetrics(selectedMonth);

// Then process and display the data
```

This endpoint would allow the LeaderPerformance component to fetch all necessary data in a single request, improving performance and simplifying the component's implementation.