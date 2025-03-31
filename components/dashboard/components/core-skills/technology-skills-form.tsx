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
import {ResourceSkillsFormValues} from "@/components/dashboard/types/resource-skills-form-values";
import {findSimilarSkill} from "@/components/dashboard/lib/utils";


// Organization's technology skills catalog
const organizationTechSkills = [
    { id: "cobol", name: "COBOL", description: "COBOL programming language skills" },
    { id: "jcl", name: "JCL", description: "Job Control Language skills" },
    { id: "vsam", name: "VSAM", description: "Virtual Storage Access Method skills" },
    { id: "ca7", name: "CA7", description: "CA7 workload automation skills" },
    { id: "db2", name: "DB2", description: "DB2 database skills" },
    { id: "healthChecks", name: "Health Checks", description: "System health check skills" },
    { id: "java", name: "Java", description: "Java programming language skills" },
    { id: "javascript", name: "JavaScript", description: "JavaScript programming language skills" },
    { id: "python", name: "Python", description: "Python programming language skills" },
    { id: "cSharp", name: "C#", description: "C# programming language skills" },
    { id: "react", name: "React", description: "React.js framework skills" },
    { id: "angular", name: "Angular", description: "Angular framework skills" },
    { id: "vue", name: "Vue.js", description: "Vue.js framework skills" },
    { id: "node", name: "Node.js", description: "Node.js runtime skills" },
    { id: "sql", name: "SQL", description: "SQL database query language skills" },
    { id: "aws", name: "AWS", description: "Amazon Web Services skills" },
    { id: "azure", name: "Azure", description: "Microsoft Azure cloud skills" },
    { id: "docker", name: "Docker", description: "Docker containerization skills" },
    { id: "kubernetes", name: "Kubernetes", description: "Kubernetes orchestration skills" },
    { id: "git", name: "Git", description: "Git version control skills" },
]

// Add this function to suggest a better name when a similar skill is detected
const getSuggestedSkillName = (skill: string): string | null => {
    // Map of common misspellings or variations to their preferred forms
    const preferredForms: Record<string, string> = {
        "c sharp": "C#",
        "c-sharp": "C#",
        csharp: "C#",
        javascript: "JavaScript",
        js: "JavaScript",
        typescript: "TypeScript",
        ts: "TypeScript",
        "react js": "React",
        reactjs: "React",
        "react.js": "React",
        "node js": "Node.js",
        nodejs: "Node.js",
        "vue js": "Vue.js",
        vuejs: "Vue.js",
        "angular js": "Angular",
        angularjs: "Angular",
        python: "Python",
        py: "Python",
        aws: "AWS",
        "amazon web services": "AWS",
        azure: "Microsoft Azure",
        "ms azure": "Microsoft Azure",
        docker: "Docker",
        kubernetes: "Kubernetes",
        k8s: "Kubernetes",
        git: "Git",
        github: "GitHub",
        "c plus plus": "C++",
        cplusplus: "C++",
        cpp: "C++",
        "objective c": "Objective-C",
        objectivec: "Objective-C",
        "ruby on rails": "Ruby on Rails",
        ror: "Ruby on Rails",
        postgres: "PostgreSQL",
        mongo: "MongoDB",
        mysql: "MySQL",
        "sql server": "SQL Server",
        mssql: "SQL Server",
    }

    const normalized = skill.toLowerCase().trim()

    return preferredForms[normalized] || null
}

interface TechnologySkillsFormProps {
    form: UseFormReturn<ResourceSkillsFormValues>
}

export function TechnologySkillsForm({ form }: TechnologySkillsFormProps) {
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
        name: "customTechnologySkills",
    })

    // Get all existing skills in the form
    const getExistingFormSkills = (): string[] => {
        return fields.map((field) => form.getValues(`customTechnologySkills.${fields.indexOf(field)}.name`).toLowerCase())
    }

    // Check if a skill name is similar to any existing skill in the form
    const checkForSimilarSkills = (skillName: string): { exists: boolean; similarTo: string; similarity: number } => {
        const existingSkills = getExistingFormSkills()
        return findSimilarSkill(skillName, existingSkills)
    }

    // Filter skills based on search term
    const filteredSkills = searchTerm
        ? organizationTechSkills.filter(
            (skill) =>
                skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (skill.description && skill.description.toLowerCase().includes(searchTerm.toLowerCase())),
        )
        : organizationTechSkills

    // Direct add skill function for the button click
    const handleDirectAddSkill = (skill: (typeof organizationTechSkills)[0]) => {
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
            id: `tech-${skill.id}-${Date.now()}`,
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
            id: `tech-new-${Date.now()}`,
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
            id: `tech-new-${Date.now()}`,
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
            <h2 className="text-xl font-semibold">Technology Skills</h2>
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
                            <DialogTitle>Add New Technology Skill</DialogTitle>
                            <DialogDescription>Enter the name of a technology skill to add to your profile.</DialogDescription>
                        </DialogHeader>

                        {similarSkillWarning.exists && (
                            <Alert variant="warning" className="my-4">
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
                                    placeholder="e.g. TypeScript, AWS Lambda, etc."
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
                            No technology skills added yet. Use the buttons above to add skills to your profile.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {fields.map((field, index) => (
                                <FormField
                                    key={field.id}
                                    control={form.control}
                                    name={`customTechnologySkills.${index}.value`}
                                    render={({ field: valueField }) => (
                                        <FormItem className="relative">
                                            <FormLabel>{form.getValues(`customTechnologySkills.${index}.name`)}</FormLabel>
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

