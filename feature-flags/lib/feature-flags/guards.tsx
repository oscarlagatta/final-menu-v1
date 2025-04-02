"use client"

import type React from "react"

import { useFeatureFlags } from "./context"

type FeatureProps = {
  featureId: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

// A component that only renders its children if the feature is enabled
export const Feature = ({ featureId, children, fallback = null }: FeatureProps) => {
  const { isFeatureEnabled } = useFeatureFlags()

  if (!isFeatureEnabled(featureId)) {
    return fallback
  }

  return <>{children}</>
}

// A higher-order component that only renders the wrapped component if the feature is enabled
export function withFeatureFlag<T>(Component: React.ComponentType<T>, featureId: string) {
  return function FeatureFlaggedComponent(props: T) {
    const { isFeatureEnabled } = useFeatureFlags()

    if (!isFeatureEnabled(featureId)) {
      return null
    }

    return <Component {...props} />
  }
}

// A component that only renders its children if the route is enabled
export const ProtectedRoute = ({ featureId, children, fallback = null }: FeatureProps) => {
  const { isFeatureEnabled } = useFeatureFlags()

  if (!isFeatureEnabled(featureId)) {
    return fallback
  }

  return <>{children}</>
}

