import React from 'react';
import Navbar from '../components/Navbar';
import HeroMarketplace from '../components/HeroMarketplace';
import Card from '../components/ui/Card';
import MarketplacePreview from '../components/MarketplacePreview'; // Reusing the preview grid
import Footer from '../components/Footer';

const Marketplace = () => {
    return (
        <div className="bg-gray-950 min-h-screen text-white font-sans">
            <Navbar />
            <HeroMarketplace />

            {/* Agency Benefits Section */}
            <section className="py-20 bg-gray-900 border-y border-gray-800">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="bg-gray-800/50 border-gray-700 p-8 text-center hover:border-blue-500/50 transition-all">
                            <i className="fas fa-hand-holding-usd text-4xl text-blue-400 mb-6"></i>
                            <h3 className="text-xl font-bold text-white mb-4">Tarifas Netas</h3>
                            <p className="text-gray-400">Accede a precios exclusivos mayoristas. Tú decides tu margen de ganancia.</p>
                        </Card>
                        <Card className="bg-gray-800/50 border-gray-700 p-8 text-center hover:border-blue-500/50 transition-all">
                            <i className="fas fa-bolt text-4xl text-yellow-400 mb-6"></i>
                            <h3 className="text-xl font-bold text-white mb-4">Confirmación Inmediata</h3>
                            <p className="text-gray-400">Sin llamadas ni esperas. Disponibilidad real sincronizada con el operador.</p>
                        </Card>
                        <Card className="bg-gray-800/50 border-gray-700 p-8 text-center hover:border-blue-500/50 transition-all">
                            <i className="fas fa-shield-check text-4xl text-green-400 mb-6"></i>
                            <h3 className="text-xl font-bold text-white mb-4">Tours Auditados</h3>
                            <p className="text-gray-400">Garantía SAT México. Solo vendes productos verificados y de alta calidad.</p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Inventory Preview Reuse */}
            <MarketplacePreview />

            <section className="py-20 text-center">
                <h2 className="text-3xl font-bold mb-8">¿Listo para vender más?</h2>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg shadow-blue-600/20 transition-all">
                    Crear Cuenta de Agencia Gratis
                </button>
            </section>

            <Footer />
        </div>
    );
};

export default Marketplace;
