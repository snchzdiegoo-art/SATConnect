"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    Calendar as CalendarIcon,
    Share2,
    Settings,
    Plus,
    Youtube,
    Instagram,
    Linkedin,
    Globe,
    Zap,
    ArrowRight,
    Clock,
    CheckCircle2,
    AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock Data for Publications
const currentMonth = "February 2026"
const daysInMonth = Array.from({ length: 28 }, (_, i) => i + 1)
const mockPublications = [
    { day: 3, platform: "linkedin", title: "Tech Architecture Reveal", status: "published" },
    { day: 5, platform: "youtube", title: "Tour Manager Feature Launch", status: "published" },
    { day: 10, platform: "instagram", title: "Behind the Scenes: Codebase", status: "published" },
    { day: 15, platform: "linkedin", title: "Why B2B Travel logic needs a rewrite", status: "scheduled" },
    { day: 20, platform: "globe", title: "Blog: SAT Connect V2026", status: "scheduled" },
    { day: 25, platform: "youtube", title: "Agentic AI Walkthrough", status: "draft" }
]

// Mock Data for Automations
const automations = [
    {
        id: 1,
        name: "Video to Social Pipeline",
        source: { name: "YouTube", icon: Youtube, color: "text-red-500" },
        target: { name: "LinkedIn", icon: Linkedin, color: "text-blue-500" },
        status: "active",
        runs: 142,
        lastRun: "2 hours ago"
    },
    {
        id: 2,
        name: "Blog Cross-Posting",
        source: { name: "Ghost Blog", icon: Globe, color: "text-emerald-500" },
        target: { name: "Multiple Platforms", icon: Share2, color: "text-purple-500" },
        status: "active",
        runs: 89,
        lastRun: "1 day ago"
    },
    {
        id: 3,
        name: "Instagram Sync",
        source: { name: "Instagram", icon: Instagram, color: "text-pink-500" },
        target: { name: "Content Lake", icon: Zap, color: "text-yellow-500" },
        status: "paused",
        runs: 0,
        lastRun: "Never"
    }
]

export function RRSSClient() {
    const [activeTab, setActiveTab] = useState<'calendar' | 'automations'>('calendar')

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'youtube': return <Youtube className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
            case 'linkedin': return <Linkedin className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
            case 'instagram': return <Instagram className="w-3 h-3 md:w-4 md:h-4 text-pink-500" />
            default: return <Globe className="w-3 h-3 md:w-4 md:h-4 text-emerald-500" />
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#0c1322] text-gray-200">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-[#0c1322]/80 backdrop-blur-xl border-b border-white/[0.05] p-6 lg:px-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Share2 className="w-6 h-6 text-teal-400" />
                        RRSS & Itinerary
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Manage public relations, social media schedules, and automation hooks.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all text-white border border-white/10">
                        <Settings className="w-4 h-4" />
                        Configure
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 rounded-lg text-sm font-medium transition-all shadow-[0_0_20px_rgba(45,212,191,0.1)] border border-teal-500/20">
                        <Plus className="w-4 h-4" />
                        New Item
                    </button>
                </div>
            </div>

            <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full flex-1">
                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-white/10 mb-8">
                    <button
                        onClick={() => setActiveTab('calendar')}
                        className={cn(
                            "pb-4 text-sm font-medium transition-colors relative",
                            activeTab === 'calendar' ? "text-teal-400" : "text-gray-400 hover:text-gray-200"
                        )}
                    >
                        <span className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" />
                            Itinerary Calendar
                        </span>
                        {activeTab === 'calendar' && (
                            <motion.div layoutId="rrss-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('automations')}
                        className={cn(
                            "pb-4 text-sm font-medium transition-colors relative",
                            activeTab === 'automations' ? "text-teal-400" : "text-gray-400 hover:text-gray-200"
                        )}
                    >
                        <span className="flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Automation Hooks
                        </span>
                        {activeTab === 'automations' && (
                            <motion.div layoutId="rrss-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                        )}
                    </button>
                </div>

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'calendar' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">{currentMonth}</h2>
                                <div className="flex items-center gap-4 text-xs font-medium">
                                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Published</span>
                                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /> Scheduled</span>
                                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-500" /> Draft</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="bg-[#0c1322] p-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        {day}
                                    </div>
                                ))}

                                {daysInMonth.map(day => {
                                    const pub = mockPublications.find(p => p.day === day)
                                    return (
                                        <div key={day} className="bg-[#111827] min-h-[120px] p-2 hover:bg-[#1a2333] transition-colors group relative cursor-pointer">
                                            <span className={cn(
                                                "text-sm font-medium",
                                                pub ? "text-gray-200" : "text-gray-600"
                                            )}>{day}</span>

                                            {pub && (
                                                <div className="mt-2 p-2 rounded-lg bg-black/40 border border-white/5 group-hover:border-white/10 transition-colors">
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        {getPlatformIcon(pub.platform)}
                                                        <div className={cn(
                                                            "w-1.5 h-1.5 rounded-full",
                                                            pub.status === 'published' ? "bg-emerald-500" :
                                                                pub.status === 'scheduled' ? "bg-blue-500" :
                                                                    "bg-gray-500"
                                                        )} />
                                                    </div>
                                                    <p className="text-[10px] sm:text-xs leading-tight text-gray-300 line-clamp-2">
                                                        {pub.title}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === 'automations' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {automations.map(auto => (
                                <div key={auto.id} className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.04] transition-all group">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h3 className="font-bold text-white text-lg mb-1">{auto.name}</h3>
                                            <div className="flex items-center gap-2 text-xs font-medium">
                                                {auto.status === 'active' ? (
                                                    <span className="text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                        <CheckCircle2 className="w-3 h-3" /> Active
                                                    </span>
                                                ) : (
                                                    <span className="text-amber-400 flex items-center gap-1.5 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                                        <AlertCircle className="w-3 h-3" /> Paused
                                                    </span>
                                                )}
                                                <span className="text-gray-500">{auto.runs} total runs</span>
                                            </div>
                                        </div>
                                        <button className="text-gray-500 hover:text-white transition-colors">
                                            <Settings className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="bg-black/40 rounded-xl p-4 border border-white/5 flex items-center justify-between mb-6">
                                        <div className="flex flex-col items-center gap-2 w-1/3">
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                                <auto.source.icon className={cn("w-5 h-5", auto.source.color)} />
                                            </div>
                                            <span className="text-xs font-medium text-gray-400 text-center">{auto.source.name}</span>
                                        </div>

                                        <div className="flex-1 flex justify-center">
                                            <div className="flex flex-col items-center">
                                                <ArrowRight className="w-5 h-5 text-gray-600" />
                                                <span className="text-[9px] uppercase tracking-wider text-teal-500/50 font-bold mt-1">Webhook</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center gap-2 w-1/3">
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                                <auto.target.icon className={cn("w-5 h-5", auto.target.color)} />
                                            </div>
                                            <span className="text-xs font-medium text-gray-400 text-center">{auto.target.name}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/5">
                                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Last run {auto.lastRun}</span>
                                        <button className="font-bold text-teal-400 hover:text-teal-300 transition-colors">View Logs</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
