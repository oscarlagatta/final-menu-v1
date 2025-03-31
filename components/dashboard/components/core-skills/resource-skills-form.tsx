"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ChevronLeft, ChevronRight, Save, UserCircle, Zap, Code, Briefcase, ClipboardList } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import {ResourceSkillsFormValues} from "@/components/dashboard/types/resource-skills-form-values";
import {resourceSkillsFormSchema} from "@/components/dashboard/lib/schema";
import {FunctionalSkillsForm} from "@/components/dashboard/components/core-skills/functional-skills-form";
import {SkillsSummary} from "@/components/dashboard/components/core-skills/skills-summary";
import {ResourceInfoForm} from "@/components/dashboard/components/core-skills/resource-info-form";
import {CoreSkillsForm} from "@/components/dashboard/components/core-skills/core-skills-form";
import {TechnologySkillsForm} from "@/components/dashboard/components/core-skills/technology-skills-form";


export default function ResourceSkillsForm() {
    const [activeTab, setActiveTab] = useState("resource-info")

    const form = useForm<ResourceSkillsFormValues>({
        resolver: zodResolver(resourceSkillsFormSchema),
        defaultValues: {
            resourceId: "",
            resourceName: "",
            coreSkills: {
                applicationFailover: "No",
            },
            customTechnologySkills: [],
            customFunctionalSkills: [],
        },
        mode: "onTouched",
    })

    function onSubmit(data: ResourceSkillsFormValues) {
        // Calculate average score
        const techSkills = data.customTechnologySkills.map((skill) => skill.value)
        const funcSkills = data.customFunctionalSkills.map((skill) => skill.value)

        const allSkills = [...techSkills, ...funcSkills]
        const nonZeroSkills = allSkills.filter((skill) => skill > 0)

        const avgScore = nonZeroSkills.length
            ? Math.round((nonZeroSkills.reduce((sum, val) => sum + val, 0) / nonZeroSkills.length) * 10) / 10
            : 0

        // Determine competency level
        let competencyLevel = "None"
        if (avgScore >= 4) competencyLevel = "Advanced"
        else if (avgScore >= 3) competencyLevel = "Intermediate"
        else if (avgScore > 0) competencyLevel = "Basic"

        const finalData = {
            ...data,
            avgScore,
            competencyLevel,
        }

        console.log(finalData)
        toast({
            title: "Resource skills saved",
            description: `${data.resourceName}'s skills have been successfully saved.`,
        })
    }

    // Modify the nextTab function to validate the current tab before proceeding
    const nextTab = async () => {
        // Trigger validation for the current tab
        let isValid = false

        if (activeTab === "resource-info") {
            // Validate resource info fields
            const resourceInfoResult = await form.trigger(["resourceId", "resourceName"])
            isValid = resourceInfoResult
        } else if (activeTab === "core-skills") {
            // Validate core skills fields
            const coreSkillsResult = await form.trigger(["coreSkills"])
            isValid = coreSkillsResult
        } else if (activeTab === "technology-skills") {
            // Technology skills don't have required fields, so we can proceed
            isValid = true
        } else if (activeTab === "functional-skills") {
            // Functional skills don't have required fields, so we can proceed
            isValid = true
        }

        // Only proceed if validation passed
        if (isValid) {
            if (activeTab === "resource-info") setActiveTab("core-skills")
            else if (activeTab === "core-skills") setActiveTab("technology-skills")
            else if (activeTab === "technology-skills") setActiveTab("functional-skills")
            else if (activeTab === "functional-skills") setActiveTab("summary")
        } else {
            // Show toast notification for validation errors
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields before proceeding.",
                variant: "destructive",
            })
        }
    }

    const prevTab = () => {
        if (activeTab === "summary") setActiveTab("functional-skills")
        else if (activeTab === "functional-skills") setActiveTab("technology-skills")
        else if (activeTab === "technology-skills") setActiveTab("core-skills")
        else if (activeTab === "core-skills") setActiveTab("resource-info")
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Resource Skills Entry Form</CardTitle>
                <CardDescription>
                    Enter resource information and skill levels from 0 (no skill) to 5 (advanced).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Tabs
                            value={activeTab}
                            onValueChange={async (value) => {
                                // Allow going back to previous tabs without validation
                                if (
                                    (activeTab === "core-skills" && value === "resource-info") ||
                                    (activeTab === "technology-skills" && (value === "resource-info" || value === "core-skills")) ||
                                    (activeTab === "functional-skills" &&
                                        (value === "resource-info" || value === "core-skills" || value === "technology-skills")) ||
                                    (activeTab === "summary" &&
                                        (value === "resource-info" ||
                                            value === "core-skills" ||
                                            value === "technology-skills" ||
                                            value === "functional-skills"))
                                ) {
                                    setActiveTab(value)
                                    return
                                }

                                // Validate current tab before allowing forward navigation
                                let isValid = false

                                if (
                                    activeTab === "resource-info" &&
                                    (value === "core-skills" ||
                                        value === "technology-skills" ||
                                        value === "functional-skills" ||
                                        value === "summary")
                                ) {
                                    const resourceInfoResult = await form.trigger(["resourceId", "resourceName"])
                                    isValid = resourceInfoResult
                                } else if (
                                    activeTab === "core-skills" &&
                                    (value === "technology-skills" || value === "functional-skills" || value === "summary")
                                ) {
                                    const coreSkillsResult = await form.trigger(["coreSkills"])
                                    isValid = coreSkillsResult
                                } else {
                                    // Technology and functional skills don't have required fields
                                    isValid = true
                                }

                                if (isValid) {
                                    setActiveTab(value)
                                } else {
                                    toast({
                                        title: "Validation Error",
                                        description: "Please fill in all required fields before proceeding.",
                                        variant: "destructive",
                                    })
                                }
                            }}
                            className="w-full"
                        >
                            <TabsList className="grid grid-cols-5 w-full">
                                <TabsTrigger value="resource-info" className="relative flex items-center gap-2">
                                    <UserCircle className="h-4 w-4" />
                                    <span>Resource</span>
                                    {form.formState.errors.resourceId || form.formState.errors.resourceName ? (
                                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive transform translate-x-1 -translate-y-1"></span>
                                    ) : null}
                                </TabsTrigger>
                                <TabsTrigger value="core-skills" className="relative flex items-center gap-2">
                                    <Zap className="h-4 w-4" />
                                    <span>Core</span>
                                    {form.formState.errors.coreSkills?.applicationFailover ? (
                                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive transform translate-x-1 -translate-y-1"></span>
                                    ) : null}
                                </TabsTrigger>
                                <TabsTrigger value="technology-skills" className="flex items-center gap-2">
                                    <Code className="h-4 w-4" />
                                    <span>Tech</span>
                                </TabsTrigger>
                                <TabsTrigger value="functional-skills" className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4" />
                                    <span>Function</span>
                                </TabsTrigger>
                                <TabsTrigger value="summary" className="flex items-center gap-2">
                                    <ClipboardList className="h-4 w-4" />
                                    <span>Summary</span>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="resource-info" className="pt-4">
                                <ResourceInfoForm form={form} />
                            </TabsContent>

                            <TabsContent value="core-skills" className="pt-4">
                                <CoreSkillsForm form={form} />
                            </TabsContent>

                            <TabsContent value="technology-skills" className="pt-4">
                                <TechnologySkillsForm form={form} />
                            </TabsContent>

                            <TabsContent value="functional-skills" className="pt-4">
                                <FunctionalSkillsForm form={form} />
                            </TabsContent>

                            <TabsContent value="summary" className="pt-4">
                                <SkillsSummary form={form} />
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-between pt-4">
                            <Button type="button" variant="outline" onClick={prevTab} disabled={activeTab === "resource-info"}>
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Previous
                            </Button>

                            {activeTab !== "summary" ? (
                                <Button type="button" onClick={nextTab}>
                                    Next
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button type="submit">
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Resource Skills
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

