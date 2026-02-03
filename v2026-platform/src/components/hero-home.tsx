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
                    {/* Updated to use the numbered video file 1.mp4 */}
                    <source src="/videos/hero/1.mp4" type="video/mp4" />
                </video>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center">

                {/* Badge */}
                <div className="flex justify-center mb-6">
                    <Badge variant="outline" className="border-teal-500/30 bg-teal-500/10 text-teal-400 px-4 py-1.5 backdrop-blur-md rounded-full">
                        <Rocket className="w-4 h-4 mr-2" />
                        Plataforma All-In-One para Turismo
                    </Badge>
                </div>

                {/* Headlines */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
                    Vende tus tours en <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                        todo el mundo
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                    Conecta con las mejores agencias, gestiona tu inventario en tiempo real y cobra sin fronteras. Todo desde un solo lugar.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button variant="primary" size="lg" className="h-14 px-8 text-lg w-full sm:w-auto bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-500/20">
                        Empezar Gratis
                    </Button>
                    <Button variant="secondary" size="lg" className="h-14 px-8 text-lg w-full sm:w-auto border-gray-600 hover:border-white text-gray-300 hover:text-white bg-transparent backdrop-blur-sm">
                        Agendar Demo
                    </Button>
                </div>

                {/* Trust Indicators */}
                <div className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Facturación MX (SAT)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Cobro en Pesos y Dólares</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
