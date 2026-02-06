"use client"

import { TourInput, TourDiagnostics, auditTour } from "@/lib/thrive-engine"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, AlertCircle, Activity } from "lucide-react"

interface PriorityBannerProps {
    tours: TourInput[]
    onPriorityClick: () => void
}

export function PriorityBanner({ tours, onPriorityClick }: PriorityBannerProps) {
    // Calculate diagnostics for all tours
    const diagnostics = tours.map(tour => ({
        tour,
        diag: auditTour(tour)
    }))

    // Categorize tours by priority
    const critical = diagnostics.filter(d =>
        d.diag.health.score === 'CRITICAL'
    )

    const incomplete = diagnostics.filter(d =>
        d.diag.health.score === 'INCOMPLETE'
    )

    const poorDistribution = diagnostics.filter(d =>
        d.diag.distribution.activeCount < 2
    )

    const lowMargin = diagnostics.filter(d =>
        d.diag.economics.status === 'LOSS_WARNING'
    )

    const totalNeedingAttention = critical.length + incomplete.length

    // Don't show banner if everything is healthy
    if (totalNeedingAttention === 0 && poorDistribution.length === 0 && lowMargin.length === 0) {
        return null
    }

    return (
        <Card className="bg-gradient-to-r from-red-950/40 via-orange-950/30 to-yellow-950/20 border-red-800/50 p-5">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        <h3 className="font-bold text-lg text-red-300">
                            {totalNeedingAttention > 0
                                ? `⚠️ ${totalNeedingAttention} ${totalNeedingAttention === 1 ? 'Tour Requiere' : 'Tours Requieren'} Atención Urgente`
                                : '📊 Alertas de Inventario'
                            }
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Critical Tours */}
                        {critical.length > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="bg-red-900/50 p-2 rounded">
                                    <AlertCircle className="h-4 w-4 text-red-300" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-red-300">{critical.length}</div>
                                    <div className="text-xs text-red-400">Críticos</div>
                                </div>
                            </div>
                        )}

                        {/* Incomplete Tours */}
                        {incomplete.length > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="bg-orange-900/50 p-2 rounded">
                                    <AlertTriangle className="h-4 w-4 text-orange-300" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-orange-300">{incomplete.length}</div>
                                    <div className="text-xs text-orange-400">Incompletos</div>
                                </div>
                            </div>
                        )}

                        {/* Poor Distribution */}
                        {poorDistribution.length > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="bg-yellow-900/50 p-2 rounded">
                                    <Activity className="h-4 w-4 text-yellow-300" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-yellow-300">{poorDistribution.length}</div>
                                    <div className="text-xs text-yellow-400">Pobre Distribución</div>
                                </div>
                            </div>
                        )}

                        {/* Low Margin */}
                        {lowMargin.length > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="bg-amber-900/50 p-2 rounded">
                                    <span className="text-amber-300 font-bold text-sm">$</span>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-amber-300">{lowMargin.length}</div>
                                    <div className="text-xs text-amber-400">Margen Bajo</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="mt-4 text-sm text-gray-400">
                        <span className="text-gray-500">Prioridades:</span>
                        {' '}
                        {critical.length > 0 && <span className="text-red-400">{critical.length} críticos</span>}
                        {critical.length > 0 && (incomplete.length > 0 || poorDistribution.length > 0) && <span className="text-gray-600"> • </span>}
                        {incomplete.length > 0 && <span className="text-orange-400">{incomplete.length} con datos faltantes</span>}
                        {incomplete.length > 0 && poorDistribution.length > 0 && <span className="text-gray-600"> • </span>}
                        {poorDistribution.length > 0 && <span className="text-yellow-400">{poorDistribution.length} con distribución limitada</span>}
                    </div>
                </div>

                <Button
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-900/20 shrink-0"
                    onClick={onPriorityClick}
                >
                    Ver Prioritarios
                </Button>
            </div>
        </Card>
    )
}
