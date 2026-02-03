import React from 'react';
import Navbar from '../components/Navbar';
import ThriveEngine from '../components/ThriveEngine'; // Reusing the Bento Grid
import Footer from '../components/Footer';

const Platform = () => {
    return (
        <div className="bg-gray-950 min-h-screen text-white font-sans">
            <Navbar />

            {/* Simple Tech Header */}
            <section className="pt-32 pb-16 px-6 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    La Plataforma <span className="text-teal-400">Inteligente</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                    Más que un sistema de reservas. Un motor de crecimiento diseñado para escalar operaciones turísticas.
                </p>
            </section>

            {/* Software Screenshots Section (Placeholder style) */}
            <section className="py-16 bg-gray-900 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="relative rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl p-4 md:p-8 max-w-5xl mx-auto transform hover:scale-[1.01] transition-transform duration-500">
                        {/* Mockup Header */}
                        <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <div className="ml-4 h-4 w-64 bg-gray-800 rounded-full opacity-50"></div>
                        </div>
                        {/* Mockup Content (Can be an img later) */}
                        <div className="grid grid-cols-4 gap-6 h-96 animate-pulse">
                            <div className="col-span-1 bg-gray-800/50 rounded-lg h-full"></div>
                            <div className="col-span-3 grid grid-rows-3 gap-6">
                                <div className="bg-gray-800/50 rounded-lg row-span-1"></div>
                                <div className="bg-gray-800/50 rounded-lg row-span-2"></div>
                            </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-gray-900/80 backdrop-blur-sm px-8 py-4 rounded-xl border border-teal-500/30">
                                <p className="text-teal-400 font-mono">Dashboard Preview (Loading...)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Engine Deep Dive */}
            <ThriveEngine />

            {/* Trust Section */}
            <section className="py-24 bg-gray-950 text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-2xl font-bold mb-12 text-gray-400">Respaldado por los líderes de la industria</h2>
                    <div className="flex justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all">
                        <div className="text-3xl font-bold text-white flex items-center gap-2">
                            <i className="fas fa-bolt text-yellow-500"></i> Bókun
                        </div>
                        <div className="text-3xl font-bold text-white flex items-center gap-2">
                            <i className="fas fa-building text-teal-500"></i> SAT México
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Platform;
