export interface ResourceSkillsFormValues {
    resourceId: string
    resourceName: string
    coreSkills: {
        applicationFailover: string
    }
    customTechnologySkills: Array<{
        id: string
        name: string
        value: number
    }>
    customFunctionalSkills: Array<{
        id: string
        name: string
        value: number
    }>
    avgScore?: number
    competencyLevel?: string
}

