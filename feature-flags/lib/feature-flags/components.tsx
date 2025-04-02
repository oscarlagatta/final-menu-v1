"use client"

import type { ReactNode } from "react"
import { useFeatureFlags } from "./context"

interface FeatureProps {
  featureId: string
  children: ReactNode
  fallback?: ReactNode
}

export function Feature({ featureId, children, fallback = null }: FeatureProps) {
  const { isFeatureEnabled } = useFeatureFlags()
  const enabled = isFeatureEnabled(featureId)

  return enabled ? <>{children}</> : <>{fallback}</>
}

interface RouteGuardProps {
  featureId: string
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
}

export function RouteGuard({ featureId, children, fallback, redirectTo }: RouteGuardProps) {
  const { isFeatureEnabled } = useFeatureFlags()
  const enabled = isFeatureEnabled(featureId)

  if (!enabled) {
    if (redirectTo) {
      // In a real implementation, you would use Next.js router to redirect
      // This is a simplified version for the demo
      if (typeof window !== "undefined") {
        window.location.href = redirectTo
        return null
      }
    }
    return fallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}

