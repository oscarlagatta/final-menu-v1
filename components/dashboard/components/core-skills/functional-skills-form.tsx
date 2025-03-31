"use client"

import { useState, useEffect } from "react"
import { type UseFormReturn, useFieldArray } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


import { Plus, X, Search, AlertCircle } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import {findSimilarSkill} from "@/components/dashboard/lib/utils";
import {SkillRating} from "@/components/dashboard/components/core-skills/skill-rating";
import {ResourceSkillsFormValues} from "@/components/dashboard/types/resource-skills-form-values";


// Organization's functional skills catalog
const organizationFunctionalSkills = [
    {
        id: "incidentManagement",
        name: "Incident Management",
        description: "Skills in managing and resolving incidents",
    },
    {
        id: "applicationKnowledge",
        name: "Application Knowledge",
        description: "Knowledge of application architecture and functionality",
    },
    {
        id: "problemManagement",
        name: "Problem Management",
        description: "Skills in identifying root causes and implementing solutions",
    },
    {
        id: "changeManagement",
        name: "Change Management",
        description: "Skills in planning and implementing changes",
    },
    {
        id: "releaseManagement",
        name: "Release Management",
        description: "Skills in planning and coordinating software releases",
    },
    {
        id: "configurationManagement",
        name: "Configuration Management",
        description: "Skills in managing configuration items and their relationships",
    },
    {
        id: "serviceDesk",
        name: "Service Desk",
        description: "Skills in providing first-line support to users",
    },
    {
        id: "businessAnalysis",
        name: "Business Analysis",
        description: "Skills in analyzing business requirements",
    },
    {
        id: "projectManagement",
        name: "Project Management",
        description: "Skills in planning and executing projects",
    },
    {
        id: "qualityAssurance",
        name: "Quality Assurance",
        description: "Skills in ensuring quality of deliverables",
    },
]

// Add this function to suggest a better name when a similar skill is detected
const getSuggestedSkillName = (skill: string): string | null => {
    // Map of common misspellings or variations to their preferred forms
    const preferredForms: Record<string, string> = {
        "incident mgmt": "Incident Management",
        im: "Incident Management",
        "problem mgmt": "Problem Management",
        pm: "Problem Management",
        "change mgmt": "Change Management",
        cm: "Change Management",
        "release mgmt": "Release Management",
        rm: "Release Management",
        "config mgmt": "Configuration Management",
        "config management": "Configuration Management",
        ba: "Business Analysis",
        "business analyst": "Business Analysis",
        pm: "Project Management",
        "project mgmt": "Project Management",
        qa: "Quality Assurance",
        quality: "Quality Assurance",
        qc: "Quality Control",
        "service desk": "Service Desk",
        helpdesk: "Service Desk",
        "help desk": "Service Desk",
        "app knowledge": "Application Knowledge",
        "application knowledge": "Application Knowledge",
        "app support": "Application Support",
        "application support": "Application Support",
        itil: "ITIL",
        itsm: "ITSM",
        "it service management": "ITSM",
    }

    const normalized = skill.toLowerCase().trim()

    return preferredForms[normalized] || null
}

interface FunctionalSkillsFormProps {
    form: UseFormReturn<ResourceSkillsFormValues>
}

export function FunctionalSkillsForm({ form }: FunctionalSkillsFormProps) {
    const [newSkillName, setNewSkillName] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [showSkillCatalog, setShowSkillCatalog] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [similarSkillWarning, setSimilarSkillWarning] = useState<{
        exists: boolean
        similarTo: string
        similarity: number
    }>({
        exists: false,
        similarTo: "",
        similarity: 0,
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "customFunctionalSkills",
    })

    // Get all existing skills in the form
    const getExistingFormSkills = (): string[] => {
        return fields.map((field) => form.getValues(`customFunctionalSkills.${fields.indexOf(field)}.name`).toLowerCase())
    }

    // Check if a skill name is similar to any existing skill in the form
    const checkForSimilarSkills = (skillName: string): { exists: boolean; similarTo: string; similarity: number } => {
        const existingSkills = getExistingFormSkills()
        return findSimilarSkill(skillName, existingSkills)
    }

    // Filter skills based on search term
    const filteredSkills = searchTerm
        ? organizationFunctionalSkills.filter(
            (skill) =>
                skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (skill.description && skill.description.toLowerCase().includes(searchTerm.toLowerCase())),
        )
        : organizationFunctionalSkills

    // Direct add skill function for the button click
    const handleDirectAddSkill = (skill: (typeof organizationFunctionalSkills)[0]) => {
        // Check if this skill is already in the form or similar to existing skills
        const existingSkills = getExistingFormSkills()
        const similarityCheck = findSimilarSkill(skill.name, existingSkills)

        if (similarityCheck.exists) {
            setShowSkillCatalog(false)
            setSearchTerm("")
            setNewSkillName(skill.name)
            setSimilarSkillWarning({
                exists: true,
                similarTo: similarityCheck.similarTo,
                similarity: similarityCheck.similarity,
            })
            setOpenDialog(true)
            return
        }

        append({
            id: `func-${skill.id}-${Date.now()}`,
            name: skill.name,
            value: 0,
        })

        // Keep the catalog open for adding more skills
        // Just reset the search term
        setSearchTerm("")
    }

    // Handle adding a new skill
    const handleAddNewSkill = () => {
        if (!newSkillName.trim()) return

        // Check for similar skills
        const similarSkillCheck = checkForSimilarSkills(newSkillName)

        if (similarSkillCheck.exists) {
            setSimilarSkillWarning({
                exists: true,
                similarTo: similarSkillCheck.similarTo,
                similarity: similarSkillCheck.similarity,
            })
            return // Don't close dialog, let user decide
        }

        // Add to skills array
        append({
            id: `func-new-${Date.now()}`,
            name: newSkillName.trim(),
            value: 0,
        })

        setNewSkillName("")
        setOpenDialog(false)
        setSimilarSkillWarning({ exists: false, similarTo: "", similarity: 0 })
    }

    // Force add a skill even if it's similar to an existing one
    const handleForceAddSkill = () => {
        append({
            id: `func-new-${Date.now()}`,
            name: newSkillName.trim(),
            value: 0,
        })

        setNewSkillName("")
        setOpenDialog(false)
        setSimilarSkillWarning({ exists: false, similarTo: "", similarity: 0 })
    }

    // Check for similar skills as the user types
    useEffect(() => {
        if (newSkillName.trim().length > 2) {
            const similarSkillCheck = checkForSimilarSkills(newSkillName)
            if (similarSkillCheck.exists && similarSkillCheck.similarity > 0.6) {
                setSimilarSkillWarning({
                    exists: true,
                    similarTo: similarSkillCheck.similarTo,
                    similarity: similarSkillCheck.similarity,
                })
            } else {
                setSimilarSkillWarning({ exists: false, similarTo: "", similarity: 0 })
            }
        } else {
            setSimilarSkillWarning({ exists: false, similarTo: "", similarity: 0 })
        }
    }, [newSkillName])

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Functional Knowledge / BAU Tasks</h2>
            <p className="text-sm text-muted-foreground mb-4">Rate skills from 0 (no skill) to 5 (advanced)</p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => setShowSkillCatalog(!showSkillCatalog)}
                >
                    <Search className="h-4 w-4 mr-2" />
                    {showSkillCatalog ? "Hide Organization Skills" : "Search Organization Skills"}
                </Button>

                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <Button type="button" onClick={() => setOpenDialog(true)} className="w-full sm:w-auto">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Skill
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Functional Skill</DialogTitle>
                            <DialogDescription>Enter the name of a functional skill to add to your profile.</DialogDescription>
                        </DialogHeader>

                        {similarSkillWarning.exists && (
                            <Alert variant="default" className="my-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Similar Skill Detected</AlertTitle>
                                <AlertDescription>
                                    <p className="mb-2">
                                        This skill appears similar to "{similarSkillWarning.similarTo}" which is already in your profile.
                                    </p>
                                    <p className="text-sm">Similarity: {Math.round(similarSkillWarning.similarity * 100)}% match</p>
                                    <p className="mt-2">Are you sure you want to add it as a separate skill?</p>
                                </AlertDescription>
                            </Alert>
                        )}

                        {!similarSkillWarning.exists && newSkillName.trim().length > 2 && (
                            <>
                                {getSuggestedSkillName(newSkillName) && (
                                    <Alert className="my-4 bg-blue-50 text-blue-800 border-blue-200">
                                        <AlertCircle className="h-4 w-4 text-blue-600" />
                                        <AlertTitle>Suggested Format</AlertTitle>
                                        <AlertDescription>
                                            <p>Did you mean "{getSuggestedSkillName(newSkillName)}"?</p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="mt-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                                                onClick={() => {
                                                    if (getSuggestedSkillName(newSkillName)) {
                                                        setNewSkillName(getSuggestedSkillName(newSkillName)!)
                                                    }
                                                }}
                                            >
                                                Use Suggested Format
                                            </Button>
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </>
                        )}

                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="newSkillName">Skill Name</Label>
                                <Input
                                    id="newSkillName"
                                    placeholder="e.g. Business Analysis, Project Management, etc."
                                    value={newSkillName}
                                    onChange={(e) => {
                                        setNewSkillName(e.target.value)
                                    }}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <DialogFooter className="flex flex-col sm:flex-row gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setOpenDialog(false)
                                    setNewSkillName("")
                                    setSimilarSkillWarning({ exists: false, similarTo: "", similarity: 0 })
                                }}
                            >
                                Cancel
                            </Button>

                            {similarSkillWarning.exists ? (
                                <Button type="button" variant="secondary" onClick={handleForceAddSkill}>
                                    Add Anyway
                                </Button>
                            ) : (
                                <Button type="button" onClick={handleAddNewSkill} disabled={!newSkillName.trim()}>
                                    Add Skill
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {showSkillCatalog && (
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="mb-4">
                            <Label htmlFor="searchSkills">Search Skills</Label>
                            <Input
                                id="searchSkills"
                                placeholder="Type to search skills..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="mt-1"
                            />
                        </div>

                        <div className="max-h-[300px] overflow-y-auto border rounded-md">
                            {filteredSkills.length === 0 ? (
                                <div className="p-4 text-center text-sm text-muted-foreground">No skills found.</div>
                            ) : (
                                <div className="divide-y">
                                    {filteredSkills.map((skill) => (
                                        <div
                                            key={skill.id}
                                            className="flex items-center justify-between p-3 hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <div className="flex-1">
                                                <div className="font-medium">{skill.name}</div>
                                                {skill.description && <p className="text-xs text-muted-foreground">{skill.description}</p>}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDirectAddSkill(skill)}
                                                className="ml-2"
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardContent className="pt-6">
                    {fields.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No functional skills added yet. Use the buttons above to add skills to your profile.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {fields.map((field, index) => (
                                <FormField
                                    key={field.id}
                                    control={form.control}
                                    name={`customFunctionalSkills.${index}.value`}
                                    render={({ field: valueField }) => (
                                        <FormItem className="relative">
                                            <FormLabel>{form.getValues(`customFunctionalSkills.${index}.name`)}</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center">
                                                    <SkillRating value={valueField.value} onChange={valueField.onChange} />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="ml-2 h-8 w-8"
                                                        onClick={() => remove(index)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                        <span className="sr-only">Remove skill</span>
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

