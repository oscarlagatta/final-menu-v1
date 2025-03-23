import { ChevronRight } from "lucide-react"
import { NavLink } from "react-router"

interface BreadcrumbNavigationProps {
    activeItem: any | null
    activeSubItem: any | null
    onSubItemClick: (id: any) => void
}

// Replace the breadcrumb generation logic with this approach that follows the user's requirements
export function BreadcrumbNavigation({ activeItem, activeSubItem, onSubItemClick }: BreadcrumbNavigationProps) {
    if (!activeItem) {
        return (
            <div className="sticky top-0 z-10 items-center border-b bg-white px-6 shadow-lg h-[65px]">
                <h2 className="text-lg font-medium">Dashboard</h2>
            </div>
        )
    }

    // Generate breadcrumbs based on active items
    // Always start with Home
    const breadcrumbs = [{ id: "home", title: "Home", href: "/" }]

    // Always add the active main item from sidebar
    if (activeItem) {
        breadcrumbs.push({
            id: activeItem.id,
            title: activeItem.title,
            href: `/${activeItem.id}`,
        })

        // Add the sub-item only if it exists
        if (activeSubItem) {
            breadcrumbs.push({
                id: activeSubItem.id,
                title: activeSubItem.title,
                href: `/${activeItem.id}/${activeSubItem.id}`,
            })
        }
    }

    return (
        <div className="mt-4">
            {/*Custom breadcrumbs navigation to avoid nesting li elements  */}
            <div className="px-6 pt-4">
                <nav aria-label="Breadcrumb">
                    <div className="flex items-center gap-1 text-sm">
                        {breadcrumbs.map((crumb, index) => (
                            <div className="flex items-center" key={crumb.id}>
                                {index > 0 && <ChevronRight className="mx-1 h-3.5 w-3.5 text-gray-400" />}
                                {index < breadcrumbs.length - 1 ? (
                                    <NavLink to={crumb.href} className="text-gray-500 transition-colors duration-200 hover:text-gray-700">
                                        {crumb.title}
                                    </NavLink>
                                ) : (
                                    <span className="animate-in fade-in-50 slide-in-front-left-1 font-medium text-gray-900 duration-300">
                    {crumb.title}
                  </span>
                                )}
                            </div>
                        ))}
                    </div>
                </nav>
            </div>
        </div>
    )
}

