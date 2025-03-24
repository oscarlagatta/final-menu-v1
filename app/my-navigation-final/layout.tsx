"use client"
import { useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom"
import NavigationMenu from "@/components/navigation-menu"
import { Header } from "@/app/my-navigation/header"
import { BreadcrumbNavigation } from "@/app/my-navigation/breadcrumb-navigation"

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

export function Layout() {
    const [activeItem, setActiveItem] = useState<any | null>(null)
    const [activeSubItem, setActiveSubItem] = useState<any | null>(null)
    const [contentKey, setContentKey] = useState(0)

    const params = useParams()

    const navigate = useNavigate()

    const location = useLocation()
    const [pathName, setPathName] = useState<string | null>(null)

    useEffect(() => {
        if (location) {
            const tmp = location.pathname.slice(location.pathname.lastIndexOf("/"), location.pathname.length)
            setPathName(tmp)
        }
    }, [location])

    useEffect(() => {
        // Only set the initial active item if none is selected
        if (!activeItem) {
            setActiveItem(findMenu("portal"))
            navigate("/portal")
        }
    }, []) // Empty dependency array means this runs once on mount

    const findMenu = (id: string) => {
        return menuItems.find((item) => item.id === id) || null
    }

    const findSubMenuItems = (menuItem: any, id: string) => {
        if (!menuItem?.subItems) return null

        for (const subItem of menuItem.subItems) {
            if (subItem.id === id) return subItem

            // check nested subitems
            if (subItem.subItems) {
                const nestedItem = subItem.subItems.find((item: any) => item.id === id)
                if (nestedItem) return nestedItem
            }
        }

        return null
    }

    // Update the handleItemClick function to ensure proper navigation
    const handleItemClick = (itemId: string) => {
        const item = findMenu(itemId)

        // Set the active item and reset any sub-item
        setActiveItem(item)
        setActiveSubItem(null)

        setContentKey((prev) => prev + 1)

        // Navigate to the new route
        if (item) {
            navigate(`/${item.id}`)
        }
    }

    // Update the handleSubItemClick function to properly handle top menu selections
    const handleSubItemClick = (subItemId: string) => {
        if (!activeItem) return

        const subItem = findSubMenuItems(activeItem, subItemId)
        setActiveSubItem(subItem)
        setContentKey((prev) => prev + 1)

        // Navigate to the submenu route
        if (subItem) {
            navigate(`/${activeItem.id}/${subItem.id}`)
        }
    }

    // Update the useEffect that handles URL changes to properly reset the state
    useEffect(() => {
        if (location && location.pathname) {
            const path = location.pathname.split("/").filter(Boolean)

            if (path.length > 0) {
                const mainItemId = path[0]
                const mainItem = findMenu(mainItemId)

                if (mainItem) {
                    // Set the active item from the URL path
                    setActiveItem(mainItem)

                    // Always reset activeSubItem when the URL changes to a main item
                    setActiveSubItem(null)

                    // Only set subItem if there's a valid sub-item in the path
                    if (path.length > 1) {
                        const subItemId = path[1]
                        const subItem = findSubMenuItems(mainItem, subItemId)
                        if (subItem) {
                            setActiveSubItem(subItem)
                        }
                    }
                }
            }
        }
    }, [location])

    return (
        <div className="bg-background relative flex min-h-screen w-full">
            <NavigationMenu activeItem={activeItem.id || null} onItemClick={handleItemClick} />
            <div className="flex min-h-screen flex-1 flex-col">
                <Header activeItem={activeItem} activeSubItem={activeSubItem} onSubItemClick={handleSubItemClick} />
                <div className="flex flex-1 flex-col">
                    <BreadcrumbNavigation
                        activeItem={activeItem}
                        activeSubItem={activeSubItem}
                        onSubItemClick={handleSubItemClick}
                    />
                    <main className="flex-1 overflow-auto">
                        <div className="w-full p-6">
                            <div key={contentKey} className="animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                                <Outlet />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

