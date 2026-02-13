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
import { Loader2, Save, Plus, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

interface CustomFieldDefinition {
    id: number;
    label: string;
    key: string;
    type: string;
    options: string | null;
}

interface TourEditModalProps {
    tour?: TourInput | null
    isOpen: boolean
    onClose: () => void
    onSave: () => void
}

export function TourEditModal({ tour, isOpen, onClose, onSave }: TourEditModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [customFieldDefs, setCustomFieldDefs] = useState<CustomFieldDefinition[]>([])
    const [formData, setFormData] = useState<Partial<TourInput>>({
        id: "",
        is_audited: false,
        bokunId: null,
        name: "",
        provider: "",
        netRate: 0,
        publicPrice: 0,
        netChild: 0,
        publicChild: 0,
        netPrivate: 0,
        publicPrivate: 0,
        factorPrivate: 0,
        minPaxShared: 0,
        minPaxPrivate: 0,
        duration: "",
        opsDays: "",
        cxlPolicy: "",
        meetingPoint: "",
        landingPageUrl: "",
        storytelling: "",
        auditNotes: "",
        location: "",
        region: "",
        activityType: "",
        tourType: "",
        images: [],
        variants: [],
        custom_fields: []
    })

    const [newNote, setNewNote] = useState("");

    // Fetch custom field definitions on mount
    useEffect(() => {
        const fetchDefinitions = async () => {
            try {
                const response = await fetch('/api/custom-fields');
                const data = await response.json();
                if (data.success) {
                    setCustomFieldDefs(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch custom field definitions:', error);
            }
        };

        if (isOpen) {
            fetchDefinitions();
        }
    }, [isOpen]);

    // Populate form when editing existing tour
    useEffect(() => {
        if (tour) {
            setFormData({
                ...tour,
                variants: tour.variants || [],
                custom_fields: tour.custom_fields || []
            })
        } else {
            // Reset for new tour
            setFormData({
                id: "",
                is_audited: false,
                bokunId: null,
                name: "",
                provider: "",
                netRate: 0,
                publicPrice: 0,
                netChild: 0,
                publicChild: 0,
                netPrivate: 0,
                publicPrivate: 0,
                factorPrivate: 0,
                minPaxShared: 0,
                minPaxPrivate: 0,
                duration: "",
                opsDays: "",
                cxlPolicy: "",
                meetingPoint: "",
                landingPageUrl: "",
                storytelling: "",
                auditNotes: "",
                location: "",
                region: "",
                activityType: "",
                tourType: "",
                images: [],
                variants: [],
                custom_fields: []
            })
            setNewNote("");
        }
    }, [tour, isOpen])

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const method = tour ? 'PUT' : 'POST'
            const url = tour ? `/api/tours/${tour.id}` : '/api/tours'

            // Prepare notes
            let finalNotes = formData.auditNotes;
            if (newNote && newNote.trim() !== "") {
                const timestamp = new Date().toISOString().split('T')[0];
                const appendText = `[${timestamp}]: ${newNote.trim()}`;
                finalNotes = finalNotes ? `${finalNotes}\n\n${appendText}` : appendText;
            }

            // Calculate factors from Public Prices if available
            const sharedFactor = formData.netRate && formData.publicPrice && formData.publicPrice > 0
                ? parseFloat((formData.publicPrice / formData.netRate).toFixed(5))
                : (formData.factorShared || 1.5);

            const privateFactor = formData.netPrivate && formData.publicPrivate && formData.publicPrivate > 0
                ? parseFloat((formData.publicPrivate / formData.netPrivate).toFixed(5))
                : (formData.factorPrivate || 1.5);

            const payload = {
                // Core
                id: formData.id,
                bokun_id: formData.bokunId,
                product_name: formData.name,
                supplier: formData.provider,
                location: formData.location,
                is_active: true,
                is_audited: formData.is_audited,

                // Nested Relations
                pricing: {
                    net_rate_adult: Number(formData.netRate),
                    shared_factor: sharedFactor,

                    net_rate_child: formData.netChild ? Number(formData.netChild) : null,

                    net_rate_private: formData.netPrivate ? Number(formData.netPrivate) : null,
                    private_factor: privateFactor,

                    shared_min_pax: formData.minPaxShared ? Number(formData.minPaxShared) : null,
                    private_min_pax: formData.minPaxPrivate ? Number(formData.minPaxPrivate) : null,
                    private_min_pax_net_rate: formData.netPrivate ? Number(formData.netPrivate) : null,

                    infant_age_threshold: formData.infantAge ? parseInt(String(formData.infantAge)) : null,
                    extra_fees: formData.extraFees
                },
                logistics: {
                    duration: formData.duration,
                    days_of_operation: formData.opsDays,
                    cxl_policy: formData.cxlPolicy,
                    meeting_point_info: formData.meetingPoint,
                    pickup_info: formData.meetingPoint
                },
                assets: {
                    landing_page_url: formData.landingPageUrl,
                    storytelling_url: formData.storytelling,
                    notes: finalNotes,
                    pictures_url: formData.images && formData.images.length > 0 ? formData.images[0] : undefined
                },

                // Arrays
                variants: formData.variants?.map(v => ({
                    ...v,
                    net_rate_adult: Number(v.net_rate_adult),
                    net_rate_child: v.net_rate_child ? Number(v.net_rate_child) : null
                })),
                custom_fields: formData.custom_fields?.map(f => ({
                    definition_id: Number(f.definition_id),
                    value: String(f.value)
                }))
            };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
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

    const addVariant = () => {
        setFormData({
            ...formData,
            variants: [
                ...(formData.variants || []),
                {
                    name: "New Variant",
                    net_rate_adult: 0,
                    is_active: true
                }
            ]
        })
    }

    const updateVariant = (index: number, field: string, value: string | number | boolean) => {
        const newVariants = [...(formData.variants || [])];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setFormData({ ...formData, variants: newVariants });
    }

    const removeVariant = (index: number) => {
        const newVariants = [...(formData.variants || [])];
        newVariants.splice(index, 1);
        setFormData({ ...formData, variants: newVariants });
    }

    const updateCustomField = (defId: number, value: string) => {
        const currentFields = [...(formData.custom_fields || [])];
        const existingIndex = currentFields.findIndex(f => f.definition_id === defId);

        if (existingIndex >= 0) {
            currentFields[existingIndex] = { ...currentFields[existingIndex], value };
        } else {
            currentFields.push({ definition_id: defId, value });
        }

        setFormData({ ...formData, custom_fields: currentFields });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="sm:max-w-[900px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white max-h-[90vh] overflow-y-auto"
                onPointerDownOutside={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('[data-id="sidebar"]')) {
                        e.preventDefault();
                    }
                }}
            >
                <DialogHeader>
                    <DialogTitle>{tour ? `Editar Tour: ${tour.name}` : 'Nuevo Tour'}</DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-400">
                        {tour ? 'Actualiza la información del tour' : 'Crea un nuevo tour en el inventario'}
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        <TabsTrigger value="general">General Info</TabsTrigger>
                        <TabsTrigger value="variants">Variants ({formData.variants?.length || 0})</TabsTrigger>
                        <TabsTrigger value="custom-fields">Custom Fields</TabsTrigger>
                    </TabsList>

                    <div className="py-4">
                        <TabsContent value="general" className="grid gap-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="id" className="text-gray-700 dark:text-gray-300">Internal ID</Label>
                                    <Input
                                        id="id"
                                        value={formData.id}
                                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                        className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                        disabled={!!tour}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="bokunId" className="text-gray-700 dark:text-gray-300">Bokun ID</Label>
                                    <Input
                                        id="bokunId"
                                        type="number"
                                        value={formData.bokunId || ''}
                                        onChange={(e) => setFormData({ ...formData, bokunId: parseInt(e.target.value) || null })}
                                        className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                        placeholder="e.g. 1113066"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="provider" className="text-gray-700 dark:text-gray-300">Proveedor *</Label>
                                    <Input
                                        id="provider"
                                        value={formData.provider}
                                        onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                                        className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                        placeholder="Ej: Mundo Maya"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-900/50 p-3 rounded-md border border-gray-200 dark:border-gray-800 mb-4">
                                <Switch
                                    id="isAudited"
                                    checked={formData.is_audited || false}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_audited: checked })}
                                    className="data-[state=checked]:bg-green-600"
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <Label htmlFor="isAudited" className="text-gray-700 dark:text-gray-300 font-medium">
                                        Audit Verified ✅
                                    </Label>
                                    <p className="text-xs text-gray-500">
                                        Mark this tour as fully audited and ready for distribution.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Nombre del Tour *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                    placeholder="Ej: Holbox Dream Tour"
                                />
                            </div>

                            {/* Economics */}
                            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                                <h3 className="font-semibold text-teal-600 dark:text-teal-400 mb-3">💰 Economics</h3>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 col-span-2">Adult Rates (Shared)</h4>
                                    <div>
                                        <Label htmlFor="netRate" className="text-gray-700 dark:text-gray-300">Net Rate (USD) *</Label>
                                        <Input
                                            id="netRate"
                                            type="number"
                                            step="0.01"
                                            value={formData.netRate ?? 0}
                                            onChange={(e) => setFormData({ ...formData, netRate: parseFloat(e.target.value) || 0 })}
                                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="publicPrice" className="text-gray-700 dark:text-gray-300">Public Price (USD)</Label>
                                        <Input
                                            id="publicPrice"
                                            type="number"
                                            step="0.01"
                                            value={formData.publicPrice ?? 0}
                                            onChange={(e) => setFormData({ ...formData, publicPrice: parseFloat(e.target.value) || 0 })}
                                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 col-span-2">Child Rates (Shared)</h4>
                                    <div>
                                        <Label htmlFor="netChild" className="text-gray-700 dark:text-gray-300">Net Rate Child (USD)</Label>
                                        <Input
                                            id="netChild"
                                            type="number"
                                            step="0.01"
                                            value={formData.netChild ?? 0}
                                            onChange={(e) => setFormData({ ...formData, netChild: parseFloat(e.target.value) || 0 })}
                                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="publicChild" className="text-gray-700 dark:text-gray-300">Public Price Child (USD)</Label>
                                        <Input
                                            id="publicChild"
                                            type="number"
                                            step="0.01"
                                            value={formData.publicChild ?? 0}
                                            onChange={(e) => setFormData({ ...formData, publicChild: parseFloat(e.target.value) || 0 })}
                                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 col-span-2">Private Rates</h4>
                                    <div>
                                        <Label htmlFor="netPrivate" className="text-gray-700 dark:text-gray-300">Net Rate Private (USD)</Label>
                                        <Input
                                            id="netPrivate"
                                            type="number"
                                            step="0.01"
                                            value={formData.netPrivate ?? 0}
                                            onChange={(e) => setFormData({ ...formData, netPrivate: parseFloat(e.target.value) || 0 })}
                                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="publicPrivate" className="text-gray-700 dark:text-gray-300">Public Price Private (USD)</Label>
                                        <Input
                                            id="publicPrivate"
                                            type="number"
                                            step="0.01"
                                            value={formData.publicPrivate ?? 0}
                                            onChange={(e) => setFormData({ ...formData, publicPrivate: parseFloat(e.target.value) || 0 })}
                                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="minPaxShared" className="text-gray-700 dark:text-gray-300">Min Pax (Shared)</Label>
                                        <Input
                                            id="minPaxShared"
                                            type="number"
                                            value={formData.minPaxShared || ''}
                                            onChange={(e) => setFormData({ ...formData, minPaxShared: parseInt(e.target.value) || 0 })}
                                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                            placeholder="1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="minPaxPrivate" className="text-gray-700 dark:text-gray-300">Min Pax (Private)</Label>
                                        <Input
                                            id="minPaxPrivate"
                                            type="number"
                                            value={formData.minPaxPrivate || ''}
                                            onChange={(e) => setFormData({ ...formData, minPaxPrivate: parseInt(e.target.value) || 0 })}
                                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                            placeholder="1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="infantAge" className="text-gray-700 dark:text-gray-300">Free Infant Age (Years)</Label>
                                        <Input
                                            id="infantAge"
                                            type="number"
                                            value={formData.infantAge || ''}
                                            onChange={(e) => setFormData({ ...formData, infantAge: e.target.value })}
                                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                            placeholder="e.g. 4 (Means 0-4 is free)"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Categorization */}
                            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                                <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-3">📍 Categorization</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="location" className="text-gray-700 dark:text-gray-300">Location (State)</Label>
                                        <Input
                                            id="location"
                                            value={formData.location ?? ""}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                            placeholder="Ej: Quintana Roo"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="region" className="text-gray-700 dark:text-gray-300">Region</Label>
                                        <Input
                                            id="region"
                                            value={formData.region ?? ""}
                                            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                            placeholder="Ej: Riviera Maya"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="activityType" className="text-gray-700 dark:text-gray-300">Activity Type</Label>
                                        <Input
                                            id="activityType"
                                            value={formData.activityType ?? ""}
                                            onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                            placeholder="Ej: Acuática, Cultural, Extrema"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="tourType" className="text-gray-700 dark:text-gray-300">Tour Type</Label>
                                        <Input
                                            id="tourType"
                                            value={formData.tourType ?? ""}
                                            onChange={(e) => setFormData({ ...formData, tourType: e.target.value })}
                                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                            placeholder="Ej: Compartido, Privado"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Technical Specs */}
                            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                                <h3 className="font-semibold text-purple-600 dark:text-purple-400 mb-3">📋 Technical Specs</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="duration" className="text-gray-700 dark:text-gray-300">Duration</Label>
                                        <Input
                                            id="duration"
                                            value={formData.duration ?? ""}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                            placeholder="Ej: 12 Hours"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="opsDays" className="text-gray-700 dark:text-gray-300">Ops Days</Label>
                                        <Input
                                            id="opsDays"
                                            value={formData.opsDays ?? ""}
                                            onChange={(e) => setFormData({ ...formData, opsDays: e.target.value })}
                                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                            placeholder="Ej: Daily, Mon-Fri"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="cxlPolicy" className="text-gray-700 dark:text-gray-300">Cancellation Policy</Label>
                                        <Input
                                            id="cxlPolicy"
                                            value={formData.cxlPolicy ?? ""}
                                            onChange={(e) => setFormData({ ...formData, cxlPolicy: e.target.value })}
                                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                            placeholder="Ej: 24 Hours"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Label htmlFor="meetingPoint" className="text-gray-700 dark:text-gray-300">Meeting Point</Label>
                                    <Input
                                        id="meetingPoint"
                                        value={formData.meetingPoint ?? ""}
                                        onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })}
                                        className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                        placeholder="Ej: Hotel Lobby"
                                    />
                                </div>
                            </div>

                            {/* Marketing & Assets */}
                            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                                <h3 className="font-semibold text-orange-600 dark:text-orange-400 mb-3">🎯 Marketing & Assets</h3>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="col-span-2">
                                        <Label htmlFor="images" className="text-gray-700 dark:text-gray-300">Main Image URL</Label>
                                        <Input
                                            id="images"
                                            value={formData.images && formData.images[0] ? formData.images[0] : ""}
                                            onChange={(e) => {
                                                const newImages = [...(formData.images || [])];
                                                newImages[0] = e.target.value;
                                                setFormData({ ...formData, images: newImages });
                                            }}
                                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="landingPageUrl" className="text-gray-700 dark:text-gray-300">Landing Page URL</Label>
                                        <Input
                                            id="landingPageUrl"
                                            value={formData.landingPageUrl ?? ""}
                                            onChange={(e) => setFormData({ ...formData, landingPageUrl: e.target.value })}
                                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="storytelling" className="text-gray-700 dark:text-gray-300">Storytelling URL</Label>
                                        <Input
                                            id="storytelling"
                                            value={formData.storytelling ?? ""}
                                            onChange={(e) => setFormData({ ...formData, storytelling: e.target.value })}
                                            className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 border-t border-gray-200 dark:border-gray-800 pt-4">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Audit Notes (History)</h4>
                                    <div className="bg-gray-50 dark:bg-gray-950 p-3 rounded-md text-sm text-gray-600 dark:text-gray-400 min-h-[80px] max-h-[150px] overflow-y-auto mb-3 whitespace-pre-wrap border border-gray-200 dark:border-gray-800">
                                        {formData.auditNotes || "No previous notes."}
                                    </div>

                                    <Label htmlFor="newNote" className="text-gray-700 dark:text-gray-300">Add New Note</Label>
                                    <Textarea
                                        id="newNote"
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-white h-24 mt-1"
                                        placeholder="Type a new note to append..."
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="variants" className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-200">Tour Variants</h3>
                                <Button onClick={addVariant} size="sm" className="bg-teal-600 hover:bg-teal-700">
                                    <Plus className="h-4 w-4 mr-2" /> Add Variant
                                </Button>
                            </div>

                            {formData.variants?.length === 0 ? (
                                <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                                    <p className="text-gray-500">No variants added yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {formData.variants?.map((variant, index) => (
                                        <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="grid grid-cols-2 gap-4 w-full mr-4">
                                                    <div>
                                                        <Label className="text-gray-600 dark:text-gray-400 text-xs">Name</Label>
                                                        <Input
                                                            value={variant.name}
                                                            onChange={(e) => updateVariant(index, 'name', e.target.value)}
                                                            className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 h-9"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-gray-600 dark:text-gray-400 text-xs">Duration</Label>
                                                        <Input
                                                            value={variant.duration || ''}
                                                            onChange={(e) => updateVariant(index, 'duration', e.target.value)}
                                                            className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 h-9"
                                                            placeholder="e.g. 4 Hours"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-gray-600 dark:text-gray-400 text-xs">Net Rate (Adult)</Label>
                                                        <Input
                                                            type="number"
                                                            value={variant.net_rate_adult}
                                                            onChange={(e) => updateVariant(index, 'net_rate_adult', e.target.value)}
                                                            className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 h-9"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-gray-600 dark:text-gray-400 text-xs">Net Rate (Child)</Label>
                                                        <Input
                                                            type="number"
                                                            value={variant.net_rate_child || ''}
                                                            onChange={(e) => updateVariant(index, 'net_rate_child', e.target.value)}
                                                            className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 h-9"
                                                            placeholder="Optional"
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <Label className="text-gray-600 dark:text-gray-400 text-xs">Description</Label>
                                                        <Input
                                                            value={variant.description || ''}
                                                            onChange={(e) => updateVariant(index, 'description', e.target.value)}
                                                            className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 h-9"
                                                            placeholder="Variant description..."
                                                        />
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-400 hover:text-red-300 hover:bg-transparent -mt-1"
                                                    onClick={() => removeVariant(index)}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="custom-fields" className="space-y-4">
                            <div className="mb-4">
                                <h3 className="text-lg font-medium text-black dark:text-gray-200">Custom Fields</h3>
                                <p className="text-sm text-gray-500">Values for custom defined fields.</p>
                            </div>

                            {customFieldDefs.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                    <p className="text-gray-500">No custom field definitions found. Go to Settings to create them.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {customFieldDefs.map((def) => {
                                        const value = formData.custom_fields?.find(f => f.definition_id === def.id)?.value || '';
                                        return (
                                            <div key={def.id}>
                                                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">{def.label}</Label>
                                                <Input
                                                    value={value}
                                                    onChange={(e) => updateCustomField(def.id, e.target.value)}
                                                    className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-black dark:text-gray-300"
                                                    placeholder={`Enter ${def.label}...`}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Type: {def.type}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </TabsContent>
                    </div>

                    <DialogFooter className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-4">
                        <Button variant="outline" onClick={onClose} className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-400">
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
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
