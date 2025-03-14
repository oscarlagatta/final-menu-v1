"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface HeaderNavigationProps {
  activeItem: any | null
  activeSubItem: any | null
  onSubItemClick: (id: string) => void
}

export function HeaderNavigation({ activeItem, activeSubItem, onSubItemClick }: HeaderNavigationProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  if (!activeItem) {
    return (
      <div className="h-16 border-b flex items-center px-6">
        <h2 className="text-lg font-medium">Dashboard</h2>
      </div>
    )
  }

  // Generate breadcrumbs based on active items
  const breadcrumbs = [
    { id: "home", title: "Home", href: "/" },
    { id: activeItem.id, title: activeItem.title, href: `#${activeItem.id}` },
  ]

  if (activeSubItem) {
    breadcrumbs.push({
      id: activeSubItem.id,
      title: activeSubItem.title,
      href: `#${activeItem.id}/${activeSubItem.id}`,
    })
  }

  return (
    <div className="border-b">
      {/* Custom breadcrumb navigation to avoid nesting li elements */}
      <div className="px-6 pt-4">
        <nav aria-label="Breadcrumb">
          <div className="flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.id} className="flex items-center">
                {index > 0 && <ChevronRight className="h-3.5 w-3.5 mx-1 text-muted-foreground" />}
                {index < breadcrumbs.length - 1 ? (
                  <Link href={crumb.href} className="text-muted-foreground hover:text-foreground">
                    {crumb.title}
                  </Link>
                ) : (
                  <span className="font-medium">{crumb.title}</span>
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Horizontal menu for submenus */}
      {activeItem.subItems && (
        <div className="flex items-center px-4 h-12 gap-1 overflow-x-auto">
          {activeItem.subItems.map((subItem: any) => {
            // If this submenu has its own subitems, render as dropdown
            if (subItem.subItems) {
              return (
                <DropdownMenu
                  key={subItem.id}
                  open={openDropdown === subItem.id}
                  onOpenChange={(open) => setOpenDropdown(open ? subItem.id : null)}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={activeSubItem?.id === subItem.id ? "default" : "ghost"}
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      {subItem.icon && <span className="mr-1">{subItem.icon}</span>}
                      {subItem.title}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {subItem.subItems.map((nestedItem: any) => (
                      <DropdownMenuItem
                        key={nestedItem.id}
                        onClick={() => {
                          onSubItemClick(subItem.id)
                          setOpenDropdown(null)
                        }}
                      >
                        {nestedItem.icon && <span className="mr-2">{nestedItem.icon}</span>}
                        {nestedItem.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            }

            // Otherwise render as a simple button
            return (
              <Button
                key={subItem.id}
                variant={activeSubItem?.id === subItem.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onSubItemClick(subItem.id)}
                className={cn(
                  "flex items-center gap-1",
                  activeSubItem?.id === subItem.id && "bg-primary text-primary-foreground",
                )}
              >
                {subItem.icon && <span>{subItem.icon}</span>}
                {subItem.title}
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )
}

