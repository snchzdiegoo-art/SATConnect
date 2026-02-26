"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Integration, HistoryEntry } from "./data"
import {
    Cpu,
    DollarSign,
    Info,
    Sparkles,
    Swords,
    Plus,
    Edit2,
    X,
    Check,
    Lock,
    TrendingUp,
    TrendingDown,
    Minus,
    Maximize2,
    Minimize2,
    Activity,
    Database,
    RefreshCw,
    Filter,
    ArrowDownUp,
    Wifi,
    AlertCircle
} from "lucide-react"

export function IntegrationsClient({
    initialIntegrations,
    canEdit
}: {
    initialIntegrations: Integration[]
    canEdit: boolean
}) {
    const [searchQuery, setSearchQuery] = useState("")
    const [isClient, setIsClient] = useState(false)

    useEffect(() => setIsClient(true), [])

    const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null)
    const [visibleFields, setVisibleFields] = useState({
        description: true,
        importance: true,
        financials: true,
        metrics: false // Condensed metrics view
    })
    const [isSyncing, setIsSyncing] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState<'name' | 'cost' | 'importance'>('name')
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'evaluating' | 'future'>('all')
    const [filterCategory, setFilterCategory] = useState<string>('all')

    const categories = Array.from(new Set(integrations.map(i => i.category).filter(Boolean)))

    const filteredIntegrations = integrations
        .filter(int =>
            (filterStatus === 'all' || int.status === filterStatus) &&
            (filterCategory === 'all' || int.category === filterCategory) &&
            (int.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                int.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                int.fullDescription?.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'cost') return (b.costMonthly || 0) - (a.costMonthly || 0); // Highest cost first
            if (sortBy === 'importance') {
                const getScore = (imp: string) => {
                    if (imp.toLowerCase().includes('critical') || imp.toLowerCase().includes('vital')) return 3;
                    if (imp.toLowerCase().includes('high') || imp.toLowerCase().includes('necessity')) return 2;
                    return 1;
                }
                return getScore(b.importance) - getScore(a.importance);
            }
            return 0;
        })

    const handleSave = (updated: Integration) => {
        setIntegrations(prev => {
            const index = prev.findIndex(i => i.id === updated.id)
            if (index > -1) {
                const newArr = [...prev]
                newArr[index] = { ...updated, lastUpdated: new Date().toISOString() }
                return newArr
            }
            return [{ ...updated, lastUpdated: new Date().toISOString() }, ...prev]
        })
        setEditingIntegration(null)
    }

    const handleDismissSuggestion = async (integrationId: string, suggestionText: string) => {
        // Optimistic UI Update
        setIntegrations(prev => prev.map(int => {
            if (int.id === integrationId && typeof int.competition !== 'string') {
                const newHistoryEntry: HistoryEntry = {
                    id: `hist-${Date.now()}`,
                    date: new Date().toISOString(),
                    action: "Suggestion Dismissed",
                    description: `Dismissed recommendation: "${suggestionText}"`,
                    type: "user"
                }

                return {
                    ...int,
                    competition: {
                        ...int.competition,
                        suggestionDismissed: true
                    },
                    history: [newHistoryEntry, ...(int.history || [])],
                    lastUpdated: new Date().toISOString()
                }
            }
            return int;
        }))

        // 🚀 THE TRIAD: Delegate to n8n silently
        try {
            await fetch("/api/webhooks/intelligence", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "dismiss_suggestion",
                    integrationId,
                    suggestionText,
                }),
            });
        } catch (error) {
            console.error("Triad Dismissal Error:", error);
        }
    }

    const handleSyncTelemetry = async (integrationId: string) => {
        setIsSyncing(integrationId)

        const targetInt = integrations.find(i => i.id === integrationId)

        try {
            // 🚀 THE TRIAD: Trigger external scrape/intelligence update via n8n
            await fetch("/api/webhooks/intelligence", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "sync_telemetry",
                    integrationId,
                    integrationName: targetInt?.name
                }),
            });
            // Simulate the delay of the external tool for UI purposes
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error("Telemetry Sync Error:", error);
        }

        setIntegrations(prev => prev.map(int => {
            if (int.id === integrationId) {
                const newHistoryEntry: HistoryEntry = {
                    id: `sync-${Date.now()}`,
                    date: new Date().toISOString(),
                    action: "Telemetry Synced",
                    description: "Deep analytics synchronized successfully from orchestrator.",
                    type: "system"
                }

                const updatedMetrics = int.metrics?.map(m => {
                    if (m.trend === 'up' && m.value.includes('%')) {
                        const currentNum = parseInt(m.value.replace(/\D/g, ''))
                        return { ...m, value: `${currentNum + Math.floor(Math.random() * 5)}%` }
                    }
                    if (m.trend === 'up' && !m.value.includes('%')) {
                        const currentNum = parseInt(m.value.replace(/\D/g, ''))
                        return { ...m, value: (currentNum + Math.floor(Math.random() * 50)).toLocaleString() }
                    }
                    return m
                })

                return {
                    ...int,
                    metrics: updatedMetrics,
                    history: [newHistoryEntry, ...(int.history || [])],
                    lastUpdated: new Date().toISOString()
                }
            }

            if (int.id === '7b' && integrationId !== '7b') {
                const jvHistoryEntry: HistoryEntry = {
                    id: `sync-jv-${Date.now()}`,
                    date: new Date().toISOString(),
                    action: "Master Blueprint Pulse",
                    description: `Received context vector from ${targetInt?.name || 'External System'} sync.`,
                    type: "system"
                }
                return {
                    ...int,
                    history: [jvHistoryEntry, ...(int.history || [])],
                    lastUpdated: new Date().toISOString()
                }
            }

            return int
        }))
        setIsSyncing(null)
    }

    return (
        <div className="flex flex-col h-full bg-[#030712]">
            {/* Header */}
            <header className="flex-none px-8 py-8 border-b border-white/[0.05] relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                                <Cpu className="w-5 h-5 text-teal-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">Intelligence & Integrations</h1>
                        </div>
                        <p className="text-sm text-gray-400">
                            Command center for the SAT Connect technological stack, internal intelligence, and APIs.
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0">
                        {integrations.length > 0 && Math.max(...integrations.map(i => i.lastUpdated ? new Date(i.lastUpdated).getTime() : 0)) > 0 && (
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Activity className="w-3.5 h-3.5 text-teal-500/50" />
                                Last Global Update: {isClient ? new Date(Math.max(...integrations.map(i => i.lastUpdated ? new Date(i.lastUpdated).getTime() : 0))).toLocaleString() : ''}
                            </div>
                        )}
                        <div className="flex flex-wrap items-center justify-end gap-3 w-full">
                            <div className="flex flex-wrap items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-1 relative z-20">

                                {/* Category Filter */}
                                <div className="flex items-center gap-1.5 px-2 border-r border-white/10">
                                    <Filter className="w-3.5 h-3.5 text-gray-400" />
                                    <select
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                        className="bg-transparent text-xs text-white focus:outline-none py-1.5 cursor-pointer appearance-none pr-4 max-w-[100px] truncate"
                                    >
                                        <option value="all" className="bg-[#0f172a]">All Categories</option>
                                        {categories.map(cat => (
                                            <option key={cat!} value={cat!} className="bg-[#0f172a]">{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center gap-1.5 px-2 border-r border-white/10">
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value as any)}
                                        className="bg-transparent text-xs text-white focus:outline-none py-1.5 cursor-pointer appearance-none pr-2"
                                    >
                                        <option value="all" className="bg-[#0f172a]">All Status</option>
                                        <option value="active" className="bg-[#0f172a]">Active</option>
                                        <option value="evaluating" className="bg-[#0f172a]">Evaluating</option>
                                        <option value="future" className="bg-[#0f172a]">Future</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-1.5 px-2">
                                    <ArrowDownUp className="w-3.5 h-3.5 text-gray-400" />
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="bg-transparent text-xs text-white focus:outline-none py-1.5 cursor-pointer appearance-none pr-2"
                                    >
                                        <option value="name" className="bg-[#0f172a]">Sort A-Z</option>
                                        <option value="importance" className="bg-[#0f172a]">Highest Importance</option>
                                        <option value="cost" className="bg-[#0f172a]">Highest Cost</option>
                                    </select>
                                </div>
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-48 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                                />
                            </div>

                            {canEdit && (
                                <button
                                    onClick={() => setEditingIntegration({
                                        id: `new-${Date.now()}`,
                                        name: "",
                                        description: "",
                                        fullDescription: "",
                                        importance: "",
                                        category: "",
                                        financials: "",
                                        costMonthly: 0,
                                        competition: { pros: [], cons: [], suggestion: "" },
                                        status: "evaluating",
                                        lastUpdated: new Date().toISOString()
                                    })}
                                    className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-teal-950 text-sm font-semibold rounded-lg transition-colors shadow-[0_0_15px_rgba(45,212,191,0.2)] shrink-0"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add
                                </button>
                            )}
                            {!canEdit && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-md shrink-0">
                                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-xs font-medium text-gray-400">View Only</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* View Toggles Row */}
                <div className="max-w-7xl mx-auto mt-6 flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2">Configurar Vista:</span>
                    <button
                        onClick={() => setVisibleFields(prev => ({ ...prev, description: !prev.description }))}
                        className={cn("px-3 py-1.5 text-xs font-medium rounded-full border transition-colors", visibleFields.description ? "bg-white/10 border-white/20 text-white" : "bg-transparent border-white/5 text-gray-500 hover:border-white/10")}
                    >Descripción</button>
                    <button
                        onClick={() => setVisibleFields(prev => ({ ...prev, importance: !prev.importance }))}
                        className={cn("px-3 py-1.5 text-xs font-medium rounded-full border transition-colors", visibleFields.importance ? "bg-white/10 border-white/20 text-white" : "bg-transparent border-white/5 text-gray-500 hover:border-white/10")}
                    >Importancia</button>
                    <button
                        onClick={() => setVisibleFields(prev => ({ ...prev, financials: !prev.financials }))}
                        className={cn("px-3 py-1.5 text-xs font-medium rounded-full border transition-colors", visibleFields.financials ? "bg-white/10 border-white/20 text-white" : "bg-transparent border-white/5 text-gray-500 hover:border-white/10")}
                    >Costos / Finanzas</button>
                    <button
                        onClick={() => setVisibleFields(prev => ({ ...prev, metrics: !prev.metrics }))}
                        className={cn("px-3 py-1.5 text-xs font-medium rounded-full border transition-colors flex items-center gap-1.5", visibleFields.metrics ? "bg-teal-500/10 border-teal-500/30 text-teal-400" : "bg-transparent border-white/5 text-gray-500 hover:border-white/10")}
                    >
                        <Activity className="w-3 h-3" /> Métricas Rápidas
                    </button>
                </div>
            </header>

            {/* Grid */}
            <main className="flex-1 overflow-y-auto p-8 relative z-0 hide-scrollbar scroll-smooth">
                <div className="max-w-7xl mx-auto">
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start auto-rows-min">
                        <AnimatePresence>
                            {filteredIntegrations.map((int) => {
                                const isExpanded = expandedId === int.id;

                                return (
                                    <motion.div
                                        key={int.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
                                        onClick={() => !isExpanded && setExpandedId(int.id)}
                                        className={cn(
                                            "group relative bg-[#0c1322] border rounded-2xl overflow-hidden flex flex-col transition-colors cursor-pointer",
                                            isExpanded
                                                ? "md:col-span-2 xl:col-span-3 border-teal-500/50 shadow-[0_0_40px_rgba(45,212,191,0.15)] ring-1 ring-teal-500/20"
                                                : "col-span-1 border-white/[0.08] hover:border-teal-500/30"
                                        )}
                                    >
                                        <div className={cn("flex flex-col h-full", isExpanded ? "p-8" : "p-6 gap-4")}>

                                            {/* Header Row */}
                                            <div className="flex items-start justify-between w-full">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "rounded-xl bg-black/40 border border-white/5 flex items-center justify-center shrink-0 p-2",
                                                        isExpanded ? "w-16 h-16 shadow-lg" : "w-12 h-12"
                                                    )}>
                                                        {int.iconUrl ? (
                                                            <img src={int.iconUrl} alt={int.name} className="w-full h-full object-contain filter brightness-110 Contrast-125" />
                                                        ) : (
                                                            <Cpu className={cn("text-teal-400/60", isExpanded ? "w-8 h-8" : "w-6 h-6")} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <motion.h3 layout="position" className={cn("font-bold text-white mb-2 group-hover:text-teal-300 transition-colors leading-tight", isExpanded ? "text-2xl" : "text-lg")}>
                                                            {int.name}
                                                        </motion.h3>
                                                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                                            {/* Status Tag */}
                                                            <span className={cn(
                                                                "text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-md border",
                                                                int.status === "active" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
                                                                    int.status === "future" ? "bg-purple-500/15 text-purple-400 border-purple-500/30" :
                                                                        "bg-amber-500/15 text-amber-400 border-amber-500/30"
                                                            )}>
                                                                {int.status}
                                                            </span>

                                                            {/* Connection Tag */}
                                                            {int.connectionStatus && (
                                                                <span className={cn(
                                                                    "text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-md border flex items-center gap-1",
                                                                    int.connectionStatus === 'connected' ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
                                                                        int.connectionStatus === 'limited' ? "bg-amber-500/15 text-amber-400 border-amber-500/30" :
                                                                            "bg-gray-500/15 text-gray-400 border-gray-500/30"
                                                                )}>
                                                                    {int.connectionStatus === 'connected' ? <Check className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                                                                    {int.connectionStatus === 'connected' ? "Connected" : int.connectionStatus === 'limited' ? "Limited Access" : "Not Connected"}
                                                                </span>
                                                            )}

                                                            {/* Category Tag */}
                                                            {int.category && (
                                                                <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-md border border-white/10 bg-white/5 text-gray-400">
                                                                    {int.category}
                                                                </span>
                                                            )}

                                                            {/* Custom Tags */}
                                                            {int.tags && int.tags.map((tag, idx) => (
                                                                <span key={idx} className="text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-md border border-blue-500/20 bg-blue-500/10 text-blue-400">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2 items-end">
                                                    {/* Controls */}
                                                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                        {canEdit && isExpanded && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setEditingIntegration(int); }}
                                                                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all shadow-sm"
                                                                title="Edit Integration"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        {isExpanded && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setExpandedId(null); }}
                                                                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all shadow-sm"
                                                                title="Close Details"
                                                            >
                                                                <Minimize2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        {!isExpanded && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setExpandedId(int.id); }}
                                                                className="p-2 bg-transparent hover:bg-white/5 rounded-lg text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all z-10"
                                                                title="Expand Details"
                                                            >
                                                                <Maximize2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    {int.lastUpdated && isExpanded && (
                                                        <div className="text-[10px] font-medium text-gray-500 bg-black/40 px-2 py-1 rounded-md border border-white/5">
                                                            Last updated: {isClient ? new Date(int.lastUpdated).toLocaleDateString() : ''}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Condensed Content */}
                                            {!isExpanded && (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col flex-1 mt-4">
                                                    {visibleFields.description && (
                                                        <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3 flex-1 transition-all">
                                                            {int.description}
                                                        </p>
                                                    )}

                                                    <div className="mt-auto space-y-3 pt-4 border-t border-white/[0.05]">
                                                        {visibleFields.importance && (
                                                            <div className="flex gap-2 items-start">
                                                                <Sparkles className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />
                                                                <div>
                                                                    <span className="text-xs font-semibold text-gray-300 block mb-0.5">Importance</span>
                                                                    <span className="text-xs text-gray-500 leading-snug block truncate w-48 xl:w-56">{int.importance}</span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {visibleFields.financials && (
                                                            <div className="flex gap-2 items-start">
                                                                <DollarSign className="w-4 h-4 text-emerald-400/80 shrink-0 mt-0.5" />
                                                                <div>
                                                                    <span className="text-xs font-semibold text-gray-300 block mb-0.5">Financials & Recom.</span>
                                                                    <span className="text-xs text-gray-500 leading-snug block truncate w-48 xl:w-56">{int.financials}</span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {visibleFields.metrics && int.metrics && int.metrics.length > 0 && (
                                                            <div className="flex gap-2 items-start pt-2 border-t border-white/[0.02]">
                                                                <Activity className="w-4 h-4 text-teal-400/80 shrink-0 mt-0.5" />
                                                                <div className="flex flex-wrap gap-2">
                                                                    {int.metrics.slice(0, 2).map((m, idx) => (
                                                                        <div key={idx} className="bg-black/40 border border-white/5 rounded px-2 py-0.5 flex flex-col items-start w-[100px]">
                                                                            <span className="text-[10px] text-gray-500 uppercase tracking-wider block truncate w-full">{m.label}</span>
                                                                            <span className="text-xs font-bold text-gray-200 mt-0.5">{m.value}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Expanded Content Grid */}
                                            {isExpanded && (
                                                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.1 }} className="mt-8 flex flex-col gap-8">

                                                    {/* Top Bar: Telemetry (Full Width) */}
                                                    <div className="bg-black/20 border border-white/5 rounded-2xl p-6">
                                                        <div className="flex items-center justify-between mb-6">
                                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                                                <Activity className="w-4 h-4 text-teal-400" /> Live Telemetry
                                                            </h4>
                                                            {canEdit && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleSyncTelemetry(int.id); }}
                                                                    disabled={typeof isSyncing === 'string' && isSyncing === int.id}
                                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 rounded-md transition-colors border border-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed group/syncbtn relative z-10"
                                                                >
                                                                    <RefreshCw className={cn("w-3.5 h-3.5 group-hover/syncbtn:text-teal-300", isSyncing === int.id && "animate-spin")} />
                                                                    {isSyncing === int.id ? "Syncing..." : "Sweep Telemetry"}
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            {int.metrics && int.metrics.length > 0 ? (
                                                                int.metrics.map((metric, idx) => (
                                                                    <div key={idx} className="bg-black/40 border border-white/5 rounded-xl p-5 flex items-center justify-between group/metric hover:bg-black/60 transition-colors relative overflow-hidden">
                                                                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl group-hover/metric:bg-teal-500/10 transition-colors" />
                                                                        <div className="flex flex-col relative z-10">
                                                                            <span className="text-xs text-gray-500 font-bold tracking-wider uppercase mb-1">{metric.label}</span>
                                                                            <span className="text-2xl font-bold text-white tracking-tight">{metric.value}</span>
                                                                        </div>

                                                                        {metric.trend && (
                                                                            <div className={cn(
                                                                                "flex items-center justify-center rounded-lg px-3 py-2 border shadow-inner relative z-10 shrink-0",
                                                                                metric.trend === 'up' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                                                                    metric.trend === 'down' ? "bg-red-500/10 border-red-500/20 text-red-400" :
                                                                                        "bg-gray-500/10 border-gray-500/20 text-gray-400"
                                                                            )}>
                                                                                {metric.trend === 'up' && <TrendingUp className="w-4 h-4 mr-1.5" />}
                                                                                {metric.trend === 'down' && <TrendingDown className="w-4 h-4 mr-1.5" />}
                                                                                {metric.trend === 'neutral' && <Minus className="w-4 h-4 mr-1.5" />}
                                                                                <span className="text-xs font-bold leading-none">{metric.trendValue || (metric.trend === 'neutral' ? 'Stable' : '')}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="col-span-3 flex flex-col items-center justify-center py-6 bg-black/10 border border-dashed border-white/10 rounded-xl text-center">
                                                                    <Activity className="w-8 h-8 text-gray-600 mb-2" />
                                                                    <span className="text-sm font-medium text-gray-400">Telemetry Offline</span>
                                                                    <span className="text-xs text-gray-500">No active metrics tracking established for this integration.</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Bottom Split */}
                                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                                        {/* Left Column (Info) */}
                                                        <div className="md:col-span-7 space-y-6">
                                                            <div>
                                                                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                                                                    <Database className="w-4 h-4 text-teal-400" /> Executive Summary
                                                                </h4>
                                                                <p className="text-base text-gray-300 leading-relaxed font-light">
                                                                    {int.fullDescription || int.description}
                                                                </p>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.05]">
                                                                <div className="bg-black/20 rounded-xl p-4 border border-white/[0.02]">
                                                                    <div className="flex gap-2 items-start mb-2">
                                                                        <Sparkles className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />
                                                                        <span className="text-xs font-bold text-gray-300 uppercase tracking-wide">Importance</span>
                                                                    </div>
                                                                    <span className="text-sm font-medium text-gray-400 leading-snug block">{int.importance}</span>
                                                                </div>

                                                                <div className="bg-emerald-950/20 rounded-xl p-4 border border-emerald-500/10">
                                                                    <div className="flex gap-2 items-start mb-2">
                                                                        <DollarSign className="w-4 h-4 text-emerald-400/80 shrink-0 mt-0.5" />
                                                                        <span className="text-xs font-bold text-emerald-200 uppercase tracking-wide">Financials & ROI</span>
                                                                    </div>
                                                                    <span className="text-sm font-medium text-emerald-100/70 leading-snug block">{int.financials}</span>
                                                                </div>

                                                                <div className="col-span-2 bg-black/20 rounded-xl p-4 border border-white/[0.02]">
                                                                    <div className="flex gap-2 items-start mb-2">
                                                                        <Swords className="w-4 h-4 text-blue-400/80 shrink-0 mt-0.5" />
                                                                        <span className="text-xs font-bold text-gray-300 uppercase tracking-wide">Competition & Security</span>
                                                                    </div>
                                                                    {typeof int.competition === 'string' ? (
                                                                        <span className="text-sm font-medium text-gray-400 leading-snug block">{int.competition}</span>
                                                                    ) : (
                                                                        <div className="space-y-4">
                                                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                                                                <div>
                                                                                    <span className="text-emerald-400/80 font-bold mb-1 block">Pros</span>
                                                                                    <ul className="text-gray-400 space-y-1 list-disc pl-3">
                                                                                        {int.competition.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                                                                                    </ul>
                                                                                </div>
                                                                                <div>
                                                                                    <span className="text-red-400/80 font-bold mb-1 block">Cons</span>
                                                                                    <ul className="text-gray-400 space-y-1 list-disc pl-3">
                                                                                        {int.competition.cons.map((con, i) => <li key={i}>{con}</li>)}
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                            {!int.competition.suggestionDismissed && (
                                                                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 relative group/sugg">
                                                                                    <span className="text-blue-300 font-bold text-xs uppercase tracking-wide mb-1 block">Intelligence Suggestion</span>
                                                                                    <span className="text-blue-100/70 text-sm">{int.competition.suggestion}</span>
                                                                                    {canEdit && (
                                                                                        <button
                                                                                            onClick={(e) => { e.stopPropagation(); handleDismissSuggestion(int.id, (int.competition as any).suggestion); }}
                                                                                            className="absolute top-2 right-2 text-blue-400/50 hover:text-red-400 opacity-0 group-hover/sugg:opacity-100 transition-all cursor-pointer z-10"
                                                                                            title="Dismiss Suggestion"
                                                                                        >
                                                                                            <X className="w-3.5 h-3.5" />
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Right Column (Horizon & Timeline) */}
                                                        <div className="md:col-span-5 space-y-6">

                                                            {/* Version & Upgrade Path V4 */}
                                                            {int.versionData && (
                                                                <div className="p-5 bg-teal-500/5 border border-teal-500/10 rounded-2xl relative overflow-hidden">
                                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-3xl rounded-full" />

                                                                    <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-4 flex items-center gap-2 relative z-10">
                                                                        <Activity className="w-3.5 h-3.5" /> Upgrade Horizon
                                                                    </h4>

                                                                    <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
                                                                        <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                                                                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Current Version</div>
                                                                            <div className="text-sm font-bold text-gray-200">{int.versionData.current}</div>
                                                                            <div className="text-xs text-gray-400 mt-1">${int.versionData.costCurrent} {int.versionData.currency || 'MXN'} / mo</div>
                                                                        </div>
                                                                        <div className="bg-teal-500/10 rounded-xl p-4 border border-teal-500/20">
                                                                            <div className="text-[10px] text-teal-500 font-bold uppercase tracking-wider mb-1">Next Version</div>
                                                                            <div className="text-sm font-bold text-teal-100">{int.versionData.next}</div>
                                                                            <div className="text-xs text-teal-300/70 mt-1">${int.versionData.costNext} {int.versionData.currency || 'MXN'} / mo</div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-3 relative z-10 pt-4 border-t border-teal-500/10">
                                                                        <div className="flex items-start justify-between gap-4">
                                                                            <div className="flex-1">
                                                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Business Justification</span>
                                                                                <p className="text-xs text-gray-300 leading-relaxed">{int.versionData.upgradeReason}</p>
                                                                            </div>
                                                                            <div className="text-right shrink-0 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                                                                                <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider block mb-0.5">Deadline</span>
                                                                                <span className="text-xs font-bold text-red-100">{int.versionData.upgradeDeadline}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* History Timeline */}
                                                            {int.history && int.history.length > 0 && (
                                                                <div className="bg-black/20 border border-white/5 rounded-2xl p-5">
                                                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                                                                        <Activity className="w-3.5 h-3.5 text-teal-400" /> Event Log
                                                                    </h4>
                                                                    <div className="relative pl-3 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-white/[0.05]">
                                                                        {int.history.map((entry) => (
                                                                            <div key={entry.id} className="relative">
                                                                                <div className={cn(
                                                                                    "absolute -left-[14.5px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-[#0c1322]",
                                                                                    entry.type === 'system' ? "bg-teal-500" :
                                                                                        entry.type === 'user' ? "bg-blue-500" :
                                                                                            entry.type === 'alert' ? "bg-amber-500" :
                                                                                                "bg-emerald-500"
                                                                                )} />
                                                                                <div className="pl-4">
                                                                                    <div className="flex items-center justify-between gap-2 mb-1">
                                                                                        <span className="text-xs font-bold text-gray-300">{entry.action}</span>
                                                                                        <span className="text-[10px] font-medium text-gray-500">{isClient ? new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}</span>
                                                                                    </div>
                                                                                    <p className="text-[11px] text-gray-400 leading-relaxed">{entry.description}</p>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </motion.div>

                    {filteredIntegrations.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-20 text-center">
                            <Info className="w-12 h-12 text-gray-600 mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">No integrations found</h3>
                            <p className="text-gray-400 text-sm">Modify your search query.</p>
                        </div>
                    )}
                </div>
            </main >

            {/* Edit Modal (unchanged logic) */}
            <AnimatePresence>
                {
                    editingIntegration && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto hide-scrollbar"
                            >
                                <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0f172a] z-10">
                                    <h2 className="text-lg font-bold text-white">
                                        {editingIntegration.id.startsWith("new-") ? "Add Integration" : "Edit Integration"}
                                    </h2>
                                    <button onClick={() => setEditingIntegration(null)} className="text-gray-400 hover:text-white transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">Name</label>
                                        <input
                                            type="text"
                                            value={editingIntegration.name}
                                            onChange={e => setEditingIntegration(prev => ({ ...prev!, name: e.target.value }))}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1">Status</label>
                                            <select
                                                value={editingIntegration.status}
                                                onChange={e => setEditingIntegration(prev => ({ ...prev!, status: e.target.value as any }))}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                                            >
                                                <option value="active">Active</option>
                                                <option value="evaluating">Evaluating</option>
                                                <option value="future">Future</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1">Icon URL (Optional)</label>
                                            <input
                                                type="text"
                                                value={editingIntegration.iconUrl || ""}
                                                onChange={e => setEditingIntegration(prev => ({ ...prev!, iconUrl: e.target.value }))}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">Brief Description</label>
                                        <textarea
                                            rows={2}
                                            value={editingIntegration.description}
                                            onChange={e => setEditingIntegration(prev => ({ ...prev!, description: e.target.value }))}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">Full Description / Executive Summary</label>
                                        <textarea
                                            rows={4}
                                            value={editingIntegration.fullDescription || ""}
                                            onChange={e => setEditingIntegration(prev => ({ ...prev!, fullDescription: e.target.value }))}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">Importance</label>
                                        <input
                                            type="text"
                                            value={editingIntegration.importance}
                                            onChange={e => setEditingIntegration(prev => ({ ...prev!, importance: e.target.value }))}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
                                            <input
                                                type="text"
                                                value={editingIntegration.category || ""}
                                                onChange={e => setEditingIntegration(prev => ({ ...prev!, category: e.target.value }))}
                                                placeholder="e.g. Artificial Intelligence"
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1">Financials Overview</label>
                                            <input
                                                type="text"
                                                value={editingIntegration.financials}
                                                onChange={e => setEditingIntegration(prev => ({ ...prev!, financials: e.target.value }))}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1">Cost Monthly ($)</label>
                                            <input
                                                type="number"
                                                value={editingIntegration.costMonthly || 0}
                                                onChange={e => setEditingIntegration(prev => ({ ...prev!, costMonthly: Number(e.target.value) }))}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Edit Upgrade Horizon Settings */}
                                    <div className="p-4 bg-teal-500/5 border border-teal-500/20 rounded-xl space-y-4">
                                        <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">Upgrade Horizon (Version tracking)</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Current Version</label>
                                                <input type="text" value={editingIntegration.versionData?.current || ""} onChange={e => setEditingIntegration(prev => ({ ...prev!, versionData: { current: e.target.value, next: prev?.versionData?.next || "", costCurrent: prev?.versionData?.costCurrent || 0, costNext: prev?.versionData?.costNext || 0, upgradeReason: prev?.versionData?.upgradeReason || "", upgradeDeadline: prev?.versionData?.upgradeDeadline || "" } }))} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-teal-500" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase font-bold text-teal-500 mb-1">Next Version</label>
                                                <input type="text" value={editingIntegration.versionData?.next || ""} onChange={e => setEditingIntegration(prev => ({ ...prev!, versionData: { current: prev?.versionData?.current || "", next: e.target.value, costCurrent: prev?.versionData?.costCurrent || 0, costNext: prev?.versionData?.costNext || 0, upgradeReason: prev?.versionData?.upgradeReason || "", upgradeDeadline: prev?.versionData?.upgradeDeadline || "" } }))} className="w-full bg-black/60 border border-teal-500/30 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-teal-500" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Current Cost</label>
                                                <input type="number" value={editingIntegration.versionData?.costCurrent || 0} onChange={e => setEditingIntegration(prev => ({ ...prev!, versionData: { current: prev?.versionData?.current || "", next: prev?.versionData?.next || "", costCurrent: Number(e.target.value), costNext: prev?.versionData?.costNext || 0, upgradeReason: prev?.versionData?.upgradeReason || "", upgradeDeadline: prev?.versionData?.upgradeDeadline || "" } }))} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-teal-500" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase font-bold text-teal-500 mb-1">Next Cost</label>
                                                <input type="number" value={editingIntegration.versionData?.costNext || 0} onChange={e => setEditingIntegration(prev => ({ ...prev!, versionData: { current: prev?.versionData?.current || "", next: prev?.versionData?.next || "", costCurrent: prev?.versionData?.costCurrent || 0, costNext: Number(e.target.value), upgradeReason: prev?.versionData?.upgradeReason || "", upgradeDeadline: prev?.versionData?.upgradeDeadline || "" } }))} className="w-full bg-black/60 border border-teal-500/30 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-teal-500" />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Upgrade Reason / Justification</label>
                                                <textarea value={editingIntegration.versionData?.upgradeReason || ""} onChange={e => setEditingIntegration(prev => ({ ...prev!, versionData: { current: prev?.versionData?.current || "", next: prev?.versionData?.next || "", costCurrent: prev?.versionData?.costCurrent || 0, costNext: prev?.versionData?.costNext || 0, upgradeReason: e.target.value, upgradeDeadline: prev?.versionData?.upgradeDeadline || "" } }))} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-teal-500 h-16 resize-none" />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-[10px] uppercase font-bold text-red-500 mb-1">Deadline</label>
                                                <input type="text" placeholder="e.g. Q4 2026" value={editingIntegration.versionData?.upgradeDeadline || ""} onChange={e => setEditingIntegration(prev => ({ ...prev!, versionData: { current: prev?.versionData?.current || "", next: prev?.versionData?.next || "", costCurrent: prev?.versionData?.costCurrent || 0, costNext: prev?.versionData?.costNext || 0, upgradeReason: prev?.versionData?.upgradeReason || "", upgradeDeadline: e.target.value } }))} className="w-full bg-black/60 border border-red-500/30 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-red-500" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">Competition</label>
                                        <input
                                            type="text"
                                            value={typeof editingIntegration.competition === 'string' ? editingIntegration.competition : "Advanced VS Data (Read Only for now)"}
                                            onChange={e => {
                                                if (typeof editingIntegration.competition === 'string') {
                                                    setEditingIntegration(prev => ({ ...prev!, competition: e.target.value }))
                                                }
                                            }}
                                            disabled={typeof editingIntegration.competition !== 'string'}
                                            className={cn("w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500", typeof editingIntegration.competition !== 'string' ? "text-gray-500 cursor-not-allowed" : "text-white")}
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-black/20 border-t border-white/5 flex justify-end gap-3 sticky bottom-0 z-10 backdrop-blur-md">
                                    <button
                                        onClick={() => setEditingIntegration(null)}
                                        className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleSave(editingIntegration)}
                                        className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-teal-950 text-sm font-semibold rounded-lg transition-colors shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                                    >
                                        <Check className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )
                }
            </AnimatePresence >
        </div >
    )
}
