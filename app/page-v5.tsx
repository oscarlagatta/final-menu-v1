
import type { Metadata } from "next"
import {RGIDataTable} from "@/components/dashboard/rgi-data-table";

export const metadata: Metadata = {
    title: "RGI Dashboard",
    description: "Risk Governance Issues tracking dashboard with advanced filtering and sorting capabilities.",
}

export default function DashboardPage() {
    return (
        <div className="py-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">RGI Dashboard</h1>
                <p className="text-muted-foreground">Track and manage Risk Governance Issues across your organization.</p>
            </div>
            <RGIDataTable />
        </div>
    )
}

