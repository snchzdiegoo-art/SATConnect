"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    BookOpen,
    Feather,
    Code2,
    Palette,
    CheckCircle2,
    AlertTriangle,
    AlignLeft,
    MonitorPlay,
    Terminal
} from "lucide-react"
import { cn } from "@/lib/utils"

const directives = {
    brand: [
        {
            title: "Voice & Tone",
            description: "Authoritative, visionary, yet accessible. We guide providers into the future of travel tech without overwhelming them with jargon.",
            type: "rule"
        },
        {
            title: "The T.H.R.I.V.E. Acronym",
            description: "Always written in full caps with periods when referring to the engine natively. (e.g. T.H.R.I.V.E. Diagnostic)",
            type: "strict"
        },
        {
            title: "B2Business Naming",
            description: "Refer to the platform as 'B2Bridge OS' for native operations and 'SAT Connect' for the broader ecosystem.",
            type: "rule"
        }
    ],
    design: [
        {
            title: "Technological Gallantry",
            description: "Primary theme uses Deep Teal (#2DD4BF) and Emerald accents on Dark backgrounds (#07101E to #0c1322) to signify premium, futuristic stability.",
            type: "rule"
        },
        {
            title: "Glassmorphism",
            description: "Panels should utilize white/[0.02] to white/[0.05] backgrounds with blur filters (backdrop-blur-xl) over solid grays.",
            type: "strict"
        },
        {
            title: "Micro-Animations",
            description: "Use Framer Motion for layout transitions. Hover states should subtly scale icons or brighten borders seamlessly.",
            type: "rule"
        }
    ],
    code: [
        {
            title: "Absolute Imports",
            description: "Always use the `@/` alias for importing internal modules to prevent relative path hell (e.g. `@/components/ui/button`).",
            type: "strict"
        },
        {
            title: "Server vs Client",
            description: "Push as much data fetching to Server Components (page.tsx) as possible, passing static props down to strictly interactive Client Components (-client.tsx).",
            type: "rule"
        },
        {
            title: "Tailwind Merge",
            description: "Use the `cn()` utility function strictly when merging dynamic Tailwind classes to prevent specific override bugs.",
            type: "strict"
        }
    ]
}

export function DirectivesClient() {
    const [activeSection, setActiveSection] = useState<'brand' | 'design' | 'code'>('brand')

    const sections = [
        { id: 'brand', label: 'Brand Voice', icon: Feather },
        { id: 'design', label: 'Design System', icon: Palette },
        { id: 'code', label: 'Development', icon: Code2 },
    ] as const

    const currentDirectives = directives[activeSection]

    return (
        <div className="flex flex-col min-h-screen bg-[#0c1322] text-gray-200">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-[#0c1322]/80 backdrop-blur-xl border-b border-white/[0.05] p-6 lg:px-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-emerald-400" />
                        Core Directives
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Foundational rules for corporate image, language, and development.</p>
                </div>
            </div>

            <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-10">
                {/* Navigation Sidebar */}
                <div className="md:w-64 shrink-0 flex flex-col gap-2">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 border",
                                activeSection === section.id
                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-medium"
                                    : "bg-transparent border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5"
                            )}
                        >
                            <section.icon className="w-4 h-4" />
                            {section.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 space-y-6"
                >
                    <div className="flex items-center gap-3 mb-8">
                        {activeSection === 'brand' && <AlignLeft className="w-8 h-8 text-white/20" />}
                        {activeSection === 'design' && <MonitorPlay className="w-8 h-8 text-white/20" />}
                        {activeSection === 'code' && <Terminal className="w-8 h-8 text-white/20" />}

                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            {sections.find(s => s.id === activeSection)?.label} Guidelines
                        </h2>
                    </div>

                    <div className="grid gap-4">
                        {currentDirectives.map((directive, idx) => (
                            <div key={idx} className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.04] transition-all">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-2">{directive.title}</h3>
                                        <p className="text-gray-400 leading-relaxed text-sm">
                                            {directive.description}
                                        </p>
                                    </div>
                                    <div className="shrink-0 mt-1">
                                        {directive.type === 'strict' ? (
                                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                                                <AlertTriangle className="w-3 h-3" /> Strict
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                                                <CheckCircle2 className="w-3 h-3" /> Standard
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
