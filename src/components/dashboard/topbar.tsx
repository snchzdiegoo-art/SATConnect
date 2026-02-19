"use client"

import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Search, ChevronRight, Bell, LogOut, Moon, Sun } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SignOutButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

// ── Route → breadcrumb map ─────────────────────────────────────────────────
const BREADCRUMBS: Record<string, { label: string; parent?: string; parentHref?: string }> = {
    "/dashboard": { label: "Resumen" },
    "/thrive": { label: "Thrive Engine", parent: "Dashboard", parentHref: "/dashboard" },
    "/dashboard/inventory": { label: "Inventario", parent: "Dashboard", parentHref: "/dashboard" },
    "/dashboard/suppliers": { label: "Proveedores", parent: "Dashboard", parentHref: "/dashboard" },
    "/dashboard/channels": { label: "Canales OTA", parent: "Dashboard", parentHref: "/dashboard" },
    "/dashboard/mail": { label: "Correo", parent: "Dashboard", parentHref: "/dashboard" },
    "/dashboard/calendar": { label: "Calendario", parent: "Dashboard", parentHref: "/dashboard" },
}

// Pages where we show the full user card in the topbar
const SHOW_USER_CARD = ["/dashboard/mail", "/dashboard/calendar"]

function CompactThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    if (!mounted) return <div className="w-8 h-8" />
    return (
        <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Cambiar tema"
        >
            {resolvedTheme === "dark"
                ? <Sun className="h-4 w-4" />
                : <Moon className="h-4 w-4" />
            }
        </button>
    )
}

export function Topbar() {
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setMounted(true), [])

    if (!mounted) return <header className="h-14 border-b border-gray-200 dark:border-white/[0.06] bg-white/80 dark:bg-[#07101E]/80" />

    const crumb = BREADCRUMBS[pathname] ?? { label: "Dashboard" }
    const showUserCard = SHOW_USER_CARD.some(p => pathname.startsWith(p))

    return (
        <header className="h-14 glass-header sticky top-0 z-30 px-6 flex items-center justify-between gap-6 shadow-sm dark:shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm min-w-0">
                {crumb.parent && (
                    <>
                        <a
                            href={crumb.parentHref}
                            className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors truncate"
                        >
                            {crumb.parent}
                        </a>
                        <ChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600 shrink-0" />
                    </>
                )}
                <span className="font-semibold text-gray-900 dark:text-white truncate">
                    {crumb.label}
                </span>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3 shrink-0">
                {/* Global search — hidden on mail/cal to save space */}
                {!showUserCard && (
                    <div className="relative w-full max-w-xs hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Buscar… ⌘K"
                            className="pl-9 pr-4 h-8 text-sm bg-gray-100 dark:bg-white/[0.05] border-gray-200 dark:border-white/[0.07] placeholder:text-gray-400 focus-visible:ring-[#29FFC6]/40 focus-visible:border-[#29FFC6]/40 rounded-lg w-full"
                        />
                    </div>
                )}

                {/* ── User card (shown on mail + calendar) ── */}
                {showUserCard && (
                    <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                        {/* Compact controls */}
                        <CompactThemeToggle />

                        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title="Notificaciones">
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-[#07101E] rounded-full" />
                        </button>

                        {/* Divider */}
                        <div className="w-px h-6 bg-white/10 mx-1" />

                        {/* Avatar + name */}
                        <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                            <div className="relative shrink-0">
                                <img
                                    src="https://api.dicebear.com/9.x/avataaars/svg?seed=Diego"
                                    alt="Diego"
                                    className="w-7 h-7 rounded-full border-2 border-teal-400/60 object-cover"
                                />
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#07101E] rounded-full" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-xs font-semibold text-white">Diego Sánchez</span>
                                <span className="text-[10px] text-teal-400 font-semibold tracking-wide uppercase">Mission Cmdr</span>
                            </div>
                        </div>

                        {/* Sign out */}
                        <SignOutButton redirectUrl="/">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors" title="Salir">
                                <LogOut className="h-4 w-4" />
                            </button>
                        </SignOutButton>
                    </div>
                )}
            </div>
        </header>
    )
}
