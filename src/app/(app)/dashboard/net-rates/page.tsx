"use client"

import { Globe, Search, Filter, TrendingUp, ShieldCheck, Zap, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NetRatesPage() {
    return (
        <div className="flex flex-col gap-6 p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[#29FFC6] mb-1">
                    <Zap className="h-4 w-4" />
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Control de Tarifas</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-white">
                    Net Rate <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#29FFC6] to-[#2E7D32]">Tracker</span>
                </h1>
                <p className="text-gray-400 text-sm">
                    Monitoreo en tiempo real de costos de proveedor, comparativa de márgenes y calibración del T.H.R.I.V.E. Engine.
                </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "SKUs Auditados", value: "1,240", icon: ShieldCheck, color: "text-blue-400" },
                    { label: "Varianza Promedio", value: "±2.1%", icon: TrendingUp, color: "text-[#29FFC6]" },
                    { label: "Sync Status", value: "Active", icon: Zap, color: "text-yellow-400" },
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <span className="text-xl font-black text-white">{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* Tracker Interface Placeholder */}
            <div className="relative mt-4">
                <div className="glass-card rounded-3xl border border-white/5 p-8 flex flex-col items-center justify-center text-center gap-6 min-h-[400px]">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Globe className="h-64 w-64 -rotate-12" />
                    </div>

                    <div className="relative z-10 space-y-6 flex flex-col items-center">
                        <div className="p-4 rounded-2xl bg-white/5 text-gray-400">
                            <Search className="h-10 w-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white">Motor de Comparativa en Calibración</h3>
                            <p className="text-gray-500 max-w-sm mx-auto text-sm">
                                El rastreador de tarifas netas está sincronizando los últimos cambios de precios de los proveedores directos. La búsqueda avanzada estará disponible en breve.
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-1 flex w-full max-w-md">
                            <Input placeholder="Buscar por tour o destino..." className="bg-transparent border-none text-gray-300 focus-visible:ring-0" />
                            <Button className="bg-[#29FFC6] text-[#07101E] font-bold text-xs h-9 px-6 rounded-lg">Cargar Index</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
