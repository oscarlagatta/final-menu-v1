"use client"

import type React from "react"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, PanelLeftClose, PanelLeftOpen } from "lucide-react"

const menuItems = [
    {
        id: "resource-hub",
        title: "Resource Hub",
        icon: <BookOpen className="h-4 w-4" />,
        href: "portal",
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

interface NavItemProps {
    id: string
    title: string
    icon: React.ReactNode
    href?: string
    isActive?: boolean
    onClick?: () => void
    isCollapsed?: boolean
}

const NavItem = ({ id, title, icon, href, isActive = false, onClick, isCollapsed = false }: NavItemProps) => {
    if (isCollapsed) {
        return (
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(`mx-2`, isActive && "bg-blue-700 text-white")}
                            onClick={onClick}
                        >
                            {icon}
                            {href ? <Link to={href}>{title}</Link> : <span>{title}</span>}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{title}</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return (
        <>
            {href ? (
                <Link to={href} className={cn(`mx-2`, isActive && "bg-blue-700 text-white")}>
                    {icon}
                    {title}
                </Link>
            ) : (
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(`mx-2`, isActive && "bg-blue-700 text-white")}
                    onClick={onClick}
                >
                    {icon}
                    {title}
                </Button>
            )}
        </>
    )
}

export default function NavigationMenu({
                                           activeItem,
                                           onItemClick,
                                       }: {
    activeItem: string | null
    onItemClick: (id: string) => void
}) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    const toggleCollapsed = () => {
        setIsCollapsed((prev) => !prev)
    }

    const renderNavContent = () => (
        <ScrollArea>
            <div>
                {!isCollapsed && (
                    <div>
                        <h3>Platform</h3>
                    </div>
                )}
            </div>
            {menuItems.map((item) => (
                <NavItem
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    icon={item.icon}
                    isActive={activeItem === item.id}
                    onClick={() => onItemClick(item.id)}
                    isCollapsed={isCollapsed}
                    href={item.href}
                />
            ))}
        </ScrollArea>
    )

    return (
        <>
            <div style={{ width: isCollapsed ? "64px" : "256px" }}>
                <div className={cn(isCollapsed ? "justify-center" : "justify-between px-6")}>
                    {isCollapsed ? (
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={toggleCollapsed}>
                                        <PanelLeftOpen className="h-4 w-4" />
                                        <span>Expand sidebar</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">Expand sidebar</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <Button variant="ghost" size="icon" onClick={toggleCollapsed}>
                            <PanelLeftClose className="h-4 w-4" />
                            <span>Collapse sidebar</span>
                        </Button>
                    )}
                </div>
                <div className={cn(isCollapsed && "items-center")}>{renderNavContent()}</div>
            </div>
        </>
    )
}

