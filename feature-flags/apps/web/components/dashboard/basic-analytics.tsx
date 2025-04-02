import { BarChart } from "lucide-react"

export function BasicAnalytics() {
  return (
    <div className="space-y-4">
      <div className="bg-muted/40 p-4 rounded-md border">
        <div className="flex items-center gap-2 mb-4">
          <BarChart className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Basic Analytics</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          This is the basic analytics view. Enable the "advanced-analytics" feature flag to see the enhanced version.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-[120px] bg-muted/60 rounded-md flex items-center justify-center">
            <p className="text-xs text-muted-foreground">Basic Chart 1</p>
          </div>
          <div className="h-[120px] bg-muted/60 rounded-md flex items-center justify-center">
            <p className="text-xs text-muted-foreground">Basic Chart 2</p>
          </div>
        </div>
      </div>
    </div>
  )
}

