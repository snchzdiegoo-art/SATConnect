"use client"

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
    FolderOpen,
    Plus,
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

    return (
        <aside className="w-[240px] border-r border-white/5 bg-black/20 backdrop-blur-xl flex flex-col h-full">
            {/* Header */}
            <div className="h-14 flex items-center px-4 border-b border-white/5">
                <span className="font-syne font-bold text-sm tracking-wide text-white/80">
                    WORKSPACE
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
                {WORKSPACE_NAV.map((section) => (
                    <div key={section.category}>
                        <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">
                            {section.category}
                        </h3>
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
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "w-4 h-4 transition-colors",
                                            isActive ? "text-teal-400" : "text-gray-500 group-hover:text-gray-300"
                                        )} />
                                        {item.title}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}

                {/* Projects Section */}
                <div>
                    <div className="flex items-center justify-between px-3 mb-2">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                            Projects
                        </h3>
                        <button className="text-white/30 hover:text-white transition-colors">
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>
                    {/* Placeholder for dynamic projects list */}
                    <div className="px-3 py-2 text-xs text-gray-500 italic">
                        No active projects
                    </div>
                </div>
            </nav>
        </aside>
    )
}
