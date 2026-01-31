import React from 'react';
import Card from './ui/Card';
import Badge from './ui/Badge';

const ThriveEngine = () => {
    return (
        <section id="thrive-engine" className="py-24 bg-gray-950 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <Badge variant="success" className="mb-4 bg-teal-900/30 text-teal-400 border-teal-500/30">
                        Tecnología Exclusiva
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Conoce a <span className="text-teal-400">T.H.R.I.V.E.</span>
                    </h2>
                    <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
                        Tu Auditor de Salud Comercial 24/7
                    </p>
                </div>

                {/* Central Engine Visualization */}
                <div className="relative max-w-6xl mx-auto">
                    {/* Central Core */}
                    <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                        <div className="w-64 h-64 bg-gray-900 rounded-full border-4 border-teal-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(20,184,166,0.3)] relative">
                            <div className="absolute inset-0 rounded-full border border-teal-500/20 animate-ping-slow"></div>
                            <div className="text-center">
                                <i className="fas fa-brain text-5xl text-teal-400 mb-2"></i>
                                <div className="text-white font-bold text-xl">THE ENGINE</div>
                            </div>
                        </div>
                    </div>

                    {/* 6 Pillars Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-y-24">
                        {/* T - Tour Health */}
                        <div className="group">
                            <Card className="h-full bg-gray-900/80 border-gray-800 hover:border-teal-500/50 transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-teal-900/20 flex items-center justify-center shrink-0 border border-teal-500/20 group-hover:bg-teal-500/20 group-hover:border-teal-500/50 transition-all">
                                        <span className="text-2xl font-black text-teal-400">T</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Tour Health</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            Auditoría automática de precios, fotos y especificaciones. Detectamos errores antes que tus clientes.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* H - Health & Distribution */}
                        <div className="group">
                            <Card className="h-full bg-gray-900/80 border-gray-800 hover:border-teal-500/50 transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-teal-900/20 flex items-center justify-center shrink-0 border border-teal-500/20 group-hover:bg-teal-500/20 group-hover:border-teal-500/50 transition-all">
                                        <span className="text-2xl font-black text-teal-400">H</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Health & Distribution</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            Monitoreo de visibilidad en OTAs globales. Asegura que tu producto esté vivo en cada canal conectado.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* R - Revenue Optimization */}
                        <div className="group">
                            <Card className="h-full bg-gray-900/80 border-gray-800 hover:border-teal-500/50 transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-teal-900/20 flex items-center justify-center shrink-0 border border-teal-500/20 group-hover:bg-teal-500/20 group-hover:border-teal-500/50 transition-all">
                                        <span className="text-2xl font-black text-teal-400">R</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Revenue Optimization</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            Protección inteligente de márgenes y markup. Maximiza tu ganancia neta por cada reserva.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* I - Inventory Standard */}
                        <div className="group">
                            <Card className="h-full bg-gray-900/80 border-gray-800 hover:border-teal-500/50 transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-teal-900/20 flex items-center justify-center shrink-0 border border-teal-500/20 group-hover:bg-teal-500/20 group-hover:border-teal-500/50 transition-all">
                                        <span className="text-2xl font-black text-teal-400">I</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Inventory Standard</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            Estandarización a calidad US-English. Tu producto listo para el mercado internacional.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* V - Value & Analytics */}
                        <div className="group">
                            <Card className="h-full bg-gray-900/80 border-gray-800 hover:border-teal-500/50 transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-teal-900/20 flex items-center justify-center shrink-0 border border-teal-500/20 group-hover:bg-teal-500/20 group-hover:border-teal-500/50 transition-all">
                                        <span className="text-2xl font-black text-teal-400">V</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Value & Analytics</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            Reportes ejecutivos para decisiones basadas en datos, no en suposiciones.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* E - Engine Automation */}
                        <div className="group">
                            <Card className="h-full bg-gray-900/80 border-gray-800 hover:border-teal-500/50 transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-teal-900/20 flex items-center justify-center shrink-0 border border-teal-500/20 group-hover:bg-teal-500/20 group-hover:border-teal-500/50 transition-all">
                                        <span className="text-2xl font-black text-teal-400">E</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Engine Automation</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            Carga y actualización en segundos. Cero error humano, máxima eficiencia operativa.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ThriveEngine;
