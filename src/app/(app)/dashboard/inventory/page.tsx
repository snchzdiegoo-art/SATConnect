"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Plus, AlertTriangle, CheckCircle, Smartphone } from "lucide-react"
import { auditTour, TourInput } from "@/lib/thrive-engine"

// Initial Mock Data (Simulating a DB Fetch)
const MOCK_DB: TourInput[] = [
    {
        id: "10563",
        name: "Chichen Itza Deluxe & Cenote",
        provider: "Mundo Maya",
        netRate: 1200,
        publicPrice: 2800,
        images: ["url"],
        description: "Full day experience"
    },
    {
        id: "internal_99",
        name: "Tulum Express (Low Margin Test)",
        provider: "Caribe VIP",
        netRate: 800,
        publicPrice: 950, // Factor ~1.18 -> Should trigger B2C ONLY
        images: ["url"],
        description: "Fast tour"
    },
    {
        id: "internal_100",
        name: "Incomplete Tour Data",
        provider: "Unknown",
        netRate: 0, // Critical Error
        publicPrice: 0,
        images: [],
        description: "" // Missing
    }
]

export default function InventoryPage() {
    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Inventario (Tours)</h1>
                    <p className="text-gray-400">Gestiona tus productos y audita su salud con <span className="text-teal-400 font-bold">THRIVE™ Engine</span>.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" className="border-gray-700 bg-gray-800 text-gray-300">
                        Importar Excel
                    </Button>
                    <Button variant="primary" className="bg-teal-600 hover:bg-teal-500">
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Tour
                    </Button>
                </div>
            </div>

            {/* Filters (Mock) */}
            <div className="flex items-center gap-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input placeholder="Buscar por Nombre o ID..." className="pl-9 bg-gray-950 border-gray-800 text-gray-200" />
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-white/5">Todos</Badge>
                    <Badge variant="outline" className="cursor-pointer border-green-500/30 text-green-400 hover:bg-green-500/10">Healthy</Badge>
                    <Badge variant="outline" className="cursor-pointer border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10">Warnings</Badge>
                    <Badge variant="outline" className="cursor-pointer border-red-500/30 text-red-400 hover:bg-red-500/10">Critical</Badge>
                </div>
            </div>

            {/* Modern List / Table */}
            <div className="grid gap-4">
                {MOCK_DB.map((tour) => {
                    // RUN THE ENGINE LIVE
                    const audit = auditTour(tour)
                    const eco = audit.economics

                    return (
                        <Card key={tour.id} className="p-4 bg-gray-900 border-gray-800 hover:border-teal-500/30 transition-all group">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                {/* Image Placeholder */}
                                <div className="w-16 h-16 rounded-lg bg-gray-800 flex-shrink-0 flex items-center justify-center text-gray-600 font-bold">
                                    IMG
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-mono text-gray-500 bg-gray-950 px-1.5 py-0.5 rounded">
                                            {tour.id?.startsWith("internal") ? "INT" : "BOKUN"} :: {tour.id}
                                        </span>
                                        {audit.healthScore === "HEALTHY" && (
                                            <Badge variant="outline" className="text-green-400 border-green-500/30 bg-green-500/10 text-[10px] px-1.5 py-0">HEALTHY</Badge>
                                        )}
                                        {audit.healthScore === "INCOMPLETE" && (
                                            <Badge variant="outline" className="text-yellow-400 border-yellow-500/30 bg-yellow-500/10 text-[10px] px-1.5 py-0">WARNING</Badge>
                                        )}
                                        {audit.healthScore === "CRITICAL" && (
                                            <Badge variant="outline" className="text-red-400 border-red-500/30 bg-red-500/10 text-[10px] px-1.5 py-0">CRITICAL</Badge>
                                        )}
                                    </div>
                                    <h3 className="text-white font-bold truncate group-hover:text-teal-400 transition-colors">
                                        {tour.name || "Sin Nombre"}
                                    </h3>
                                    <p className="text-sm text-gray-500 truncate">{tour.provider}</p>

                                    {/* Missing Fields List */}
                                    {audit.missingFields.length > 0 && (
                                        <div className="flex gap-2 mt-2">
                                            {audit.missingFields.map(f => (
                                                <span key={f} className="text-[10px] text-red-300 bg-red-900/20 px-1.5 rounded border border-red-900/50">
                                                    Missing: {f}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Economics Engine Visualization */}
                                <div className="flex items-center gap-6 md:border-l md:border-gray-800 md:pl-6 w-full md:w-auto mt-4 md:mt-0 justify-between md:justify-end">
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500 mb-0.5">Net Rate</div>
                                        <div className="font-mono text-gray-300">${tour.netRate}</div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-xs text-gray-500 mb-0.5">Public (PVP)</div>
                                        <div className="font-mono text-white font-bold">${tour.publicPrice}</div>
                                    </div>

                                    <div className="text-right min-w-[80px]">
                                        <div className="text-xs text-gray-500 mb-0.5">Margin / Factor</div>
                                        <div className={`font-mono font-bold ${eco.status === "B2C_ONLY" ? "text-yellow-500" : eco.status === "LOSS_WARNING" ? "text-red-500" : "text-green-400"}`}>
                                            {eco.multiplier}x
                                        </div>
                                        {eco.status === "B2C_ONLY" && (
                                            <span className="text-[8px] uppercase font-bold text-yellow-500 block">B2C Only</span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                        <AlertTriangle className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
