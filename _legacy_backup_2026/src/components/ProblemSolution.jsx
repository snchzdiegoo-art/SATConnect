import React from 'react';
import Card from './ui/Card';

const ProblemSolution = () => {
    return (
        <section className="py-20 bg-gray-900 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Headline */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        ¿Tu Excelente Producto está Atrapado en el <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">'Excel Hell'</span>?
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        La fragmentación tecnológica está costándote dinero cada día. Es hora de romper el ciclo.
                    </p>
                </div>

                {/* 3 Columns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Column 1: Pain - Excel Hell */}
                    <Card className="bg-gray-800/50 border-gray-700 hover:border-red-500/50 transition-colors duration-300">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                                <i className="fas fa-file-excel text-3xl text-red-500"></i>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">El Caos Manual</h3>
                            <p className="text-gray-400">
                                Tarifas desactualizadas, errores de dedo y horas perdidas gestionando reservas por email. El costo oculto de la operación manual.
                            </p>
                        </div>
                    </Card>

                    {/* Column 2: Pain - Invisibility */}
                    <Card className="bg-gray-800/50 border-gray-700 hover:border-orange-500/50 transition-colors duration-300">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-6">
                                <i className="fas fa-ghost text-3xl text-orange-500"></i>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">La Invisibilidad Digital</h3>
                            <p className="text-gray-400">
                                ¿Estás realmente visible en Viator, Expedia y GetYourGuide en tiempo real? Probablemente no. Tu inventario offline es invisible para el mundo.
                            </p>
                        </div>
                    </Card>

                    {/* Column 3: Solution - Marketplace */}
                    <Card className="bg-gray-800/50 border-teal-500/30 hover:border-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.1)] hover:shadow-[0_0_30px_rgba(20,184,166,0.2)] transition-all duration-300 transform md:-translate-y-4">
                        <div className="flex flex-col items-center text-center relative">
                            <div className="absolute -top-12 bg-teal-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Solución Definitiva
                            </div>
                            <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
                                <i className="fas fa-rocket text-3xl text-teal-400"></i>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">El Techo B2B Roto</h3>
                            <p className="text-gray-300">
                                Accede instantáneamente al <strong className="text-teal-400">Marketplace B2B de SAT México</strong>. Conectamos tu inventario auditado con nuestra red de agencias y hoteles globales.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default ProblemSolution;
