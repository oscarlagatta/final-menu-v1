"use client"

import { useState, useMemo } from "react"
import { useFeatureFlags } from "@/lib/feature-flags/context"
import type { FeatureFlag } from "@/lib/feature-flags/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Grid3X3,
  List,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  Tag,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EditFeatureFlag } from "./edit-feature-flag"
import { ViewFeatureFlag } from "./view-feature-flag"

type ViewMode = "list" | "grid" | "table"
type SortField = "name" | "type" | "category" | "enabled" | "id"
type SortDirection = "asc" | "desc"

export function EnhancedFlagVisualization() {
  const { flags, toggleFeature } = useFeatureFlags()
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [showFilters, setShowFilters] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [selectedFlag, setSelectedFlag] = useState<FeatureFlag | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Extract all unique categories from flags
  const categories = useMemo(() => {
    const categorySet = new Set<string>()
    flags.forEach((flag) => {
      if (flag.category) {
        categorySet.add(flag.category)
      } else {
        categorySet.add("Uncategorized")
      }
    })
    return Array.from(categorySet).sort()
  }, [flags])

  // Extract all unique types from flags
  const types = useMemo(() => {
    const typeSet = new Set<string>()
    flags.forEach((flag) => {
      typeSet.add(flag.type)
    })
    return Array.from(typeSet).sort()
  }, [flags])

  // Filter flags based on search query, selected types, and selected categories
  const filteredFlags = useMemo(() => {
    return flags.filter((flag) => {
      const matchesSearch =
        searchQuery === "" ||
        flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flag.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flag.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(flag.type)

      const flagCategory = flag.category || "Uncategorized"
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(flagCategory)

      return matchesSearch && matchesType && matchesCategory
    })
  }, [flags, searchQuery, selectedTypes, selectedCategories])

  // Sort filtered flags
  const sortedFlags = useMemo(() => {
    return [...filteredFlags].sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      // Handle special cases
      if (sortField === "category") {
        aValue = a.category || "Uncategorized"
        bValue = b.category || "Uncategorized"
      }

      // Compare values
      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1
      }
      return 0
    })
  }, [filteredFlags, sortField, sortDirection])

  // Calculate pagination
  const totalPages = Math.ceil(sortedFlags.length / pageSize)

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedTypes, selectedCategories, pageSize])

  // Get current page items
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedFlags.slice(startIndex, startIndex + pageSize)
  }, [sortedFlags, currentPage, pageSize])

  // Group flags by category for list view (using paginated items)
  const flagsByCategory = useMemo(() => {
    const grouped: Record<string, FeatureFlag[]> = {}

    currentItems.forEach((flag) => {
      const category = flag.category || "Uncategorized"
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(flag)
    })

    return grouped
  }, [currentItems])

  const handleEdit = (flag: FeatureFlag) => {
    setSelectedFlag(flag)
    setIsEditDialogOpen(true)
  }

  const handleViewDetails = (flag: FeatureFlag) => {
    setSelectedFlag(flag)
    setIsViewDialogOpen(true)
  }

  // Toggle sort direction or change sort field
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Toggle type selection
  const toggleType = (type: string) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTypes([])
    setSelectedCategories([])
  }

  // Pagination controls
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value))
    setCurrentPage(1) // Reset to first page when changing page size
  }

  // Render pagination controls
  const renderPagination = () => {
    if (sortedFlags.length <= pageSize) return null

    const startItem = (currentPage - 1) * pageSize + 1
    const endItem = Math.min(currentPage * pageSize, sortedFlags.length)

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          Showing {startItem}-{endItem} of {sortedFlags.length} items
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center mr-4">
            <Label htmlFor="page-size" className="mr-2 text-sm">
              Per page:
            </Label>
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger id="page-size" className="w-[70px] h-8">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>

            <div className="flex items-center mx-2">
              {totalPages <= 5 ? (
                // Show all pages if 5 or fewer
                Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8 mx-0.5"
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </Button>
                ))
              ) : (
                // Show limited pages with ellipsis for many pages
                <>
                  <Button
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8 mx-0.5"
                    onClick={() => goToPage(1)}
                  >
                    1
                  </Button>

                  {currentPage > 3 && <span className="mx-1 text-muted-foreground">...</span>}

                  {currentPage > 2 && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 mx-0.5"
                      onClick={() => goToPage(currentPage - 1)}
                    >
                      {currentPage - 1}
                    </Button>
                  )}

                  {currentPage !== 1 && currentPage !== totalPages && (
                    <Button variant="default" size="icon" className="h-8 w-8 mx-0.5">
                      {currentPage}
                    </Button>
                  )}

                  {currentPage < totalPages - 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 mx-0.5"
                      onClick={() => goToPage(currentPage + 1)}
                    >
                      {currentPage + 1}
                    </Button>
                  )}

                  {currentPage < totalPages - 2 && <span className="mx-1 text-muted-foreground">...</span>}

                  <Button
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8 mx-0.5"
                    onClick={() => goToPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Render table view
  const renderTableView = () => (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[70px]">Status</TableHead>
            <TableHead className="cursor-pointer w-[180px]" onClick={() => handleSort("name")}>
              <div className="flex items-center">
                Name
                {sortField === "name" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer w-[100px]" onClick={() => handleSort("type")}>
              <div className="flex items-center">
                Type
                {sortField === "type" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer w-[120px]" onClick={() => handleSort("category")}>
              <div className="flex items-center">
                Category
                {sortField === "category" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </TableHead>
            <TableHead className="w-[400px]">Description</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No feature flags found matching your criteria
              </TableCell>
            </TableRow>
          ) : (
            currentItems.map((flag) => (
              <TableRow key={flag.id}>
                <TableCell>
                  <Switch
                    id={`table-flag-${flag.id}`}
                    checked={flag.enabled}
                    onCheckedChange={() => toggleFeature(flag.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{flag.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {flag.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {flag.category ? (
                    <Badge variant="secondary" className="capitalize">
                      {flag.category}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Uncategorized
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{flag.description}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toggleFeature(flag.id)}>
                        {flag.enabled ? "Disable" : "Enable"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(flag)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewDetails(flag)}>View Details</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )

  // Render grid view
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {currentItems.length === 0 ? (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No feature flags found matching your criteria
        </div>
      ) : (
        currentItems.map((flag) => (
          <Card
            key={flag.id}
            className={`overflow-hidden transition-all ${flag.enabled ? "border-primary/30 shadow-md" : ""}`}
          >
            <div className="p-4 relative">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium truncate" title={flag.name}>
                    {flag.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2" title={flag.description}>
                    {flag.description}
                  </p>
                </div>
                <Switch
                  id={`grid-flag-${flag.id}`}
                  checked={flag.enabled}
                  onCheckedChange={() => toggleFeature(flag.id)}
                />
              </div>
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => toggleFeature(flag.id)}>
                      {flag.enabled ? "Disable" : "Enable"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(flag)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleViewDetails(flag)}>View Details</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline" className="capitalize">
                  {flag.type}
                </Badge>
                {flag.category && (
                  <Badge variant="secondary" className="capitalize">
                    {flag.category}
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-3">
                ID: <code className="bg-muted px-1 py-0.5 rounded text-xs">{flag.id}</code>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )

  // Render list view grouped by category
  const renderListView = () => (
    <div className="space-y-6">
      {Object.keys(flagsByCategory).length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No feature flags found matching your criteria</div>
      ) : (
        Object.entries(flagsByCategory).map(([category, categoryFlags]) => (
          <div key={category} className="space-y-2">
            <h3 className="font-medium text-sm flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              {category}
              <Badge className="ml-2" variant="outline">
                {categoryFlags.length}
              </Badge>
            </h3>
            <div className="space-y-2 pl-6">
              {categoryFlags.map((flag) => (
                <div
                  key={flag.id}
                  className={`flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 ${
                    flag.enabled ? "border-primary/30 bg-primary/5" : ""
                  }`}
                >
                  <div className="flex flex-col flex-1 mr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{flag.name}</span>
                      <Badge variant="outline" className="capitalize">
                        {flag.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{flag.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`list-flag-${flag.id}`}
                      checked={flag.enabled}
                      onCheckedChange={() => toggleFeature(flag.id)}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toggleFeature(flag.id)}>
                          {flag.enabled ? "Disable" : "Enable"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(flag)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewDetails(flag)}>View Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search feature flags..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            className={showFilters ? "bg-muted" : ""}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <Badge
              className="ml-2"
              variant={selectedTypes.length > 0 || selectedCategories.length > 0 ? "default" : "outline"}
            >
              {selectedTypes.length + selectedCategories.length || 0}
            </Badge>
          </Button>
          <div className="border rounded-md flex">
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 rounded-none ${viewMode === "table" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("table")}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="sr-only">Table view</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 rounded-none ${viewMode === "grid" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 rounded-none ${viewMode === "list" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="p-4 border rounded-md bg-muted/40">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="space-y-2 flex-1">
              <Label>Filter by Type</Label>
              <div className="flex flex-wrap gap-2">
                {types.map((type) => (
                  <Badge
                    key={type}
                    variant={selectedTypes.includes(type) ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => toggleType(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <Label>Filter by Category</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategories.includes(category) ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4">
        {viewMode === "table" && renderTableView()}
        {viewMode === "grid" && renderGridView()}
        {viewMode === "list" && renderListView()}
      </div>

      {renderPagination()}

      <div className="flex justify-between items-center text-sm text-muted-foreground pt-2">
        <div>
          {sortedFlags.length === 0 ? (
            "No feature flags found"
          ) : (
            <>
              {flags.filter((f) => f.enabled).length} enabled / {flags.length} total
            </>
          )}
        </div>
      </div>
      <EditFeatureFlag flag={selectedFlag} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />

      <ViewFeatureFlag
        flag={selectedFlag}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        onEdit={(flag) => {
          setIsViewDialogOpen(false)
          setSelectedFlag(flag)
          setIsEditDialogOpen(true)
        }}
      />
    </div>
  )
}

