import React from 'react';
import Navbar from '../components/Navbar';
import ThriveEngine from '../components/ThriveEngine';
import Footer from '../components/Footer';
import Badge from '../components/ui/Badge';

const Platform = () => {
    return (
        <div className="bg-gray-950 min-h-screen text-white font-sans">
            <Navbar />

            {/* HERO SECTION (Video Ready) */}
            <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gray-900">
                {/* 
                    VIDEO BACKGROUND SETUP:
                    Standardized container for Page 3 video.
                    Replace the image div below with the video tag when asset is ready.
                */}
                <div className="absolute inset-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent"></div>

                <div className="relative z-10 container mx-auto px-6 text-center pt-24">
                    <Badge variant="purple" className="mb-6 inline-block bg-purple-500/20 text-purple-300 border-purple-500/50">
                        <i className="fas fa-layer-group mr-2"></i> Infraestructura T.H.R.I.V.E.
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                        La Plataforma <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-500">Inteligente</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
                        Más que un sistema de reservas. Un motor de crecimiento diseñado para escalar operaciones turísticas y erradicar el error humano.
                    </p>
                </div>
            </section>

            {/* DASHBOARD PREVIEWS */}
            <section className="py-20 bg-gray-950 relative">
                <div className="container mx-auto px-6">
                    <div className="relative rounded-2xl border border-gray-800 bg-gray-900/50 shadow-2xl p-4 md:p-8 max-w-6xl mx-auto backdrop-blur-sm">
                        {/* Mockup Windows Header */}
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <div className="ml-4 text-xs text-gray-600 font-mono">dashboard.satconnect.travel</div>
                        </div>

                        {/* Internal Grid Mockup */}
                        <div className="grid grid-cols-12 gap-6 h-[500px] animate-pulse-slow">
                            {/* Sidebar */}
                            <div className="col-span-2 hidden md:block bg-gray-800/20 rounded-lg h-full border border-gray-800/50"></div>
                            {/* Main Content */}
                            <div className="col-span-12 md:col-span-10 grid grid-rows-3 gap-6">
                                {/* Top Stats */}
                                <div className="row-span-1 grid grid-cols-3 gap-6">
                                    <div className="bg-gray-800/30 rounded-lg border border-gray-700/30"></div>
                                    <div className="bg-gray-800/30 rounded-lg border border-gray-700/30"></div>
                                    <div className="bg-gray-800/30 rounded-lg border border-gray-700/30"></div>
                                </div>
                                {/* Big Chart */}
                                <div className="row-span-2 bg-gray-800/20 rounded-lg border border-gray-700/30 relative flex items-center justify-center">
                                    <div className="text-center">
                                        <i className="fas fa-chart-line text-6xl text-gray-700 mb-4 opacity-50"></i>
                                        <p className="text-gray-500 font-mono text-sm">Visualización de Datos en Tiempo Real</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BENCHMARKING SECTION */}
            <section className="py-24 bg-gray-900 border-y border-gray-800" id="benchmarking">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Guerra contra el <span className="text-red-500 line-through">Excel</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Comparamos tu operación actual vs. el estándar T.H.R.I.V.E.
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-6 text-gray-400 font-medium border-b border-gray-800 w-1/3">Proceso Operativo</th>
                                    <th className="p-6 text-red-400 font-bold border-b border-gray-800 bg-red-900/10 w-1/3">Método Manual (Excel)</th>
                                    <th className="p-6 text-teal-400 font-bold border-b border-gray-800 bg-teal-900/10 w-1/3">SAT Connect + T.H.R.I.V.E.</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm md:text-base">
                                <tr className="group hover:bg-white/5 transition-colors">
                                    <td className="p-6 border-b border-gray-800 text-white font-medium">Carga de Producto</td>
                                    <td className="p-6 border-b border-gray-800 text-gray-400">4 Horas <span className="text-xs text-red-500 block mt-1">(Alto riesgo de error)</span></td>
                                    <td className="p-6 border-b border-gray-800 text-white">4 Segundos <span className="text-xs text-teal-500 block mt-1">(Onboarding Automatizado)</span></td>
                                </tr>
                                <tr className="group hover:bg-white/5 transition-colors">
                                    <td className="p-6 border-b border-gray-800 text-white font-medium">Actualización de Tarifas</td>
                                    <td className="p-6 border-b border-gray-800 text-gray-400">Manual, canal por canal</td>
                                    <td className="p-6 border-b border-gray-800 text-white">Instantánea Global</td>
                                </tr>
                                <tr className="group hover:bg-white/5 transition-colors">
                                    <td className="p-6 border-b border-gray-800 text-white font-medium">Auditoría de Salud</td>
                                    <td className="p-6 border-b border-gray-800 text-gray-400">Imposible monitorear diario</td>
                                    <td className="p-6 border-b border-gray-800 text-white">Reporte Diario (Health Score)</td>
                                </tr>
                                <tr className="group hover:bg-white/5 transition-colors">
                                    <td className="p-6 border-b border-gray-800 text-white font-medium">Distribución B2B</td>
                                    <td className="p-6 border-b border-gray-800 text-gray-400">Llamadas y correos infinitos</td>
                                    <td className="p-6 border-b border-gray-800 text-white">Acceso Directo Marketplace</td>
                                </tr>
                                <tr className="group hover:bg-white/5 transition-colors">
                                    <td className="p-6 border-b border-gray-800 text-white font-medium">Riesgo de Margen</td>
                                    <td className="p-6 border-b border-gray-800 text-red-400 font-bold">Alto <span className="text-xs font-normal opacity-70 block mt-1">(Dedazos y fórmulas rotas)</span></td>
                                    <td className="p-6 border-b border-gray-800 text-teal-400 font-bold">0% <span className="text-xs font-normal opacity-70 block mt-1">(Protección Automática)</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* THRIVE ENGINE DEEP DIVE */}
            <ThriveEngine />

            {/* TRUST SECTION */}
            <section className="py-24 bg-gray-950 text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-2xl font-bold mb-12 text-gray-400">Respaldado por líderes globales</h2>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-12 opacity-80">
                        <div className="flex items-center gap-4 text-3xl font-bold text-white group">
                            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/20 group-hover:border-yellow-500/50 transition-colors">
                                <i className="fas fa-bolt text-yellow-500"></i>
                            </div>
                            <span>Bókun</span>
                        </div>
                        <div className="h-8 w-px bg-gray-800 hidden md:block"></div>
                        <div className="flex items-center gap-4 text-3xl font-bold text-white group">
                            <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center border border-teal-500/20 group-hover:border-teal-500/50 transition-colors">
                                <i className="fas fa-building text-teal-500"></i>
                            </div>
                            <span>SAT México</span>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Platform;
