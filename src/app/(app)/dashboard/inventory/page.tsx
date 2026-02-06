"use client"
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Plus, Globe, Trash2 } from "lucide-react"
import { auditTour, TourInput } from "@/lib/thrive-engine"
import { ImportModal } from "@/components/dashboard/inventory/import-modal"
import { InventoryFilters, FilterState } from "@/components/dashboard/inventory/filters"
import { PriorityBanner } from "@/components/dashboard/inventory/priority-banner"

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleImport = async (importedData: any[], type: "RATES" | "SPECS" | "LOG" | "CONFIG") => {
        if (type === "CONFIG") {
            setConfig(importedData)
            return
        }

        const tourData = importedData as TourInput[];

        // Save tours to database via API
        try {
            // Fetch current tours from database to check for duplicates
            const fetchResponse = await fetch('/api/tours')
            const currentTours = fetchResponse.ok ? await fetchResponse.json() : []

            const promises = tourData.map(async (tourItem) => {
                // Check if tour exists in database (not just in state)
                const existing = currentTours.find((t: TourInput) => t.id === tourItem.id)

                if (existing) {
                    // UPDATE existing tour
                    const mergedTour = { ...existing }

                    if (type === "RATES") {
                        // Only update fields that have values
                        if (tourItem.name && tourItem.name !== `Tour ${tourItem.id}`) mergedTour.name = tourItem.name
                        if (tourItem.provider && tourItem.provider !== "Por Definir") mergedTour.provider = tourItem.provider
                        if (tourItem.netRate !== null && tourItem.netRate !== undefined) mergedTour.netRate = tourItem.netRate
                        if (tourItem.publicPrice !== null && tourItem.publicPrice !== undefined) mergedTour.publicPrice = tourItem.publicPrice
                        if (tourItem.infantAge) mergedTour.infantAge = tourItem.infantAge
                    } else if (type === "SPECS") {
                        // Only update non-empty fields
                        if (tourItem.images?.length > 0) mergedTour.images = tourItem.images
                        if (tourItem.duration) mergedTour.duration = tourItem.duration
                        if (tourItem.opsDays) mergedTour.opsDays = tourItem.opsDays
                        if (tourItem.cxlPolicy) mergedTour.cxlPolicy = tourItem.cxlPolicy
                        if (tourItem.landingPageUrl) mergedTour.landingPageUrl = tourItem.landingPageUrl
                        if (tourItem.storytelling) mergedTour.storytelling = tourItem.storytelling
                        if (tourItem.meetingPoint) mergedTour.meetingPoint = tourItem.meetingPoint
                    } else if (type === "LOG") {
                        if (tourItem.channels) mergedTour.channels = tourItem.channels
                    }

                    // PUT to update
                    const response = await fetch(`/api/tours/${mergedTour.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(mergedTour)
                    })

                    if (!response.ok) {
                        const errorText = await response.text()
                        console.error(`Failed to update tour ${mergedTour.id}:`, errorText)
                        throw new Error(`Failed to update tour ${mergedTour.id}`)
                    }
                    return response.json()
                } else {
                    // CREATE new tour (only for RATES)
                    if (type === "RATES") {
                        const response = await fetch('/api/tours', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(tourItem)
                        })

                        if (!response.ok) {
                            const errorText = await response.text()
                            console.error(`Failed to create tour ${tourItem.id}:`, errorText)
                            throw new Error(`Failed to create tour ${tourItem.id}`)
                        }
                        return response.json()
                    }
                }
            })

            await Promise.all(promises)

            // Refresh tours from database
            const response = await fetch('/api/tours')
            if (response.ok) {
                const updatedTours = await response.json()
                setTours(updatedTours)
            }

            alert(`✅ ${tourData.length} tours ${type === "RATES" ? "importados" : "actualizados"} correctamente`)
        } catch (error) {
            console.error('Import error:', error)
            alert(`❌ Error al importar: ${error}`)
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
                    <ImportModal onImport={handleImport} />
                    <Button variant="primary" className="bg-teal-600 hover:bg-teal-500">
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Tour
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
                {sortedTours.map((tour, idx) => {
                    const diagnosis = auditTour(tour)
                    const { health, distribution, economics } = diagnosis

                    return (
                        <Card key={tour.id || idx} className="p-5 bg-gray-900 border-gray-800 hover:border-gray-700 transition-all group">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
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
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
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
