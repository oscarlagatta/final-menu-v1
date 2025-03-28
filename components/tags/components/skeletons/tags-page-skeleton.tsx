import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Search } from "lucide-react"

export function TagsPageSkeleton() {
    return (
        <div className="space-y-4">
            {/* Search and Add button skeleton */}
            <div className="flex items-center justify-between">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground opacity-30" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Table skeleton */}
            <Card className="overflow-hidden">
                <div className="border-b">
                    <div className="flex p-4">
                        {/* Table header skeleton */}
                        <div className="grid grid-cols-6 w-full gap-4">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-6 w-16 ml-auto" />
                        </div>
                    </div>
                </div>

                {/* Table rows skeleton */}
                <div className="divide-y">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="p-4">
                            <div className="grid grid-cols-6 w-full gap-4 items-center">
                                <Skeleton className="h-6 w-28" />
                                <Skeleton className="h-6 w-36" />
                                <Skeleton className="h-6 w-12" />
                                <Skeleton className="h-6 w-28" />
                                <Skeleton className="h-6 w-32" />
                                <div className="flex justify-end space-x-2">
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Pagination skeleton */}
            <div className="flex items-center justify-between px-2 py-4">
                <Skeleton className="h-5 w-48" />
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="h-5 w-32" />
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    )
}

