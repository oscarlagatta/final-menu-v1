import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown } from "lucide-react"
import type { ReactNode } from "react"

interface PremiumFeatureCardProps {
  title: string
  description: string
  icon: ReactNode
}

export function PremiumFeatureCard({ title, description, icon }: PremiumFeatureCardProps) {
  return (
    <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge className="bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        </div>
        <CardDescription className="text-yellow-700 dark:text-yellow-300/70">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[100px] bg-yellow-100/50 dark:bg-yellow-900/20 rounded-md flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">Premium feature content</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600">
          Access Feature
        </Button>
      </CardFooter>
    </Card>
  )
}

// Add the Badge component since it's used in this file
function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className || ""}`}>
      {children}
    </span>
  )
}

