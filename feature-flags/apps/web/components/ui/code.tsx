import type { ReactNode } from "react"

interface CodeProps {
  children: ReactNode
  className?: string
}

export function Code({ children, className }: CodeProps) {
  return (
    <pre className={`bg-muted p-4 rounded-md overflow-x-auto text-sm ${className || ""}`}>
      <code>{children}</code>
    </pre>
  )
}

