"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export interface Tag {
    id: string
    name: string
}

interface TagManagerProps {
    tags: Tag[]
    onAddTag: (tag: Tag) => void
    onDeleteTag: (tagId: string) => void
}

export function TagManager({ tags, onAddTag, onDeleteTag }: TagManagerProps) {
    const [newTagInput, setNewTagInput] = useState("")

    const handleAddTag = () => {
        if (!newTagInput.trim()) {
            toast({
                title: "Error",
                description: "Tag name cannot be empty.",
                variant: "destructive",
            })
            return
        }

        // Check for duplicates
        if (tags.some((tag) => tag.name.toLowerCase() === newTagInput.trim().toLowerCase())) {
            toast({
                title: "Error",
                description: "This tag already exists.",
                variant: "destructive",
            })
            return
        }

        const newTag = {
            id: Date.now().toString(),
            name: newTagInput.trim(),
        }

        onAddTag(newTag)
        setNewTagInput("")

        toast({
            title: "Tag added",
            description: "The new tag has been successfully added.",
        })
    }

    return (
        <div className="bg-white rounded-md shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">
                    Tags <Badge className="ml-1 bg-gray-500 text-white">{tags.length}</Badge>
                </h3>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag) => (
                    <div key={tag.id} className="relative group">
                        <Badge
                            className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 hover:from-blue-100 hover:to-blue-200
                     border border-blue-200 transition-all duration-200 pr-8 py-1.5 rounded-full"
                        >
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>
                  {tag.name}
              </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full w-6 p-0 opacity-70 hover:opacity-100
                       hover:text-red-500 transition-all duration-200"
                                onClick={() => onDeleteTag(tag.id)}
                                type="button"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    </div>
                ))}
            </div>

            <div className="relative">
                <Input
                    placeholder="Add a tag..."
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    className="pr-24 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddTag()
                        }
                    }}
                />
                <Button
                    size="sm"
                    onClick={handleAddTag}
                    type="button"
                    className="absolute right-1 top-1 bg-blue-600 hover:bg-blue-700 text-white h-8"
                >
                    <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
            </div>
        </div>
    )
}

