import type React from "react"
import { FeatureFlagProvider } from "@/lib/feature-flags"

// Initial feature flags for the demo
const initialFlags = [
  {
    id: "advanced-analytics",
    name: "Advanced Analytics",
    description: "Enable advanced analytics visualizations",
    type: "feature",
    enabled: false,
  },
  {
    id: "component-data-grid",
    name: "Enhanced Data Grid",
    description: "Use the enhanced data grid component",
    type: "component",
    enabled: false,
  },
  {
    id: "premium-features",
    name: "Premium Features",
    description: "Enable premium features",
    type: "feature",
    category: "premium",
    enabled: false,
  },
  {
    id: "experimental-ui",
    name: "Experimental UI",
    description: "Enable experimental UI components",
    type: "feature",
    category: "experimental",
    enabled: false,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <FeatureFlagProvider initialFlags={initialFlags}>{children}</FeatureFlagProvider>
}

