"use client"

import React from "react"
import { CheckCircle, XCircle, TrendingDown, DollarSign } from "lucide-react"

export function BenchmarkingTable() {
    return (
        <section className="py-24 relative bg-gray-950" id="benchmarking">
            {/* Distinct Top Divider */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>

            {/* Ambient Background for Separation */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-block px-4 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-widest mb-4">
                        Realidad vs Solución
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Guerra contra el <span className="text-red-500 line-through decoration-4 decoration-white/20">Excel</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Tu método actual te está costando dinero. Aquí la prueba.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* Glass Container */}
                    <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
                        {/* Gloss Effect */}
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="p-6 md:p-8 text-gray-400 font-medium border-b border-white/10 w-1/3">Proceso Operativo</th>
                                        <th className="p-6 md:p-8 text-red-400 font-bold border-b border-white/10 bg-red-500/5 w-1/3 border-r border-white/5">
                                            <div className="flex items-center gap-2">
                                                <XCircle className="h-5 w-5" /> Método Manual
                                            </div>
                                        </th>
                                        <th className="p-6 md:p-8 text-teal-400 font-bold border-b border-white/10 bg-teal-500/5 w-1/3">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-5 w-5" /> SAT Connect
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm md:text-base divide-y divide-white/5">
                                    <tr className="group hover:bg-white/5 transition-colors">
                                        <td className="p-6 text-white font-medium">Carga de Producto</td>
                                        <td className="p-6 text-gray-400 border-r border-white/5 bg-red-500/[0.02]">
                                            4 Horas <span className="text-xs text-red-400 block mt-1 font-medium bg-red-500/10 w-fit px-2 py-0.5 rounded">Alto riesgo de error</span>
                                        </td>
                                        <td className="p-6 text-white bg-teal-500/[0.02]">
                                            4 Segundos <span className="text-xs text-teal-400 block mt-1 font-medium bg-teal-500/10 w-fit px-2 py-0.5 rounded">Onboarding Auto</span>
                                        </td>
                                    </tr>
                                    <tr className="group hover:bg-white/5 transition-colors">
                                        <td className="p-6 text-white font-medium">Actualización de Tarifas</td>
                                        <td className="p-6 text-gray-400 border-r border-white/5 bg-red-500/[0.02]">Manual (Canal x Canal)</td>
                                        <td className="p-6 text-white bg-teal-500/[0.02]">Instantánea Global</td>
                                    </tr>
                                    <tr className="group hover:bg-white/5 transition-colors">
                                        <td className="p-6 text-white font-medium">Cobranza B2B</td>
                                        <td className="p-6 text-gray-400 border-r border-white/5 bg-red-500/[0.02]">Facturas Aisladas</td>
                                        <td className="p-6 text-white bg-teal-500/[0.02]">Conciliación Automática</td>
                                    </tr>
                                    <tr className="group hover:bg-white/5 transition-colors">
                                        <td className="p-6 text-white font-medium">Overbooking</td>
                                        <td className="p-6 text-gray-400 border-r border-white/5 bg-red-500/[0.02]">Frecuente (Sin Sync)</td>
                                        <td className="p-6 text-white bg-teal-500/[0.02]">0% (Bloqueo Real-Time)</td>
                                    </tr>

                                    {/* FINANCIAL IMPACT ROW */}
                                    <tr className="bg-gradient-to-r from-gray-900 to-gray-800 font-bold border-t-2 border-white/10">
                                        <td className="p-8 text-white text-lg">
                                            <span className="flex items-center gap-2">
                                                <DollarSign className="text-yellow-500" /> Costo Operativo Real
                                            </span>
                                        </td>
                                        <td className="p-8 text-red-300 border-r border-white/10 bg-red-500/10">
                                            <div className="text-2xl md:text-3xl font-extrabold mb-1">-$12,500<span className="text-sm font-normal text-red-400">/mes</span></div>
                                            <div className="text-xs font-normal opacity-80 flex items-center gap-1">
                                                <TrendingDown className="h-3 w-3" /> Pérdidas por hh + errores
                                            </div>
                                        </td>
                                        <td className="p-8 text-teal-300 bg-teal-500/10">
                                            <div className="text-2xl md:text-3xl font-extrabold mb-1">$599<span className="text-sm font-normal text-teal-400">/mes</span></div>
                                            <div className="text-xs font-normal opacity-80 flex items-center gap-1">
                                                Suscripción Standard
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
