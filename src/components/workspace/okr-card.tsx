"use client";

import { cn } from "@/lib/utils";
import { Target, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface KeyResult {
    id: number;
    title: string;
    current_value: number;
    target_value: number;
    unit: string;
}

interface Objective {
    id: number;
    title: string;
    description: string | null;
    status: string;
    quarter: number;
    year: number;
    key_results: KeyResult[];
}

export function OkrCard({ objective }: { objective: Objective }) {
    // Calculate overall progress
    const totalProgress = objective.key_results.length > 0
        ? objective.key_results.reduce((acc, kr) => acc + (kr.current_value / kr.target_value), 0) / objective.key_results.length
        : 0;

    const progressPercent = Math.min(Math.round(totalProgress * 100), 100);

    const statusConfig = {
        on_track: { color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20", icon: TrendingUp, label: "On Track" },
        at_risk: { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", icon: AlertTriangle, label: "At Risk" },
        done: { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", icon: CheckCircle, label: "Completed" },
    }[objective.status] || { color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/20", icon: Target, label: objective.status };

    const StatusIcon = statusConfig.icon;

    return (
        <div className="group flex flex-col p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            {/* Hover Circuit Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent opacity-30 group-hover:opacity-60 transition-opacity" />

            <div className="flex justify-between items-start mb-5 relative z-10">
                <div className={cn("px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 border shadow-[0_0_10px_rgba(0,0,0,0.3)]", statusConfig.bg, statusConfig.color, statusConfig.border)}>
                    <StatusIcon className="w-3.5 h-3.5 glow-current" />
                    {statusConfig.label}
                </div>
                <span className="text-[10px] font-bold text-white/30 tracking-widest uppercase">Q{objective.quarter} {objective.year}</span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white font-syne mb-2 leading-tight tracking-tight">
                {objective.title}
            </h3>

            <div className="mb-6 relative z-10">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
                    <span>Progreso Consolidado</span>
                    <span className="font-mono text-white glow-white">{progressPercent}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 ring-1 ring-black/20">
                    <div
                        className={cn("h-full rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(41,255,198,0.3)]", statusConfig.bg.replace('/10', ''))}
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Key Results */}
            <div className="space-y-4 mt-auto">
                {objective.key_results.map((kr) => {
                    const krProgress = Math.min((kr.current_value / kr.target_value) * 100, 100);
                    return (
                        <div key={kr.id} className="group">
                            <div className="flex justify-between text-[11px] mb-1 font-medium">
                                <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors truncate pr-4">{kr.title}</span>
                                <span className="font-mono font-bold text-gray-600 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                    {kr.current_value} / {kr.target_value} {kr.unit}
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gray-400 dark:bg-gray-500 group-hover:bg-teal-500 dark:group-hover:bg-white transition-colors duration-300"
                                    style={{ width: `${krProgress}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
