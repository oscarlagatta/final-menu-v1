import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DashboardPage() {
  // Generate last 6 months in Month-Year format
  const getLast6Months = () => {
    const months = []
    const currentDate = new Date()

    for (let i = 0; i < 6; i++) {
      const date = new Date(currentDate)
      date.setMonth(currentDate.getMonth() - i)
      const monthYear = date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
      months.push(monthYear)
    }

    return months
  }

  // Sample users for the dropdown
  const users = ["All Users", "John Doe", "Jane Smith", "Robert Johnson", "Emily Davis", "Michael Wilson"]

  const months = getLast6Months()

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="w-full sm:w-auto sm:min-w-[200px] md:min-w-[240px]">
          <label htmlFor="month-select" className="block text-sm font-medium mb-2">
            Time Period
          </label>
          <Select defaultValue={months[0]}>
            <SelectTrigger id="month-select" className="w-full">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-auto sm:min-w-[200px] md:min-w-[240px]">
          <label htmlFor="user-select" className="block text-sm font-medium mb-2">
            User
          </label>
          <Select defaultValue={users[0]}>
            <SelectTrigger id="user-select" className="w-full">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user} value={user}>
                  {user}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Grid Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Data Overview</h2>
        <Card>
          <CardHeader>
            <CardTitle>Data Grid</CardTitle>
            <CardDescription>Your data grid will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full bg-muted/20 flex items-center justify-center rounded-md border border-dashed">
              <p className="text-muted-foreground">Data Grid Placeholder</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Charts Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Chart 1 */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Chart 1</CardTitle>
              <CardDescription>Description for chart 1</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full bg-muted/20 flex items-center justify-center rounded-md border border-dashed">
                <p className="text-muted-foreground">Chart Placeholder</p>
              </div>
            </CardContent>
          </Card>

          {/* Chart 2 */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Chart 2</CardTitle>
              <CardDescription>Description for chart 2</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full bg-muted/20 flex items-center justify-center rounded-md border border-dashed">
                <p className="text-muted-foreground">Chart Placeholder</p>
              </div>
            </CardContent>
          </Card>

          {/* Chart 3 */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Chart 3</CardTitle>
              <CardDescription>Description for chart 3</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full bg-muted/20 flex items-center justify-center rounded-md border border-dashed">
                <p className="text-muted-foreground">Chart Placeholder</p>
              </div>
            </CardContent>
          </Card>

          {/* Chart 4 */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Chart 4</CardTitle>
              <CardDescription>Description for chart 4</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full bg-muted/20 flex items-center justify-center rounded-md border border-dashed">
                <p className="text-muted-foreground">Chart Placeholder</p>
              </div>
            </CardContent>
          </Card>

          {/* Chart 5 */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Chart 5</CardTitle>
              <CardDescription>Description for chart 5</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full bg-muted/20 flex items-center justify-center rounded-md border border-dashed">
                <p className="text-muted-foreground">Chart Placeholder</p>
              </div>
            </CardContent>
          </Card>

          {/* Chart 6 */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Chart 6</CardTitle>
              <CardDescription>Description for chart 6</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full bg-muted/20 flex items-center justify-center rounded-md border border-dashed">
                <p className="text-muted-foreground">Chart Placeholder</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
