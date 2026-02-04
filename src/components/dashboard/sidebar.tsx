"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Package,
    CalendarDays,
    CreditCard,
    Settings,
    Users,
    LogOut,
    Store // For Marketplace link
} from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Inicio", href: "/dashboard" },
    { icon: Package, label: "Inventario", href: "/dashboard/inventory" },
    { icon: CalendarDays, label: "Reservas", href: "/dashboard/bookings" },
    { icon: CreditCard, label: "Finanzas", href: "/dashboard/finance" },
    { icon: Users, label: "Clientes", href: "/dashboard/customers" },
    // { icon: Store, label: "Marketplace B2B", href: "/dashboard/marketplace" }, // Future
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 bg-gray-950 border-r border-gray-800 flex flex-col z-50">
            {/* Brand */}
            <div className="h-16 flex items-center px-6 border-b border-gray-800 shrink-0">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="bg-teal-500/10 p-1.5 rounded-lg border border-teal-500/20">
                        <img src="/Logo-SATConnect-v3.svg" alt="SAT Logo" className="h-6 w-auto" />
                    </div>
                    <span className="font-bold text-white text-lg tracking-tight">SAT <span className="text-teal-400">Connect</span></span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2 mt-4">
                    Operativa
                </div>
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-[0_0_15px_-5px_rgba(20,184,166,0.3)]"
                                    : "text-gray-400 hover:text-white hover:bg-white/5 active:scale-95"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-teal-400" : "text-gray-500 group-hover:text-gray-300")} />
                            {item.label}
                        </Link>
                    )
                })}

                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2 mt-8">
                    Sistema
                </div>
                <Link
                    href="/dashboard/settings"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                        pathname === "/dashboard/settings"
                            ? "bg-teal-500/10 text-teal-400"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                >
                    <Settings className="h-5 w-5 text-gray-500 group-hover:text-gray-300" />
                    Configuración
                </Link>
            </nav>

            {/* User / Logout */}
            <div className="p-4 border-t border-gray-800">
                <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10">
                    <LogOut className="h-5 w-5 mr-3" />
                    Cerrar Sesión
                </Button>
            </div>
        </aside>
    )
}
