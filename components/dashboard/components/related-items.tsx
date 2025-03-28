"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export interface Relationship {
    id: string
    recordId: string
    title: string
    type: string
    initiatedRgi: boolean
}

interface RelatedItemsProps {
    relationships: Relationship[]
    onAddRelationship: (relationship: Relationship) => void
    existingRecords: Array<{ recordId: string; title: string }>
}

export function RelatedItems({ relationships, onAddRelationship, existingRecords }: RelatedItemsProps) {
    const [isRelationshipDialogOpen, setIsRelationshipDialogOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [relationshipForm, setRelationshipForm] = useState({
        recordId: "",
        title: "",
        type: "Incident",
        initiatedRgi: false,
    })

    // Filter records based on search input
    const filteredRecords = existingRecords.filter((record) =>
        record.recordId.toLowerCase().includes(relationshipForm.recordId.toLowerCase()),
    )

    // Handle record selection from search
    const handleRecordSelect = (record: { recordId: string; title: string }) => {
        setRelationshipForm({
            ...relationshipForm,
            recordId: record.recordId,
            title: record.title,
        })
        setIsSearchOpen(false)
    }

    // Handle adding a new relationship
    const handleAddRelationship = () => {
        if (!relationshipForm.recordId.trim()) {
            toast({
                title: "Error",
                description: "Record ID is required.",
                variant: "destructive",
            })
            return
        }

        if (!relationshipForm.title.trim()) {
            toast({
                title: "Error",
                description: "Title is required.",
                variant: "destructive",
            })
            return
        }

        const newRelationship = {
            id: Date.now().toString(),
            recordId: relationshipForm.recordId,
            title: relationshipForm.title,
            type: relationshipForm.type,
            initiatedRgi: relationshipForm.initiatedRgi,
        }

        onAddRelationship(newRelationship)
        setIsRelationshipDialogOpen(false)

        // Reset form
        setRelationshipForm({
            recordId: "",
            title: "",
            type: "Incident",
            initiatedRgi: false,
        })

        toast({
            title: "Relationship added",
            description: "The relationship has been successfully added.",
        })
    }

    return (
        <>
            <div className="bg-white rounded-md shadow-sm p-4 mb-4">
                <h3 className="font-medium mb-3">Related Items</h3>
                <p className="text-sm text-gray-500 mb-4">Items that have been related to this entry by ROI.</p>

                <div className="space-y-3">
                    {relationships.map((relationship) => (
                        <div key={relationship.id} className="border rounded p-3">
                            <div className="flex justify-between">
                                <span className="text-sm font-medium">{relationship.recordId}</span>
                                <Badge className="bg-blue-500">{relationship.type}</Badge>
                            </div>
                            <p className="text-sm">{relationship.title}</p>
                            {relationship.initiatedRgi && (
                                <div className="mt-1 flex items-center text-xs text-green-600">
                                    <Check className="h-3 w-3 mr-1" /> Initiated RGI Creation
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex mt-4">
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => setIsRelationshipDialogOpen(true)}>
                        Add Relationship
                    </Button>
                    <Button variant="link" size="sm" className="text-xs text-blue-500">
                        Manage Relationships
                    </Button>
                </div>
            </div>

            {/* Add Relationship Dialog */}
            <Sheet open={isRelationshipDialogOpen} onOpenChange={setIsRelationshipDialogOpen}>
                <SheetContent className="sm:max-w-[500px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Add Relationship</SheetTitle>
                        <SheetDescription>Create a relationship between this item and another record.</SheetDescription>
                    </SheetHeader>

                    <div className="grid gap-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="record-id">Record ID</Label>
                            <div>
                                <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                                    <PopoverTrigger asChild>
                                        <div className="relative">
                                            <Input
                                                id="record-id"
                                                value={relationshipForm.recordId}
                                                onChange={(e) => setRelationshipForm({ ...relationshipForm, recordId: e.target.value })}
                                                className="w-full pr-10"
                                                placeholder="Search for a record ID..."
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3"
                                                onClick={() => setIsSearchOpen(true)}
                                                type="button"
                                            >
                                                <Search className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0" align="start" side="bottom" sideOffset={5}>
                                        <Command>
                                            <CommandInput placeholder="Search record ID..." />
                                            <CommandList>
                                                <CommandEmpty>No records found.</CommandEmpty>
                                                <CommandGroup>
                                                    {filteredRecords.map((record) => (
                                                        <CommandItem
                                                            key={record.recordId}
                                                            onSelect={() => handleRecordSelect(record)}
                                                            className="flex items-center"
                                                        >
                                                            <span className="font-medium">{record.recordId}</span>
                                                            <span className="ml-2 text-sm text-gray-500 truncate">{record.title}</span>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={relationshipForm.title}
                                onChange={(e) => setRelationshipForm({ ...relationshipForm, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="relationship-type">Relationship Type</Label>
                            <Select
                                value={relationshipForm.type}
                                onValueChange={(value) => setRelationshipForm({ ...relationshipForm, type: value })}
                            >
                                <SelectTrigger id="relationship-type">
                                    <SelectValue placeholder="Select relationship type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Incident">Incident</SelectItem>
                                    <SelectItem value="Change">Change</SelectItem>
                                    <SelectItem value="CIMA">CIMA</SelectItem>
                                    <SelectItem value="RISE">RISE</SelectItem>
                                    <SelectItem value="PPRT">PPRT</SelectItem>
                                    <SelectItem value="Problem">Problem</SelectItem>
                                    <SelectItem value="RGI">RGI</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="initiated-rgi">Initiated RGI Creation</Label>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="initiated-rgi"
                                    checked={relationshipForm.initiatedRgi}
                                    onCheckedChange={(checked) => setRelationshipForm({ ...relationshipForm, initiatedRgi: checked })}
                                />
                                <Label htmlFor="initiated-rgi" className="text-sm text-gray-500">
                                    {relationshipForm.initiatedRgi ? "Yes" : "No"}
                                </Label>
                            </div>
                        </div>
                    </div>

                    <SheetFooter className="pt-4">
                        <Button variant="outline" onClick={() => setIsRelationshipDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddRelationship}>Save</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    )
}

