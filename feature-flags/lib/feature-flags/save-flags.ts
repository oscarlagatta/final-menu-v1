"use server"

import fs from "fs"
import path from "path"
import type { FeatureFlag } from "./types"

export async function saveFeatureFlagsToJson(flags: FeatureFlag[]) {
  try {
    // Convert array to object with ID as key
    const flagsObject = flags.reduce(
      (acc, flag) => {
        acc[flag.id] = flag
        return acc
      },
      {} as Record<string, FeatureFlag>,
    )

    // Path to the JSON file
    const filePath = path.join(process.cwd(), "lib/feature-flags/feature-flags.json")

    // Write to file
    await fs.promises.writeFile(filePath, JSON.stringify(flagsObject, null, 2), "utf8")

    return { success: true }
  } catch (error) {
    console.error("Failed to save feature flags:", error)
    return { success: false, error: (error as Error).message }
  }
}

