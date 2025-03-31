"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SkillRatingProps {
    value: number
    onChange: (value: number) => void
}

const skillLevels = [
    { value: 0, label: "No Skill", description: "Resource does not have this skill" },
    { value: 1, label: "Basic (1)", description: "Fundamental awareness and basic understanding" },
    { value: 2, label: "Basic (2)", description: "Limited practical application, needs significant guidance" },
    { value: 3, label: "Intermediate (3)", description: "Practical application, occasional guidance needed" },
    { value: 4, label: "Advanced (4)", description: "Applied theory, works independently on complex tasks" },
    { value: 5, label: "Advanced (5)", description: "Recognized expert, can teach others" },
]

export function SkillRating({ value, onChange }: SkillRatingProps) {
    const [hoverValue, setHoverValue] = useState<number | null>(null)

    return (
        <TooltipProvider>
            <div className="flex items-center space-x-1">
                {skillLevels.map((level) => (
                    <Tooltip key={level.value}>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                className="focus:outline-none"
                                onClick={() => onChange(level.value)}
                                onMouseEnter={() => setHoverValue(level.value)}
                                onMouseLeave={() => setHoverValue(null)}
                            >
                                <Star
                                    className={cn(
                                        "w-6 h-6 transition-all",
                                        (hoverValue !== null ? level.value <= hoverValue : level.value <= value)
                                            ? "fill-primary text-primary"
                                            : "fill-muted text-muted-foreground",
                                    )}
                                />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs">
                            <div className="space-y-1">
                                <p className="font-medium">{level.label}</p>
                                <p className="text-xs">{level.description}</p>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                ))}
                <span className="ml-2 text-lg font-medium">{value}</span>
            </div>
        </TooltipProvider>
    )
}

