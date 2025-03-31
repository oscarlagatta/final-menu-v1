"use client"

import { useState } from "react"
import {
    Users,
    Download,
    AlertCircle,
    Check,
    X,
    Save,
    PlusCircle,
    UserPlus,
    ClipboardList,
    Trash2,
    Code,
    Briefcase,
    Search,
    Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { SkillRating } from "@/components/skill-rating"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

// Update the TeamMember interface to separate technology and functional skills
interface TeamMember {
    id: string
    resourceId: string
    resourceName: string
    applicationFailover: string
    technologySkills: {
        name: string
        value: number
    }[]
    functionalSkills: {
        name: string
        value: number
    }[]
}

// Add the organization skill catalogs
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

export function TeamSkillsSheet() {
    const [open, setOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("manual-entry")
    const [validationErrors, setValidationErrors] = useState<string[]>([])
    // Update the state for manual entry with separate technology and functional skills
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
        {
            id: "member-1",
            resourceId: "",
            resourceName: "",
            applicationFailover: "No",
            technologySkills: [],
            functionalSkills: [],
        },
    ])
    const [currentMemberIndex, setCurrentMemberIndex] = useState(0)
    const [manualEntryStep, setManualEntryStep] = useState<"entry" | "review" | "complete">("entry")
    const [activeSkillsTab, setActiveSkillsTab] = useState<"technology" | "functional">("technology")
    const [showTechSkillCatalog, setShowTechSkillCatalog] = useState(false)
    const [showFuncSkillCatalog, setShowFuncSkillCatalog] = useState(false)
    const [techSearchTerm, setTechSearchTerm] = useState("")
    const [funcSearchTerm, setFuncSearchTerm] = useState("")
    const [newTechSkillName, setNewTechSkillName] = useState("")
    const [newFuncSkillName, setNewFuncSkillName] = useState("")
    const [openTechDialog, setOpenTechDialog] = useState(false)
    const [openFuncDialog, setOpenFuncDialog] = useState(false)
    // Add these state variables near the other state declarations
    const [skillToRemove, setSkillToRemove] = useState<{ type: "tech" | "func"; index: number } | null>(null)
    const [showRemoveDialog, setShowRemoveDialog] = useState(false)
    // Add this state variable near the other state declarations
    const [showRemoveMemberDialog, setShowRemoveMemberDialog] = useState(false)
    const [memberToRemove, setMemberToRemove] = useState<number | null>(null)

    const handleOpenChange = (newOpen: boolean) => {
        if (newOpen === false) {
            setOpen(false)
        } else {
            setOpen(true)
        }
    }

    // Manual entry functions
    const addTeamMember = () => {
        const newMember: TeamMember = {
            id: `member-${teamMembers.length + 1}`,
            resourceId: "",
            resourceName: "",
            applicationFailover: "No",
            technologySkills: [],
            functionalSkills: [],
        }

        setTeamMembers([...teamMembers, newMember])
        setCurrentMemberIndex(teamMembers.length)
    }

    // Replace the removeTeamMember function with this version that shows a confirmation dialog
    const promptRemoveTeamMember = (index: number) => {
        setMemberToRemove(index)
        setShowRemoveMemberDialog(true)
    }

    // Add this function to handle the actual removal after confirmation
    const confirmRemoveTeamMember = () => {
        if (memberToRemove === null) return

        if (teamMembers.length <= 1) {
            toast({
                title: "Cannot remove",
                description: "You must have at least one team member.",
                variant: "destructive",
            })
            setShowRemoveMemberDialog(false)
            setMemberToRemove(null)
            return
        }

        const newTeamMembers = [...teamMembers]
        newTeamMembers.splice(memberToRemove, 1)
        setTeamMembers(newTeamMembers)

        if (currentMemberIndex >= newTeamMembers.length) {
            setCurrentMemberIndex(newTeamMembers.length - 1)
        }

        setShowRemoveMemberDialog(false)
        setMemberToRemove(null)
    }

    const updateTeamMember = (index: number, field: string, value: any) => {
        const newTeamMembers = [...teamMembers]

        if (field.startsWith("skill-")) {
            const skillIndex = Number.parseInt(field.split("-")[1])
            //newTeamMembers[index].skills[skillIndex].value = value
        } else {
            ;(newTeamMembers[index] as any)[field] = value
        }

        setTeamMembers(newTeamMembers)
    }

    const validateTeamMembers = () => {
        const errors: string[] = []

        teamMembers.forEach((member, index) => {
            if (!member.resourceId) {
                errors.push(`Team member ${index + 1}: Resource ID is required`)
            }
            if (!member.resourceName) {
                errors.push(`Team member ${index + 1}: Resource Name is required`)
            }
        })

        if (errors.length > 0) {
            setValidationErrors(errors)
            return false
        }

        setValidationErrors([])
        return true
    }

    const reviewTeamMembers = () => {
        if (validateTeamMembers()) {
            setManualEntryStep("review")
        } else {
            toast({
                title: "Validation Error",
                description: "Please fix the errors before proceeding.",
                variant: "destructive",
            })
        }
    }

    const saveTeamMembers = () => {
        // In a real application, this would send the data to your backend
        // For now, we'll just simulate success
        setManualEntryStep("complete")
        toast({
            title: "Team skills saved",
            description: `Successfully saved skills for ${teamMembers.length} team members.`,
        })
    }

    // Add these functions for handling skills
    const addTechSkill = (skillName: string) => {
        const newTeamMembers = [...teamMembers]
        // Check if skill already exists
        if (!newTeamMembers[currentMemberIndex].technologySkills.some((s) => s.name === skillName)) {
            newTeamMembers[currentMemberIndex].technologySkills.push({
                name: skillName,
                value: 0,
            })
            setTeamMembers(newTeamMembers)
        } else {
            toast({
                title: "Skill already exists",
                description: `${skillName} is already in the list.`,
                variant: "destructive",
            })
        }
    }

    const addFuncSkill = (skillName: string) => {
        const newTeamMembers = [...teamMembers]
        // Check if skill already exists
        if (!newTeamMembers[currentMemberIndex].functionalSkills.some((s) => s.name === skillName)) {
            newTeamMembers[currentMemberIndex].functionalSkills.push({
                name: skillName,
                value: 0,
            })
            setTeamMembers(newTeamMembers)
        } else {
            toast({
                title: "Skill already exists",
                description: `${skillName} is already in the list.`,
                variant: "destructive",
            })
        }
    }

    // Replace the removeTechSkill and removeFuncSkill functions with these versions
    const removeTechSkill = (index: number) => {
        setSkillToRemove({ type: "tech", index })
        setShowRemoveDialog(true)
    }

    const removeFuncSkill = (index: number) => {
        setSkillToRemove({ type: "func", index })
        setShowRemoveDialog(true)
    }

    // Add this function to handle the actual removal after confirmation
    const confirmRemoveSkill = () => {
        if (!skillToRemove) return

        const newTeamMembers = [...teamMembers]

        if (skillToRemove.type === "tech") {
            newTeamMembers[currentMemberIndex].technologySkills.splice(skillToRemove.index, 1)
        } else {
            newTeamMembers[currentMemberIndex].functionalSkills.splice(skillToRemove.index, 1)
        }

        setTeamMembers(newTeamMembers)
        setShowRemoveDialog(false)
        setSkillToRemove(null)
    }

    const updateTechSkillValue = (index: number, value: number) => {
        const newTeamMembers = [...teamMembers]
        newTeamMembers[currentMemberIndex].technologySkills[index].value = value
        setTeamMembers(newTeamMembers)
    }

    const updateFuncSkillValue = (index: number, value: number) => {
        const newTeamMembers = [...teamMembers]
        newTeamMembers[currentMemberIndex].functionalSkills[index].value = value
        setTeamMembers(newTeamMembers)
    }

    // Filter skills based on search term
    const filteredTechSkills = techSearchTerm
        ? organizationTechSkills.filter(
            (skill) =>
                skill.name.toLowerCase().includes(techSearchTerm.toLowerCase()) ||
                (skill.description && skill.description.toLowerCase().includes(techSearchTerm.toLowerCase())),
        )
        : organizationTechSkills

    const filteredFuncSkills = funcSearchTerm
        ? organizationFunctionalSkills.filter(
            (skill) =>
                skill.name.toLowerCase().includes(funcSearchTerm.toLowerCase()) ||
                (skill.description && skill.description.toLowerCase().includes(funcSearchTerm.toLowerCase())),
        )
        : organizationFunctionalSkills

    // Update the resetManualEntry function
    const resetManualEntry = () => {
        setTeamMembers([
            {
                id: "member-1",
                resourceId: "",
                resourceName: "",
                applicationFailover: "No",
                technologySkills: [],
                functionalSkills: [],
            },
        ])
        setCurrentMemberIndex(0)
        setManualEntryStep("entry")
        setActiveSkillsTab("technology")
        setShowTechSkillCatalog(false)
        setShowFuncSkillCatalog(false)
        setTechSearchTerm("")
        setFuncSearchTerm("")
        setNewTechSkillName("")
        setNewFuncSkillName("")
    }

    const getSkillLevelLabel = (value: number) => {
        if (value === 0) return "No Skill"
        if (value <= 2) return "Basic"
        if (value <= 4) return "Intermediate"
        return "Advanced"
    }

    const getSkillLevelColor = (value: number) => {
        if (value === 0) return "bg-gray-100 text-gray-800"
        if (value <= 2) return "bg-yellow-100 text-yellow-800"
        if (value <= 4) return "bg-blue-100 text-blue-800"
        return "bg-green-100 text-green-800"
    }

    return (
        <>
            <Button className="gap-2" onClick={() => setOpen(true)} variant="outline">
                <Users className="h-4 w-4" />
                Add Team Skills
            </Button>

            <Sheet open={open} onOpenChange={handleOpenChange}>
                <SheetContent
                    side="right"
                    className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <SheetHeader className="mb-6">
                        <SheetTitle>Team Skills Management</SheetTitle>
                        <SheetDescription>Add or update skills for multiple team members at once.</SheetDescription>
                    </SheetHeader>

                    <div className="h-[calc(100vh-10rem)] overflow-y-auto pr-4">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid grid-cols-2 w-full mb-6">
                                <TabsTrigger value="manual-entry" className="flex items-center gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    <span>Manual Entry</span>
                                </TabsTrigger>
                                <TabsTrigger value="spreadsheet-view" className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span>Team Grid</span>
                                </TabsTrigger>
                            </TabsList>

                            {/* Manual Entry Tab */}
                            <TabsContent value="manual-entry" className="space-y-6">
                                {manualEntryStep === "entry" && (
                                    <Card>
                                        <CardHeader>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <CardTitle>Add Team Members</CardTitle>
                                                    <CardDescription>Enter information for each team member one by one.</CardDescription>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-sm">
                                                        {currentMemberIndex + 1} of {teamMembers.length}
                                                    </Badge>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={addTeamMember}
                                                        className="flex items-center gap-1"
                                                    >
                                                        <PlusCircle className="h-3.5 w-3.5" />
                                                        Add Member
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {validationErrors.length > 0 && (
                                                <Alert variant="destructive">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertTitle>Validation Errors</AlertTitle>
                                                    <AlertDescription>
                                                        <ul className="list-disc pl-5 space-y-1 mt-2">
                                                            {validationErrors.map((error, index) => (
                                                                <li key={index}>{error}</li>
                                                            ))}
                                                        </ul>
                                                    </AlertDescription>
                                                </Alert>
                                            )}

                                            <div className="flex justify-between items-center">
                                                <h3 className="text-lg font-medium">Team Member Information</h3>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => promptRemoveTeamMember(currentMemberIndex)}
                                                    className="flex items-center gap-1 text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Remove
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="resourceId">
                                                        Resource ID <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id="resourceId"
                                                        placeholder="e.g. NB12345"
                                                        value={teamMembers[currentMemberIndex].resourceId}
                                                        onChange={(e) => updateTeamMember(currentMemberIndex, "resourceId", e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="resourceName">
                                                        Resource Name <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id="resourceName"
                                                        placeholder="e.g. John Smith"
                                                        value={teamMembers[currentMemberIndex].resourceName}
                                                        onChange={(e) => updateTeamMember(currentMemberIndex, "resourceName", e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Application Failover/Recovery</Label>
                                                <RadioGroup
                                                    value={teamMembers[currentMemberIndex].applicationFailover}
                                                    onValueChange={(value) => updateTeamMember(currentMemberIndex, "applicationFailover", value)}
                                                    className="flex space-x-4"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="Yes" id="failover-yes" />
                                                        <Label htmlFor="failover-yes">Yes</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="No" id="failover-no" />
                                                        <Label htmlFor="failover-no">No</Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>

                                            <div className="space-y-4">
                                                <Tabs
                                                    value={activeSkillsTab}
                                                    onValueChange={(value) => setActiveSkillsTab(value as "technology" | "functional")}
                                                >
                                                    <TabsList className="grid w-full grid-cols-2">
                                                        <TabsTrigger value="technology" className="flex items-center gap-2">
                                                            <Code className="h-4 w-4" />
                                                            Technology Skills
                                                        </TabsTrigger>
                                                        <TabsTrigger value="functional" className="flex items-center gap-2">
                                                            <Briefcase className="h-4 w-4" />
                                                            Functional Skills
                                                        </TabsTrigger>
                                                    </TabsList>

                                                    {/* Technology Skills Tab */}
                                                    <TabsContent value="technology" className="space-y-4 pt-4">
                                                        <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                className="w-full sm:w-auto"
                                                                onClick={() => setShowTechSkillCatalog(!showTechSkillCatalog)}
                                                            >
                                                                <Search className="h-4 w-4 mr-2" />
                                                                {showTechSkillCatalog ? "Hide Organization Skills" : "Search Organization Skills"}
                                                            </Button>

                                                            <Dialog open={openTechDialog} onOpenChange={setOpenTechDialog}>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        type="button"
                                                                        onClick={() => setOpenTechDialog(true)}
                                                                        className="w-full sm:w-auto"
                                                                    >
                                                                        <Plus className="h-4 w-4 mr-2" />
                                                                        Add New Skill
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Add New Technology Skill</DialogTitle>
                                                                        <DialogDescription>Enter the name of a technology skill to add.</DialogDescription>
                                                                    </DialogHeader>

                                                                    <div className="grid gap-4 py-4">
                                                                        <div className="grid gap-2">
                                                                            <Label htmlFor="newTechSkillName">Skill Name</Label>
                                                                            <Input
                                                                                id="newTechSkillName"
                                                                                placeholder="e.g. TypeScript, AWS Lambda, etc."
                                                                                value={newTechSkillName}
                                                                                onChange={(e) => setNewTechSkillName(e.target.value)}
                                                                                className="w-full"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                                                                        <Button
                                                                            type="button"
                                                                            variant="outline"
                                                                            onClick={() => {
                                                                                setOpenTechDialog(false)
                                                                                setNewTechSkillName("")
                                                                            }}
                                                                        >
                                                                            Cancel
                                                                        </Button>
                                                                        <Button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                if (newTechSkillName.trim()) {
                                                                                    addTechSkill(newTechSkillName.trim())
                                                                                    setNewTechSkillName("")
                                                                                    setOpenTechDialog(false)
                                                                                }
                                                                            }}
                                                                            disabled={!newTechSkillName.trim()}
                                                                        >
                                                                            Add Skill
                                                                        </Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </div>

                                                        {showTechSkillCatalog && (
                                                            <Card className="mb-4">
                                                                <CardContent className="pt-6">
                                                                    <div className="mb-4">
                                                                        <Label htmlFor="techSearchSkills">Search Skills</Label>
                                                                        <Input
                                                                            id="techSearchSkills"
                                                                            placeholder="Type to search skills..."
                                                                            value={techSearchTerm}
                                                                            onChange={(e) => setTechSearchTerm(e.target.value)}
                                                                            className="mt-1"
                                                                        />
                                                                    </div>

                                                                    <div className="max-h-[300px] overflow-y-auto border rounded-md">
                                                                        {filteredTechSkills.length === 0 ? (
                                                                            <div className="p-4 text-center text-sm text-muted-foreground">
                                                                                No skills found.
                                                                            </div>
                                                                        ) : (
                                                                            <div className="divide-y">
                                                                                {filteredTechSkills.map((skill) => (
                                                                                    <div
                                                                                        key={skill.id}
                                                                                        className="flex items-center justify-between p-3 hover:bg-accent hover:text-accent-foreground"
                                                                                    >
                                                                                        <div className="flex-1">
                                                                                            <div className="font-medium">{skill.name}</div>
                                                                                            {skill.description && (
                                                                                                <p className="text-xs text-muted-foreground">{skill.description}</p>
                                                                                            )}
                                                                                        </div>
                                                                                        <Button
                                                                                            type="button"
                                                                                            variant="outline"
                                                                                            size="sm"
                                                                                            onClick={() => addTechSkill(skill.name)}
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

                                                        <div className="space-y-4">
                                                            {teamMembers[currentMemberIndex].technologySkills.length === 0 ? (
                                                                <div className="text-center py-8 text-muted-foreground border rounded-md">
                                                                    No technology skills added yet. Use the buttons above to add skills.
                                                                </div>
                                                            ) : (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                    {teamMembers[currentMemberIndex].technologySkills.map((skill, index) => (
                                                                        <div key={index} className="space-y-2">
                                                                            <div className="flex items-center justify-between">
                                                                                <Label>{skill.name}</Label>
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-8 w-8"
                                                                                    onClick={() => removeTechSkill(index)}
                                                                                >
                                                                                    <X className="h-4 w-4" />
                                                                                    <span className="sr-only">Remove skill</span>
                                                                                </Button>
                                                                            </div>
                                                                            <SkillRating
                                                                                value={skill.value}
                                                                                onChange={(value) => updateTechSkillValue(index, value)}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TabsContent>

                                                    {/* Functional Skills Tab */}
                                                    <TabsContent value="functional" className="space-y-4 pt-4">
                                                        <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                className="w-full sm:w-auto"
                                                                onClick={() => setShowFuncSkillCatalog(!showFuncSkillCatalog)}
                                                            >
                                                                <Search className="h-4 w-4 mr-2" />
                                                                {showFuncSkillCatalog ? "Hide Organization Skills" : "Search Organization Skills"}
                                                            </Button>

                                                            <Dialog open={openFuncDialog} onOpenChange={setOpenFuncDialog}>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        type="button"
                                                                        onClick={() => setOpenFuncDialog(true)}
                                                                        className="w-full sm:w-auto"
                                                                    >
                                                                        <Plus className="h-4 w-4 mr-2" />
                                                                        Add New Skill
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Add New Functional Skill</DialogTitle>
                                                                        <DialogDescription>Enter the name of a functional skill to add.</DialogDescription>
                                                                    </DialogHeader>

                                                                    <div className="grid gap-4 py-4">
                                                                        <div className="grid gap-2">
                                                                            <Label htmlFor="newFuncSkillName">Skill Name</Label>
                                                                            <Input
                                                                                id="newFuncSkillName"
                                                                                placeholder="e.g. Business Analysis, Project Management, etc."
                                                                                value={newFuncSkillName}
                                                                                onChange={(e) => setNewFuncSkillName(e.target.value)}
                                                                                className="w-full"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                                                                        <Button
                                                                            type="button"
                                                                            variant="outline"
                                                                            onClick={() => {
                                                                                setOpenFuncDialog(false)
                                                                                setNewFuncSkillName("")
                                                                            }}
                                                                        >
                                                                            Cancel
                                                                        </Button>
                                                                        <Button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                if (newFuncSkillName.trim()) {
                                                                                    addFuncSkill(newFuncSkillName.trim())
                                                                                    setNewFuncSkillName("")
                                                                                    setOpenFuncDialog(false)
                                                                                }
                                                                            }}
                                                                            disabled={!newFuncSkillName.trim()}
                                                                        >
                                                                            Add Skill
                                                                        </Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </div>

                                                        {showFuncSkillCatalog && (
                                                            <Card className="mb-4">
                                                                <CardContent className="pt-6">
                                                                    <div className="mb-4">
                                                                        <Label htmlFor="funcSearchSkills">Search Skills</Label>
                                                                        <Input
                                                                            id="funcSearchSkills"
                                                                            placeholder="Type to search skills..."
                                                                            value={funcSearchTerm}
                                                                            onChange={(e) => setFuncSearchTerm(e.target.value)}
                                                                            className="mt-1"
                                                                        />
                                                                    </div>

                                                                    <div className="max-h-[300px] overflow-y-auto border rounded-md">
                                                                        {filteredFuncSkills.length === 0 ? (
                                                                            <div className="p-4 text-center text-sm text-muted-foreground">
                                                                                No skills found.
                                                                            </div>
                                                                        ) : (
                                                                            <div className="divide-y">
                                                                                {filteredFuncSkills.map((skill) => (
                                                                                    <div
                                                                                        key={skill.id}
                                                                                        className="flex items-center justify-between p-3 hover:bg-accent hover:text-accent-foreground"
                                                                                    >
                                                                                        <div className="flex-1">
                                                                                            <div className="font-medium">{skill.name}</div>
                                                                                            {skill.description && (
                                                                                                <p className="text-xs text-muted-foreground">{skill.description}</p>
                                                                                            )}
                                                                                        </div>
                                                                                        <Button
                                                                                            type="button"
                                                                                            variant="outline"
                                                                                            size="sm"
                                                                                            onClick={() => addFuncSkill(skill.name)}
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

                                                        <div className="space-y-4">
                                                            {teamMembers[currentMemberIndex].functionalSkills.length === 0 ? (
                                                                <div className="text-center py-8 text-muted-foreground border rounded-md">
                                                                    No functional skills added yet. Use the buttons above to add skills.
                                                                </div>
                                                            ) : (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                    {teamMembers[currentMemberIndex].functionalSkills.map((skill, index) => (
                                                                        <div key={index} className="space-y-2">
                                                                            <div className="flex items-center justify-between">
                                                                                <Label>{skill.name}</Label>
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-8 w-8"
                                                                                    onClick={() => removeFuncSkill(index)}
                                                                                >
                                                                                    <X className="h-4 w-4" />
                                                                                    <span className="sr-only">Remove skill</span>
                                                                                </Button>
                                                                            </div>
                                                                            <SkillRating
                                                                                value={skill.value}
                                                                                onChange={(value) => updateFuncSkillValue(index, value)}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TabsContent>
                                                </Tabs>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-between border-t pt-6">
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setCurrentMemberIndex(Math.max(0, currentMemberIndex - 1))}
                                                    disabled={currentMemberIndex === 0}
                                                >
                                                    Previous Member
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        setCurrentMemberIndex(Math.min(teamMembers.length - 1, currentMemberIndex + 1))
                                                    }
                                                    disabled={currentMemberIndex === teamMembers.length - 1}
                                                >
                                                    Next Member
                                                </Button>
                                            </div>
                                            <Button onClick={reviewTeamMembers}>
                                                <ClipboardList className="mr-2 h-4 w-4" />
                                                Review All
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                )}

                                {manualEntryStep === "review" && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Review Team Skills</CardTitle>
                                            <CardDescription>Review the information for all team members before saving.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <ScrollArea className="h-[400px] rounded-md border p-4">
                                                {teamMembers.map((member, index) => (
                                                    <div key={member.id} className="mb-8 last:mb-0">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h3 className="text-lg font-medium">Team Member {index + 1}</h3>
                                                            <Badge variant="outline">
                                                                {member.applicationFailover === "Yes" ? "Failover: Yes" : "Failover: No"}
                                                            </Badge>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                            <div>
                                                                <p className="text-sm font-medium text-muted-foreground">Resource ID</p>
                                                                <p className="text-sm">{member.resourceId}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-muted-foreground">Resource Name</p>
                                                                <p className="text-sm">{member.resourceName}</p>
                                                            </div>
                                                        </div>

                                                        {/* Technology Skills */}
                                                        <div className="mb-4">
                                                            <p className="text-sm font-medium text-muted-foreground mb-2">Technology Skills</p>
                                                            {member.technologySkills.length > 0 ? (
                                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                                    {member.technologySkills.map((skill, skillIndex) => (
                                                                        <div
                                                                            key={skillIndex}
                                                                            className="flex items-center justify-between bg-muted/40 p-2 rounded-md"
                                                                        >
                                                                            <span className="text-sm">{skill.name}</span>
                                                                            <Badge className={getSkillLevelColor(skill.value)}>
                                                                                {skill.value} - {getSkillLevelLabel(skill.value)}
                                                                            </Badge>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-muted-foreground">No technology skills added.</p>
                                                            )}
                                                        </div>

                                                        {/* Functional Skills */}
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground mb-2">Functional Skills</p>
                                                            {member.functionalSkills.length > 0 ? (
                                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                                    {member.functionalSkills.map((skill, skillIndex) => (
                                                                        <div
                                                                            key={skillIndex}
                                                                            className="flex items-center justify-between bg-muted/40 p-2 rounded-md"
                                                                        >
                                                                            <span className="text-sm">{skill.name}</span>
                                                                            <Badge className={getSkillLevelColor(skill.value)}>
                                                                                {skill.value} - {getSkillLevelLabel(skill.value)}
                                                                            </Badge>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-muted-foreground">No functional skills added.</p>
                                                            )}
                                                        </div>

                                                        {index < teamMembers.length - 1 && <div className="border-t my-6"></div>}
                                                    </div>
                                                ))}
                                            </ScrollArea>
                                        </CardContent>
                                        <CardFooter className="flex justify-between border-t pt-6">
                                            <Button variant="outline" onClick={() => setManualEntryStep("entry")}>
                                                Back to Edit
                                            </Button>
                                            <Button onClick={saveTeamMembers}>
                                                <Save className="mr-2 h-4 w-4" />
                                                Save Team Skills
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                )}

                                {manualEntryStep === "complete" && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Team Skills Saved</CardTitle>
                                            <CardDescription>Team skills have been successfully saved.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <Alert className="bg-green-50 border-green-200 text-green-800">
                                                <Check className="h-4 w-4 text-green-600" />
                                                <AlertTitle>Success</AlertTitle>
                                                <AlertDescription>
                                                    Successfully saved skills for {teamMembers.length} team members.
                                                </AlertDescription>
                                            </Alert>

                                            <div className="flex justify-end">
                                                <Button onClick={resetManualEntry} className="flex items-center gap-2">
                                                    <UserPlus className="h-4 w-4" />
                                                    Add More Team Members
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            {/* Spreadsheet View Tab */}
                            <TabsContent value="spreadsheet-view" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Team Skills Grid</CardTitle>
                                        <CardDescription>View team members' skills in a spreadsheet-like interface.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="border rounded-md overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-[180px] min-w-[180px]">Resource ID</TableHead>
                                                        <TableHead className="w-[200px] min-w-[200px]">Resource Name</TableHead>
                                                        <TableHead className="w-[150px] min-w-[150px]">App Failover</TableHead>
                                                        <TableHead className="w-[120px] min-w-[120px]">JavaScript</TableHead>
                                                        <TableHead className="w-[120px] min-w-[120px]">React</TableHead>
                                                        <TableHead className="w-[120px] min-w-[120px]">Node.js</TableHead>
                                                        <TableHead className="w-[120px] min-w-[120px]">AWS</TableHead>
                                                        <TableHead className="w-[150px] min-w-[150px]">Incident Mgmt</TableHead>
                                                        <TableHead className="w-[150px] min-w-[150px]">Project Mgmt</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {[
                                                        {
                                                            id: "NB12345",
                                                            name: "John Smith",
                                                            failover: "Yes",
                                                            js: 4,
                                                            react: 3,
                                                            node: 2,
                                                            aws: 1,
                                                            incident: 5,
                                                            project: 4,
                                                        },
                                                        {
                                                            id: "NB67890",
                                                            name: "Jane Doe",
                                                            failover: "No",
                                                            js: 5,
                                                            react: 5,
                                                            node: 4,
                                                            aws: 3,
                                                            incident: 2,
                                                            project: 1,
                                                        },
                                                        {
                                                            id: "NB54321",
                                                            name: "Alex Johnson",
                                                            failover: "Yes",
                                                            js: 2,
                                                            react: 3,
                                                            node: 4,
                                                            aws: 5,
                                                            incident: 1,
                                                            project: 2,
                                                        },
                                                        {
                                                            id: "NB98765",
                                                            name: "Sarah Williams",
                                                            failover: "No",
                                                            js: 3,
                                                            react: 4,
                                                            node: 3,
                                                            aws: 2,
                                                            incident: 4,
                                                            project: 5,
                                                        },
                                                        {
                                                            id: "NB24680",
                                                            name: "Michael Brown",
                                                            failover: "Yes",
                                                            js: 1,
                                                            react: 2,
                                                            node: 5,
                                                            aws: 4,
                                                            incident: 3,
                                                            project: 3,
                                                        },
                                                    ].map((member, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{member.id}</TableCell>
                                                            <TableCell>{member.name}</TableCell>
                                                            <TableCell>{member.failover}</TableCell>
                                                            <TableCell>
                                                                <div className="flex justify-center">
                                                                    <SkillRating value={member.js} onChange={() => {}} />
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex justify-center">
                                                                    <SkillRating value={member.react} onChange={() => {}} />
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex justify-center">
                                                                    <SkillRating value={member.node} onChange={() => {}} />
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex justify-center">
                                                                    <SkillRating value={member.aws} onChange={() => {}} />
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex justify-center">
                                                                    <SkillRating value={member.incident} onChange={() => {}} />
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex justify-center">
                                                                    <SkillRating value={member.project} onChange={() => {}} />
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        <div className="flex justify-end mt-6">
                                            <Button variant="outline" className="flex items-center gap-2">
                                                <Download className="h-4 w-4" />
                                                Export to CSV
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Add the confirmation dialog here */}
            <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Removal</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove this skill? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setShowRemoveDialog(false)
                                setSkillToRemove(null)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="button" variant="destructive" onClick={confirmRemoveSkill}>
                            Remove Skill
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* Add the member removal confirmation dialog at the end of the component, right after the skill removal dialog */}
            <Dialog open={showRemoveMemberDialog} onOpenChange={setShowRemoveMemberDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Member Removal</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove this team member and all their skills? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setShowRemoveMemberDialog(false)
                                setMemberToRemove(null)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="button" variant="destructive" onClick={confirmRemoveTeamMember}>
                            Remove Member
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

