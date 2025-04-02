"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { FeatureFlag, FeatureFlagContextType, FeatureFlagProviderProps } from "./types"

// Replace the defaultFlags array with this import
import defaultFlagsData from "./feature-flags.json"

// Create the context
const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined)

// Update the FeatureFlagProvider component to include the addFlag function
export const FeatureFlagProvider = ({ children, initialFlags }: FeatureFlagProviderProps) => {
  const [flags, setFlags] = useState<FeatureFlag[]>(
      initialFlags ||
      Object.values(defaultFlagsData).map((flag) => {
        if (!["feature", "route", "component"].includes(flag.type)) {
          throw new Error(`Invalid flag type: ${flag.type}`)
        }
        return { ...flag } as FeatureFlag
      }),
  )
  const [isManagementVisible, setIsManagementVisible] = useState(false)

  // Check if we're in a non-production environment
  useEffect(() => {
    const env = process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV
    const allowedEnvs = ["development", "test", "preview", "uat"]
    setIsManagementVisible(allowedEnvs.includes(env || ""))

    // Load flags from localStorage if available
    const storedFlags = localStorage.getItem("featureFlags")
    if (storedFlags) {
      try {
        setFlags(JSON.parse(storedFlags))
      } catch (e) {
        console.error("Failed to parse stored feature flags", e)
      }
    }
  }, [])

  // Save flags to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("featureFlags", JSON.stringify(flags))
  }, [flags])

  const isFeatureEnabled = (featureId: string) => {
    const flag = flags.find((f) => f.id === featureId)
    return flag?.enabled || false
  }

  const toggleFeature = (featureId: string) => {
    setFlags((prevFlags) =>
      prevFlags.map((flag) => (flag.id === featureId ? { ...flag, enabled: !flag.enabled } : flag)),
    )
  }

  const updateFlag = (updatedFlag: FeatureFlag) => {
    setFlags((prevFlags) => prevFlags.map((flag) => (flag.id === updatedFlag.id ? updatedFlag : flag)))
  }

  // Add new function to add a flag
  const addFlag = (newFlag: Omit<FeatureFlag, "enabled">) => {
    const flagWithEnabled: FeatureFlag = { ...newFlag, enabled: false }
    setFlags((prevFlags) => {
      // Check if flag with this ID already exists
      if (prevFlags.some((flag) => flag.id === newFlag.id)) {
        return prevFlags
      }
      return [...prevFlags, flagWithEnabled]
    })
  }

  const value = {
    flags,
    isFeatureEnabled,
    toggleFeature,
    updateFlag,
    addFlag,
    isManagementVisible,
  }

  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>
}

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext)
  if (context === undefined) {
    throw new Error("useFeatureFlags must be used within a FeatureFlagProvider")
  }
  return context
}

