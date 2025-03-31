import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Calculates the Levenshtein distance between two strings
 * This measures how many single character edits are needed to change one string into another
 */
export function levenshteinDistance(str1: string, str2: string): number {
    const track = Array(str2.length + 1)
        .fill(null)
        .map(() => Array(str1.length + 1).fill(null))

    for (let i = 0; i <= str1.length; i += 1) {
        track[0][i] = i
    }

    for (let j = 0; j <= str2.length; j += 1) {
        track[j][0] = j
    }

    for (let j = 1; j <= str2.length; j += 1) {
        for (let i = 1; i <= str1.length; i += 1) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
            track[j][i] = Math.min(
                track[j][i - 1] + 1, // deletion
                track[j - 1][i] + 1, // insertion
                track[j - 1][i - 1] + indicator, // substitution
            )
        }
    }

    return track[str2.length][str1.length]
}

/**
 * Normalizes a skill name for comparison
 * Handles special characters, spacing, and common replacements
 */
export function normalizeSkillName(skill: string): string {
    let normalized = skill.toLowerCase().trim()

    // Replace special characters and their word equivalents
    const replacements: Record<string, string> = {
        "#": "sharp",
        "c#": "csharp",
        "c sharp": "csharp",
        "c-sharp": "csharp",
        ".net": "dotnet",
        "dot net": "dotnet",
        ".js": "js",
        javascript: "js",
        typescript: "ts",
        "react.js": "react",
        reactjs: "react",
        "react js": "react",
        "node.js": "node",
        nodejs: "node",
        "node js": "node",
        "vue.js": "vue",
        vuejs: "vue",
        "vue js": "vue",
        "angular.js": "angular",
        angularjs: "angular",
        "angular js": "angular",
        aws: "amazon web services",
        amazon: "amazon web services",
        azure: "microsoft azure",
        "ms azure": "microsoft azure",
        py: "python",
        "go lang": "golang",
        "objective c": "objective-c",
        "objective-c": "objectivec",
        "ruby on rails": "rails",
        ror: "rails",
        postgres: "postgresql",
        mongo: "mongodb",
        "incident mgmt": "incident management",
        "problem mgmt": "problem management",
        "change mgmt": "change management",
        "release mgmt": "release management",
        "config mgmt": "configuration management",
        "config management": "configuration management",
        ba: "business analysis",
        "business analyst": "business analysis",
        pm: "project management",
        qa: "quality assurance",
        qc: "quality control",
    }

    // Check for exact matches in replacements
    if (replacements[normalized]) {
        return replacements[normalized]
    }

    // Check for partial matches and apply replacements
    for (const [pattern, replacement] of Object.entries(replacements)) {
        if (normalized.includes(pattern)) {
            normalized = normalized.replace(pattern, replacement)
        }
    }

    // Remove common filler words
    const fillerWords = ["and", "or", "the", "a", "an", "in", "for", "with", "using"]
    fillerWords.forEach((word) => {
        normalized = normalized.replace(new RegExp(`\\b${word}\\b`, "g"), "")
    })

    // Remove punctuation and extra spaces
    normalized = normalized.replace(/[^\w\s]/g, " ")
    normalized = normalized.replace(/\s+/g, " ").trim()

    return normalized
}

/**
 * Checks if two skill names are similar using multiple techniques
 * Returns a similarity score between 0 and 1, where 1 is an exact match
 */
export function getSkillSimilarity(skill1: string, skill2: string): number {
    const s1 = skill1.toLowerCase().trim()
    const s2 = skill2.toLowerCase().trim()

    // Exact match
    if (s1 === s2) return 1

    // Normalize both skills for comparison
    const normalized1 = normalizeSkillName(s1)
    const normalized2 = normalizeSkillName(s2)

    // If normalized versions match, they're essentially the same skill
    if (normalized1 === normalized2) return 0.95

    // Special case handling for programming languages with symbols
    const programmingLanguages: Record<string, string[]> = {
        csharp: ["c#", "c sharp", "c-sharp", "csharp"],
        cplusplus: ["c++", "cpp", "c plus plus"],
        fsharp: ["f#", "f sharp", "f-sharp"],
        javascript: ["js", "javascript", "ecmascript"],
        typescript: ["ts", "typescript"],
    }

    // Check if skills are known variations of programming languages
    for (const [base, variations] of Object.entries(programmingLanguages)) {
        if (
            (variations.includes(normalized1) && variations.includes(normalized2)) ||
            (variations.some((v) => normalized1.includes(v)) && variations.some((v) => normalized2.includes(v)))
        ) {
            return 0.9
        }
    }

    // Common abbreviations and variations
    const commonVariations: Record<string, string[]> = {
        javascript: ["js", "javascript", "ecmascript"],
        typescript: ["ts", "typescript"],
        react: ["reactjs", "react.js", "react js"],
        angular: ["angularjs", "angular.js", "angular js"],
        vue: ["vuejs", "vue.js", "vue js"],
        node: ["nodejs", "node.js", "node js"],
        python: ["py", "python"],
        csharp: ["c#", "c sharp", "c-sharp"],
        aws: ["amazon web services", "amazon", "aws"],
        azure: ["microsoft azure", "ms azure"],
        "incident management": ["im", "incident mgmt"],
        "problem management": ["pm", "problem mgmt"],
        "change management": ["cm", "change mgmt"],
        "release management": ["rm", "release mgmt"],
        "configuration management": ["config mgmt", "config management"],
        "business analysis": ["ba", "business analyst"],
        "project management": ["pm", "project mgmt"],
        "quality assurance": ["qa", "quality", "qc"],
    }

    // Check if either skill is a known variation of the other
    for (const [base, variations] of Object.entries(commonVariations)) {
        if (
            (normalized1.includes(base) && variations.some((v) => normalized2.includes(v))) ||
            (normalized2.includes(base) && variations.some((v) => normalized1.includes(v)))
        ) {
            return 0.9 // Very high similarity
        }
    }

    // Check for substring relationship (one is contained in the other)
    if (
        (normalized1.length > 3 && normalized2.includes(normalized1)) ||
        (normalized2.length > 3 && normalized1.includes(normalized2))
    ) {
        return 0.8
    }

    // Calculate Levenshtein distance for fuzzy matching
    const maxLength = Math.max(normalized1.length, normalized2.length)
    if (maxLength === 0) return 0

    const distance = levenshteinDistance(normalized1, normalized2)
    const similarity = 1 - distance / maxLength

    return similarity
}

/**
 * Checks if a skill is similar to any in a list of existing skills
 * Returns information about the most similar skill if similarity is above threshold
 */
export function findSimilarSkill(
    newSkill: string,
    existingSkills: string[],
    threshold = 0.7,
): { exists: boolean; similarTo: string; similarity: number } {
    let highestSimilarity = 0
    let mostSimilarSkill = ""

    for (const existingSkill of existingSkills) {
        const similarity = getSkillSimilarity(newSkill, existingSkill)

        if (similarity > highestSimilarity) {
            highestSimilarity = similarity
            mostSimilarSkill = existingSkill
        }
    }

    return {
        exists: highestSimilarity >= threshold,
        similarTo: mostSimilarSkill,
        similarity: highestSimilarity,
    }
}

