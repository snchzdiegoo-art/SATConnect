"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TourInput } from "@/lib/thrive-engine"
import { Loader2, Save } from "lucide-react"

interface TourEditModalProps {
    tour?: TourInput | null
    isOpen: boolean
    onClose: () => void
    onSave: () => void
}

export function TourEditModal({ tour, isOpen, onClose, onSave }: TourEditModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState<Partial<TourInput>>({
        id: "",
        name: "",
        provider: "",
        netRate: 0,
        publicPrice: 0,
        duration: "",
        opsDays: "",
        cxlPolicy: "",
        meetingPoint: "",
        landingPageUrl: "",
        storytelling: "",
        location: "",
        region: "",
        activityType: "",
        tourType: "",
        images: [],
    })

    // Populate form when editing existing tour
    useEffect(() => {
        if (tour) {
            setFormData(tour)
        } else {
            // Reset for new tour
            setFormData({
                id: "",
                name: "",
                provider: "",
                netRate: 0,
                publicPrice: 0,
                duration: "",
                opsDays: "",
                cxlPolicy: "",
                meetingPoint: "",
                landingPageUrl: "",
                storytelling: "",
                location: "",
                region: "",
                activityType: "",
                tourType: "",
                images: [],
            })
        }
    }, [tour, isOpen])

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const method = tour ? 'PUT' : 'POST'
            const url = tour ? `/api/tours/${tour.id}` : '/api/tours'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                const error = await response.text()
                throw new Error(error)
            }

            onSave()
            onClose()
        } catch (error) {
            console.error('Save error:', error)
            alert(`Error al guardar: ${error}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[900px] bg-gray-900 border-gray-800 text-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{tour ? `Editar Tour: ${tour.name}` : 'Nuevo Tour'}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {tour ? 'Actualiza la información del tour' : 'Crea un nuevo tour en el inventario'}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="id" className="text-gray-300">ID *</Label>
                            <Input
                                id="id"
                                value={formData.id}
                                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                className="bg-gray-950 border-gray-800 text-gray-300"
                                disabled={!!tour}
                                placeholder="ID único del tour"
                            />
                        </div>
                        <div>
                            <Label htmlFor="provider" className="text-gray-300">Proveedor *</Label>
                            <Input
                                id="provider"
                                value={formData.provider}
                                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                                className="bg-gray-950 border-gray-800 text-gray-300"
                                placeholder="Ej: Mundo Maya"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="name" className="text-gray-300">Nombre del Tour *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-gray-950 border-gray-800 text-gray-300"
                            placeholder="Ej: Holbox Dream Tour"
                        />
                    </div>

                    {/* Economics */}
                    <div className="border-t border-gray-800 pt-4">
                        <h3 className="font-semibold text-teal-400 mb-3">💰 Economics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="netRate" className="text-gray-300">Net Rate (USD) *</Label>
                                <Input
                                    id="netRate"
                                    type="number"
                                    value={formData.netRate ?? 0}
                                    onChange={(e) => setFormData({ ...formData, netRate: parseFloat(e.target.value) || 0 })}
                                    className="bg-gray-950 border-gray-800 text-gray-300"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <Label htmlFor="publicPrice" className="text-gray-300">Public Price (USD)</Label>
                                <Input
                                    id="publicPrice"
                                    type="number"
                                    value={formData.publicPrice ?? 0}
                                    onChange={(e) => setFormData({ ...formData, publicPrice: parseFloat(e.target.value) || 0 })}
                                    className="bg-gray-950 border-gray-800 text-gray-300"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Categorization */}
                    <div className="border-t border-gray-800 pt-4">
                        <h3 className="font-semibold text-blue-400 mb-3">📍 Categorization</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="location" className="text-gray-300">Location (State)</Label>
                                <Input
                                    id="location"
                                    value={formData.location ?? ""}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="bg-gray-950 border-gray-800 text-gray-300"
                                    placeholder="Ej: Quintana Roo"
                                />
                            </div>
                            <div>
                                <Label htmlFor="region" className="text-gray-300">Region</Label>
                                <Input
                                    id="region"
                                    value={formData.region ?? ""}
                                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                    className="bg-gray-950 border-gray-800 text-gray-300"
                                    placeholder="Ej: Riviera Maya"
                                />
                            </div>
                            <div>
                                <Label htmlFor="activityType" className="text-gray-300">Activity Type</Label>
                                <Input
                                    id="activityType"
                                    value={formData.activityType ?? ""}
                                    onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                                    className="bg-gray-950 border-gray-800 text-gray-300"
                                    placeholder="Ej: Acuática, Cultural, Extrema"
                                />
                            </div>
                            <div>
                                <Label htmlFor="tourType" className="text-gray-300">Tour Type</Label>
                                <Input
                                    id="tourType"
                                    value={formData.tourType ?? ""}
                                    onChange={(e) => setFormData({ ...formData, tourType: e.target.value })}
                                    className="bg-gray-950 border-gray-800 text-gray-300"
                                    placeholder="Ej: Compartido, Privado"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Technical Specs */}
                    <div className="border-t border-gray-800 pt-4">
                        <h3 className="font-semibold text-purple-400 mb-3">📋 Technical Specs</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="duration" className="text-gray-300">Duration</Label>
                                <Input
                                    id="duration"
                                    value={formData.duration ?? ""}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    className="bg-gray-950 border-gray-800 text-gray-300"
                                    placeholder="Ej: 12 Hours"
                                />
                            </div>
                            <div>
                                <Label htmlFor="opsDays" className="text-gray-300">Ops Days</Label>
                                <Input
                                    id="opsDays"
                                    value={formData.opsDays ?? ""}
                                    onChange={(e) => setFormData({ ...formData, opsDays: e.target.value })}
                                    className="bg-gray-950 border-gray-800 text-gray-300"
                                    placeholder="Ej: Daily, Mon-Fri"
                                />
                            </div>
                            <div>
                                <Label htmlFor="cxlPolicy" className="text-gray-300">Cancellation Policy</Label>
                                <Input
                                    id="cxlPolicy"
                                    value={formData.cxlPolicy ?? ""}
                                    onChange={(e) => setFormData({ ...formData, cxlPolicy: e.target.value })}
                                    className="bg-gray-950 border-gray-800 text-gray-300"
                                    placeholder="Ej: 24 Hours"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <Label htmlFor="meetingPoint" className="text-gray-300">Meeting Point</Label>
                            <Input
                                id="meetingPoint"
                                value={formData.meetingPoint ?? ""}
                                onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })}
                                className="bg-gray-950 border-gray-800 text-gray-300"
                                placeholder="Ej: Hotel Lobby"
                            />
                        </div>
                    </div>

                    {/* Marketing */}
                    <div className="border-t border-gray-800 pt-4">
                        <h3 className="font-semibold text-orange-400 mb-3">🎯 Marketing</h3>
                        <div className="mb-4">
                            <Label htmlFor="landingPageUrl" className="text-gray-300">Landing Page URL</Label>
                            <Input
                                id="landingPageUrl"
                                value={formData.landingPageUrl ?? ""}
                                onChange={(e) => setFormData({ ...formData, landingPageUrl: e.target.value })}
                                className="bg-gray-950 border-gray-800 text-gray-300"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <Label htmlFor="storytelling" className="text-gray-300">Storytelling</Label>
                            <Textarea
                                id="storytelling"
                                value={formData.storytelling ?? ""}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, storytelling: e.target.value })}
                                className="bg-gray-950 border-gray-800 text-gray-300 h-24"
                                placeholder="Descripción atractiva del tour..."
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} className="border-gray-700 text-gray-400">
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading} className="bg-teal-600 hover:bg-teal-500">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Guardar
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
