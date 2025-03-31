"use client"

import { useMemo } from "react"
import type { UseFormReturn } from "react-hook-form"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {ResourceSkillsFormValues} from "@/components/dashboard/types/resource-skills-form-values";

interface SkillsSummaryProps {
    form: UseFormReturn<ResourceSkillsFormValues>
}

export function SkillsSummary({ form }: SkillsSummaryProps) {
    const formValues = form.getValues()

    const avgScore = useMemo(() => {
        // Include custom skills in calculation
        const techSkills = formValues.customTechnologySkills.map((skill) => skill.value)
        const funcSkills = formValues.customFunctionalSkills.map((skill) => skill.value)

        const allSkills = [...techSkills, ...funcSkills]
        const nonZeroSkills = allSkills.filter((skill) => skill > 0)

        return nonZeroSkills.length
            ? Math.round((nonZeroSkills.reduce((sum, val) => sum + val, 0) / nonZeroSkills.length) * 10) / 10
            : 0
    }, [formValues])

    const competencyLevel = useMemo(() => {
        if (avgScore >= 4) return "Advanced"
        if (avgScore >= 3) return "Intermediate"
        if (avgScore > 0) return "Basic"
        return "None"
    }, [avgScore])

    const getCompetencyColor = (level: string) => {
        switch (level) {
            case "Advanced":
                return "bg-green-100 text-green-800 hover:bg-green-100"
            case "Intermediate":
                return "bg-blue-100 text-blue-800 hover:bg-blue-100"
            case "Basic":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-100"
        }
    }

    const getSkillLabel = (value: number) => {
        if (value === 0) return "No Skill"
        if (value <= 2) return "Basic"
        if (value <= 4) return "Intermediate"
        return "Advanced"
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Skills Summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-medium mb-2">Resource Information</h3>
                    <Card>
                        <CardContent className="pt-6">
                            <dl className="grid grid-cols-1 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Resource ID</dt>
                                    <dd className="mt-1 text-sm">{formValues.resourceId || "Not provided"}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Resource Name</dt>
                                    <dd className="mt-1 text-sm">{formValues.resourceName || "Not provided"}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Application Failover/Recovery</dt>
                                    <dd className="mt-1 text-sm">{formValues.coreSkills.applicationFailover}</dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-2">Competency Overview</h3>
                    <Card>
                        <CardContent className="pt-6">
                            <dl className="grid grid-cols-1 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Average Score</dt>
                                    <dd className="mt-1 text-sm font-bold text-2xl">{avgScore.toFixed(1)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Competency Level</dt>
                                    <dd className="mt-1">
                                        <Badge className={getCompetencyColor(competencyLevel)}>{competencyLevel}</Badge>
                                    </dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div>
                    <h3 className="text-lg font-medium mb-2">Technology Skills</h3>
                    <Card>
                        <CardContent className="pt-6">
                            {formValues.customTechnologySkills.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {formValues.customTechnologySkills.map((skill) => (
                                        <div key={skill.id} className="flex flex-col">
                                            <span className="text-sm font-medium">{skill.name}</span>
                                            <div className="flex items-center mt-1">
                                                <span className="text-2xl font-bold mr-2">{skill.value}</span>
                                                <Badge variant="outline">{getSkillLabel(skill.value)}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted-foreground">No technology skills added yet.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-2">Functional Knowledge</h3>
                    <Card>
                        <CardContent className="pt-6">
                            {formValues.customFunctionalSkills.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {formValues.customFunctionalSkills.map((skill) => (
                                        <div key={skill.id} className="flex flex-col">
                                            <span className="text-sm font-medium">{skill.name}</span>
                                            <div className="flex items-center mt-1">
                                                <span className="text-2xl font-bold mr-2">{skill.value}</span>
                                                <Badge variant="outline">{getSkillLabel(skill.value)}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted-foreground">No functional skills added yet.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

