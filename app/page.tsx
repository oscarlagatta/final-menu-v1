import {ResourceSkillsSheet} from "@/components/dashboard/components/core-skills/resource-skill-sheet";

export default function Home() {
    return (
        <main className="container mx-auto py-10 px-4 md:px-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Resource Skills Management</h1>
                <ResourceSkillsSheet />
            </div>
            <div className="bg-muted/40 rounded-lg p-8 text-center">
                <h2 className="text-xl font-medium mb-2">Welcome to Resource Skills Management</h2>
                <p className="text-muted-foreground mb-6">
                    Use the "Add Resource Skills" button to add a new resource and their skills to the system.
                </p>
            </div>
        </main>
    )
}