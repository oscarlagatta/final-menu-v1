import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {ResourceSkillsFormValues} from "@/components/dashboard/types/resource-skills-form-values";


interface CoreSkillsFormProps {
    form: UseFormReturn<ResourceSkillsFormValues>
}

export function CoreSkillsForm({ form }: CoreSkillsFormProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Core Skills</h2>

            <FormField
                control={form.control}
                name="coreSkills.applicationFailover"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel className="flex items-center">
                            Application Failover/Recovery
                            <span className="text-destructive ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-row space-x-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Yes" id="failover-yes" />
                                    <Label htmlFor="failover-yes">Yes</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="No" id="failover-no" />
                                    <Label htmlFor="failover-no">No</Label>
                                </div>
                            </RadioGroup>
                        </FormControl>
                        <FormDescription>Does the resource have application failover/recovery skills?</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <p className="text-sm text-muted-foreground mt-4">
                <span className="text-destructive">*</span> Required fields
            </p>
        </div>
    )
}

