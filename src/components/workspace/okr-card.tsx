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
        <div className="flex flex-col p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border", statusConfig.bg, statusConfig.color, statusConfig.border)}>
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig.label}
                </div>
                <span className="text-xs font-medium text-gray-500">Q{objective.quarter} {objective.year}</span>
            </div>

            <h3 className="text-lg font-bold text-white font-syne mb-2 leading-tight">
                {objective.title}
            </h3>

            {/* Overall Progress */}
            <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    <span>Overall Progress</span>
                    <span className="font-mono text-white">{progressPercent}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                        className={cn("h-full rounded-full transition-all duration-1000", statusConfig.bg.replace('/10', ''))}
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
                            <div className="flex justify-between text-[11px] mb-1">
                                <span className="text-gray-400 group-hover:text-gray-300 transition-colors truncate pr-4">{kr.title}</span>
                                <span className="font-mono text-gray-500 group-hover:text-white transition-colors">
                                    {kr.current_value} / {kr.target_value} {kr.unit}
                                </span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gray-500 group-hover:bg-white transition-colors duration-300"
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
