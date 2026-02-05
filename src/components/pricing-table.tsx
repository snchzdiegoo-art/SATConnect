"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Star, Hourglass, Info } from "lucide-react"

export function PricingTable() {
    // const [billingCycle, setBillingCycle] = useState("monthly") - Unused

    return (
        <section id="pricing" className="py-20 bg-gray-900 relative">

            {/* STANDARD DIVIDER (Stronger Visibility) */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent z-50 shadow-[0_0_15px_rgba(20,184,166,0.5)]"></div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-block bg-gradient-to-r from-teal-500 to-blue-500 p-[1px] rounded-full mb-4">
                        <div className="bg-gray-900 rounded-full px-4 py-1">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400 font-bold uppercase tracking-wider text-xs">
                                Campaña de Lanzamiento
                            </span>
                        </div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Únete al Círculo Exclusivo de los <span className="text-teal-400">Primeros 100</span>
                    </h2>

                    {/* GLOBAL BENEFIT BANNER */}
                    <div className="max-w-3xl mx-auto bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 rounded-xl p-6 mb-12 backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-4 text-center flex-col md:flex-row">
                            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center shrink-0 animate-pulse">
                                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Beneficio Fundador para TODOs los Planes</h3>
                                <p className="text-yellow-200 tex-sm">
                                    <span className="font-bold text-yellow-400">0% Booking Fee en Viator</span> durante tus primeros 6 meses.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Urgency Counter / Banner */}
                    <div className="inline-flex items-center gap-4 bg-red-500/10 border border-red-500/30 rounded-lg px-6 py-3 text-red-300 animate-pulse">
                        <Hourglass className="h-5 w-5" />
                        <span className="font-bold">Cierre de Inscripción: Febrero 2026</span>
                        <span className="w-px h-4 bg-red-500/30 mx-2"></span>
                        <span className="text-sm">
                            Cupos Restantes: <strong className="text-white">87/100</strong>
                        </span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* STANDARD Plan */}
                    <Card className="bg-gray-800 border-gray-700 opacity-90 hover:opacity-100 transition-all flex flex-col">
                        <div className="p-6 flex-grow">
                            <h3 className="text-xl font-bold text-white mb-2">Standard</h3>
                            <p className="text-gray-400 text-sm mb-6 h-10">
                                Guías independientes, micro-operadores, free tours.
                            </p>

                            <div className="mb-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-sm text-gray-500 line-through decoration-red-500">$799</span>
                                    <span className="text-4xl font-bold text-white">$599</span>
                                    <span className="text-gray-500 text-sm">MXN</span>
                                </div>
                                <span className="text-teal-400 text-xs font-bold">Ahorras $200/mes</span>
                            </div>

                            <div className="border-t border-gray-700 pt-4 mb-6">
                                <div className="flex justify-between text-sm text-gray-300 mb-2">
                                    <span>Booking Fee (Online)</span>
                                    <span className="font-bold text-white">3.0%</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-300">
                                    <span>Fee Marketplace B2B</span>
                                    <span className="font-bold text-white">5.0%</span>
                                </div>
                            </div>

                            <ul className="space-y-4 text-gray-400 text-sm mb-8">
                                <li className="flex items-start">
                                    <Check className="text-green-500 mr-2 h-4 w-4 shrink-0 mt-0.5" />
                                    Facturación CFDI
                                </li>
                                <li className="flex items-start">
                                    <Check className="text-green-500 mr-2 h-4 w-4 shrink-0 mt-0.5" />
                                    Google Things To Do Inlcuido
                                </li>
                                <li className="flex items-start">
                                    <Check className="text-green-500 mr-2 h-4 w-4 shrink-0 mt-0.5" />
                                    Motor de Reservas Web (Widget)
                                </li>
                                <li className="flex items-start">
                                    <Check className="text-green-500 mr-2 h-4 w-4 shrink-0 mt-0.5" />
                                    Pasarela de Pagos (Stripe/Paypal)
                                </li>
                                <li className="flex items-start">
                                    <Check className="text-green-500 mr-2 h-4 w-4 shrink-0 mt-0.5" />
                                    Auditoría de Salud (Manual)
                                </li>
                            </ul>
                        </div>
                        <div className="p-6 pt-0 mt-auto">
                            <Button variant="secondary" className="w-full border-gray-600 text-gray-300 hover:border-white hover:text-white">
                                Empezar Ahora
                            </Button>
                        </div>
                    </Card>

                    {/* PRO Plan (Best Value) */}
                    <div className="relative transform md:-translate-y-4 flex flex-col">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg shadow-teal-500/40 z-20">
                            MÁS POPULAR
                        </div>
                        <Card className="bg-gray-800 border-teal-500 shadow-[0_0_30px_rgba(20,184,166,0.15)] relative overflow-hidden flex flex-col h-full">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="p-8 flex-grow">
                                <h3 className="text-2xl font-bold text-teal-400 mb-2">Pro</h3>
                                <p className="text-gray-300 text-sm mb-6 h-10">
                                    DMCs regionales, parques de aventura, operadores culturales.
                                </p>

                                <div className="mb-8">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-lg text-gray-500 line-through decoration-red-500 decoration-2">
                                            $1,999
                                        </span>
                                        <span className="text-5xl font-bold text-white">$1,499</span>
                                        <span className="text-gray-500 text-xs">MXN</span>
                                    </div>
                                    <span className="text-teal-400 text-sm font-bold">
                                        Ahorras $500/mes
                                    </span>
                                </div>

                                <div className="border-t border-gray-700 pt-4 mb-6">
                                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                                        <span>Booking Fee (Online)</span>
                                        <span className="font-bold text-white">2.0%</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-300">
                                        <span>Fee Marketplace B2B</span>
                                        <span className="font-bold text-white text-teal-400">4.0%</span>
                                    </div>
                                </div>

                                <ul className="space-y-4 text-gray-300 text-sm mb-8">
                                    <li className="flex items-start">
                                        <Check className="text-teal-400 mr-2 h-4 w-4 shrink-0 mt-0.5" />
                                        <strong>Todo lo de Standard +</strong>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="text-teal-400 mr-2 h-4 w-4 shrink-0 mt-0.5" />
                                        Channel Manager (Illimitado)
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="text-teal-400 mr-2 h-4 w-4 shrink-0 mt-0.5" />
                                        Sincronización Calendario (Google Cal)
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="text-teal-400 mr-2 h-4 w-4 shrink-0 mt-0.5" />
                                        Auditoría Automática (Health Score)
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="text-teal-400 mr-2 h-4 w-4 shrink-0 mt-0.5" />
                                        Soporte Prioritario WhatsApp
                                    </li>
                                </ul>
                            </div>
                            <div className="p-8 pt-0 mt-auto">
                                <Button variant="primary" className="w-full py-4 text-lg bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-500/20">
                                    Asegurar mi Precio
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* ELITE Plan */}
                    <Card className="bg-gray-800 border-gray-700 opacity-90 hover:opacity-100 transition-all flex flex-col">
                        <div className="p-6 flex-grow">
                            <h3 className="text-xl font-bold text-white mb-2">Elite</h3>
                            <p className="text-gray-400 text-sm mb-6 h-10">
                                Cadenas hoteleras, receptivos nacionales, grandes atracciones.
                            </p>

                            <div className="mb-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-sm text-gray-500 line-through decoration-red-500">$5,499</span>
                                    <span className="text-4xl font-bold text-white">$4,124</span>
                                    <span className="text-gray-500 text-sm">MXN</span>
                                </div>
                                <span className="text-teal-400 text-xs font-bold">Ahorras $1,375/mes</span>
                            </div>

                            <div className="border-t border-gray-700 pt-4 mb-6">
                                <div className="flex justify-between text-sm text-gray-300 mb-2">
                                    <span>Booking Fee (Online)</span>
                                    <span className="font-bold text-white">1.5%</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-300">
                                    <span>Fee Marketplace B2B</span>
                                    <span className="font-bold text-white">3.0%</span>
                                </div>
                            </div>

                            <ul className="space-y-4 text-gray-400 text-sm mb-8">
                                <li className="flex items-start">
                                    <Check className="text-green-500 mr-2 h-4 w-4 shrink-0 mt-0.5" />
                                    <strong>Todo lo de Pro +</strong>
                                </li>
                                <li className="flex items-start">
                                    <Check className="text-green-500 mr-2 h-4 w-4 shrink-0 mt-0.5" />
                                    White Label Completo (Sin Branding)
                                </li>
                                <li className="flex items-start">
                                    <Check className="text-green-500 mr-2 h-4 w-4 shrink-0 mt-0.5" />
                                    API + Integración PMS
                                </li>
                                <li className="flex items-start">
                                    <Check className="text-green-500 mr-2 h-4 w-4 shrink-0 mt-0.5" />
                                    Gerente de Cuenta Dedicado
                                </li>
                                <li className="flex items-start">
                                    <Check className="text-green-500 mr-2 h-4 w-4 shrink-0 mt-0.5" />
                                    SLA Garantizado 99.9%
                                </li>
                            </ul>
                        </div>
                        <div className="p-6 pt-0 mt-auto">
                            <Button variant="secondary" className="w-full border-gray-600 text-gray-300 hover:border-white hover:text-white">
                                Contactar Ventas
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* FACTURACION & INFO */}
                <div className="mt-16 text-center max-w-2xl mx-auto border-t border-gray-800 pt-10">
                    <div className="inline-flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700 text-sm text-gray-300">
                        <Info className="h-4 w-4 text-blue-400" />
                        <span>Todos los precios + IVA. <strong>Facturamos en México (CFDI 4.0).</strong></span>
                    </div>
                </div>
            </div>
        </section>
    )
}
