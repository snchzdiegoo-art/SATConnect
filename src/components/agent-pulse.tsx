"use client"

import * as React from "react"
import {
    Zap,
    TrendingUp,
    ShieldCheck,
    Briefcase,
    Activity,
    ChevronUp,
    ChevronDown,
    Settings,
    LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"

export function AgentPulse() {
    const { user } = useUser()
    const [isExpanded, setIsExpanded] = React.useState(false)

    if (!user) return null

    return (
        <div
            className={cn(
                "fixed bottom-6 right-6 z-[100] transition-all duration-500 ease-in-out",
                isExpanded ? "w-80" : "w-14 h-14"
            )}
        >
            {/* Action Trigger */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    "w-14 h-14 rounded-full bg-gradient-to-br from-[#29FFC6] to-[#2E7D32] flex items-center justify-center shadow-[0_0_30px_rgba(41,255,198,0.4)] hover:shadow-[0_0_50px_rgba(41,255,198,0.6)] transition-all active:scale-95 group overflow-hidden",
                    isExpanded && "rounded-b-none translate-y-0"
                )}
            >
                {isExpanded ? (
                    <ChevronDown className="h-6 w-6 text-[#07101E] animate-in slide-in-from-top-2" />
                ) : (
                    <div className="relative">
                        <Zap className="h-6 w-6 text-[#07101E] group-hover:scale-110 transition-transform" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                    </div>
                )}
            </button>

            {/* Pulse Dashboard Panel */}
            <div
                className={cn(
                    "absolute bottom-full right-0 mb-0 glass-card border border-[#29FFC6]/20 rounded-2xl overflow-hidden transition-all duration-500 origin-bottom-right",
                    isExpanded
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-90 translate-y-10 pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-[#29FFC6]/20 to-transparent border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#29FFC6]/20">
                            <ShieldCheck className="h-4 w-4 text-[#29FFC6]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-[#29FFC6] uppercase tracking-widest">Agent Pulse</span>
                            <span className="text-sm font-bold text-white truncate w-40">
                                {user.firstName || "Agente"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="p-4 grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="h-3 w-3 text-emerald-400" />
                            <span className="text-[9px] font-bold text-gray-500 uppercase">Markup</span>
                        </div>
                        <span className="text-lg font-black text-white">15%</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                            <Activity className="h-3 w-3 text-blue-400" />
                            <span className="text-[9px] font-bold text-gray-500 uppercase">Tier</span>
                        </div>
                        <span className="text-lg font-black text-white">Gold</span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="px-4 pb-4 space-y-2">
                    <div className="p-3 rounded-xl bg-[#29FFC6]/5 border border-[#29FFC6]/10 flex justify-between items-center group cursor-pointer hover:bg-[#29FFC6]/10 transition-colors">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-[#29FFC6] uppercase">Comisión Proyectada</span>
                            <span className="text-sm font-black text-white">$1,240.50</span>
                        </div>
                        <Briefcase className="h-4 w-4 text-[#29FFC6] group-hover:translate-x-1 transition-transform" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="ghost" className="h-9 text-xs text-gray-400 hover:text-white hover:bg-white/5 gap-2 border border-white/5">
                            <Settings className="h-3.5 w-3.5" /> Ajustes
                        </Button>
                        <Button variant="ghost" className="h-9 text-xs text-gray-400 hover:text-red-400 hover:bg-red-400/5 gap-2 border border-white/5">
                            <LogOut className="h-3.5 w-3.5" /> Salir
                        </Button>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="bg-[#29FFC6] p-1 text-center">
                    <span className="text-[8px] font-black text-[#07101E] uppercase tracking-[0.2em]">Net Rates Active • Multi-Platform Sync</span>
                </div>
            </div>
        </div>
    )
}
