"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    Inbox,
    Calendar,
    Mail,
    ListTodo,
    Target,
    FileText,
    Plus,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
} from "lucide-react"

const WORKSPACE_NAV = [
    {
        category: "Focus",
        items: [
            { title: "Inbox", href: "/dashboard/workspace/inbox", icon: Inbox },
            { title: "Today", href: "/dashboard/workspace/today", icon: ListTodo },
        ],
    },
    {
        category: "Comms",
        items: [
            { title: "Mail", href: "/dashboard/workspace/mail", icon: Mail },
            { title: "Calendar", href: "/dashboard/workspace/calendar", icon: Calendar },
        ],
    },
    {
        category: "Strategy",
        items: [
            { title: "OKRs", href: "/dashboard/workspace/okrs", icon: Target },
            { title: "Docs", href: "/dashboard/workspace/docs", icon: FileText },
        ],
    },
]

export function WorkspaceSidebar() {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    return (
        <aside
            className={cn(
                "border-r border-white/5 bg-black/20 backdrop-blur-xl flex flex-col h-full transition-all duration-300 relative group/sidebar",
                isCollapsed ? "w-[70px]" : "w-[240px]"
            )}
        >
            {/* Collapse Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#0a0f1e] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all opacity-0 group-hover/sidebar:opacity-100 z-50 shadow-xl"
            >
                {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>

            {/* Header / Branding */}
            <div className={cn(
                "h-14 flex items-center border-b border-white/5",
                isCollapsed ? "justify-center px-0" : "px-4"
            )}>
                {!isCollapsed ? (
                    <span className="font-syne font-bold text-sm tracking-wide text-white/80">
                        WORKSPACE
                    </span>
                ) : (
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center border border-teal-500/20">
                        <span className="text-teal-400 font-bold text-xs">W</span>
                    </div>
                )}
            </div>

            {/* Back to Dashboard Button */}
            <div className={cn("p-2 border-b border-white/5", isCollapsed && "flex justify-center")}>
                <Link
                    href="/dashboard"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all",
                        isCollapsed && "justify-center px-2"
                    )}
                    title="Regresar al Menú"
                >
                    <LayoutDashboard className="w-4 h-4 text-teal-500" />
                    {!isCollapsed && <span>Regresar al Menú</span>}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
                {WORKSPACE_NAV.map((section) => (
                    <div key={section.category}>
                        {!isCollapsed && (
                            <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">
                                {section.category}
                            </h3>
                        )}
                        <div className="space-y-0.5">
                            {section.items.map((item) => {
                                const isActive = pathname.startsWith(item.href)
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group",
                                            isActive
                                                ? "bg-teal-500/10 text-teal-400 font-medium"
                                                : "text-gray-400 hover:text-white hover:bg-white/5",
                                            isCollapsed && "justify-center px-2"
                                        )}
                                        title={item.title}
                                    >
                                        <item.icon className={cn(
                                            "w-4 h-4 transition-colors shrink-0",
                                            isActive ? "text-teal-400" : "text-gray-500 group-hover:text-gray-300"
                                        )} />
                                        {!isCollapsed && <span>{item.title}</span>}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}

                {/* Projects Section */}
                {!isCollapsed && (
                    <div>
                        <div className="flex items-center justify-between px-3 mb-2">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                                Projects
                            </h3>
                            <button className="text-white/30 hover:text-white transition-colors">
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="px-3 py-2 text-xs text-gray-500 italic">
                            No active projects
                        </div>
                    </div>
                )}
            </nav>
        </aside>
    )
}
