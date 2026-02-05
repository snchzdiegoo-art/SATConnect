"use client"
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Plus, Globe, Trash2 } from "lucide-react"
import { auditTour, TourInput } from "@/lib/thrive-engine"
import { ImportModal } from "@/components/dashboard/inventory/import-modal"

// MOCK DATA
const MOCK_DB: TourInput[] = [
    {
        id: "1113066",
        name: "Holbox Dream Tour (Ejemplo)",
        provider: "Mundo Maya",
        netRate: 1500,
        publicPrice: 3500,
        images: ["url"],
        duration: "12 Hours",
        opsDays: "Daily",
        cxlPolicy: "24 Hours",
        meetingPoint: "Hotel Lobby",
        landingPageUrl: "https://sat.travel/holbox",
        storytelling: "Experience the magic...",
        channels: { expedia: "Active", viator: "Active", gyg: "Active", civitatis: "Active" }
    }
]

export default function InventoryPage() {
    const [tours, setTours] = useState<TourInput[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [config, setConfig] = useState<any[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from LocalStorage
    useEffect(() => {
        const savedTours = localStorage.getItem("thrive_tours")
        const savedConfig = localStorage.getItem("thrive_config")

        // Use a local variable to batch updates if needed, but setState is fine here.
        // We defer the state update to avoid 'synchronous' calling warning if it's strict,
        // but typically this pattern is fine. We will disable the warning for this hydration pattern.

        let initialTours = MOCK_DB
        let initialConfig: any[] = [] // eslint-disable-line @typescript-eslint/no-explicit-any

        if (savedTours) {
            try {
                const parsed = JSON.parse(savedTours)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    initialTours = parsed
                }
            } catch (e) {
                console.error("Failed to parse tours", e)
            }
        }

        if (savedConfig) {
            try {
                initialConfig = JSON.parse(savedConfig)
            } catch (e) {
                console.error(e)
            }
        }

        setTours(initialTours)
        setConfig(initialConfig)
        setIsLoaded(true)
        // eslint-disable-next-line react-hooks/set-state-in-effect
    }, [])

    // Save to LocalStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("thrive_tours", JSON.stringify(tours))
        }
    }, [tours, isLoaded])

    useEffect(() => {
        if (isLoaded && config.length > 0) {
            localStorage.setItem("thrive_config", JSON.stringify(config))
        }
    }, [config, isLoaded])

    const handleReset = () => {
        if (confirm("¿Borrar todos los datos y reiniciar?")) {
            localStorage.removeItem("thrive_tours")
            localStorage.removeItem("thrive_config")
            setTours(MOCK_DB)
            setConfig([])
            window.location.reload()
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleImport = (importedData: any[], type: "RATES" | "SPECS" | "LOG" | "CONFIG") => {
        if (type === "CONFIG") {
            setConfig(importedData)
            return
        }

        const tourData = importedData as TourInput[];

        setTours((prevTours) => {
            const newState = [...prevTours];

            tourData.forEach((item) => {
                const existingIndex = newState.findIndex(t => t.id === item.id);

                if (existingIndex > -1) {
                    // MERGE Logic
                    if (type === "RATES") {
                        newState[existingIndex] = { ...newState[existingIndex], ...item };
                    } else if (type === "SPECS") {
                        newState[existingIndex] = {
                            ...newState[existingIndex],
                            // Only update if value exists
                            images: item.images?.length > 0 ? item.images : newState[existingIndex].images,
                            duration: item.duration || newState[existingIndex].duration,
                            opsDays: item.opsDays || newState[existingIndex].opsDays,
                            cxlPolicy: item.cxlPolicy || newState[existingIndex].cxlPolicy,
                            landingPageUrl: item.landingPageUrl || newState[existingIndex].landingPageUrl,
                            storytelling: item.storytelling || newState[existingIndex].storytelling,
                            meetingPoint: item.meetingPoint || newState[existingIndex].meetingPoint
                        };
                    } else if (type === "LOG") {
                        newState[existingIndex] = {
                            ...newState[existingIndex],
                            channels: item.channels || newState[existingIndex].channels
                        }
                    }
                } else {
                    // CREATE logic
                    if (type === "RATES") {
                        newState.unshift(item);
                    }
                }
            });
            return newState;
        });
    }

    if (!isLoaded) return <div className="p-10 text-white">Cargando base de datos...</div>

    return (
        <div className="space-y-6">
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

            {/* Grid */}
            <div className="grid gap-4 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards" style={{ opacity: 1 }}>
                {tours.map((tour, idx) => {
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
