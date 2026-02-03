import React from 'react';
import Card from './ui/Card';

const ThreeSteps = () => {
    return (
        <section className="py-24 bg-gray-950">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Es simple. <span className="text-teal-400">Sin Excel.</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Digitaliza tu operación en minutos, no en meses.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Step 1 */}
                    <div className="relative group">
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 text-8xl font-black text-gray-800/50 z-0">1</div>
                        <Card className="bg-gray-900 border-gray-800 hover:border-teal-500/50 relative z-10 h-full">
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <i className="fas fa-cloud-upload-alt text-3xl text-teal-400"></i>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">Carga tus Tours</h3>
                                <p className="text-gray-400 text-sm">
                                    Subes tu información, fotos y precios una sola vez. Nuestro sistema audita la calidad automáticamente.
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Step 2 */}
                    <div className="relative group">
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 text-8xl font-black text-gray-800/50 z-0">2</div>
                        <Card className="bg-gray-900 border-gray-800 hover:border-teal-500/50 relative z-10 h-full">
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <i className="fas fa-network-wired text-3xl text-blue-400"></i>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">Conéctate</h3>
                                <p className="text-gray-400 text-sm">
                                    Activamos tu inventario en Viator, Expedia y nuestro Marketplace B2B al instante.
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Step 3 */}
                    <div className="relative group">
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 text-8xl font-black text-gray-800/50 z-0">3</div>
                        <Card className="bg-gray-900 border-gray-800 hover:border-teal-500/50 relative z-10 h-full">
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <i className="fas fa-calendar-check text-3xl text-green-400"></i>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">Recibe Reservas</h3>
                                <p className="text-gray-400 text-sm">
                                    Olvídate del Excel. Recibe confirmaciones en tiempo real y gestiona todo desde un solo calendario.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ThreeSteps;
