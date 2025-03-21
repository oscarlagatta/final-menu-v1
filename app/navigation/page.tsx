"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom"
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

// Home component that redirects to portal
function Home() {
    const navigate = useNavigate()

    useEffect(() => {
        navigate("/portal")
    }, [navigate])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg">Loading portal...</p>
        </div>
    )
}

// Portal component with the main content
function Portal() {
    const navigate = useNavigate()
    const params = useParams()
    const [activeItem, setActiveItem] = useState<any | null>(null)
    const [activeSubItem, setActiveSubItem] = useState<any | null>(null)
    const [activeNestedItem, setActiveNestedItem] = useState<any | null>(null)

    // Find the active main menu item
    const findMenuItem = (id: string) => {
        return menuItems.find((item) => item.id === id)
    }

    // Find a submenu item within a main menu item or its nested items
    const findSubMenuItem = (mainItem: any, id: string): any => {
        if (!mainItem?.subItems) return null

        // First check direct children
        const directChild = mainItem.subItems.find((item: any) => item.id === id)
        if (directChild) return directChild

        // Then check nested children
        for (const subItem of mainItem.subItems) {
            if (subItem.subItems) {
                const nestedItem = subItem.subItems.find((item: any) => item.id === id)
                if (nestedItem) {
                    // Return both the parent submenu and the nested item
                    return { parent: subItem, item: nestedItem }
                }
            }
        }

        return null
    }

    // Set initial active items based on URL params
    useEffect(() => {
        if (params.mainItem) {
            const mainItem = findMenuItem(params.mainItem)
            setActiveItem(mainItem)

            if (params.subItem && mainItem) {
                const subItemResult = findSubMenuItem(mainItem, params.subItem)

                if (subItemResult) {
                    // If it's a nested item
                    if (subItemResult.parent && subItemResult.item) {
                        setActiveSubItem(subItemResult.parent)
                        setActiveNestedItem(subItemResult.item)
                    } else {
                        // If it's a direct child
                        setActiveSubItem(subItemResult)
                        setActiveNestedItem(null)
                    }
                }
            }
        } else {
            // Default to Resource Hub if no params
            setActiveItem(findMenuItem("resource-hub"))
        }
    }, [params.mainItem, params.subItem])

    const handleItemClick = (itemId: string) => {
        const item = findMenuItem(itemId)
        setActiveItem(item)
        setActiveSubItem(null)
        setActiveNestedItem(null)

        // Navigate to the main item URL
        navigate(`/portal/${itemId}`)
    }

    const handleSubItemClick = (subItemId: string) => {
        if (!activeItem) return

        const subItemResult = findSubMenuItem(activeItem, subItemId)

        if (subItemResult) {
            // If it's a nested item with parent and item properties
            if (subItemResult.parent && subItemResult.item) {
                setActiveSubItem(subItemResult.parent)
                setActiveNestedItem(subItemResult.item)
                // Navigate to the nested item URL
                navigate(`/portal/${activeItem.id}/${subItemResult.item.id}`)
            } else {
                // If it's a direct child
                setActiveSubItem(subItemResult)
                setActiveNestedItem(null)
                // Navigate to the submenu URL
                navigate(`/portal/${activeItem.id}/${subItemId}`)
            }
        }
    }

    return (
        <div className="flex min-h-screen">
            <NavigationMenu activeItem={activeItem?.id || null} onItemClick={handleItemClick} />
            <div className="flex-1 flex flex-col">
                <HeaderNavigation
                    activeItem={activeItem}
                    activeSubItem={activeSubItem}
                    activeNestedItem={activeNestedItem}
                    onSubItemClick={handleSubItemClick}
                />
                <main className="flex-1 p-6">
                    <h1 className="text-2xl font-semibold mb-4">
                        {activeNestedItem
                            ? activeNestedItem.title
                            : activeSubItem
                                ? activeSubItem.title
                                : activeItem
                                    ? activeItem.title
                                    : "Banking Portal Dashboard"}
                    </h1>
                    <p className="text-muted-foreground">
                        {activeItem
                            ? `You are viewing the ${
                                activeNestedItem ? activeNestedItem.title : activeSubItem ? activeSubItem.title : activeItem.title
                            } section.`
                            : "Welcome to your banking portal. Select an option from the navigation menu to get started."}
                    </p>
                </main>
            </div>
        </div>
    )
}

// Main App component with router
export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/portal" element={<Portal />} />
                <Route path="/portal/:mainItem" element={<Portal />} />
                <Route path="/portal/:mainItem/:subItem" element={<Portal />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    )
}

