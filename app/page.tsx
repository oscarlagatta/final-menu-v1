import type { Metadata } from "next"
import {ResourceHierarchiesContent} from "@/components/resource-hierarchies/components/resource-hierarchies-content";
import {EmployeeDropdown} from "@/components/drop-down/employee-dropdown";



export const metadata: Metadata = {
    title: "Resource Hierarchies",
    description: "Manage resource hierarchies across your organization",
}
export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
            <div className="w-full max-w-[600px] bg-white p-6 rounded-lg shadow-sm">
                <EmployeeDropdown />
            </div>
        </main>
    )
}
