"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { FileSpreadsheet, Layers, Building2 } from "lucide-react"

export function ProblemSolution() {
    return (
        <section className="py-20 bg-gray-900 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Headline */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Entendemos tu etapa de <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Madurez Digital</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        No todos necesitan lo mismo. Identifica tu perfil y descubre cómo escalamos tu operación.
                    </p>
                </div>

                {/* 3 Columns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* ICP 1: Excel Hell */}
                    <Card className="bg-gray-800/50 border-gray-700 hover:border-red-500/50 transition-colors duration-300 flex flex-col">
                        <div className="flex flex-col items-center text-center flex-grow">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                                <FileSpreadsheet className="h-8 w-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">El "Excel Hell"</h3>
                            <p className="text-xs text-red-400 uppercase tracking-wide font-bold mb-4">Operador Independiente</p>
                            <p className="text-gray-400 mb-6 flex-grow">
                                Gestionas todo en hojas de cálculo. No tienes motor de reservas y dependes de que las OTAs carguen por ti.
                            </p>
                            <div className="bg-gray-900/50 p-4 rounded-lg w-full text-left border border-gray-700">
                                <p className="text-sm text-gray-300">
                                    <strong className="text-white block mb-1">Solución SAT Connect:</strong>
                                    Profesionalización instantánea. Motor de reservas web y auditoría de tarifas para no vender a pérdida.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* ICP 2: Tech Ceiling */}
                    <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-colors duration-300 flex flex-col">
                        <div className="flex flex-col items-center text-center flex-grow">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                                <Layers className="h-8 w-8 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">El "Channel Caos"</h3>
                            <p className="text-xs text-blue-400 uppercase tracking-wide font-bold mb-4">DMC Regional</p>
                            <p className="text-gray-400 mb-6 flex-grow">
                                Ya vendes online, pero cambiar un precio te obliga a entrar a 5 extranets diferentes. Fragmentación total.
                            </p>
                            <div className="bg-gray-900/50 p-4 rounded-lg w-full text-left border border-gray-700">
                                <p className="text-sm text-gray-300">
                                    <strong className="text-white block mb-1">Solución Pro:</strong>
                                    Sincronización total. Cambia disponibilidad en SAT Connect y se actualiza en Viator, Expedia y Marketplace B2B.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* ICP 3: Enterprise */}
                    <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-colors duration-300 flex flex-col">
                        <div className="flex flex-col items-center text-center flex-grow">
                            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-6">
                                <Building2 className="h-8 w-8 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Corporativo</h3>
                            <p className="text-xs text-purple-400 uppercase tracking-wide font-bold mb-4">Cadena Hotelera</p>
                            <p className="text-gray-400 mb-6 flex-grow">
                                Necesitas control total de marca (White Label), integración con PMS y soporte dedicado VIP.
                            </p>
                            <div className="bg-gray-900/50 p-4 rounded-lg w-full text-left border border-gray-700">
                                <p className="text-sm text-gray-300">
                                    <strong className="text-white block mb-1">Solución Elite:</strong>
                                    Personalización total. APIs abiertas para conectar tu PMS y un Gerente de Cuenta dedicado.
                                </p>
                            </div>
                        </div>
                    </Card>

                </div>
            </div>
        </section>
    )
}
