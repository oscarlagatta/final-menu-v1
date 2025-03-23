import {useState} from "react";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Bell, ChevronDown, HelpCircle, Menu, Search, Settings} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

interface HeaderNavigationProps {
    activeItem: any | null;
    activeSubItem: any | null;
    onSubItemClick: (item: any) => void;
}

export function Header({
    activeItem,
    activeSubItem,
    onSubItemClick,
                       }: HeaderNavigationProps) {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    if (!activeItem) {
        return null;
    }

    const breadcrumbs = [
        { id: 'home', title: 'Home', href: '/'},
        { id: activeItem.id, title: activeItem.title, href: `#${activeItem.id}`}
    ]

    if (activeSubItem) {
        breadcrumbs.push({
            id: activeSubItem.id,
            title: activeSubItem.title,
            href: `${activeItem.id}/${activeSubItem.id}`
        })
    }

    return (
        <header className='bg-background sticky top-0 z-10 h-[65px] border-b bg-white shadow-xl'>
            <div className='flex flex-wrap items-center gap02 px-4 py-2 sm:px-6'>
                <SidebarTrigger className='mr-2 md:hidden'>
                    <Menu className='h-6 w-6' />
                </SidebarTrigger>

                <h1 className="resource-hub-title mr-auto text-sm font-semibold">
                    {/*{activeItem && `${activeItem.title}`}*/}
                </h1>
                {/*Horizontal menu for submenus*/}
                {activeItem.subItems && (
                    <div>
                        {activeItem.subItems.map((subItem: any) => {
                            // if this submenu has its own subitems, render as dropdown
                            if (subItem.subItems) {
                                return (
                                    <DropdownMenu
                                        key={subItem.id}
                                        open={openDropdown === subItem.id}
                                        onOpenChange={(open) =>
                                            setOpenDropdown(open ? subItem.id : null)
                                        }>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant={
                                                activeSubItem?.id === subItem.id ? 'default': 'ghost'
                                                }
                                                size='sm'
                                                className={cn(
                                                    'flex items-center gap-1 transition duration-200',
                                                    activeSubItem?.id === subItem.id
                                                        ? 'bg-blue-900 text-white'
                                                        : 'text-gray-700 hover:text-gray-900'
                                                )}>
                                                {subItem.icon && (
                                                    <span className='mr-1 transition-transform duration-200 ease-in-out group-hover:scale-110'>
                                                        {subItem.icon}
                                                    </span>
                                                )}
                                                {subItem.title}
                                                <ChevronDown className='h-4 w-4 tarnsition-transform duration-200 ease-in-out group-hover:rotate-180' />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align='start'
                                            className='animate-in fade-in-50 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'>
                                            {subItem.subItems.map((nestedItem: any) => (
                                                <DropdownMenuItem
                                                    key={nestedItem.id}
                                                    onClick={() => {
                                                        onSubItemClick(nestedItem.id)
                                                        setOpenDropdown(null)
                                                    }}
                                                    className='transition-colors text-gray-700 duration-150 hover:text-gray-900'>
                                                    {nestedItem.icon && (
                                                        <span className='group-hover:scale-110 mr-2 transition-transform duration-200 ease-in-out'>
                                                            {nestedItem.icon}
                                                        </span>
                                                    )}
                                                    {nestedItem.title}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                );
                            }

                            // Otherwise render as a simple button
                            return (
                                <Button
                                    key={subItem.id}
                                    variant={
                                    activeSubItem?.id === subItem.id ? 'default': 'ghost'
                                    }
                                    size='sm'
                                    onClick={() => onSubItemClick(subItem.id)}
                                    className={cn(
                                        'group flex items-center gap-1 transition-all duration-200',
                                        activeSubItem?.id === subItem.id
                                            ? 'bg-blue-900 text-white'
                                            : 'text-gray-700 hover:text-gray-900'
                                    )}>
                                    {subItem.icon && (
                                        <span className='gtransition-transform duration-200 ease-in-out group-hover:scale-100'>
                                            {subItem.icon}
                                        </span>
                                    )}
                                    <span className='transition-transform duration-200 ease-in-out group-hover:translate-x-0.5'>
                                        {subItem.title}
                                    </span>
                                </Button>
                                );
                        })}
                    </div>
                )}
                <div className="search-resources relative max-w-xl flex-grow">
                    <Input placeholder='Search resources...' className='w-full pl-10'/>
                    <Search className='text-muted-foreground absolute top-1/2 w-4 h-4 -translate-y-1/2 transform ' />
                </div>
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant='outline' size='icon'>
                                <Bell className='h-4 w-4' />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Notifications</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant='outline'
                                size='icon'
                            className='help-button hidden sm:flex'>
                                <HelpCircle className='h-4 w-4' />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Help Center</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant='outline'
                                size='icon'
                                className='hidden sm:flex'>
                                <Settings className='h-4 w-4' />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Settings</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant='outline'
                                size='icon'
                                className='hidden sm:flex'>
                                {/*<UserNav />*/}
                            </Button>
                        </TooltipTrigger>
                    </Tooltip>
                </div>
            </div>
        </header>
    )
}