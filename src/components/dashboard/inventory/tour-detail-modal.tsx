"use client"

import { TourInput } from "@/lib/thrive-engine"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, DollarSign, Users, ExternalLink, AlertCircle, Globe2 } from "lucide-react"

interface TourDetailModalProps {
    tour: TourInput | null
    isOpen: boolean
    onClose: () => void
}

export function TourDetailModal({ tour, isOpen, onClose }: TourDetailModalProps) {
    if (!tour) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[900px] bg-gray-900 border-gray-800 text-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-teal-400">
                        {tour.name}
                    </DialogTitle>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="outline" className="text-blue-400 border-blue-400">
                            {tour.provider}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                            ID: {tour.id}
                        </Badge>
                        {tour.location && (
                            <Badge variant="outline" className="text-xs text-green-400 border-green-600">
                                <MapPin className="h-3 w-3 mr-1" />
                                {tour.location}
                            </Badge>
                        )}
                    </div>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Economics - Two Column Layout: SHARED vs PRIVATE */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* SHARED Column */}
                        <div className="bg-gradient-to-br from-green-950/40 to-gray-950 p-5 rounded-lg border border-green-900/50">
                            <h3 className="font-bold text-green-400 mb-4 text-center text-lg flex items-center justify-center gap-2">
                                <Users className="h-5 w-5" />
                                COMPARTIDO
                            </h3>

                            {/* Adult Rates */}
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400">Neto Adulto:</span>
                                    <span className="text-xl font-bold text-green-400">${tour.netRate?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400">PVP Sugerido:</span>
                                    <span className="text-lg font-semibold text-green-300">${tour.publicPrice?.toFixed(2) || '0.00'}</span>
                                </div>
                                {tour.factorShared && tour.factorShared > 0 && (
                                    <div className="flex justify-between items-center border-t border-green-900/30 pt-2">
                                        <span className="text-xs text-gray-500">Factor:</span>
                                        <span className="text-sm font-mono text-gray-400">{tour.factorShared.toFixed(2)}x</span>
                                    </div>
                                )}
                            </div>

                            {/* Child Rates */}
                            {(tour.netChild && tour.netChild > 0) && (
                                <div className="border-t border-green-900/30 pt-4 space-y-2">
                                    <div className="text-xs text-gray-500 mb-2">NIÑO:</div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400">Neto Niño:</span>
                                        <span className="text-lg font-bold text-green-400">${tour.netChild.toFixed(2)}</span>
                                    </div>
                                    {tour.publicChild && tour.publicChild > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-400">PVP Niño:</span>
                                            <span className="text-sm font-semibold text-green-300">${tour.publicChild.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Min Pax */}
                            {tour.minPaxShared && tour.minPaxShared > 1 && (
                                <div className="mt-4 pt-4 border-t border-green-900/30">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Mínimo PAX:</span>
                                        <Badge className="bg-green-600">{tour.minPaxShared}</Badge>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* PRIVATE Column */}
                        <div className="bg-gradient-to-br from-blue-950/40 to-gray-950 p-5 rounded-lg border border-blue-900/50">
                            <h3 className="font-bold text-blue-400 mb-4 text-center text-lg flex items-center justify-center gap-2">
                                <Users className="h-5 w-5" />
                                PRIVADO
                            </h3>

                            {(tour.netPrivate && tour.netPrivate > 0) ? (
                                <>
                                    {/* Private Rates */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-400">Neto Privado:</span>
                                            <span className="text-xl font-bold text-blue-400">${tour.netPrivate.toFixed(2)}</span>
                                        </div>
                                        {tour.publicPrivate && tour.publicPrivate > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-400">PVP Sugerido:</span>
                                                <span className="text-lg font-semibold text-blue-300">${tour.publicPrivate.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {tour.factorPrivate && tour.factorPrivate > 0 && (
                                            <div className="flex justify-between items-center border-t border-blue-900/30 pt-2">
                                                <span className="text-xs text-gray-500">Factor:</span>
                                                <span className="text-sm font-mono text-gray-400">{tour.factorPrivate.toFixed(2)}x</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Min Pax */}
                                    {tour.minPaxPrivate && tour.minPaxPrivate > 1 && (
                                        <div className="mt-4 pt-4 border-t border-blue-900/30">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">Mínimo PAX:</span>
                                                <Badge className="bg-blue-600">{tour.minPaxPrivate}</Badge>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-600 text-sm">
                                    No disponible
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Infant Age */}
                    {tour.infantAge && (
                        <div className="bg-yellow-950/20 border border-yellow-900/50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-yellow-400">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-xs font-semibold">EDAD INFANTE:</span>
                                <span className="font-bold">{tour.infantAge}</span>
                            </div>
                        </div>
                    )}

                    {/* Technical Specs */}
                    {(tour.duration || tour.opsDays || tour.cxlPolicy) && (
                        <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                            <h3 className="font-semibold text-gray-300 mb-3">Especificaciones Técnicas</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {tour.duration && (
                                    <div>
                                        <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                                            <Clock className="h-3 w-3" />
                                            Duración
                                        </div>
                                        <div className="text-sm text-white">{tour.duration}</div>
                                    </div>
                                )}
                                {tour.opsDays && (
                                    <div>
                                        <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                                            <Calendar className="h-3 w-3" />
                                            Días de Operación
                                        </div>
                                        <div className="text-sm text-white">{tour.opsDays}</div>
                                    </div>
                                )}
                                {tour.cxlPolicy && (
                                    <div>
                                        <div className="text-gray-500 text-xs mb-1">Cancelación</div>
                                        <div className="text-sm text-white">{tour.cxlPolicy}</div>
                                    </div>
                                )}
                            </div>
                            {tour.meetingPoint && (
                                <div className="mt-3 pt-3 border-t border-gray-800">
                                    <div className="text-gray-500 text-xs mb-1">Punto de Encuentro</div>
                                    <div className="text-sm text-white">{tour.meetingPoint}</div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Extra Fees */}
                    {tour.extraFees && (
                        <div className="bg-orange-950/20 border border-orange-900/50 p-4 rounded-lg">
                            <h3 className="font-semibold text-orange-400 mb-2 flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Costos Adicionales
                            </h3>
                            <p className="text-sm text-gray-300">{tour.extraFees}</p>
                        </div>
                    )}

                    {/* Storytelling */}
                    {tour.storytelling && (
                        <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                            <h3 className="font-semibold text-gray-300 mb-2">Storytelling</h3>
                            <a
                                href={tour.storytelling}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-teal-400 hover:text-teal-300 flex items-center gap-2 break-all"
                            >
                                {tour.storytelling}
                                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            </a>
                        </div>
                    )}

                    {/* Landing Page */}
                    {tour.landingPageUrl && (
                        <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                            <h3 className="font-semibold text-gray-300 mb-2">Landing Page</h3>
                            <a
                                href={tour.landingPageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-teal-400 hover:text-teal-300 flex items-center gap-2 break-all"
                            >
                                {tour.landingPageUrl}
                                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            </a>
                        </div>
                    )}

                    {/* Distribution Channels */}
                    {tour.channels && Object.keys(tour.channels).length > 0 && (
                        <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                            <h3 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                                <Globe2 className="h-4 w-4" />
                                Distribución OTA
                            </h3>
                            <div className="grid grid-cols-4 gap-3">
                                {Object.entries(tour.channels).map(([channel, status]) => (
                                    <div key={channel} className="text-center">
                                        <div className="text-xs text-gray-500 mb-1 capitalize">{channel}</div>
                                        <Badge
                                            variant={status === "Active" ? "primary" : "outline"}
                                            className={status === "Active" ? "bg-green-600" : "text-gray-500 border-gray-700"}
                                        >
                                            {status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Images */}
                    {tour.images && tour.images.length > 0 && (
                        <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                            <h3 className="font-semibold text-gray-300 mb-3">Imágenes</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {tour.images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`${tour.name} ${idx + 1}`}
                                        className="w-full h-48 object-cover rounded-lg border border-gray-700"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Audit Notes */}
                    {tour.auditNotes && (
                        <div className="bg-gray-950/50 border border-gray-700 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-400 mb-2 text-xs">NOTAS DE AUDITORÍA</h3>
                            <p className="text-sm text-gray-500 italic">{tour.auditNotes}</p>
                        </div>
                    )}

                    {/* Last Update */}
                    {tour.lastUpdate && (
                        <div className="text-center text-xs text-gray-600">
                            Última actualización: {tour.lastUpdate}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
