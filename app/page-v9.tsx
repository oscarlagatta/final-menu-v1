import type { Metadata } from "next"
import {ImportApplicationTabs} from "@/components/import-application/components/import-application-tabs";



export const metadata: Metadata = {
  title: "Import Application",
  description: "Application import management interface",
}

export default function ImportApplicationPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Import Application</h1>
      </div>
      <ImportApplicationTabs />
    </div>
  )
}

