"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

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
                    {subItem.subItems.map((nestedItem: any) => {
                      // If this is a group with items, render a group with a label and items
                      if (nestedItem.isGroup && nestedItem.items) {
                        return (
                          <div key={nestedItem.id}>
                            {/* Add a separator before each group (except the first one) */}
                            {subItem.subItems.indexOf(nestedItem) > 0 && <DropdownMenuSeparator />}
                            <DropdownMenuLabel>{nestedItem.title}</DropdownMenuLabel>
                            {nestedItem.items.map((groupItem: any) => (
                              <DropdownMenuItem
                                key={groupItem.id}
                                onClick={() => {
                                  onSubItemClick(groupItem.id)
                                  setOpenDropdown(null)
                                }}
                              >
                                {groupItem.icon && <span className="mr-2">{groupItem.icon}</span>}
                                {groupItem.title}
                              </DropdownMenuItem>
                            ))}
                          </div>
                        )
                      }

                      // Regular item
                      return (
                        <DropdownMenuItem
                          key={nestedItem.id}
                          onClick={() => {
                            onSubItemClick(nestedItem.id)
                            setOpenDropdown(null)
                          }}
                        >
                          {nestedItem.icon && <span className="mr-2">{nestedItem.icon}</span>}
                          {nestedItem.title}
                        </DropdownMenuItem>
                      )
                    })}
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



"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"

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
                    {subItem.subItems.map((nestedItem: any) => {
                      // If this is a group with items, render a group with a label and items
                      if (nestedItem.isGroup && nestedItem.items) {
                        return (
                          <div key={nestedItem.id}>
                            {/* Add a separator before each group (except the first one) */}
                            {subItem.subItems.indexOf(nestedItem) > 0 && <DropdownMenuSeparator />}
                            <DropdownMenuLabel>{nestedItem.title}</DropdownMenuLabel>
                            {nestedItem.items.map((groupItem: any) => {
                              // If this item has a submenu, render it as a nested dropdown
                              if (groupItem.hasSubmenu && groupItem.submenuItems) {
                                return (
                                  <DropdownMenuSub key={groupItem.id}>
                                    <DropdownMenuSubTrigger>
                                      {groupItem.icon && <span className="mr-2">{groupItem.icon}</span>}
                                      {groupItem.title}
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                      <DropdownMenuSubContent>
                                        {groupItem.submenuItems.map((submenuItem: any) => (
                                          <DropdownMenuItem
                                            key={submenuItem.id}
                                            onClick={() => {
                                              onSubItemClick(submenuItem.id)
                                              setOpenDropdown(null)
                                            }}
                                          >
                                            {submenuItem.icon && <span className="mr-2">{submenuItem.icon}</span>}
                                            {submenuItem.title}
                                          </DropdownMenuItem>
                                        ))}
                                      </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                  </DropdownMenuSub>
                                )
                              }

                              // Regular item without submenu
                              return (
                                <DropdownMenuItem
                                  key={groupItem.id}
                                  onClick={() => {
                                    onSubItemClick(groupItem.id)
                                    setOpenDropdown(null)
                                  }}
                                >
                                  {groupItem.icon && <span className="mr-2">{groupItem.icon}</span>}
                                  {groupItem.title}
                                </DropdownMenuItem>
                              )
                            })}
                          </div>
                        )
                      }

                      // Regular item
                      return (
                        <DropdownMenuItem
                          key={nestedItem.id}
                          onClick={() => {
                            onSubItemClick(nestedItem.id)
                            setOpenDropdown(null)
                          }}
                        >
                          {nestedItem.icon && <span className="mr-2">{nestedItem.icon}</span>}
                          {nestedItem.title}
                        </DropdownMenuItem>
                      )
                    })}
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




// Define the menu structure
const menuItems = [
  {
    id: "resource-hub",
    title: "Resource Hub",
    icon: <BookOpen className="h-4 w-4" />,
    subItems: [
      { id: "widget-category", title: "Widget Category", icon: <Grid className="h-4 w-4" /> },
      { id: "widget-cards", title: "Widget Cards", icon: <Grid className="h-4 w-4" /> },
    ],
  },
  {
    id: "application-portfolio",
    title: "Application Portfolio",
    icon: <FolderOpen className="h-4 w-4" />,
    subItems: [
      { id: "import-ait", title: "Import AIT", icon: <Upload className="h-4 w-4" /> },
      { id: "resource-hierarchies", title: "Resource Hierarchies", icon: <List className="h-4 w-4" /> },
      {
        id: "data-management",
        title: "Data Management",
        icon: <Database className="h-4 w-4" />,
        subItems: [
          // Organisation group
          {
            id: "organisation-group",
            title: "Organisation",
            isGroup: true,
            items: [
              { id: "edit-organisations", title: "Organisation", icon: <Users className="h-4 w-4" /> },
              // App Functions with its own submenu
              {
                id: "app-functions",
                title: "App Functions",
                icon: <Settings className="h-4 w-4" />,
                hasSubmenu: true,
                submenuItems: [
                  { id: "app-functions-create", title: "Create App Function", icon: <Settings className="h-4 w-4" /> },
                  { id: "app-functions-edit", title: "Edit App Function", icon: <Settings className="h-4 w-4" /> },
                  { id: "app-functions-delete", title: "Delete App Function", icon: <Settings className="h-4 w-4" /> },
                  {
                    id: "app-functions-assign",
                    title: "Assign to Application",
                    icon: <Settings className="h-4 w-4" />,
                  },
                ],
              },
              { id: "lob", title: "LOB", icon: <List className="h-4 w-4" /> },
            ],
          },
          // Portfolio group
          {
            id: "portfolio-group",
            title: "Portfolio",
            isGroup: true,
            items: [
              { id: "portfolio", title: "Portfolio", icon: <FolderOpen className="h-4 w-4" /> },
              { id: "team", title: "Team", icon: <Users className="h-4 w-4" /> },
              {
                id: "problem-coordinator-group",
                title: "Problem Coordinator Group",
                icon: <Users className="h-4 w-4" />,
              },
            ],
          },
          // Other group
          {
            id: "other-group",
            title: "Other",
            isGroup: true,
            items: [
              { id: "regions", title: "Regions", icon: <Grid className="h-4 w-4" /> },
              { id: "resource-function", title: "Resource Function", icon: <Grid className="h-4 w-4" /> },
              { id: "resource-skill", title: "Resource Skill", icon: <Grid className="h-4 w-4" /> },
              { id: "support-model", title: "Support Model", icon: <Grid className="h-4 w-4" /> },
            ],
          },
        ],
      },
    ],
  },
