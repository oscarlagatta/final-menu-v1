import type { Metadata } from "next"
import {ResourceHierarchiesContent} from "@/components/resource-hierarchies/components/resource-hierarchies-content";



export const metadata: Metadata = {
    title: "Resource Hierarchies",
    description: "Manage resource hierarchies across your organization",
}

export default function ResourceHierarchiesPage() {
    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Resource Hierarchies</h1>
            </div>
            <ResourceHierarchiesContent />
        </div>
    )
}
