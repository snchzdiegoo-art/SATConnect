"use client"

import React from "react"
import { CheckCircle, XCircle } from "lucide-react"

export function BenchmarkingTable() {
    return (
        <section className="py-24 bg-gray-900 border-y border-gray-800" id="benchmarking">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Guerra contra el <span className="text-red-500 line-through">Excel</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Comparamos tu operación actual vs. el estándar de SAT Connect.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="p-6 text-gray-400 font-medium border-b border-gray-800 w-1/3">Proceso Operativo</th>
                                <th className="p-6 text-red-400 font-bold border-b border-gray-800 bg-red-900/10 w-1/3">Método Manual (Excel)</th>
                                <th className="p-6 text-teal-400 font-bold border-b border-gray-800 bg-teal-900/10 w-1/3">SAT Connect</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm md:text-base">
                            <tr className="group hover:bg-white/5 transition-colors">
                                <td className="p-6 border-b border-gray-800 text-white font-medium">Carga de Producto</td>
                                <td className="p-6 border-b border-gray-800 text-gray-400">
                                    4 Horas <span className="text-xs text-red-500 block mt-1">(Alto riesgo de error)</span>
                                </td>
                                <td className="p-6 border-b border-gray-800 text-white">
                                    4 Segundos <span className="text-xs text-teal-500 block mt-1">(Onboarding Automatizado)</span>
                                </td>
                            </tr>
                            <tr className="group hover:bg-white/5 transition-colors">
                                <td className="p-6 border-b border-gray-800 text-white font-medium">Actualización de Tarifas</td>
                                <td className="p-6 border-b border-gray-800 text-gray-400">Manual, canal por canal</td>
                                <td className="p-6 border-b border-gray-800 text-white">Instantánea Global</td>
                            </tr>
                            <tr className="group hover:bg-white/5 transition-colors">
                                <td className="p-6 border-b border-gray-800 text-white font-medium">Cobranza B2B</td>
                                <td className="p-6 border-b border-gray-800 text-gray-400">Facturas individuales x Agencia</td>
                                <td className="p-6 border-b border-gray-800 text-white">Conciliación Unificada Automática</td>
                            </tr>
                            <tr className="group hover:bg-white/5 transition-colors">
                                <td className="p-6 border-b border-gray-800 text-white font-medium">Disponibilidad</td>
                                <td className="p-6 border-b border-gray-800 text-gray-400">Offline (Riesgo de Sobreventa)</td>
                                <td className="p-6 border-b border-gray-800 text-white">Real-Time (Channel Manager)</td>
                            </tr>
                            <tr className="group hover:bg-white/5 transition-colors">
                                <td className="p-6 border-b border-gray-800 text-white font-medium">Auditoría de Salud</td>
                                <td className="p-6 border-b border-gray-800 text-gray-400">Imposible monitorear diario</td>
                                <td className="p-6 border-b border-gray-800 text-white">Reporte Diario Automático</td>
                            </tr>
                            <tr className="group hover:bg-white/5 transition-colors">
                                <td className="p-6 border-b border-gray-800 text-white font-medium">Distribución B2B</td>
                                <td className="p-6 border-b border-gray-800 text-gray-400">Llamadas y correos infinitos</td>
                                <td className="p-6 border-b border-gray-800 text-white">Acceso Directo Marketplace</td>
                            </tr>
                            <tr className="group hover:bg-white/5 transition-colors">
                                <td className="p-6 border-b border-gray-800 text-white font-medium">Riesgo de Margen</td>
                                <td className="p-6 border-b border-gray-800 text-red-400 font-bold">
                                    Alto <span className="text-xs font-normal opacity-70 block mt-1">(Dedazos y fórmulas rotas)</span>
                                </td>
                                <td className="p-6 border-b border-gray-800 text-teal-400 font-bold">
                                    0% <span className="text-xs font-normal opacity-70 block mt-1">(Protección Automática)</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}
