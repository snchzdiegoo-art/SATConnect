"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
    Palette, PenTool, Type, LayoutTemplate, Sparkles, Send, Bot, MessageSquare,
    Zap, Cpu, Fingerprint, LayoutDashboard, Server, MonitorSmartphone, Layers,
    Check, Loader2, SlidersHorizontal, Eye
} from "lucide-react"

export function UXClient() {
    const [activeTab, setActiveTab] = useState<'system' | 'preview'>('system')
    const [theme, setTheme] = useState<'gallantry' | 'motherboard'>('gallantry')

    const [aiQuery, setAiQuery] = useState("")
    const [isThinking, setIsThinking] = useState(false)
    const [conversation, setConversation] = useState<{ role: 'user' | 'assistant', text: string }[]>([
        { role: 'assistant', text: 'Welcome to the SAT Connect Design Studio. Accessing the NotebookLM Master Blueprint... Context loaded. How can I assist with the V2026 UI/UX today?' }
    ])

    const handleAISubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!aiQuery.trim() || isThinking) return

        const newQ = aiQuery
        setAiQuery("")
        setConversation(prev => [...prev, { role: 'user', text: newQ }])
        setIsThinking(true)

        // Simulate AI Thinking
        setTimeout(() => {
            setIsThinking(false)
            setConversation(prev => [...prev, {
                role: 'assistant',
                text: "Based on the SAT Connect Master Blueprint, any new components should utilize the 'Technological Gallantry' palette. Ensure deep background (#030712), with Teal (#2DD4BF) primary accents, and Emerald (#34D399) as a success state. Heavy use of glassmorphism (bg-black/40) and framer-motion is required."
            }])
        }, 2500)
    }

    const isMotherboard = theme === 'motherboard'

    return (
        <div className={cn(
            "flex flex-col h-full overflow-y-auto hide-scrollbar scroll-smooth transition-colors duration-500 relative min-h-screen",
            isMotherboard ? "bg-[#051008]" : "bg-[#030712]"
        )}>
            {/* Background pattern for motherboard theme */}
            {isMotherboard && (
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle at center, #22c55e 2px, transparent 2px)', backgroundSize: '32px 32px' }} />
            )}

            {/* Header */}
            <header className={cn(
                "flex-none px-8 py-6 border-b relative z-10 shrink-0 transition-colors duration-500",
                isMotherboard ? "border-[#22c55e]/20 bg-[#051008]/80 backdrop-blur-xl" : "border-white/[0.05] bg-[#030712]/80 backdrop-blur-xl"
            )}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={cn(
                                "w-10 h-10 rounded-xl border flex items-center justify-center transition-colors duration-500",
                                isMotherboard ? "bg-[#22c55e]/10 border-[#22c55e]/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]" : "bg-fuchsia-500/10 border-fuchsia-500/20"
                            )}>
                                <Palette className={cn("w-5 h-5", isMotherboard ? "text-[#22c55e]" : "text-fuchsia-400")} />
                            </div>
                            <h1 className={cn(
                                "text-2xl font-bold tracking-tight transition-colors duration-500",
                                isMotherboard ? "text-[#22c55e] font-mono uppercase" : "text-white"
                            )}>
                                UX / UI Design Studio
                            </h1>
                        </div>
                        <p className={cn(
                            "text-sm transition-colors duration-500",
                            isMotherboard ? "text-[#22c55e]/60 font-mono" : "text-gray-400"
                        )}>
                            Super Admin creative dashboard. Centralized command for aesthetics and AI enhancements.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <div className={cn(
                            "flex items-center p-1 rounded-lg border transition-colors duration-500",
                            isMotherboard ? "bg-[#08180d] border-[#22c55e]/30" : "bg-white/5 border-white/10"
                        )}>
                            <button
                                onClick={() => setTheme('gallantry')}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-xs font-bold transition-all",
                                    !isMotherboard ? "bg-white/10 text-white shadow-sm" : "text-[#22c55e]/40 hover:text-[#22c55e]/80"
                                )}
                            >
                                Tech Gallantry
                            </button>
                            <button
                                onClick={() => setTheme('motherboard')}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-xs font-bold transition-all font-mono tracking-wider",
                                    isMotherboard ? "bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]" : "text-gray-500 hover:text-gray-300"
                                )}
                            >
                                MOTHERBOARD
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="max-w-7xl mx-auto mt-6 flex gap-6">
                    <button
                        onClick={() => setActiveTab('system')}
                        className={cn(
                            "pb-3 text-sm font-medium transition-colors relative",
                            activeTab === 'system'
                                ? isMotherboard ? "text-[#22c55e]" : "text-fuchsia-400"
                                : isMotherboard ? "text-[#22c55e]/40 hover:text-[#22c55e]/80" : "text-gray-500 hover:text-gray-300"
                        )}
                    >
                        <span className="flex items-center gap-2 font-mono">
                            <Fingerprint className="w-4 h-4" />
                            Identity & Tools
                        </span>
                        {activeTab === 'system' && (
                            <motion.div layoutId="ux-tab" className={cn(
                                "absolute bottom-0 left-0 right-0 h-0.5",
                                isMotherboard ? "bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.8)]" : "bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.5)]"
                            )} />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={cn(
                            "pb-3 text-sm font-medium transition-colors relative",
                            activeTab === 'preview'
                                ? isMotherboard ? "text-[#22c55e]" : "text-fuchsia-400"
                                : isMotherboard ? "text-[#22c55e]/40 hover:text-[#22c55e]/80" : "text-gray-500 hover:text-gray-300"
                        )}
                    >
                        <span className="flex items-center gap-2 font-mono">
                            <MonitorSmartphone className="w-4 h-4" />
                            Live Site Preview
                        </span>
                        {activeTab === 'preview' && (
                            <motion.div layoutId="ux-tab" className={cn(
                                "absolute bottom-0 left-0 right-0 h-0.5",
                                isMotherboard ? "bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.8)]" : "bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.5)]"
                            )} />
                        )}
                    </button>
                </div>
            </header>

            <main className="flex-1 p-8 relative z-10 w-full max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={cn("h-full", isMotherboard ? "font-mono" : "")}
                    >
                        {activeTab === 'system' ? (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Left Column: Visual Identity & Stack */}
                                <div className="lg:col-span-4 space-y-8">
                                    <div className={cn(
                                        "border rounded-2xl p-6 transition-colors duration-500",
                                        isMotherboard ? "bg-[#08180d] border-[#22c55e]/30 shadow-[0_0_20px_rgba(34,197,94,0.05)]" : "bg-[#0c1322] border-white/[0.05]"
                                    )}>
                                        <h2 className={cn(
                                            "text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2 transition-colors",
                                            isMotherboard ? "text-[#22c55e]" : "text-white"
                                        )}>
                                            <Fingerprint className={cn("w-4 h-4", isMotherboard ? "text-[#22c55e]" : "text-fuchsia-400")} />
                                            Identity Values
                                        </h2>

                                        <div className="space-y-6">
                                            {/* Colors */}
                                            <div>
                                                <h3 className={cn("text-xs font-medium mb-3 transition-colors", isMotherboard ? "text-[#22c55e]/70" : "text-gray-400")}>
                                                    Core Palette
                                                </h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className={cn("group flex items-center gap-3 p-2 rounded-lg border transition-colors", isMotherboard ? "bg-[#22c55e]/5 border-[#22c55e]/20" : "bg-black/20 border-white/5")}>
                                                        <div className={cn("w-8 h-8 rounded-md border", isMotherboard ? "bg-[#030712] border-[#22c55e]/30" : "bg-[#030712] border-white/10")} />
                                                        <div>
                                                            <div className={cn("text-xs font-bold", isMotherboard ? "text-[#22c55e]" : "text-gray-200")}>Void</div>
                                                        </div>
                                                    </div>
                                                    <div className={cn("group flex items-center gap-3 p-2 rounded-lg border transition-colors", isMotherboard ? "bg-[#22c55e]/5 border-[#22c55e]/20" : "bg-black/20 border-white/5")}>
                                                        <div className={cn("w-8 h-8 rounded-md border shadow-[0_0_15px_rgba(45,212,191,0.3)]", isMotherboard ? "bg-[#22c55e] border-[#22c55e]/50" : "bg-[#2DD4BF] border-white/10")} />
                                                        <div>
                                                            <div className={cn("text-xs font-bold", isMotherboard ? "text-[#22c55e]" : "text-gray-200")}>{isMotherboard ? "Neon" : "Teal"}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Typography */}
                                            <div>
                                                <h3 className={cn("text-xs font-medium mb-3 flex items-center gap-2 transition-colors", isMotherboard ? "text-[#22c55e]/70" : "text-gray-400")}>
                                                    <Type className="w-3.5 h-3.5" /> Typography Scale
                                                </h3>
                                                <div className={cn("space-y-3 rounded-xl p-4 border transition-colors", isMotherboard ? "bg-[#22c55e]/5 border-[#22c55e]/20" : "bg-black/20 border-white/5")}>
                                                    <div className={cn("flex items-baseline justify-between border-b pb-2", isMotherboard ? "border-[#22c55e]/20" : "border-white/5")}>
                                                        <span className={cn("text-2xl font-bold tracking-tight", isMotherboard ? "text-[#22c55e]" : "text-white")}>Heading 1</span>
                                                    </div>
                                                    <div className={cn("flex items-baseline justify-between border-b pb-2", isMotherboard ? "border-[#22c55e]/20" : "border-white/5")}>
                                                        <span className={cn("text-lg font-semibold", isMotherboard ? "text-[#22c55e]/90" : "text-gray-200")}>Heading 2</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tech Stack */}
                                    <div className={cn(
                                        "border rounded-2xl p-6 transition-colors duration-500",
                                        isMotherboard ? "bg-[#08180d] border-[#22c55e]/30 shadow-[0_0_20px_rgba(34,197,94,0.05)]" : "bg-[#0c1322] border-white/[0.05]"
                                    )}>
                                        <h2 className={cn("text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2", isMotherboard ? "text-[#22c55e]" : "text-white")}>
                                            <Cpu className="w-4 h-4" /> UX Stack
                                        </h2>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className={cn("flex items-center gap-3 border rounded-lg px-3 py-2", isMotherboard ? "bg-[#22c55e]/10 border-[#22c55e]/20 text-[#22c55e]" : "bg-white/5 border-white/10 text-gray-300")}>
                                                <span className="text-xs font-bold">Tailwind CSS</span>
                                            </div>
                                            <div className={cn("flex items-center gap-3 border rounded-lg px-3 py-2", isMotherboard ? "bg-[#22c55e]/10 border-[#22c55e]/20 text-[#22c55e]" : "bg-white/5 border-white/10 text-gray-300")}>
                                                <span className="text-xs font-bold">Radix UI</span>
                                            </div>
                                            <div className={cn("flex items-center gap-3 border rounded-lg px-3 py-2 col-span-2", isMotherboard ? "bg-[#22c55e]/10 border-[#22c55e]/20 text-[#22c55e]" : "bg-white/5 border-white/10 text-gray-300")}>
                                                <Zap className={cn("w-4 h-4", isMotherboard ? "text-[#22c55e]" : "text-amber-400/80")} />
                                                <span className="text-xs font-bold">Framer Motion</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: AI NotebookLM Enhancer */}
                                <div className={cn(
                                    "lg:col-span-8 flex flex-col h-[700px] border rounded-2xl overflow-hidden relative shadow-2xl transition-colors duration-500",
                                    isMotherboard ? "bg-[#08180d] border-[#22c55e]/30 shadow-[0_0_40px_rgba(34,197,94,0.1)]" : "bg-[#0c1322] border-white/[0.05]"
                                )}>
                                    <div className={cn(
                                        "flex items-center justify-between px-6 py-4 border-b relative z-10 w-full transition-colors",
                                        isMotherboard ? "bg-[#0a2012] border-[#22c55e]/30" : "bg-black/40 border-white/5"
                                    )}>
                                        <div className="flex items-center gap-3">
                                            <Bot className={cn("w-5 h-5", isMotherboard ? "text-[#22c55e]" : "text-blue-400")} />
                                            <div>
                                                <h3 className={cn("text-sm font-bold flex items-center gap-2", isMotherboard ? "text-[#22c55e]" : "text-white")}>
                                                    NotebookLM Design Enhancer <Sparkles className={cn("w-3 h-3", isMotherboard ? "text-[#22c55e]" : "text-amber-400")} />
                                                </h3>
                                                <span className={cn("text-[10px] uppercase tracking-wider", isMotherboard ? "text-[#22c55e]/60" : "text-gray-500")}>SSOT Architecture Link: Attached</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <div className={cn("w-2.5 h-2.5 rounded-full border", isMotherboard ? "bg-[#22c55e]/20 border-[#22c55e]/50" : "bg-red-500/20 border-red-500/50")} />
                                            <div className={cn("w-2.5 h-2.5 rounded-full border", isMotherboard ? "bg-[#22c55e]/20 border-[#22c55e]/50" : "bg-amber-500/20 border-amber-500/50")} />
                                            <div className={cn("w-2.5 h-2.5 rounded-full border", isMotherboard ? "bg-[#22c55e] border-[#22c55e]" : "bg-emerald-500/20 border-emerald-500/50")} />
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col hide-scrollbar">
                                        <AnimatePresence>
                                            {conversation.map((msg, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}
                                                >
                                                    <div className={cn(
                                                        "max-w-[80%] rounded-2xl px-5 py-4",
                                                        msg.role === 'user'
                                                            ? isMotherboard ? "bg-[#22c55e]/20 border border-[#22c55e]/40 text-[#22c55e] rounded-br-sm" : "bg-teal-500/10 border border-teal-500/20 text-teal-50 rounded-br-sm"
                                                            : isMotherboard ? "bg-[#051008] border border-[#22c55e]/20 text-[#22c55e]/90 rounded-bl-sm" : "bg-white/5 border border-white/10 text-gray-300 rounded-bl-sm"
                                                    )}>
                                                        {msg.role === 'assistant' && (
                                                            <div className={cn("flex items-center gap-2 mb-2 opacity-70", isMotherboard ? "text-[#22c55e]" : "text-gray-400")}>
                                                                <LayoutTemplate className="w-3 h-3" />
                                                                <span className="text-[10px] font-bold uppercase tracking-wider">UI Specialist Agent</span>
                                                            </div>
                                                        )}
                                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                            {isThinking && (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start w-full">
                                                    <div className={cn("border rounded-2xl rounded-bl-sm px-5 py-4 flex flex-col gap-3 max-w-[80%]", isMotherboard ? "bg-[#051008] border-[#22c55e]/20" : "bg-white/5 border-white/10")}>
                                                        <span className={cn("text-[10px] font-mono", isMotherboard ? "text-[#22c55e]/60" : "text-gray-500")}>Querying NotebookLM SSOT logic...</span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className={cn("p-4 border-t relative z-10 w-full mt-auto", isMotherboard ? "bg-[#0a2012] border-[#22c55e]/30" : "bg-black/40 border-white/5")}>
                                        <form onSubmit={handleAISubmit} className="relative flex items-center">
                                            <MessageSquare className={cn("absolute left-4 w-4 h-4", isMotherboard ? "text-[#22c55e]/50" : "text-gray-500")} />
                                            <input
                                                type="text"
                                                value={aiQuery}
                                                onChange={e => setAiQuery(e.target.value)}
                                                placeholder="Ask the SSOT for UX recommendations..."
                                                className={cn(
                                                    "w-full border rounded-xl pl-12 pr-16 py-4 text-sm focus:outline-none focus:ring-1",
                                                    isMotherboard
                                                        ? "bg-[#051008] border-[#22c55e]/30 text-[#22c55e] placeholder:text-[#22c55e]/40 focus:ring-[#22c55e]/50"
                                                        : "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:ring-teal-500/50"
                                                )}
                                                disabled={isThinking}
                                            />
                                            <button
                                                type="submit"
                                                disabled={!aiQuery.trim() || isThinking}
                                                className={cn(
                                                    "absolute right-2 p-2.5 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50",
                                                    isMotherboard
                                                        ? "bg-[#22c55e] text-[#051008] shadow-[0_0_15px_rgba(34,197,94,0.4)] disabled:bg-[#22c55e]/20 disabled:text-[#22c55e]/50"
                                                        : "bg-teal-500 hover:bg-teal-400 disabled:bg-gray-700 disabled:text-gray-500 text-teal-950 shadow-lg shadow-teal-500/20"
                                                )}
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full flex justify-center items-center py-6 h-[800px]">
                                <MiniSiteReplica theme={theme} />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    )
}

function MiniSiteReplica({ theme }: { theme: 'gallantry' | 'motherboard' }) {
    const isMobo = theme === 'motherboard'

    return (
        <div className={cn(
            "w-full max-w-5xl h-full rounded-2xl overflow-hidden border shadow-2xl flex relative transition-all duration-700 transform scale-95",
            isMobo
                ? "border-[#22c55e]/50 bg-[#051008] shadow-[0_0_50px_rgba(34,197,94,0.15)] ring-1 ring-[#22c55e]/20"
                : "border-white/10 bg-[#0c1322] shadow-[0_0_40px_rgba(45,212,191,0.1)]"
        )}>
            {/* Background SVG Traces for motherboard */}
            {isMobo && (
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] overflow-hidden">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="circuit" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                                <path d="M 10,10 L 20,10 L 25,15 L 25,25" fill="none" stroke="#22c55e" strokeWidth="1" strokeLinejoin="round" />
                                <circle cx="10" cy="10" r="1.5" fill="#22c55e" />
                                <circle cx="25" cy="25" r="1.5" fill="#051008" stroke="#22c55e" strokeWidth="1" />

                                <path d="M 40,50 L 50,50 L 55,45 L 55,35" fill="none" stroke="#22c55e" strokeWidth="1" strokeLinejoin="round" />
                                <circle cx="40" cy="50" r="1.5" fill="#22c55e" />
                                <circle cx="55" cy="35" r="1.5" fill="#051008" stroke="#22c55e" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#circuit)" />
                    </svg>
                </div>
            )}

            {/* Simulated Sidebar */}
            <div className={cn(
                "w-56 shrink-0 border-r p-4 flex flex-col gap-2 relative z-10 transition-colors duration-500",
                isMobo ? "border-[#22c55e]/30 bg-[#08180d]/80 backdrop-blur-md" : "border-white/5 bg-[#030712]/50 backdrop-blur-xl"
            )}>
                <div className="flex items-center gap-3 mb-8 px-2 mt-2">
                    <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                        isMobo ? "bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40 shadow-[0_0_10px_rgba(34,197,94,0.3)]" : "bg-gradient-to-br from-teal-400 to-emerald-500 text-white"
                    )}>
                        <LayoutDashboard className="w-4 h-4" />
                    </div>
                    <span className={cn("font-bold tracking-wide", isMobo ? "text-[#22c55e] uppercase text-sm" : "text-white")}>
                        {isMobo ? "SYS.CORE" : "SAT Connect"}
                    </span>
                </div>

                {['Dashboard', 'Workspace', 'Integrations'].map((item, i) => (
                    <div key={item} className={cn(
                        "px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 cursor-pointer transition-all",
                        i === 0
                            ? isMobo ? "bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30" : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                            : isMobo ? "text-[#22c55e]/60 hover:text-[#22c55e] hover:bg-[#22c55e]/5" : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}>
                        <Server className={cn("w-4 h-4", isMobo && i === 0 && "animate-pulse")} />
                        {item}
                    </div>
                ))}

                <div className="mt-auto px-4 py-3 border-t">
                    <div className={cn("flex items-center gap-3", isMobo ? "border-[#22c55e]/30" : "border-white/5")}>
                        <div className={cn("w-8 h-8 rounded-full border", isMobo ? "bg-[#051008] border-[#22c55e]/50" : "bg-[#1f2937] border-white/10")} />
                        <div className="flex flex-col">
                            <span className={cn("text-xs font-bold", isMobo ? "text-[#22c55e]" : "text-gray-200")}>Admin User</span>
                            <span className={cn("text-[10px]", isMobo ? "text-[#22c55e]/50" : "text-gray-500")}>Security Clearance: 0x9</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simulated Main Body */}
            <div className="flex-1 flex flex-col relative z-10">
                {/* Simulated Header */}
                <div className={cn(
                    "h-16 border-b flex items-center justify-between px-8 shrink-0 transition-colors duration-500",
                    isMobo ? "border-[#22c55e]/30 bg-[#08180d]/80 backdrop-blur-md" : "border-white/5 bg-[#0c1322]/80 backdrop-blur-xl"
                )}>
                    <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full animate-pulse", isMobo ? "bg-[#22c55e]" : "bg-emerald-500")} />
                        <span className={cn("text-xs tracking-widest", isMobo ? "text-[#22c55e]/80" : "text-gray-400")}>
                            {isMobo ? "NETWORK_ESTABLISHED" : "System Normal"}
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <div className={cn("w-6 h-6 rounded-md", isMobo ? "bg-[#22c55e]/20" : "bg-white/5")} />
                        <div className={cn("w-6 h-6 rounded-md", isMobo ? "bg-[#22c55e]/20" : "bg-white/5")} />
                    </div>
                </div>

                {/* Simulated Content Dashboard */}
                <div className="p-8 flex-1 overflow-y-auto">
                    <h2 className={cn("text-2xl font-bold mb-8 transition-colors", isMobo ? "text-[#22c55e] uppercase tracking-wider" : "text-white")}>
                        {isMobo ? "> SYSTEM_OVERVIEW" : "Overview Dashboard"}
                    </h2>

                    <div className="grid grid-cols-3 gap-6 mb-8">
                        {[
                            { label: "Active Nodes", val: "1,024" },
                            { label: "Latency", val: "0.2ms" },
                            { label: "Bandwidth", val: "1.4 TB/s" }
                        ].map((metric, i) => (
                            <div key={i} className={cn(
                                "p-6 rounded-2xl border flex flex-col gap-3 transition-colors relative overflow-hidden group",
                                isMobo ? "border-[#22c55e]/30 bg-[#08180d]/70 hover:bg-[#0a2012] hover:border-[#22c55e]/60" : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                            )}>
                                {/* Circuit accent */}
                                {isMobo && <div className="absolute top-0 right-4 w-[1px] h-4 bg-[#22c55e]/50" />}

                                <span className={cn("text-xs font-bold tracking-wider", isMobo ? "text-[#22c55e]/70" : "text-gray-400")}>
                                    {isMobo ? `// ${metric.label.toUpperCase()}` : metric.label}
                                </span>
                                <span className={cn("text-3xl font-bold", isMobo ? "text-[#22c55e]" : "text-white")}>
                                    {isMobo && i === 1 ? ">_ " + metric.val : metric.val}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className={cn(
                        "h-64 rounded-2xl border flex flex-col p-6 transition-colors relative overflow-hidden",
                        isMobo ? "border-[#22c55e]/30 bg-[#08180d]/70" : "border-white/5 bg-white/[0.02]"
                    )}>
                        <h3 className={cn("text-sm font-bold mb-4", isMobo ? "text-[#22c55e]" : "text-white")}>
                            {isMobo ? "DATA_STREAM_MATRIX" : "Analytics Graph"}
                        </h3>

                        <div className="flex-1 flex items-end justify-between gap-2 pt-4">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className={cn("w-full rounded-t-sm", isMobo ? "bg-[#22c55e]/40" : "bg-teal-500/20")}
                                    initial={{ height: "10%" }}
                                    animate={{ height: `${20 + Math.random() * 80}%` }}
                                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: i * 0.1 }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
