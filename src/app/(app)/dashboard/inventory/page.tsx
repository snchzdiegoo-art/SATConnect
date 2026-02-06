"use client"
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Plus, Globe, Trash2, Loader2 } from "lucide-react"
import { auditTour, TourInput } from "@/lib/thrive-engine"
import { ImportModal } from "@/components/dashboard/inventory/import-modal"
import { InventoryFilters, FilterState } from "@/components/dashboard/inventory/filters"
import { PriorityBanner } from "@/components/dashboard/inventory/priority-banner"
import { TourDetailModal } from "@/components/dashboard/inventory/tour-detail-modal"
import { TourEditModal } from "@/components/dashboard/inventory/tour-edit-modal"

export default function InventoryPage() {
    const [tours, setTours] = useState<TourInput[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [config, setConfig] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        providers: [],
        locations: [],
        activityTypes: [],
        tourTypes: [],
        priorityOnly: false
    })
    const [selectedTour, setSelectedTour] = useState<TourInput | null>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [tourToEdit, setTourToEdit] = useState<TourInput | null>(null)
    const [showImport, setShowImport] = useState(false)
    const [importProgress, setImportProgress] = useState<{ current: number; total: number } | null>(null)

    // Fetch tours from API
    useEffect(() => {
        async function fetchTours() {
            try {
                setIsLoading(true)
                const response = await fetch('/api/tours')
                if (!response.ok) {
                    throw new Error('Failed to fetch tours')
                }
                const data = await response.json()
                setTours(data)
                setError(null)
            } catch (err) {
                console.error('Error fetching tours:', err)
                setError('Failed to load tours. Please refresh the page.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchTours()
    }, [])

    // Load config from localStorage (keeping this for now)
    useEffect(() => {
        const savedConfig = localStorage.getItem("thrive_config")
        if (savedConfig) {
            try {
                setConfig(JSON.parse(savedConfig))
            } catch (e) {
                console.error('Failed to parse config:', e)
            }
        }
    }, [])


    useEffect(() => {
        if (config.length > 0) {
            localStorage.setItem("thrive_config", JSON.stringify(config))
        }
    }, [config])

    const handleReset = async () => {
        if (confirm("¿Borrar todos los datos y reiniciar?")) {
            localStorage.removeItem("thrive_tours")
            localStorage.removeItem("thrive_config")
            setTours([])
            setConfig([])
            window.location.reload()
        }
    }

    // Handle consolidated import with intelligent merge and change tracking
    const handleImport = async (importedTours: TourInput[]) => {
        try {
            setIsLoading(true)
            const changes: { id: string; action: 'created' | 'updated'; fields: string[] }[] = []

            // Fetch current tours from API to ensure we have latest data
            const response = await fetch('/api/tours')
            if (!response.ok) throw new Error('Failed to fetch current tours')
            const currentTours: TourInput[] = await response.json()

            for (let i = 0; i < importedTours.length; i++) {
                const tourItem = importedTours[i]
                setImportProgress({ current: i + 1, total: importedTours.length })

                const existing = currentTours.find(t => t.id === tourItem.id)

                if (existing) {
                    // UPDATE: Merge intelligently, only updating fields with new data
                    const updatedFields: string[] = []
                    const mergedTour: TourInput = { ...existing }

                    // Check and update all fields if they differ
                    if (tourItem.name && tourItem.name !== existing.name) {
                        mergedTour.name = tourItem.name
                        updatedFields.push('name')
                    }
                    if (tourItem.provider && tourItem.provider !== existing.provider) {
                        mergedTour.provider = tourItem.provider
                        updatedFields.push('provider')
                    }
                    if (tourItem.location && tourItem.location !== existing.location) {
                        mergedTour.location = tourItem.location
                        updatedFields.push('location')
                    }
                    if (tourItem.netRate !== undefined && tourItem.netRate !== existing.netRate) {
                        mergedTour.netRate = tourItem.netRate
                        updatedFields.push('netRate')
                    }
                    if (tourItem.publicPrice !== undefined && tourItem.publicPrice !== existing.publicPrice) {
                        mergedTour.publicPrice = tourItem.publicPrice
                        updatedFields.push('publicPrice')
                    }
                    if (tourItem.infantAge && tourItem.infantAge !== existing.infantAge) {
                        mergedTour.infantAge = tourItem.infantAge
                        updatedFields.push('infantAge')
                    }
                    if (tourItem.images && tourItem.images.length > 0 && JSON.stringify(tourItem.images) !== JSON.stringify(existing.images)) {
                        mergedTour.images = tourItem.images
                        updatedFields.push('images')
                    }
                    if (tourItem.duration && tourItem.duration !== existing.duration) {
                        mergedTour.duration = tourItem.duration
                        updatedFields.push('duration')
                    }
                    if (tourItem.opsDays && tourItem.opsDays !== existing.opsDays) {
                        mergedTour.opsDays = tourItem.opsDays
                        updatedFields.push('opsDays')
                    }
                    if (tourItem.cxlPolicy && tourItem.cxlPolicy !== existing.cxlPolicy) {
                        mergedTour.cxlPolicy = tourItem.cxlPolicy
                        updatedFields.push('cxlPolicy')
                    }
                    if (tourItem.landingPageUrl && tourItem.landingPageUrl !== existing.landingPageUrl) {
                        mergedTour.landingPageUrl = tourItem.landingPageUrl
                        updatedFields.push('landingPageUrl')
                    }
                    if (tourItem.storytelling && tourItem.storytelling !== existing.storytelling) {
                        mergedTour.storytelling = tourItem.storytelling
                        updatedFields.push('storytelling')
                    }
                    if (tourItem.meetingPoint && tourItem.meetingPoint !== existing.meetingPoint) {
                        mergedTour.meetingPoint = tourItem.meetingPoint
                        updatedFields.push('meetingPoint')
                    }
                    if (tourItem.region && tourItem.region !== existing.region) {
                        mergedTour.region = tourItem.region
                        updatedFields.push('region')
                    }
                    if (tourItem.activityType && tourItem.activityType !== existing.activityType) {
                        mergedTour.activityType = tourItem.activityType
                        updatedFields.push('activityType')
                    }
                    if (tourItem.tourType && tourItem.tourType !== existing.tourType) {
                        mergedTour.tourType = tourItem.tourType
                        updatedFields.push('tourType')
                    }
                    if (tourItem.channels && JSON.stringify(tourItem.channels) !== JSON.stringify(existing.channels)) {
                        mergedTour.channels = tourItem.channels
                        updatedFields.push('channels')
                    }

                    // Only update if there are actual changes
                    if (updatedFields.length > 0) {
                        const updateResponse = await fetch(`/api/tours/${existing.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(mergedTour)
                        })

                        if (!updateResponse.ok) {
                            const errorText = await updateResponse.text()
                            console.error(`Failed to update tour ${existing.id}:`, errorText)
                            continue
                        }

                        changes.push({ id: existing.id, action: 'updated', fields: updatedFields })
                        console.log(`✅ Updated ${existing.id}: ${updatedFields.join(', ')}`)
                    } else {
                        console.log(`ℹ️  No changes for ${existing.id}`)
                    }
                } else {
                    // CREATE new tour
                    const createResponse = await fetch('/api/tours', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(tourItem)
                    })

                    if (!createResponse.ok) {
                        const errorData = await createResponse.json()
                        console.error(`Failed to create tour ID ${tourItem.id}:`, JSON.stringify(errorData))
                        continue
                    }

                    changes.push({ id: tourItem.id, action: 'created', fields: ['all'] })
                    console.log(`🚀 Created tour ${tourItem.id}`)
                }
            }

            // Refresh tours list
            const finalResponse = await fetch('/api/tours')
            if (finalResponse.ok) {
                const updatedTours = await finalResponse.json()
                setTours(updatedTours)
            }

            // Show summary
            const created = changes.filter(c => c.action === 'created').length
            const updated = changes.filter(c => c.action === 'updated').length

            alert(
                `✅ Import Complete!\n\n` +
                `Created: ${created} tours\n` +
                `Updated: ${updated} tours\n` +
                `No changes: ${importedTours.length - created - updated} tours\n\n` +
                `Check console for detailed change log.`
            )

            setIsLoading(false)
            setImportProgress(null)
        } catch (error) {
            console.error('Import error:', error)
            alert(`❌ Import failed: ${error}`)
            setIsLoading(false)
            setImportProgress(null)
        }
    }

    // Extract unique values for filters
    const uniqueProviders = useMemo(() =>
        [...new Set(tours.map(t => t.provider))].sort(),
        [tours])

    const uniqueLocations = useMemo(() =>
        [...new Set(tours.map(t => t.location).filter(Boolean) as string[])].sort(),
        [tours])

    const uniqueActivityTypes = useMemo(() =>
        [...new Set(tours.map(t => t.activityType).filter(Boolean) as string[])].sort(),
        [tours])

    const uniqueTourTypes = useMemo(() =>
        [...new Set(tours.map(t => t.tourType).filter(Boolean) as string[])].sort(),
        [tours])

    // Apply filters
    const filteredTours = useMemo(() => {
        let result = tours

        // Search filter (name, provider)
        if (filters.search) {
            const searchLower = filters.search.toLowerCase()
            result = result.filter(t =>
                t.name.toLowerCase().includes(searchLower) ||
                t.provider.toLowerCase().includes(searchLower)
            )
        }

        // Provider filter
        if (filters.providers.length > 0) {
            result = result.filter(t => filters.providers.includes(t.provider))
        }

        // Location filter
        if (filters.locations.length > 0) {
            result = result.filter(t => t.location && filters.locations.includes(t.location))
        }

        // Activity type filter
        if (filters.activityTypes.length > 0) {
            result = result.filter(t =>
                t.activityType && filters.activityTypes.includes(t.activityType)
            )
        }

        // Tour type filter
        if (filters.tourTypes.length > 0) {
            result = result.filter(t => t.tourType && filters.tourTypes.includes(t.tourType))
        }

        // Priority filter (critical or incomplete)
        if (filters.priorityOnly) {
            result = result.filter(t => {
                const diag = auditTour(t)
                return diag.health.score === 'CRITICAL' || diag.health.score === 'INCOMPLETE'
            })
        }

        return result
    }, [tours, filters])

    // Sort by priority (Critical > Incomplete > Healthy)
    const sortedTours = useMemo(() => {
        return [...filteredTours].sort((a, b) => {
            const diagA = auditTour(a)
            const diagB = auditTour(b)

            // Priority order: CRITICAL (3) > INCOMPLETE (2) > HEALTHY (1)
            const priorityOrder = { CRITICAL: 3, INCOMPLETE: 2, HEALTHY: 1 }
            const scoreA = priorityOrder[diagA.health.score]
            const scoreB = priorityOrder[diagB.health.score]

            if (scoreA !== scoreB) {
                return scoreB - scoreA // Higher priority first
            }

            // Secondary sort: by distribution (fewer active channels first)
            if (diagA.distribution.activeCount !== diagB.distribution.activeCount) {
                return diagA.distribution.activeCount - diagB.distribution.activeCount
            }

            // Tertiary sort: by margin (lower margin first)
            return diagA.economics.multiplier - diagB.economics.multiplier
        })
    }, [filteredTours])

    const handlePriorityClick = () => {
        setFilters({ ...filters, priorityOnly: true })
    }

    if (isLoading) return <div className="p-10 text-white">Cargando inventario...</div>

    if (error) return <div className="p-10 text-red-400">{error}</div>

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Inventario (Tours)</h1>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-gray-400 text-sm">Auditoría en Tiempo Real • Motor <span className="text-teal-400 font-bold">THRIVE™ v2.0</span></p>
                        <ConfigStatus config={config} />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" className="text-red-500 hover:bg-red-900/10" onClick={handleReset}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={() => {
                            setTourToEdit(null)
                            setIsEditModalOpen(true)
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Tour
                    </Button>
                    <Button onClick={() => setShowImport(true)} className="bg-teal-600 hover:bg-teal-500 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Importar Excel
                    </Button>
                </div>
            </div>

            {/* Priority Banner */}
            <PriorityBanner tours={tours} onPriorityClick={handlePriorityClick} />

            {/* Filters */}
            <InventoryFilters
                filters={filters}
                onFilterChange={setFilters}
                uniqueProviders={uniqueProviders}
                uniqueLocations={uniqueLocations}
                uniqueActivityTypes={uniqueActivityTypes}
                uniqueTourTypes={uniqueTourTypes}
            />

            {/* Results Counter */}
            <div className="flex items-center justify-between text-sm">
                <div className="text-gray-400">
                    Mostrando <span className="text-teal-400 font-bold">{sortedTours.length}</span> de {tours.length} tours
                    {filters.priorityOnly && <span className="text-red-400 ml-2">• Solo Prioritarios</span>}
                </div>
            </div>

            {/* Grid */}
            <div className="grid gap-4 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards" style={{ opacity: 1 }}>
                {sortedTours.map((tour) => {
                    const diagnosis = auditTour(tour)
                    const { health, distribution, economics } = diagnosis

                    return (
                        <Card
                            key={tour.id}
                            className="group bg-gray-900 border-gray-800 hover:border-teal-600 transition-all cursor-pointer"
                            onClick={() => {
                                setSelectedTour(tour)
                                setIsDetailModalOpen(true)
                            }}
                        >
                            <div className="flex flex-col md:flex-row items-start md:items-stretch gap-4 p-5">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <Badge variant="outline" className="text-xs bg-gray-950 text-gray-500 font-mono">ID: {tour.id}</Badge>
                                        {economics.status === "B2C_ONLY" && (
                                            <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-500 border-yellow-500/30">B2C ONLY</Badge>
                                        )}
                                        {health.score === "HEALTHY" && (
                                            <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/30">HEALTHY</Badge>
                                        )}
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-1 group-hover:text-teal-400 transition-colors">{tour.name}</h3>
                                    <p className="text-sm text-gray-500 mb-3">{tour.provider}</p>

                                    <div className={`text-xs p-2 rounded border transition-colors ${health.score === "HEALTHY" ? "bg-green-950/30 border-green-900/50 text-green-400" :
                                        health.score === "INCOMPLETE" ? "bg-yellow-950/30 border-yellow-900/50 text-yellow-400" :
                                            "bg-red-950/30 border-red-900/50 text-red-400"
                                        }`}>
                                        <span className="font-bold block mb-1">Product Health:</span>
                                        {health.details}
                                    </div>
                                </div>

                                <div className="md:w-48 border-l border-gray-800 pl-6 flex flex-col justify-center">
                                    <span className="text-xs text-gray-500 mb-1">OTA Distribution</span>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Globe className={`h-4 w-4 ${distribution.activeCount >= 3 ? "text-blue-400" : "text-gray-600"}`} />
                                        <span className={`font-bold text-sm ${distribution.activeCount === 4 ? "text-blue-400" : "text-gray-300"}`}>
                                            {distribution.score.split(" ")[1]}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-600">Active: {distribution.activeCount}/4</span>
                                </div>

                                <div className="md:w-40 border-l border-gray-800 pl-6 flex flex-col justify-center text-right">
                                    <div className="mb-2">
                                        <div className="text-xs text-gray-500">Net Logic</div>
                                        <div className="font-mono text-gray-300">${tour.netRate || 0}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Margin Factor</div>
                                        <div className={`font-mono font-bold text-lg ${economics.status === "B2C_ONLY" ? "text-yellow-500" : "text-green-400"}`}>
                                            {economics.multiplier}x
                                        </div>
                                    </div>
                                </div>
                            </div >
                        </Card >
                    )
                })}
            </div >

            {/* Tour Detail Modal */}
            <TourDetailModal
                tour={selectedTour}
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
            />

            {/* Tour Edit/Create Modal */}
            <TourEditModal
                tour={tourToEdit}
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setTourToEdit(null)
                }}
                onSave={async () => {
                    // Refresh tours after save
                    const response = await fetch('/api/tours')
                    if (response.ok) {
                        const updated = await response.json()
                        setTours(updated)
                    }
                }}
            />


            {/* Import Modal */}
            <ImportModal
                isOpen={showImport}
                onClose={() => setShowImport(false)}
                onImport={handleImport}
            />
            {/* Loading Overlay */}
            {importProgress && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl max-w-md w-full text-center shadow-2xl">
                        <div className="mb-6 flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full animate-pulse"></div>
                                <Loader2 className="h-16 w-16 text-teal-400 animate-spin relative z-10" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Procesando Inventario</h3>
                        <p className="text-gray-400 mb-6">
                            Actualizando base de datos central...
                        </p>

                        <div className="w-full bg-gray-800 rounded-full h-4 mb-3 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-teal-600 to-teal-400 h-full transition-all duration-300 ease-out"
                                style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                            ></div>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-teal-400 font-mono font-bold">
                                {Math.round((importProgress.current / importProgress.total) * 100)}%
                            </span>
                            <span className="text-gray-500">
                                Tour {importProgress.current} de {importProgress.total}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div >
    )
}

// Config Status Component (Extracted)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ConfigStatus = ({ config }: { config: any[] }) => (
    <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-500">Config:</span>
        {config.length > 0 ? (
            <Badge variant="outline" className="border-orange-500/30 text-orange-400 bg-orange-500/10">
                {config.length} Rules Active
            </Badge>
        ) : (
            <Badge variant="outline" className="border-gray-800 text-gray-600">Default (1.5x)</Badge>
        )}
    </div>
)
