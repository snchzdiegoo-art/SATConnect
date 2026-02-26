"use client"

import { useState } from "react"
import {
    Briefcase,
    Activity,
    Globe,
    ArrowUpRight,
    TrendingUp,
    Users,
    Wallet,
    Search,
    Filter,
    Plus,
    CheckCircle2,
    Clock,
    MoreVertical,
    ChevronRight,
    Settings,
    ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export default function AgencyClient() {
    const [activeTab, setActiveTab] = useState("directory")

    return (
        <div className="flex flex-col gap-6 p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[#29FFC6] mb-1">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Control de Operaciones</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white">
                        Agency <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#29FFC6] to-[#2E7D32]">Manager</span>
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Base de datos maestra de agencias aliadas, control de markups y auditoría de histórico de ventas.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-white/10 bg-white/5 text-xs h-9 hover:bg-white/10 text-gray-300">
                        <Activity className="h-3.5 w-3.5 mr-2" />
                        Reporte Global
                    </Button>
                    <Button className="bg-[#29FFC6] text-[#07101E] font-bold text-xs h-9 hover:shadow-[0_0_15px_rgba(41,255,198,0.4)] transition-all">
                        <Plus className="h-3.5 w-3.5 mr-2" />
                        Registrar Agencia
                    </Button>
                </div>
            </div>

            {/* Quick Audit Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Ventas Netas Totales", value: "$45,280", icon: Wallet, color: "text-[#29FFC6]", sub: "Últimos 30 días" },
                    { label: "Agencias Verificadas", value: "24", icon: ShieldCheck, color: "text-blue-400", sub: "+3 esta semana" },
                    { label: "Reservas Activas", value: "112", icon: Activity, color: "text-purple-400", sub: "Marketplace B2Bridge" },
                    { label: "Margen Admin", value: "15%", icon: TrendingUp, color: "text-emerald-400", sub: "Target Estratégico" },
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-4 rounded-xl border border-white/5 group hover:border-[#29FFC6]/20 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={cn("p-2 rounded-lg bg-white/5", stat.color)}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black text-white">{stat.value}</span>
                            <span className="text-[10px] text-gray-500 font-medium">{stat.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main CRM Workspace */}
            <div className="mt-2">
                <Tabs defaultValue="directory" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="bg-white/5 border border-white/10 p-1 mb-6 rounded-xl">
                        <TabsTrigger value="directory" className="rounded-lg px-6 data-[state=active]:bg-[#29FFC6] data-[state=active]:text-[#07101E] font-bold text-xs">Directorio</TabsTrigger>
                        <TabsTrigger value="history" className="rounded-lg px-6 data-[state=active]:bg-[#29FFC6] data-[state=active]:text-[#07101E] font-bold text-xs">Historial de Ventas</TabsTrigger>
                        <TabsTrigger value="config" className="rounded-lg px-6 data-[state=active]:bg-[#29FFC6] data-[state=active]:text-[#07101E] font-bold text-xs">Configuración</TabsTrigger>
                    </TabsList>

                    <TabsContent value="directory" className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                        {/* Filters & Search */}
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input placeholder="Buscar por agencia o agente..." className="pl-10 bg-white/5 border-white/10 text-gray-300 rounded-xl focus:border-[#29FFC6]/50" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" className="text-xs text-gray-400 hover:bg-white/5">
                                    <Filter className="h-3.5 w-3.5 mr-2" />
                                    Filtros Avanzados
                                </Button>
                            </div>
                        </div>

                        {/* CRM Table */}
                        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/5">
                                        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Agencia / Empresa</th>
                                        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Estado</th>
                                        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Tier</th>
                                        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Ventas (30d)</th>
                                        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Markup</th>
                                        <th className="p-4 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { name: "Viajes Pacífico S.A.", agent: "Carlos Mendoza", status: "Verified", tier: "GOLD", sales: "$12,400", markup: "15%", date: "hace 2 días" },
                                        { name: "Expediciones del Caribe", agent: "Ana Sofía Ruiz", status: "Pending", tier: "BRONZE", sales: "$2,850", markup: "18%", date: "hace 5 min" },
                                        { name: "Luxury Travel Experts", agent: "Roberto Gómez", status: "Verified", tier: "SILVER", sales: "$8,900", markup: "15%", date: "hace 1 semana" },
                                    ].map((agency, i) => (
                                        <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white group-hover:text-[#29FFC6] transition-colors">{agency.name}</span>
                                                    <span className="text-[10px] text-gray-500">{agency.agent}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className={cn(
                                                    "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold",
                                                    agency.status === "Verified" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                                                )}>
                                                    {agency.status === "Verified" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                                    {agency.status}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={cn(
                                                    "text-[10px] font-black px-2 py-0.5 rounded border",
                                                    agency.tier === "GOLD" ? "border-yellow-500/50 text-yellow-500/80 bg-yellow-500/5" :
                                                        agency.tier === "SILVER" ? "border-gray-400/50 text-gray-400 bg-gray-400/5" :
                                                            "border-orange-500/50 text-orange-400 bg-orange-500/5"
                                                )}>
                                                    {agency.tier}
                                                </span>
                                            </td>
                                            <td className="p-4 font-mono text-sm text-gray-300">{agency.sales}</td>
                                            <td className="p-4 text-sm text-[#29FFC6] font-bold">{agency.markup}</td>
                                            <td className="p-4 text-right">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-white hover:bg-white/10">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="p-4 bg-white/[0.02] flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                <span>Mostrando 3 de 24 agencias</span>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="h-6 px-3 hover:bg-white/10 text-gray-400">Anterior</Button>
                                    <Button variant="ghost" size="sm" className="h-6 px-3 hover:bg-white/10 text-gray-400">Siguiente</Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="animate-in fade-in slide-in-from-top-2 duration-500">
                        <div className="glass-card rounded-2xl border border-white/5 p-12 flex flex-col items-center justify-center text-center gap-4">
                            <div className="p-4 rounded-full bg-white/5 text-gray-600">
                                <Clock className="h-12 w-12" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Módulo de Conciliación en Espera</h3>
                            <p className="text-gray-500 max-w-sm">
                                Los datos históricos se están sincronizando con el servidor B2Bridge. Las reservas podrán ser auditadas aquí próximamente.
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="config" className="animate-in fade-in slide-in-from-top-2 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-6">
                                <div className="flex items-center gap-3">
                                    <Settings className="h-5 w-5 text-[#29FFC6]" />
                                    <h3 className="text-lg font-bold text-white">Global Pricing Rules</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Markup Base (Default)</label>
                                        <div className="flex items-center gap-3">
                                            <Input defaultValue="1.15" className="bg-white/5 border-white/10 text-white font-mono w-24 h-10" />
                                            <span className="text-sm text-gray-400">Multiplier (x1.15 = 15%)</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-400">Permitir markups variables</span>
                                            <div className="h-5 w-10 bg-[#29FFC6] rounded-full relative shadow-[0_0_10px_rgba(41,255,198,0.3)]">
                                                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-[#07101E] rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button className="w-full bg-[#29FFC6] text-[#07101E] font-bold text-xs h-10">Guardar Cambios Globales</Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
