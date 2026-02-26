"use client"

import { Activity, Wallet, ArrowUpRight, Clock, ShieldCheck, TrendingUp, History } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CommissionsPage() {
    return (
        <div className="flex flex-col gap-6 p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[#29FFC6] mb-1">
                    <Wallet className="h-4 w-4" />
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Finanzas B2B</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-white">
                    Commissions <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#29FFC6] to-[#2E7D32]">Hub</span>
                </h1>
                <p className="text-gray-400 text-sm">
                    Gestión de pagos a agencias, conciliación de reservas y auditoría de comisiones SAT.
                </p>
            </div>

            {/* Hub Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Pendiente por Pagar", value: "$8,420", icon: Clock, color: "text-yellow-400" },
                    { label: "Pagado (Este Mes)", value: "$12,150", icon: Wallet, color: "text-[#29FFC6]" },
                    { label: "Comisión SAT (Retention)", value: "3.5%", icon: TrendingUp, color: "text-blue-400" },
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <stat.icon className={StatIconStyles(stat.color)} />
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <span className="text-xl font-black text-white">{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* Hub Content Placeholder */}
            <div className="glass-card p-12 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center gap-6 mt-4">
                <div className="relative">
                    <div className="p-6 rounded-full bg-[#29FFC6]/10 text-[#29FFC6]">
                        <Activity className="h-12 w-12" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">Módulo de Auditoría Financiera</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        Este módulo está siendo alimentado por el historial de reservas de B2Bridge. Los reportes detallados estarán disponibles tras la primera conciliación del mes.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button className="bg-[#29FFC6] text-[#07101E] font-bold px-8 h-10">Explorar Documentación</Button>
                    <Button variant="outline" className="border-white/10 text-gray-400 h-10">Sincronizar Ledger</Button>
                </div>
            </div>
        </div>
    )
}

function StatIconStyles(color: string) {
    return `h-4 w-4 ${color}`
}
