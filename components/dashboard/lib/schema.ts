import { z } from "zod"

export const resourceSkillsFormSchema = z.object({
    resourceId: z.string().min(1, "Resource ID is required"),
    resourceName: z.string().min(1, "Resource name is required"),
    coreSkills: z.object({
        applicationFailover: z.string().min(1, "Please select Yes or No"),
    }),
    customTechnologySkills: z.array(
        z.object({
            id: z.string(),
            name: z.string().min(1, "Skill name is required"),
            value: z.number().min(0).max(5),
        }),
    ),
    customFunctionalSkills: z.array(
        z.object({
            id: z.string(),
            name: z.string().min(1, "Skill name is required"),
            value: z.number().min(0).max(5),
        }),
    ),
    avgScore: z.number().optional(),
    competencyLevel: z.string().optional(),
})

