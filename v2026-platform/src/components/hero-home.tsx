"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Rocket, CheckCircle } from "lucide-react"

export function HeroHome() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full bg-gray-900">
                <video
                    className="w-full h-full object-cover opacity-60"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    {/* Note: In a real migration, make sure to copy public/videos to the new project's public folder */}
                    <source src="/videos/hero/3562633-hd_1920_1080_24fps.mp4" type="video/mp4" />
                </video>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 py-20 text-center">
                <div className="mt-20">
                    <Badge
                        variant="primary"
                        className="mb-6 animate-pulse px-4 py-2 text-sm bg-teal-500/20 text-teal-300 border-teal-500/50"
                    >
                        <Rocket className="mr-2 h-4 w-4" /> El SaaS para Proveedores de Tours
                    </Badge>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight max-w-5xl mx-auto">
                        Vende tus tours en todo el mundo,{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                            sin complicaciones.
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
                        Administra tus reservas, acepta pagos y conéctate con las agencias más grandes del mundo en un solo lugar.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Button
                            variant="primary"
                            className="text-lg px-10 py-5 bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-500/30 transform hover:-translate-y-1 transition-all"
                        >
                            Comienza Gratis hoy mismo
                        </Button>
                    </div>

                    <p className="mt-8 text-sm text-gray-500 flex items-center justify-center">
                        <CheckCircle className="text-teal-500 mr-2 h-4 w-4" /> Facturamos en México y en Pesos
                    </p>
                </div>
            </div>
        </section>
    )
}
