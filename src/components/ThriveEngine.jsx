import React from 'react';
import Card from './ui/Card';
import Badge from './ui/Badge';

const ThriveEngine = () => {
    return (
        <section id="thrive-engine" className="py-24 bg-gray-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-900/10 rounded-full blur-3xl -z-10"></div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <Badge variant="success" className="mb-4 bg-teal-900/30 text-teal-400 border-teal-500/30 backdrop-blur-sm">
                        Tecnología Exclusiva
                    </Badge>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        Conoce a <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">T.H.R.I.V.E.</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light">
                        El motor de inteligencia que audita, sanea y conecta tu inventario.
                    </p>
                </div>

                {/* Bento Grid 2.0 Layout */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">

                    {/* [T] Tour Health */}
                    <Card className="bg-gray-900/60 border-gray-800 hover:border-teal-500/50 transition-all duration-300 group backdrop-blur-md">
                        <div className="h-full flex flex-col p-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-900/20 border border-teal-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-2xl font-black text-teal-400">T</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Tour Health</h3>
                            <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                                Auditoría 360° de tus productos. Detectamos links rotos, fotos de baja calidad y precios desactualizados automáticamente.
                            </p>
                        </div>
                    </Card>

                    {/* [H] Health & Distribution */}
                    <Card className="bg-gray-900/60 border-gray-800 hover:border-teal-500/50 transition-all duration-300 group backdrop-blur-md">
                        <div className="h-full flex flex-col p-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-900/20 border border-teal-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-2xl font-black text-teal-400">H</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Health & Dist.</h3>
                            <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                                Panel de control de distribución. Visualiza en tiempo real dónde está activo tu inventario (Viator, Expedia, B2B).
                            </p>
                        </div>
                    </Card>

                    {/* [R] Revenue Optimization */}
                    <Card className="bg-gray-900/60 border-gray-800 hover:border-teal-500/50 transition-all duration-300 group backdrop-blur-md">
                        <div className="h-full flex flex-col p-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-900/20 border border-teal-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-2xl font-black text-teal-400">R</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Revenue Opt.</h3>
                            <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                                Algoritmos de precios dinámicos y protección de márgenes para asegurar que cada venta sea rentable.
                            </p>
                        </div>
                    </Card>

                    {/* [I] Inventory Standard */}
                    <Card className="bg-gray-900/60 border-gray-800 hover:border-teal-500/50 transition-all duration-300 group backdrop-blur-md">
                        <div className="h-full flex flex-col p-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-900/20 border border-teal-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-2xl font-black text-teal-400">I</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Inventory Std.</h3>
                            <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                                Estandarización global (GS1/OpenTravel). Tu inventario habla el idioma que las grandes OTAs requieren.
                            </p>
                        </div>
                    </Card>

                    {/* THE ENGINE (Centerpiece) - Spans 2 rows on mobile if needed, or takes center stage on lg */}
                    <div className="lg:col-start-2 lg:row-start-2 relative flex items-center justify-center min-h-[300px] lg:min-h-0">
                        {/* Orb Animation */}
                        <div className="absolute inset-0 bg-teal-500/5 rounded-full animate-pulse-slow blur-2xl"></div>
                        <div className="w-full h-full bg-gray-900/80 border border-teal-500/30 rounded-3xl flex flex-col items-center justify-center p-8 relative overflow-hidden shadow-[0_0_50px_rgba(20,184,166,0.15)] group">
                            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                            <div className="relative z-10 text-center transform transition-transform duration-500 group-hover:scale-105">
                                <div className="w-24 h-24 mx-auto bg-gradient-to-b from-gray-800 to-gray-900 rounded-full border-2 border-teal-400/50 flex items-center justify-center mb-6 shadow-lg shadow-teal-500/20">
                                    <i className="fas fa-brain text-5xl text-transparent bg-clip-text bg-gradient-to-br from-teal-300 to-emerald-300 drop-shadow-sm"></i>
                                </div>
                                <h3 className="text-2xl font-black text-white tracking-widest mb-1">ENGINE</h3>
                                <div className="h-1 w-12 bg-teal-500 mx-auto rounded-full"></div>
                                <p className="mt-4 text-xs font-mono text-teal-300 uppercase tracking-widest">
                                    Processing Live Data
                                </p>
                            </div>
                            {/* Orbiting Particles */}
                            <div className="absolute w-full h-full animate-spin-slower opacity-30 pointer-events-none">
                                <div className="absolute top-4 left-1/2 w-2 h-2 bg-teal-400 rounded-full shadow-[0_0_10px_currentColor]"></div>
                                <div className="absolute bottom-4 left-1/2 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_currentColor]"></div>
                            </div>
                        </div>
                    </div>

                    {/* [V] Value & Analytics */}
                    <Card className="bg-gray-900/60 border-gray-800 hover:border-teal-500/50 transition-all duration-300 group backdrop-blur-md">
                        <div className="h-full flex flex-col p-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-900/20 border border-teal-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-2xl font-black text-teal-400">V</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Value & Analytics</h3>
                            <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                                Tableros de inteligencia de negocios. Mide ROI, ADR y conversión por canal en tiempo real.
                            </p>
                        </div>
                    </Card>

                    {/* [E] Engine Automation - Reordered for Layout flow */}
                    <Card className="bg-gray-900/60 border-gray-800 hover:border-teal-500/50 transition-all duration-300 group backdrop-blur-md lg:col-start-3 lg:row-start-2">
                        <div className="h-full flex flex-col p-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-900/20 border border-teal-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-2xl font-black text-teal-400">E</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Engine Auto.</h3>
                            <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                                Automatización de flujos de trabajo. Sincronización de disponibilidad y confirmaciones automáticas 24/7.
                            </p>
                        </div>
                    </Card>

                    {/* Empty cell/filler or just flow naturally. 
                        Layout check:
                        Row 1: T, H, R
                        Row 2: I, ENGINE, E (Placed explicitly)
                        Row 3: V (Flows to (3,1)?)
                        
                        Let's re-arrange explicitly for perfect symmetry if possible, or just let V take last spot.
                        Current Items: T, H, R, I, ENGINE(Fixed), V, E(Fixed).
                        Total 7 items.
                        Grid has 3 cols.
                        Row 1: T, H, R (3 items)
                        Row 2: I, ENGINE, E (3 items)
                        Row 3: V (1 item) -> V is centered? 
                        
                        Let's make V span 3 cols or center it.
                        Or adding a CTA card to fill the space?
                        
                        Let's adjust:
                        Row 1: T, H, R
                        Row 2: I, ENGINE, E
                        Row 3: V (Centered)
                    */}

                    <div className="lg:col-span-3 lg:w-1/3 lg:mx-auto">
                        <Card className="bg-gray-900/60 border-gray-800 hover:border-teal-500/50 transition-all duration-300 group backdrop-blur-md h-full">
                            <div className="h-full flex flex-col p-6 items-center text-center">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-900/20 border border-teal-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <span className="text-2xl font-black text-teal-400">V</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Value & Analytics</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Tableros de inteligencia de negocios. Mide ROI, ADR y conversión por canal.
                                </p>
                            </div>
                        </Card>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ThriveEngine;
