"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {ResourceSkillsFormValues} from "@/components/dashboard/types/resource-skills-form-values";


interface ResourceInfoFormProps {
    form: UseFormReturn<ResourceSkillsFormValues>
}

export function ResourceInfoForm({ form }: ResourceInfoFormProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Resource Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="resourceId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center">
                                Resource NB ID
                                <span className="text-destructive ml-1">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. NB15DDQ" {...field} />
                            </FormControl>
                            <FormDescription>Enter the unique identifier for this resource.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="resourceName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center">
                                Resource Name
                                <span className="text-destructive ml-1">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. John Smith" {...field} />
                            </FormControl>
                            <FormDescription>Enter the full name of the resource.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
                <span className="text-destructive">*</span> Required fields
            </p>
        </div>
    )
}

