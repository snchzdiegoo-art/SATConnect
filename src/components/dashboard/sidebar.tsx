"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SignOutButton } from "@clerk/nextjs"
import {
    ChevronLeft,
    ChevronRight,
    Bell,
    LogOut,
    LayoutDashboard,
    Activity,
    Building2,
    Share2,
    Mail,
    Calendar,
    LayoutPanelLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Workspace", href: "/dashboard/workspace", icon: LayoutPanelLeft },
    { title: "Thrive Engine", href: "/thrive", icon: Activity },
    { title: "Proveedores", href: "/dashboard/suppliers", icon: Building2 },
    { title: "Canales OTA", href: "/dashboard/channels", icon: Share2 },
]

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const pathname = usePathname()
    const { user } = useUser()

    const displayName = user ? [user.firstName, user.lastName].filter(Boolean).join(" ") : "Usuario"
    const avatarUrl = user?.imageUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=user`
    const roleRaw = (user?.publicMetadata?.role as string) ?? ""
    const roleLabel = roleRaw === "admin" ? "Admin" : "Super Admin"

    return (
        <div
            data-id="sidebar"
            className={cn(
                "relative flex flex-col glass-sidebar transition-all duration-300 z-40",
                "shadow-[4px_0_24px_0_rgba(0,0,0,0.15)] dark:shadow-[4px_0_30px_0_rgba(0,0,0,0.5)]",
                isCollapsed ? "w-[72px]" : "w-[280px]"
            )}
        >
            {/* ── Toggle Button ────────────────────────────────── */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={cn(
                    "absolute z-50 flex items-center justify-center",
                    "w-6 h-6 rounded-full",
                    "bg-[#29FFC6] text-[#07101E]",
                    "shadow-[0_0_12px_rgba(41,255,198,0.5)]",
                    "hover:shadow-[0_0_20px_rgba(41,255,198,0.8)] hover:scale-110",
                    "transition-all duration-200",
                    isCollapsed
                        ? "left-1/2 -translate-x-1/2 top-[76px]"
                        : "top-8 -right-3"
                )}
            >
                {isCollapsed
                    ? <ChevronRight className="h-3.5 w-3.5" />
                    : <ChevronLeft className="h-3.5 w-3.5" />
                }
            </button>

            {/* ── Logo Area ────────────────────────────────────── */}
            <div className={cn(
                "flex flex-col items-center justify-center",
                "border-b border-gray-200 dark:border-white/[0.06]",
                "overflow-hidden transition-all duration-300",
                isCollapsed ? "h-[72px] px-2" : "h-[140px] px-6"
            )}>
                <Link href="/" className="flex flex-col items-center justify-center w-full h-full group">
                    {isCollapsed ? (
                        <img
                            src="/sidebar-logo-open.png"
                            alt="SAT"
                            className="h-9 w-auto object-contain glow-teal-sm group-hover:glow-teal transition-all duration-300"
                        />
                    ) : (
                        <img
                            src="/logo_final.svg"
                            alt="SAT Connect"
                            className={cn(
                                "h-[72px] w-auto object-contain",
                                "drop-shadow-[0_0_18px_rgba(41,255,198,0.25)]",
                                "group-hover:drop-shadow-[0_0_28px_rgba(41,255,198,0.45)]",
                                "transition-all duration-500",
                                "group-hover:scale-[1.03]"
                            )}
                        />
                    )}
                </Link>
            </div>

            {/* ── Nav Items ────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto py-5 px-3 scrollbar-none">
                <nav className="flex flex-col gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== "/dashboard" && pathname.startsWith(item.href))

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative flex items-center gap-3.5 rounded-xl text-sm font-medium",
                                    "transition-all duration-200 group overflow-hidden",
                                    isCollapsed ? "px-0 py-3 justify-center" : "px-4 py-3",
                                    isActive
                                        ? [
                                            "bg-teal-50 dark:bg-[#29FFC6]/[0.08]",
                                            "text-teal-700 dark:text-[#29FFC6]",
                                            "border border-teal-200/80 dark:border-[#29FFC6]/20",
                                            "shadow-sm dark:shadow-[0_0_12px_rgba(41,255,198,0.08)]",
                                        ]
                                        : [
                                            "text-gray-500 dark:text-gray-400",
                                            "hover:text-gray-900 dark:hover:text-white",
                                            "hover:bg-gray-100 dark:hover:bg-white/[0.05]",
                                            "border border-transparent",
                                        ]
                                )}
                                title={isCollapsed ? item.title : undefined}
                            >
                                {/* Active left border indicator */}
                                {isActive && !isCollapsed && (
                                    <span className="nav-active-indicator" />
                                )}

                                <item.icon className={cn(
                                    "shrink-0 transition-all duration-300",
                                    isCollapsed ? "h-5 w-5" : "h-[18px] w-[18px]",
                                    isActive
                                        ? "text-teal-600 dark:text-[#29FFC6] glow-teal-sm"
                                        : "group-hover:scale-110"
                                )} />

                                {!isCollapsed && (
                                    <span className="font-sans tracking-wide truncate">
                                        {item.title}
                                    </span>
                                )}

                                {/* Active pulsing dot */}
                                {isActive && !isCollapsed && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#29FFC6] animate-pulse-glow" />
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* ── Footer / User Card ───────────────────────────── */}
            <div className="p-3 pb-6 space-y-3">
                {/* User profile — click to open Users panel */}
                <Link
                    href="/dashboard/users"
                    className={cn(
                        "flex items-center gap-3 transition-all duration-300 group",
                        "backdrop-blur-md border border-gray-200 dark:border-white/[0.07]",
                        "hover:border-teal-500/30 hover:bg-[#29FFC6]/[0.04]",
                        !isCollapsed
                            ? "bg-gray-50 dark:bg-white/[0.04] p-3.5 rounded-xl"
                            : "justify-center bg-transparent border-none"
                    )}
                    title="Gestión de Usuarios"
                >
                    <div className="relative shrink-0">
                        <img
                            src={avatarUrl}
                            alt={displayName}
                            className={cn(
                                "rounded-full object-cover",
                                "border-2 border-teal-400 dark:border-[#29FFC6]/60",
                                "shadow-sm dark:shadow-[0_0_10px_rgba(41,255,198,0.2)]",
                                "transition-all duration-300",
                                "group-hover:border-[#29FFC6] group-hover:shadow-[0_0_14px_rgba(41,255,198,0.4)]",
                                isCollapsed ? "w-9 h-9" : "w-10 h-10"
                            )}
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white dark:border-[#07101E] rounded-full shadow-sm animate-pulse-glow" />
                    </div>

                    {!isCollapsed && (
                        <div className="flex flex-col overflow-hidden min-w-0">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-tight group-hover:text-teal-300 transition-colors">
                                {displayName}
                            </span>
                            <span className="text-[10px] text-teal-600 dark:text-[#29FFC6] font-semibold tracking-[0.12em] uppercase truncate mt-0.5">
                                {roleLabel}
                            </span>
                        </div>
                    )}
                </Link>

                {/* System Controls */}
                <div className={cn(
                    "flex items-center gap-2",
                    isCollapsed ? "flex-col gap-3 justify-center w-full" : "justify-between w-full px-1"
                )}>
                    <div className={cn("flex items-center gap-2", isCollapsed && "flex-col gap-3")}>
                        <ThemeToggle />
                        <button
                            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                            title="Notificaciones"
                        >
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-1 right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-[#07101E]" />
                            </span>
                        </button>
                    </div>

                    {!isCollapsed ? (
                        <div className="w-full">
                            <SignOutButton redirectUrl="/">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/[0.12] border border-red-500/20 text-xs font-medium uppercase tracking-widest px-2 h-8"
                                >
                                    <LogOut className="h-3.5 w-3.5 mr-1.5" />
                                    Salir
                                </Button>
                            </SignOutButton>
                        </div>
                    ) : (
                        <SignOutButton redirectUrl="/">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/[0.08] hover:scale-110 transition-transform"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </SignOutButton>
                    )}
                </div>
            </div>
        </div>
    )
}
