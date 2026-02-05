"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Papa from "papaparse"
import { FileSpreadsheet, Loader2, Database, FileText, Settings } from "lucide-react"
import { TourInput } from "@/lib/thrive-engine"

interface ImportModalProps {
    onImport: (data: any[], type: "RATES" | "SPECS" | "LOG" | "CONFIG") => void
}

export function ImportModal({ onImport }: ImportModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [importType, setImportType] = useState<"RATES" | "SPECS" | "LOG" | "CONFIG">("RATES")
    const [previewCount, setPreviewCount] = useState<number>(0)
    const [parsedData, setParsedData] = useState<any[]>([])

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setIsLoading(true)

        Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            complete: (results) => {
                const rows = results.data as any[][]
                const data: any[] = []

                if (importType === "CONFIG") {
                    // CONFIG_SETTINGS Mapping: A=Channel, B=Commission
                    // Skip header usually
                    for (let i = 1; i < rows.length; i++) {
                        const row = rows[i]
                        if (row[0]) {
                            data.push({
                                channel: row[0].toString().trim(),
                                commission: parseFloat(row[1]?.toString() || "0")
                            })
                        }
                    }
                } else {
                    const startRow = rows[0][0]?.toString().toLowerCase().includes("id") ? 1 : 0
                    for (let i = startRow; i < rows.length; i++) {
                        const row = rows[i]
                        const id = row[0]?.toString().trim()
                        if (!id) continue

                        const tour: TourInput = { id, name: "", provider: "Unknown", netRate: 0, publicPrice: 0, images: [] }

                        if (importType === "RATES") {
                            tour.name = row[1]?.toString().trim() || "Unknown"
                            tour.provider = row[2]?.toString().trim() || "Imported"
                            tour.netRate = parseCurrency(row[4])
                            tour.infantAge = row[9]?.toString()
                            tour.publicPrice = parseCurrency(row[6])
                        } else if (importType === "SPECS") {
                            tour.images = row[1] ? [row[1].toString()] : []
                            tour.duration = row[2]?.toString()
                            tour.opsDays = row[3]?.toString()
                            tour.cxlPolicy = row[4]?.toString()
                            tour.landingPageUrl = row[5]?.toString()
                            tour.storytelling = row[6]?.toString()
                            tour.meetingPoint = row[7]?.toString()
                        } else if (importType === "LOG") {
                            // Mapping based on user input
                            // 20=Expedia, 24=Viator, 29=GyG, 33=Civitatis (Indices)
                            tour.channels = {
                                expedia: row[20]?.toString().trim() === "Active" ? "Active" : "Inactive",
                                viator: row[24]?.toString().trim() === "Active" ? "Active" : "Inactive",
                                gyg: row[29]?.toString().trim() === "Active" ? "Active" : "Inactive",
                                civitatis: row[33]?.toString().trim() === "Active" ? "Active" : "Inactive"
                            }
                        }
                        data.push(tour)
                    }
                }

                setParsedData(data)
                setPreviewCount(data.length)
                setIsLoading(false)
            },
            error: (error) => {
                console.error("CSV Parse Error", error)
                setIsLoading(false)
            }
        })
    }

    const parseCurrency = (val: any) => {
        if (!val) return 0
        if (typeof val === 'number') return val
        return parseFloat(val.toString().replace(/[^0-9.-]+/g, "")) || 0
    }

    const confirmImport = () => {
        onImport(parsedData, importType)
        setIsOpen(false)
        setParsedData([])
        setPreviewCount(0)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="border-gray-700 bg-gray-800 text-gray-300 hover:bg-white/10">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Importar Excel
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] bg-gray-900 border-gray-800 text-white">
                <DialogHeader>
                    <DialogTitle>Importar Ecosistema THRIVE</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Sube los 4 archivos CSV clave para reconstruir la inteligencia de negocio.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">

                    {/* File Type Selector Grid */}
                    <div className="grid grid-cols-4 gap-2">
                        <div onClick={() => setImportType("RATES")} className={`cursor-pointer p-3 rounded-lg border flex flex-col items-center gap-1 transition-all ${importType === "RATES" ? "bg-teal-500/10 border-teal-500 text-teal-400" : "bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-700"}`}>
                            <Database className="h-5 w-5" />
                            <span className="font-bold text-[10px]">1. Rate DB</span>
                        </div>

                        <div onClick={() => setImportType("SPECS")} className={`cursor-pointer p-3 rounded-lg border flex flex-col items-center gap-1 transition-all ${importType === "SPECS" ? "bg-blue-500/10 border-blue-500 text-blue-400" : "bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-700"}`}>
                            <FileText className="h-5 w-5" />
                            <span className="font-bold text-[10px]">2. Tech Specs</span>
                        </div>

                        <div onClick={() => setImportType("LOG")} className={`cursor-pointer p-3 rounded-lg border flex flex-col items-center gap-1 transition-all ${importType === "LOG" ? "bg-purple-500/10 border-purple-500 text-purple-400" : "bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-700"}`}>
                            <FileSpreadsheet className="h-5 w-5" />
                            <span className="font-bold text-[10px]">3. Master Log</span>
                        </div>

                        <div onClick={() => setImportType("CONFIG")} className={`cursor-pointer p-3 rounded-lg border flex flex-col items-center gap-1 transition-all ${importType === "CONFIG" ? "bg-orange-500/10 border-orange-500 text-orange-400" : "bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-700"}`}>
                            <Settings className="h-5 w-5" />
                            <span className="font-bold text-[10px]">4. Config</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="csv-file" className="text-right text-gray-400">CSV File</Label>
                        <div className="col-span-3">
                            <Input id="csv-file" type="file" accept=".csv" className="bg-gray-950 border-gray-800 text-gray-300" onChange={handleFileUpload} />
                        </div>
                    </div>

                    {isLoading && <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-teal-500" /></div>}

                    {previewCount > 0 && (
                        <div className={`border rounded-lg p-3 text-center ${importType === "RATES" ? "bg-teal-500/10 border-teal-500/20 text-teal-400" : importType === "SPECS" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : importType === "LOG" ? "bg-purple-500/10 border-purple-500/20 text-purple-400" : "bg-orange-500/10 border-orange-500/20 text-orange-400"}`}>
                            <p className="font-bold text-sm">✅ {previewCount} Registros Detectados</p>
                            <p className="text-xs opacity-70 mt-1">Listo para procesar {importType}.</p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)} className="border-gray-700 text-gray-400">Cancelar</Button>
                    <Button onClick={confirmImport} className="bg-white text-black hover:bg-gray-200">
                        Procesar {importType}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
