import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function StandardDataTable() {
  return (
    <div className="space-y-4">
      <div className="bg-muted/40 p-4 rounded-md border">
        <h3 className="font-medium mb-4">Standard Data Table</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This is the standard data table. Enable the "component-data-grid" feature flag to see the enhanced version.
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>PRJ-{1000 + i}</TableCell>
                <TableCell>Project {i + 1}</TableCell>
                <TableCell>{i % 2 === 0 ? "Active" : "Completed"}</TableCell>
                <TableCell>2023-0{i + 1}-01</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

