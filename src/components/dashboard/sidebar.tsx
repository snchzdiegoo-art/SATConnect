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
                "relative flex flex-col border-r border-gray-200 dark:border-white/5 bg-white/80 dark:bg-[#050F1A]/80 backdrop-blur-2xl transition-all duration-300 z-40 shadow-xl dark:shadow-[4px_0_30px_0_#00000080]",
                isCollapsed ? "w-20" : "w-72"
            )}>

            {/* Toggle Button - Neon Accent */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={cn(
                    "absolute top-8 z-50 bg-teal-500 dark:bg-[#29FFC6] text-white dark:text-[#050F1A] rounded-full p-1.5 shadow-lg dark:shadow-[0_0_15px_#29FFC666] hover:scale-110 transition-all duration-300",
                    isCollapsed ? "left-1/2 -translate-x-1/2 top-24 mt-2" : "right-4"
                )}
            >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>

            {/* Logo Area */}
            <div className={cn("flex flex-col items-center justify-center border-b border-gray-200 dark:border-white/5 overflow-hidden transition-all duration-300",
                isCollapsed ? "h-24" : "h-40"
            )}>
                {isCollapsed ? (
                    <img src="/sidebar-logo-open.png" alt="SAT Logo" className="h-10 w-10 drop-shadow-[0_0_10px_#29FFC680]" />
                ) : (
                    <Link href="/dashboard" className="flex flex-col items-center justify-center w-full h-full p-6 group">
                        <img
                            src="/logo_final.svg"
                            alt="SAT Connect"
                            className="h-20 w-auto drop-shadow-[0_0_15px_#29FFC64D] transition-all duration-500 hover:scale-105"
                        />
                    </Link>
                )}
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
                                    ? "bg-teal-50 dark:bg-[#29FFC6]/10 text-teal-600 dark:text-[#29FFC6] border border-teal-200 dark:border-[#29FFC6]/20 shadow-sm dark:shadow-[0_0_15px_#29FFC61A]"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5",
                                isCollapsed && "justify-center px-2"
                            )}
                            title={isCollapsed ? item.title : undefined}
                        >
                            <item.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110", pathname === item.href && "drop-shadow-[0_0_5px_#29FFC6CC]")} />
                            {!isCollapsed && <span className="whitespace-nowrap font-display tracking-wide">{item.title}</span>}
                            {pathname === item.href && !isCollapsed && (
                                <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-[#29FFC6] shadow-[0_0_8px_theme(colors.teal.500)] dark:shadow-[0_0_8px_#29FFC6]"></span>
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
                            className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#0B2E3C] border-2 border-teal-500 dark:border-[#29FFC6] shadow-sm dark:shadow-[0_0_10px_#29FFC64D]"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-teal-500 dark:bg-[#29FFC6] border-2 border-white dark:border-[#050F1A] rounded-full shadow-sm dark:shadow-[0_0_5px_#29FFC6]"></span>
                    </div>

                    {!isCollapsed && (
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-gray-900 dark:text-white font-display tracking-wide truncate">Diego Sánchez</span>
                            <span className="text-xs text-teal-600 dark:text-[#29FFC6] font-medium tracking-wider uppercase truncate">Mission Cmdr</span>
                        </div>
                    )}
                </div>

                {/* System Controls */}
                <div className={cn("flex items-center gap-2", isCollapsed ? "flex-col" : "justify-between w-full px-2")}>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative text-gray-400 hover:text-teal-600 dark:hover:text-[#29FFC6] transition-colors hover:bg-gray-100 dark:hover:bg-white/5"
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
                    {isCollapsed && <LogOut className="h-5 w-5 text-red-400 hover:text-red-300 cursor-pointer hover:scale-110 transition-transform" />}
                </div>
            </div>
        </div>
    )
}
