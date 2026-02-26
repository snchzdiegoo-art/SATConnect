import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getGlobalFinanceStats } from "@/lib/analytics"
import { cn } from "@/lib/utils"
import { DollarSign, Users, CalendarCheck, TrendingUp, ArrowUpRight, Zap, Inbox, Activity } from "lucide-react"
import Link from "next/link"
import { TaskRow } from "@/components/workspace/task-row"
import { DashboardCTAs } from "@/components/dashboard/dashboard-ctas"

export const revalidate = 30 // ISR: refresh every 30s

// ── OTA brand colours
const OTA_COLORS: Record<string, { text: string; dot: string; ring: string }> = {
    "Viator": { text: "text-orange-500", dot: "bg-orange-500", ring: "border-orange-500/30" },
    "Expedia": { text: "text-yellow-500", dot: "bg-yellow-500", ring: "border-yellow-500/30" },
    "Project Expedition": { text: "text-blue-500", dot: "bg-blue-500", ring: "border-blue-500/30" },
    "Klook": { text: "text-red-500", dot: "bg-red-500", ring: "border-red-500/30" },
}

// ── Minimal KPI Stats Card ───────────────────────────────────────────────────
// ── Premium KPI Stats Card ───────────────────────────────────────────────────
function StatsCard({ title, value, metric, icon: Icon, accentColor, bgColor }: any) {
    return (
        <div className="group relative bg-white/[0.02] border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/[0.04] transition-all duration-300 backdrop-blur-md overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            {/* Hover Circuit Accent */}
            <div className="absolute top-0 left-0 w-24 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                        {title}
                    </p>
                    <h3 className="text-3xl font-bold text-white font-syne tracking-tight group-hover:glow-white transition-all">
                        {value}
                    </h3>
                </div>
                <div className={cn("p-2.5 rounded-xl shrink-0 group-hover:scale-110 transition-all duration-500 shadow-inner", bgColor)}>
                    <Icon className={cn("h-4 w-4", accentColor)} />
                </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white/30 mt-1 relative z-10">
                <span className={cn("flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/5", accentColor)}>
                    {metric}
                </span>
            </div>
        </div>
    )
}

// ── Minimal OTA Channel Card ─────────────────────────────────────────────────
function OTACard({ channel }: { channel: any }) {
    const colors = OTA_COLORS[channel.name] ?? {
        text: "text-teal-400", dot: "bg-teal-400", ring: "border-teal-400/30"
    }
    const tourCount = channel._count?.channel_links ?? 0

    return (
        <div className="group flex items-center justify-between p-3.5 rounded-xl border border-transparent hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300 relative overflow-hidden">
            <div className="flex items-center gap-3 relative z-10">
                <div className="relative">
                    <span className={`w-2 h-2 rounded-full ${colors.dot} block shadow-[0_0_10px_rgba(41,255,198,0.5)]`} />
                    <span className={`absolute inset-0 rounded-full ${colors.dot} animate-ping opacity-20`} />
                </div>
                <div>
                    <p className="text-sm font-bold text-white tracking-tight">{channel.name}</p>
                    <p className="text-[11px] text-white/40 font-medium">{tourCount} tours activos</p>
                </div>
            </div>
            <div className="flex flex-col items-end relative z-10">
                <span className="text-[10px] font-bold bg-white/5 border border-white/10 text-white/60 px-2 py-0.5 rounded-lg tracking-widest">
                    {Number(channel.base_commission_percent).toFixed(0)}% COM
                </span>
            </div>
        </div>
    )
}

// ── Main Dashboard Page (Server Component) ───────────────────────────────────
export default async function DashboardPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    // Parallelized data fetches for performance — all three queries run simultaneously
    const [stats, channels, tasks] = await Promise.all([
        getGlobalFinanceStats(),
        prisma.distributionChannel.findMany({
            where: { is_active: true },
            include: { _count: { select: { channel_links: true } } },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.task.findMany({
            where: { assignee_id: userId, status: "inbox" },
            orderBy: { created_at: "desc" },
            take: 5
        })
    ]);

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20 relative">
            {/* Tech Pattern Overlay */}
            <div className="fixed inset-0 z-[-1] opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)' }} />

            {/* ── Page Header ──────────────────────────────────────── */}
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8 mt-2">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-6 bg-teal-500 rounded-full shadow-[0_0_12px_rgba(41,255,198,0.4)]" />
                        <h1 className="text-3xl font-bold text-white font-syne tracking-tight">
                            Resumen Operativo
                        </h1>
                    </div>
                    <p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] ml-3.5">
                        SAT Connect Control Central
                    </p>
                </div>
                <DashboardCTAs />
            </div>

            {/* ── Minimal KPI Row ───────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatsCard
                    title="Ventas Totales"
                    value={`$${stats.totalSales.toLocaleString()}`}
                    metric={`+${stats.growthPercent}% mensual`}
                    icon={DollarSign}
                    accentColor="text-emerald-600 dark:text-emerald-400"
                    bgColor="bg-emerald-100 dark:bg-emerald-500/10"
                />
                <StatsCard
                    title="Retención SAT"
                    value={`$${stats.retention.toLocaleString()}`}
                    metric="Net Margin Audit"
                    icon={TrendingUp}
                    accentColor="text-blue-600 dark:text-blue-400"
                    bgColor="bg-blue-100 dark:bg-blue-500/10"
                />
                <StatsCard
                    title="Reservas B2Bridge"
                    value={stats.bookingCount.toString()}
                    metric="Last 30 days"
                    icon={CalendarCheck}
                    accentColor="text-orange-600 dark:text-orange-400"
                    bgColor="bg-orange-100 dark:bg-orange-500/10"
                />
                <StatsCard
                    title="Proveedores"
                    value="18"
                    metric="3 alertas de riesgo"
                    icon={Users}
                    accentColor="text-rose-600 dark:text-rose-400"
                    bgColor="bg-rose-100 dark:bg-rose-500/10"
                />
            </div>

            {/* ── Hybrid Splite View ───────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Lado Izquierdo: Workspace Tasks */}
                <div className="lg:col-span-7 flex flex-col gap-5">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 shadow-[0_0_10px_rgba(41,255,198,0.1)]">
                                <Inbox className="w-4 h-4 text-teal-400" />
                            </div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Mis Tareas (Workspace)</h3>
                        </div>
                        <Link href="/dashboard/workspace/inbox" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 hover:text-teal-400 transition-colors">
                            Ver Todas
                        </Link>
                    </div>

                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex-1 backdrop-blur-md relative group/tasks">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />
                        {tasks.length === 0 ? (
                            <div className="p-12 text-center text-white/30 text-xs font-bold uppercase tracking-widest">
                                <Activity className="w-10 h-10 mx-auto mb-4 opacity-10" />
                                No hay tareas pendientes
                            </div>
                        ) : (
                            <div className="flex flex-col p-2">
                                {tasks.map(task => (
                                    <TaskRow key={task.id} task={task as any} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Lado Derecho: Distribución y Actividad */}
                <div className="lg:col-span-5 flex flex-col gap-8">

                    {/* Distribution Status */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl shadow-2xl p-5 backdrop-blur-md relative">
                        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] opacity-40">
                                Canales OTA Activos
                            </h3>
                            <Link href="/dashboard/channels" className="text-[10px] font-bold text-teal-400/60 uppercase tracking-widest hover:text-teal-400 transition-colors">
                                Gestionar
                            </Link>
                        </div>
                        <div className="flex flex-col gap-1 -mx-2">
                            {channels.length === 0 ? (
                                <p className="text-xs text-white/20 px-2 font-bold uppercase tracking-widest py-4 text-center">Sin canales activos</p>
                            ) : (
                                channels.map(channel => (
                                    <OTACard key={channel.id} channel={channel} />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl shadow-2xl p-6 backdrop-blur-md relative flex-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-1 px-2 rounded-md bg-white/5 border border-white/10">
                                <Activity className="w-3.5 h-3.5 text-white/40" />
                            </div>
                            <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] opacity-40">
                                Actividad Crítica
                            </h3>
                        </div>
                        <div className="space-y-6">
                            {[
                                { text: "Viator actualizó las políticas de cancelación de 5 tours.", time: "Hace 10 min", highlight: "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]" },
                                { text: "Diego aprobó Proveedor 'Mayan Heritage'.", time: "Hace 1 hora", highlight: "bg-teal-500 shadow-[0_0_10px_rgba(41,255,198,0.3)]" },
                                { text: "Alerta de Gatekeeper: 'Tulum Express' bajo riesgo de margen.", time: "Hace 3 horas", highlight: "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]" },
                            ].map((event, i) => (
                                <div key={i} className="flex gap-4 group/item">
                                    <div className="mt-1 flex flex-col items-center">
                                        <div className={`w-2 h-2 rounded-full ${event.highlight} transition-all duration-300 group-hover/item:scale-125`} />
                                        {i !== 2 && <div className="w-px h-10 bg-white/5 mt-1" />}
                                    </div>
                                    <div className="pb-1 max-w-[280px]">
                                        <p className="text-xs text-white/80 font-bold leading-relaxed tracking-tight group-hover:text-white transition-colors">{event.text}</p>
                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1.5 block">{event.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div >
    )
}
