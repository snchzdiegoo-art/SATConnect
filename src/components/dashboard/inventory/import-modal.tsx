"use client"

import { useState } from "react"
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
import Papa from "papaparse"
import { FileSpreadsheet, Loader2 } from "lucide-react"
import { TourInput } from "@/lib/thrive-engine"

interface ImportModalProps {
    isOpen: boolean
    onClose: () => void
    onImport: (data: TourInput[]) => void
}

export function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [previewCount, setPreviewCount] = useState<number>(0)
    const [parsedData, setParsedData] = useState<TourInput[]>([])

    const parseCurrency = (value: any): number => {
        if (!value) return 0
        const cleaned = String(value).replace(/[$,]/g, '')
        return parseFloat(cleaned) || 0
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setIsLoading(true)

        Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            complete: (results) => {
                const rows = results.data as any[][]
                const data: TourInput[] = []

                // Skip header rows (rows 1-3 contain headers/metadata)
                // Data starts at row 4 (index 3)
                for (let i = 3; i < rows.length; i++) {
                    const row = rows[i]
                    const id = row[0]?.toString().trim() // Bokun ID (Col A)

                    if (!id) continue

                    // Map all 38 columns from your consolidated CSV
                    const tour: TourInput = {
                        // Core Identity (Columns A-D)
                        id,                                                 // A: Bokun ID
                        name: row[1]?.toString().trim() || `Tour ${id}`,  // B: Product
                        provider: row[2]?.toString().trim() || "Por Definir", // C: Supplier
                        location: row[3]?.toString().trim() || "",         // D: Location

                        // Economics - NET RATES (Columns I-S)
                        netRate: parseCurrency(row[8]) || 0,               // I: NET RATE
                        publicPrice: parseCurrency(row[10]) || 0,          // K: SUGGESTED PVP
                        infantAge: row[13]?.toString() || "",              // N: Infant Age

                        // Technical Specs (Columns U-AB)
                        images: row[20] ? [row[20].toString()] : [],       // U: Pictures
                        duration: row[21]?.toString() || "",               // V: Duration
                        opsDays: row[22]?.toString() || "",                // W: Days of Operation
                        cxlPolicy: row[23]?.toString() || "",              // X: CXL Policy
                        landingPageUrl: row[24]?.toString() || "",         // Y: Landing Page
                        storytelling: row[25]?.toString() || "",           // Z: Storytelling Link
                        meetingPoint: row[26]?.toString() || "",           // AA: Meeting point / Pick up

                        // Distribution Channels (Columns AF, AH, AI)
                        channels: {
                            expedia: row[31]?.toString().trim().toLowerCase() === "active" ? "Active" : "Inactive",  // AF: EXPEDIA
                            viator: row[34]?.toString().trim().toLowerCase() === "active" ? "Active" : "Inactive",   // AI: VIATOR
                            gyg: "Inactive",     // Not in CSV, default to Inactive
                            civitatis: row[36]?.toString().trim().toLowerCase() === "active" ? "Active" : "Inactive" // AK: KLOOK
                        }
                    }

                    data.push(tour)
                }

                setParsedData(data)
                setPreviewCount(data.length)
                setIsLoading(false)
            },
            error: (error) => {
                console.error("CSV Parse Error", error)
                alert("Error al leer el archivo CSV")
                setIsLoading(false)
            }
        })
    }

    const handleConfirmImport = () => {
        onImport(parsedData)
        onClose()
        setParsedData([])
        setPreviewCount(0)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-800 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5 text-teal-400" />
                        Importar Inventario
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Sube tu archivo CSV consolidado con todos los datos de tours
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* File Upload */}
                    <div className="space-y-2">
                        <Label htmlFor="csvFile" className="text-gray-300">
                            Archivo CSV
                        </Label>
                        <Input
                            id="csvFile"
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            disabled={isLoading}
                            className="bg-gray-950 border-gray-800 text-gray-300 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-500"
                        />
                    </div>

                    {/* Preview */}
                    {previewCount > 0 && (
                        <div className="p-4 bg-gray-950 rounded-lg border border-gray-800">
                            <div className="flex items-center gap-2 text-sm">
                                <FileSpreadsheet className="h-4 w-4 text-teal-400" />
                                <span className="text-gray-300">
                                    Listo para importar: <span className="text-teal-400 font-bold">{previewCount}</span> tours
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Column Reference Guide */}
                    <div className="p-4 bg-blue-950/20 rounded-lg border border-blue-900/30 max-h-48 overflow-y-auto">
                        <h4 className="text-sm font-semibold text-blue-400 mb-2">📋 Estructura CSV (38 columnas):</h4>
                        <div className="text-xs text-gray-400 space-y-1 font-mono">
                            <div><strong>Identidad:</strong> A=Bokun ID, B=Product, C=Supplier, D=Location</div>
                            <div><strong>Economics:</strong> I=NET RATE, K=SUGGESTED PVP, N=Infant Age</div>
                            <div><strong>Specs:</strong> U=Pictures, V=Duration, W=Days Op, X=CXL</div>
                            <div><strong>Marketing:</strong> Y=Landing, Z=Storytelling, AA=Meeting</div>
                            <div><strong>Channels:</strong> AF=Expedia, AI=Viator, AK=Klook</div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} className="border-gray-700 text-gray-400">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmImport}
                        disabled={previewCount === 0 || isLoading}
                        className="bg-teal-600 hover:bg-teal-500 text-white"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            `Importar ${previewCount} Tours`
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
