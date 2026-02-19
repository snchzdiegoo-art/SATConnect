"use client"

import { useEffect, useState } from "react"
import { DollarSign, Users, CalendarCheck, TrendingUp, ArrowUpRight, Zap } from "lucide-react"
import Link from "next/link"

// ── Type helpers ────────────────────────────────────────────────────────────
interface Channel {
    id: number
    name: string
    base_commission_percent: number
    is_active: boolean
    _count?: { tour_links: number }
}

// OTA brand colours
const OTA_COLORS: Record<string, { text: string; dot: string; ring: string }> = {
    "Viator": { text: "text-orange-400", dot: "bg-orange-400", ring: "border-orange-400/30" },
    "Expedia": { text: "text-yellow-400", dot: "bg-yellow-400", ring: "border-yellow-400/30" },
    "Project Expedition": { text: "text-blue-400", dot: "bg-blue-400", ring: "border-blue-400/30" },
    "Klook": { text: "text-red-400", dot: "bg-red-400", ring: "border-red-400/30" },
}

// ── KPI Stats Card ──────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StatsCard({ title, value, metric, icon: Icon, accentColor, bgColor }: any) {
    return (
        <div className={`
            card-glass card-glass-hover p-5 group cursor-default
            animate-slide-in
        `}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                        {title}
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white font-display leading-none">
                        {value}
                    </h3>
                </div>
                <div className={`p-2.5 rounded-xl ${bgColor} shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-5 w-5 ${accentColor}`} />
                </div>
            </div>
            <div className={`
                inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full
                ${bgColor} ${accentColor}
            `}>
                <ArrowUpRight className="h-3 w-3" />
                {metric}
            </div>
        </div>
    )
}

// ── OTA Channel Mini Card ───────────────────────────────────────────────────
function OTACard({ channel }: { channel: Channel }) {
    const colors = OTA_COLORS[channel.name] ?? {
        text: "text-purple-400", dot: "bg-purple-400", ring: "border-purple-400/30"
    }
    const tourCount = channel._count?.tour_links ?? 0

    return (
        <div className={`flex items-center gap-3 p-3 rounded-xl border ${colors.ring} dark:border-opacity-40 bg-white/30 dark:bg-white/[0.03] hover:bg-white/50 dark:hover:bg-white/[0.06] transition-all duration-200`}>
            <span className={`w-2 h-2 rounded-full ${colors.dot} animate-pulse-glow shrink-0`} />
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${colors.text} truncate`}>{channel.name}</p>
                <p className="text-xs text-gray-400">{tourCount} tours · {Number(channel.base_commission_percent).toFixed(0)}% comisión</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-medium border border-emerald-500/20">
                Activo
            </span>
        </div>
    )
}

// ── Main Dashboard Page ─────────────────────────────────────────────────────
export default function DashboardPage() {
    const [channels, setChannels] = useState<Channel[]>([])

    useEffect(() => {
        fetch("/api/channels")
            .then(r => r.json())
            .then(d => setChannels((d.channels ?? []).filter((c: Channel) => c.is_active)))
            .catch(() => { })
    }, [])

    return (
        <div className="space-y-7 animate-slide-in">
            {/* ── Page Header ──────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display">
                        Resumen
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Bienvenido de vuelta, Diego. Aquí está lo que está pasando hoy.
                    </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                    <Link
                        href="/dashboard/inventory"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-white/[0.08] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
                    >
                        Exportar Reporte
                    </Link>
                    <Link
                        href="/dashboard/inventory"
                        className="btn-teal"
                    >
                        <Zap className="h-3.5 w-3.5" />
                        Nueva Reserva
                    </Link>
                </div>
            </div>

            {/* ── KPI Row ───────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Ventas Totales"
                    value="$124,500"
                    metric="+12% vs mes anterior"
                    icon={DollarSign}
                    accentColor="text-emerald-500 dark:text-emerald-400"
                    bgColor="bg-emerald-500/10"
                />
                <StatsCard
                    title="Reservas Activas"
                    value="342"
                    metric="+5 nuevos hoy"
                    icon={CalendarCheck}
                    accentColor="text-blue-500 dark:text-blue-400"
                    bgColor="bg-blue-500/10"
                />
                <StatsCard
                    title="Tasa de Ocupación"
                    value="87%"
                    metric="Top: Chichen Itza"
                    icon={TrendingUp}
                    accentColor="text-orange-500 dark:text-orange-400"
                    bgColor="bg-orange-500/10"
                />
                <StatsCard
                    title="Clientes Nuevos"
                    value="18"
                    metric="Esta semana"
                    icon={Users}
                    accentColor="text-purple-500 dark:text-purple-400"
                    bgColor="bg-purple-500/10"
                />
            </div>

            {/* ── Lower Grid ───────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Actividad Reciente */}
                <div className="card-glass p-5">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white font-display mb-4">
                        Actividad Reciente
                    </h3>
                    <div className="space-y-2">
                        {[
                            { initials: "JS", name: "Juan Soto", tour: "Chichen Itza Deluxe", amount: "$1,200 MXN", time: "Hace 5 min", color: "from-teal-500 to-blue-600" },
                            { initials: "MR", name: "María Ramírez", tour: "Tulum & Cenote", amount: "$850 MXN", time: "Hace 18 min", color: "from-purple-500 to-pink-600" },
                            { initials: "CL", name: "Carlos López", tour: "Isla Mujeres Full Day", amount: "$1,450 MXN", time: "Hace 42 min", color: "from-orange-500 to-amber-600" },
                        ].map((item) => (
                            <div key={item.initials + item.time} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors cursor-pointer group">
                                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm`}>
                                    {item.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight">
                                        <span>{item.name}</span>
                                        {" · "}
                                        <span className="text-teal-600 dark:text-[#29FFC6]">{item.tour}</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">{item.time} · {item.amount}</p>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-teal-500 dark:group-hover:text-[#29FFC6] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Estado de Canales OTA — real data */}
                <div className="card-glass p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white font-display">
                            Estado de Canales OTA
                        </h3>
                        <Link
                            href="/dashboard/channels"
                            className="text-xs text-teal-600 dark:text-[#29FFC6] hover:underline font-medium"
                        >
                            Gestionar →
                        </Link>
                    </div>

                    {channels.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/[0.05] flex items-center justify-center mb-3">
                                <TrendingUp className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Cargando canales...</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {channels.map(channel => (
                                <OTACard key={channel.id} channel={channel} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
