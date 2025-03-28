import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"

export function RGIDataTableSkeleton() {
    return (
        <Card>
            <CardContent className="p-6 space-y-4">
                {/* Filters and search skeleton */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground opacity-30" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex flex-1 items-center space-x-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-28" />
                    </div>
                    <Skeleton className="h-8 w-24 ml-auto" />
                </div>

                {/* Table skeleton */}
                <div className="rounded-md border overflow-hidden">
                    {/* Table header */}
                    <div className="bg-muted/50 border-b">
                        <div className="grid grid-cols-9 gap-2 p-4">
                            <Skeleton className="h-5 w-5" />
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-5 w-28" />
                            <Skeleton className="h-5 w-28" />
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-5 w-16" />
                        </div>
                    </div>

                    {/* Table rows */}
                    <div className="bg-card">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <div key={index} className="grid grid-cols-9 gap-2 p-4 border-b last:border-0">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 w-full max-w-[200px]" />
                                <div className="flex flex-col gap-1">
                                    <Skeleton className="h-5 w-20" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Skeleton className="h-5 w-20" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-5 w-28" />
                                <Skeleton className="h-8 w-16 rounded-md" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination skeleton */}
                <div className="flex items-center justify-between px-2">
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
            </CardContent>
        </Card>
    )
}

