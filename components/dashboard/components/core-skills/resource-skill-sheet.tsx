"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import ResourceSkillsForm from "@/components/dashboard/components/core-skills/resource-skills-form";

export function ResourceSkillsSheet() {
    const [open, setOpen] = useState(false)

    const handleOpenChange = (newOpen: boolean) => {
        // Only allow closing via the X button or after form submission
        // This prevents accidental closing when clicking inside the sheet
        if (newOpen === false) {
            // You could add a confirmation dialog here if needed
            setOpen(false)
        } else {
            setOpen(true)
        }
    }

    return (
        <>
            <Button className="gap-2" onClick={() => setOpen(true)}>
                <PlusCircle className="h-4 w-4" />
                Add Resource Skills
            </Button>

            <Sheet open={open} onOpenChange={handleOpenChange}>
                <SheetContent
                    side="right"
                    className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl overflow-y-auto"
                    // Prevent clicks inside the sheet from closing it
                    onClick={(e) => e.stopPropagation()}
                >
                    <SheetHeader className="mb-6">
                        <SheetTitle>Resource Skills Entry</SheetTitle>
                        <SheetDescription>Add a new resource and their skills to the system.</SheetDescription>
                    </SheetHeader>
                    <div className="h-[calc(100vh-10rem)] overflow-y-auto pr-4">
                        <ResourceSkillsForm onComplete={() => setOpen(false)} />
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}

