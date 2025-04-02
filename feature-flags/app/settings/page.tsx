import { ProtectedRoute } from "@/lib/feature-flags/guards"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

function AccessDenied() {
  return (
    <div className="container py-10 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mb-4">
        <AlertCircle className="w-6 h-6 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        You don't have access to the settings page. This feature is currently disabled in your environment.
      </p>
      <Link href="/">
        <Button>Return to Dashboard</Button>
      </Link>
    </div>
  )
}

function Settings() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <Tabs defaultValue="account">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Manage your account details and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Email</h3>
                <p className="text-sm text-muted-foreground">user@example.com</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Username</h3>
                <p className="text-sm text-muted-foreground">@username</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Account</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Theme</h3>
                <p className="text-sm text-muted-foreground">System (follows your device settings)</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Font Size</h3>
                <p className="text-sm text-muted-foreground">Medium</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Appearance</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how and when you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">Enabled</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Push Notifications</h3>
                <p className="text-sm text-muted-foreground">Disabled</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Notifications</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <ProtectedRoute featureId="route-settings" fallback={<AccessDenied />}>
      <Settings />
    </ProtectedRoute>
  )
}

