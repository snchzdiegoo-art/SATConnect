import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getGlobalFinanceStats, getMarginHeatmapData, getRecentAuditActivity } from "@/lib/analytics"
import { MarginHeatmap } from "@/components/analytics/margin-heatmap"
import { TrendingUp, DollarSign, Activity, Percent, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

export const revalidate = 60 // Revalidate this page every 60 seconds (ISR caching)

export default async function AnalyticsPage() {
    const user = await currentUser()

    if (!user) {
        redirect("/sign-in")
    }

    const roleRaw = (user.publicMetadata?.role as string) || "super_admin"
    const isAdmin = roleRaw === "admin"
    const isSuperAdmin = roleRaw === "super_admin"

    if (!isAdmin && !isSuperAdmin) {
        redirect("/dashboard")
    }

    const [stats, heatmapData, auditActivity] = await Promise.all([
        getGlobalFinanceStats(),
        getMarginHeatmapData(),
        getRecentAuditActivity()
    ])

    return (
        <div className="flex flex-col gap-8 p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[#29FFC6] mb-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Auditoría Inteligente</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white mb-2">
                    Financial <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#29FFC6] to-[#2E7D32]">Intelligence</span>
                </h1>
                <p className="text-gray-400 text-sm max-w-2xl">
                    Monitoreo en tiempo real de márgenes de retención, rendimiento por canal y salud financiera del ecosistema SAT Connect.
                </p>
            </div>

            {/* Dynamic KPI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Ventas Totales", value: `$${stats.totalSales.toLocaleString()}`, sub: "Gross Merchandise Value", icon: DollarSign, color: "text-[#29FFC6]" },
                    { label: "Retención SAT", value: `$${stats.retention.toLocaleString()}`, sub: "Net Revenue (Commission)", icon: Percent, color: "text-blue-400" },
                    { label: "Volumen Reservas", value: stats.bookingCount.toString(), sub: "Total activas en BD", icon: Activity, color: "text-purple-400" },
                    { label: "Margen Neto", value: `${stats.growthPercent}%`, sub: "Retención / Ventas Totales", icon: TrendingUp, color: "text-emerald-400" },
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <stat.icon className="h-12 w-12" />
                        </div>
                        <div className="flex flex-col gap-1 relative z-10">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
                            <span className="text-2xl font-black text-white">{stat.value}</span>
                            <span className="text-[10px] text-gray-500 font-medium">{stat.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Charts & Deep Dive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Margin Heatmap Card */}
                <div className="glass-card rounded-2xl border border-white/10 p-8 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <h3 className="text-lg font-bold text-white">Heatmap de Márgenes</h3>
                            <p className="text-xs text-gray-500">Retención promedio por segmento T.H.R.I.V.E.</p>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#29FFC6] animate-pulse" />
                        </div>
                    </div>

                    <MarginHeatmap data={heatmapData} />

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Optimización Sugerida</span>
                        <div className="flex items-center gap-1 text-[#29FFC6] text-[10px] font-bold">
                            <span>Ajustar Markups Gold</span>
                            <ArrowUpRight className="h-3 w-3" />
                        </div>
                    </div>
                </div>

                {/* Live Audit Feed */}
                <div className="glass-card rounded-2xl border border-white/10 p-8 flex flex-col gap-6">
                    <div className="flex flex-col">
                        <h3 className="text-lg font-bold text-white">Fugas Financial Auditing</h3>
                        <p className="text-xs text-gray-500">Detección de variaciones en costos de proveedor.</p>
                    </div>

                    <div className="space-y-4">
                        {auditActivity.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white">{item.name}</span>
                                    <span className="text-[10px] text-gray-500">{item.date}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={cn(
                                        "text-xs font-black",
                                        item.status === "Warning" ? "text-yellow-400" : "text-emerald-400"
                                    )}>{item.delta}</span>
                                    <div className={cn(
                                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest",
                                        item.status === "Warning" ? "bg-yellow-400/10 text-yellow-400" : "bg-emerald-400/10 text-emerald-400"
                                    )}>{item.status}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto pt-6">
                        <div className="p-4 rounded-xl bg-[#29FFC6]/5 border border-[#29FFC6]/10 flex items-center gap-4">
                            <Activity className="h-5 w-5 text-[#29FFC6]" />
                            <p className="text-[11px] text-gray-400 leading-tight">
                                <strong className="text-white block mb-0.5 text-xs">Insight del Engine:</strong>
                                Los tours de la categoría &quot;Culture&quot; tienen un margen de retención 3.4% superior al promedio actual.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
