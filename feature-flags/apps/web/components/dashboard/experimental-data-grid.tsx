import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, RefreshCw } from "lucide-react"

export function ExperimentalDataGrid() {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-md border border-blue-200 dark:border-blue-900">
        <h3 className="font-medium text-blue-800 dark:text-blue-400 mb-4">Advanced Data Grid</h3>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="pl-8" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="bg-white dark:bg-gray-800">
                  <TableCell className="font-medium">PRJ-{1000 + i}</TableCell>
                  <TableCell>Enhanced Project {i + 1}</TableCell>
                  <TableCell>
                    <Badge
                      variant={i % 2 === 0 ? "default" : "outline"}
                      className={
                        i % 2 === 0 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : ""
                      }
                    >
                      {i % 2 === 0 ? "Active" : "Completed"}
                    </Badge>
                  </TableCell>
                  <TableCell>{i % 3 === 0 ? "Marketing" : i % 3 === 1 ? "Development" : "Design"}</TableCell>
                  <TableCell>2023-0{i + 1}-01</TableCell>
                  <TableCell>
                    <div className="w-full bg-muted rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(i + 1) * 20}%` }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">{(i + 1) * 20}%</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">Showing 5 of 25 entries</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

