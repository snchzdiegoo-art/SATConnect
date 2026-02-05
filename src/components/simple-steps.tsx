"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { CloudUpload, Share2, CalendarCheck } from "lucide-react"

export function SimpleSteps() {
    return (
        <section className="py-24 bg-gray-950 relative overflow-hidden">

            {/* STANDARD DIVIDER (Stronger Visibility) */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent z-50 shadow-[0_0_15px_rgba(20,184,166,0.5)]"></div>

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

            <div className="container mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Es simple. <span className="text-teal-400">Sin Excel.</span>
                    </h2>
                    <p className="text-xl text-gray-400">
                        Digitaliza tu operación en minutos, no en meses.
                    </p>
                </div>

                {/* 3 Step Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">

                    {/* Step 1 */}
                    <Card className="bg-gray-900 border-gray-800 p-8 flex flex-col items-center text-center hover:border-teal-500/30 transition-colors group">
                        <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <CloudUpload className="h-8 w-8 text-teal-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Carga tus Tours</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Subes tu información, fotos y precios una sola vez. Nuestro sistema audita la calidad automáticamente.
                        </p>
                    </Card>

                    {/* Step 2 */}
                    <Card className="bg-gray-900 border-gray-800 p-8 flex flex-col items-center text-center hover:border-blue-500/30 transition-colors group">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Share2 className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Conéctate</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Activamos tu inventario en Viator, Expedia y nuestro Marketplace B2B al instante.
                        </p>
                    </Card>

                    {/* Step 3 */}
                    <Card className="bg-gray-900 border-gray-800 p-8 flex flex-col items-center text-center hover:border-green-500/30 transition-colors group">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <CalendarCheck className="h-8 w-8 text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Recibe Reservas</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Olvídate del Excel. Recibe confirmaciones en tiempo real y gestiona todo desde un solo calendario.
                        </p>
                    </Card>

                </div>

                {/* Footer Text */}
                <div className="text-center max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold text-white mb-4">
                        No solo es software, es <span className="text-blue-400">Crecimiento</span>
                    </h3>
                    <p className="text-gray-400 italic">
                        &quot;Además, te llevamos de la mano con agencias y hoteles para que nunca te falten clientes.&quot;
                    </p>
                </div>

            </div>
        </section>
    )
}
