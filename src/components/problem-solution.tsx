"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { FileSpreadsheet, Layers, Building2, TrendingDown } from "lucide-react"

export function ProblemSolution() {
    return (
        <section className="py-24 bg-gray-900 relative overflow-hidden">

            {/* STANDARD DIVIDER (Stronger Visibility) */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent z-50 shadow-[0_0_15px_rgba(20,184,166,0.5)]"></div>

            {/* Background Accents (Kept existing ones but adjusted blend) */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Headline */}
                <div className="text-center mb-16">
                    <div className="inline-block px-4 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-bold uppercase tracking-widest mb-4">
                        Diagnóstico
                    </div>
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
                    <Card className="bg-gray-800/40 backdrop-blur-md border-gray-700 hover:border-red-500/50 hover:bg-gray-800/60 transition-all duration-300 flex flex-col relative group shadow-lg">
                        <div className="flex flex-col items-center text-center flex-grow p-6">
                            <div className="w-16 h-16 bg-red-500/10 rounded-2xl rotate-3 flex items-center justify-center mb-6 group-hover:rotate-0 transition-transform">
                                <FileSpreadsheet className="h-8 w-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">El &quot;Excel Hell&quot;</h3>
                            <p className="text-xs text-red-400 uppercase tracking-wide font-bold mb-4">Operador Independiente</p>

                            <p className="text-gray-400 mb-6 flex-grow text-sm leading-relaxed">
                                Gestionas todo en hojas de cálculo. No tienes motor de reservas y dependes de que las OTAs carguen por ti.
                            </p>

                            {/* Quantified Loss Metric */}
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 w-full mb-6">
                                <div className="flex items-center justify-center gap-2 text-red-300 text-sm">
                                    <TrendingDown className="h-4 w-4 shrink-0" />
                                    <span>Estimas perder <strong>+20 horas/mes</strong> en tareas manuales.</span>
                                </div>
                            </div>

                            <div className="bg-black/30 p-4 rounded-lg w-full text-left border border-white/5 group-hover:border-red-500/30 transition-colors">
                                <p className="text-sm text-gray-300">
                                    <strong className="text-white block mb-1 text-xs uppercase tracking-wider text-red-400">Solución: SAT Connect</strong>
                                    Profesionalización instantánea. Motor de reservas web y auditoría de tarifas.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* ICP 2: Tech Ceiling */}
                    <Card className="bg-gray-800/40 backdrop-blur-md border-gray-700 hover:border-blue-500/50 hover:bg-gray-800/60 transition-all duration-300 flex flex-col shadow-lg">
                        <div className="flex flex-col items-center text-center flex-grow p-6">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl -rotate-3 flex items-center justify-center mb-6 group-hover:rotate-0 transition-transform">
                                <Layers className="h-8 w-8 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">El &quot;Channel Caos&quot;</h3>
                            <p className="text-xs text-blue-400 uppercase tracking-wide font-bold mb-4">DMC Regional</p>
                            <p className="text-gray-400 mb-6 flex-grow text-sm leading-relaxed">
                                Ya vendes online, pero cambiar un precio te obliga a entrar a 5 extranets diferentes. Fragmentación total.
                            </p>
                            <div className="bg-black/30 p-4 rounded-lg w-full text-left border border-white/5 hover:border-blue-500/30 transition-colors">
                                <p className="text-sm text-gray-300">
                                    <strong className="text-white block mb-1 text-xs uppercase tracking-wider text-blue-400">Solución: Plan Pro</strong>
                                    Sincronización total. Cambia disponibilidad y precios en tiempo real para todos tus canales.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* ICP 3: Enterprise */}
                    <Card className="bg-gray-800/40 backdrop-blur-md border-gray-700 hover:border-purple-500/50 hover:bg-gray-800/60 transition-all duration-300 flex flex-col shadow-lg">
                        <div className="flex flex-col items-center text-center flex-grow p-6">
                            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl rotate-3 flex items-center justify-center mb-6 group-hover:rotate-0 transition-transform">
                                <Building2 className="h-8 w-8 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Corporativo</h3>
                            <p className="text-xs text-purple-400 uppercase tracking-wide font-bold mb-4">Cadena Hotelera</p>
                            <p className="text-gray-400 mb-6 flex-grow text-sm leading-relaxed">
                                Necesitas control total de marca (White Label), integración con PMS y soporte dedicado VIP.
                            </p>
                            <div className="bg-black/30 p-4 rounded-lg w-full text-left border border-white/5 hover:border-purple-500/30 transition-colors">
                                <p className="text-sm text-gray-300">
                                    <strong className="text-white block mb-1 text-xs uppercase tracking-wider text-purple-400">Solución: Plan Elite</strong>
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
