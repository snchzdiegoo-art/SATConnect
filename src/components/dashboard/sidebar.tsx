"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    ChevronLeft,
    ChevronRight,
    Bell,
    LogOut,
    LayoutDashboard,
    CalendarDays,
    Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Thrive Engine", href: "/thrive", icon: Activity },
    { title: "Reservations", href: "/dashboard/inventory", icon: CalendarDays },
]

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const pathname = usePathname()

    return (
        <div
            data-id="sidebar"
            className={cn(
                "relative flex flex-col glass-sidebar transition-all duration-300 z-40 shadow-xl dark:shadow-[4px_0_30px_0_#00000080]",
                isCollapsed ? "w-20" : "w-72"
            )}>

            {/* Toggle Button - Neon Accent */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={cn(
                    "absolute z-50 bg-teal-500 dark:bg-brand-primary text-white dark:text-brand-dark rounded-full p-1.5 shadow-lg dark:shadow-[0_0_15px_rgba(41,255,198,0.4)] hover:scale-110 transition-all duration-300",
                    isCollapsed ? "left-1/2 -translate-x-1/2 top-[72px]" : "top-8 right-4"
                )}
            >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>

            {/* Logo Area */}
            <div className={cn("flex flex-col items-center justify-center border-b border-gray-200 dark:border-white/5 overflow-hidden transition-all duration-300 relative",
                isCollapsed ? "h-24" : "h-40"
            )}>
                <Link href="/" className="flex flex-col items-center justify-center w-full h-full p-6 group">
                    {isCollapsed ? (
                        <img src="/sidebar-logo-open.png" alt="SAT Logo" className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(41,255,198,0.5)] mb-2" />
                    ) : (
                        <img
                            src="/logo_final.svg"
                            alt="SAT Connect"
                            className="h-20 w-auto drop-shadow-[0_0_15px_rgba(41,255,198,0.3)] transition-all duration-500 hover:scale-105"
                        />
                    )}
                </Link>
            </div>

            {/* Nav Items - Neon Active States */}
            <div className="flex-1 overflow-y-auto py-6 px-3 scrollbar-none">
                <nav className="grid gap-2">
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                                pathname === item.href
                                    ? "bg-teal-50 dark:bg-brand-primary/10 text-teal-600 dark:text-brand-primary border border-teal-200 dark:border-brand-primary/20 shadow-sm dark:shadow-[0_0_15px_rgba(41,255,198,0.1)]"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5",
                                isCollapsed && "justify-center px-2"
                            )}
                            title={isCollapsed ? item.title : undefined}
                        >
                            <item.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110", pathname === item.href && "drop-shadow-[0_0_5px_rgba(41,255,198,0.8)]")} />
                            {!isCollapsed && <span className="whitespace-nowrap font-display tracking-wide">{item.title}</span>}
                            {pathname === item.href && !isCollapsed && (
                                <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-brand-primary shadow-[0_0_8px_theme(colors.teal.500)] dark:shadow-[0_0_8px_rgba(41,255,198,1)]"></span>
                            )}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Footer / User Ecosystem - Glass Card */}
            <div className="p-4 pb-8 space-y-4">
                <div className={cn(
                    "flex items-center gap-3 w-full transition-all duration-300 backdrop-blur-md border border-gray-200 dark:border-white/10",
                    !isCollapsed ? "bg-white/50 dark:bg-white/5 p-4 rounded-2xl" : "justify-center bg-transparent border-none"
                )}>
                    <div className="relative shrink-0">
                        <img
                            src="https://api.dicebear.com/9.x/avataaars/svg?seed=Diego"
                            alt="User"
                            className="w-10 h-10 rounded-full bg-gray-200 dark:bg-brand-teal border-2 border-teal-500 dark:border-brand-primary shadow-sm dark:shadow-[0_0_10px_rgba(41,255,198,0.3)]"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-teal-500 dark:bg-brand-primary border-2 border-white dark:border-brand-dark rounded-full shadow-sm dark:shadow-[0_0_5px_rgba(41,255,198,1)]"></span>
                    </div>

                    {!isCollapsed && (
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-gray-900 dark:text-white font-display tracking-wide truncate">Diego Sánchez</span>
                            <span className="text-xs text-teal-600 dark:text-brand-primary font-medium tracking-wider uppercase truncate">Mission Cmdr</span>
                        </div>
                    )}
                </div>

                {/* System Controls */}
                <div className={cn("flex items-center gap-2", isCollapsed ? "flex-col gap-4 justify-center w-full" : "justify-between w-full px-2")}>
                    <div className={cn("flex items-center gap-2", isCollapsed && "flex-col gap-4")}>
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative text-gray-400 hover:text-teal-600 dark:hover:text-brand-primary transition-colors hover:bg-gray-100 dark:hover:bg-white/5"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#EF4444CC] animate-pulse"></span>
                        </Button>
                    </div>

                    {!isCollapsed && (
                        <Button
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs font-medium uppercase tracking-widest px-2"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Log Out
                        </Button>
                    )}
                    {isCollapsed && (
                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:scale-110 transition-transform">
                            <LogOut className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
