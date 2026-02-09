"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Package,
    CalendarDays,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Sidebar() {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)

    const navItems = [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "T.H.R.I.V.E. Engine",
            href: "/thrive",
            icon: Settings,
        },
        {
            title: "Reservas",
            href: "/dashboard/bookings",
            icon: CalendarDays,
        },
        {
            title: "Configuración",
            href: "/dashboard/settings",
            icon: Settings,
        },
    ]

    return (
        <div className={cn(
            "relative flex flex-col border-r border-gray-800 bg-gray-900/50 backdrop-blur-xl transition-all duration-300 z-[100]",
            isCollapsed ? "w-16" : "w-64"
        )}>

            {/* Toggle Button - Explicitly positioned */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-6 z-50 bg-teal-600 border border-teal-500 text-white rounded-full p-1 shadow-lg hover:bg-teal-500 transition-colors"
            >
                {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </button>

            {/* Logo Area */}
            <div className={cn("flex flex-col items-center justify-center border-b border-gray-800 overflow-hidden transition-all duration-300",
                isCollapsed ? "h-20" : "h-40"
            )}>
                {isCollapsed ? (
                    <img src="/sidebar-logo-open.png" alt="SAT Logo" className="h-8 w-8 transition-all duration-300 hover:scale-110" />
                ) : (
                    <Link href="/dashboard" className="flex flex-col items-center justify-center w-full h-full p-4 group">
                        <img
                            src="/logo_final.svg"
                            alt="SAT Connect"
                            className="h-16 w-16 drop-shadow-[0_0_10px_rgba(45,212,191,0.2)] transition-all duration-500 hover:scale-110"
                        />
                    </Link>
                )}
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
                <nav className="grid gap-1 px-2">
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-800 hover:text-white group",
                                pathname === item.href
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400",
                                isCollapsed && "justify-center"
                            )}
                            title={isCollapsed ? item.title : undefined}
                        >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {!isCollapsed && <span className="whitespace-nowrap">{item.title}</span>}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Footer / User */}
            <div className={cn("border-t border-gray-800 p-4", isCollapsed && "flex justify-center p-2")}>
                <Button variant="ghost" className={cn("w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/10", isCollapsed && "justify-center px-0")}>
                    <LogOut className="h-4 w-4 shrink-0 mr-2" />
                    {!isCollapsed && "Cerrar Sesión"}
                </Button>
            </div>
        </div>
    )
}
