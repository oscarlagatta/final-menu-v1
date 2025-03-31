import ResourceSkillsForm from "@/components/dashboard/components/core-skills/resource-skills-form";

export default function Home() {
    return (
        <main className="container mx-auto py-10 px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-6">Resource Skills Management</h1>
            <ResourceSkillsForm />
        </main>
    )
}

