"use client"

import { useState } from "react"
import NavigationMenu from "@/components/navigation-menu"
import { HeaderNavigation } from "@/components/header-navigation"

// Define the menu structure
const menuItems = [
  {
    id: "resource-hub",
    title: "Resource Hub",
    subItems: [
      { id: "widget-category", title: "Widget Category" },
      { id: "widget-cards", title: "Widget Cards" },
    ],
  },
  {
    id: "application-portfolio",
    title: "Application Portfolio",
    subItems: [
      { id: "import-ait", title: "Import AIT" },
      { id: "resource-hierarchies", title: "Resource Hierarchies" },
      {
        id: "data-management",
        title: "Data Management",
        subItems: [
          { id: "edit-organisations", title: "Edit Organisations" },
          { id: "app-functions", title: "App Functions" },
          { id: "lob", title: "LOB" },
          { id: "portfolio", title: "Portfolio" },
        ],
      },
    ],
  },
  {
    id: "capacity-exception-tracker",
    title: "Capacity Exception Tracker",
  },
  {
    id: "resource-list",
    title: "Resource List",
  },
  {
    id: "scorecard",
    title: "Scorecard",
  },
  {
    id: "rgi",
    title: "RGI",
    subItems: [
      {
        id: "configuration",
        title: "Configuration",
        subItems: [
          { id: "type", title: "Type" },
          { id: "subtype", title: "SubType" },
          { id: "status", title: "Status" },
          { id: "stage", title: "Stage" },
          { id: "dispositions", title: "Dispositions" },
          { id: "intake-status", title: "Intake Status" },
          { id: "intake-sub-status", title: "Intake Sub Status" },
          { id: "note-type", title: "Note Type" },
          { id: "deliverable-status", title: "Deliverable Status" },
          { id: "relationship-type", title: "Relationship Type" },
          { id: "category", title: "Category" },
          { id: "slt", title: "SLT" },
        ],
      },
      {
        id: "reporting",
        title: "Reporting",
        subItems: [
          { id: "rgi-report", title: "RGI" },
          { id: "rgi-bi", title: "RGI Business Intelligence (BI)" },
          { id: "rise", title: "RISE" },
          { id: "rise-app", title: "RISE App" },
          { id: "rise-bi", title: "RISE BI" },
        ],
      },
    ],
  },
  {
    id: "submission-tools",
    title: "Submission Tools",
  },
  {
    id: "reporting-analytics-hub",
    title: "Reporting & Analytics Hub",
  },
  {
    id: "data-import",
    title: "Data Import",
  },
  {
    id: "aas",
    title: "AAS",
  },
  {
    id: "admin",
    title: "Admin",
    subItems: [
      { id: "app-notification", title: "App Notification" },
      { id: "health-checks", title: "Health Checks" },
      { id: "offline-page", title: "Offline Page" },
    ],
  },
  {
    id: "help",
    title: "Help",
  },
]

export default function Home() {
  const [activeItem, setActiveItem] = useState<any | null>(null)
  const [activeSubItem, setActiveSubItem] = useState<any | null>(null)

  // Find the active main menu item
  const findMenuItem = (id: string) => {
    return menuItems.find((item) => item.id === id)
  }

  // Find a submenu item within a main menu item
  const findSubMenuItem = (mainItem: any, id: string) => {
    if (!mainItem?.subItems) return null

    for (const subItem of mainItem.subItems) {
      if (subItem.id === id) return subItem

      // Check nested subitems
      if (subItem.subItems) {
        const nestedItem = subItem.subItems.find((item: any) => item.id === id)
        if (nestedItem) return nestedItem
      }
    }

    return null
  }

  const handleItemClick = (itemId: string) => {
    const item = findMenuItem(itemId)
    setActiveItem(item)
    setActiveSubItem(null)
  }

  const handleSubItemClick = (subItemId: string) => {
    if (!activeItem) return

    const subItem = findSubMenuItem(activeItem, subItemId)
    setActiveSubItem(subItem)
  }

  return (
    <div className="flex min-h-screen">
      <NavigationMenu activeItem={activeItem?.id || null} onItemClick={handleItemClick} />
      <div className="flex-1 flex flex-col">
        <HeaderNavigation activeItem={activeItem} activeSubItem={activeSubItem} onSubItemClick={handleSubItemClick} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-4">
            {activeSubItem ? activeSubItem.title : activeItem ? activeItem.title : "Banking Portal Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {activeItem
              ? `You are viewing the ${activeSubItem ? activeSubItem.title : activeItem.title} section.`
              : "Welcome to your banking portal. Select an option from the navigation menu to get started."}
          </p>
        </main>
      </div>
    </div>
  )
}

