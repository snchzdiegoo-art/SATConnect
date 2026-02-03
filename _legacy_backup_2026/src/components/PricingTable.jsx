import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';

const PricingTable = () => {
    const [billingCycle, setBillingCycle] = useState('monthly');

    return (
        <section id="pricing" className="py-20 bg-gray-900 relative">
            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-block bg-gradient-to-r from-teal-500 to-blue-500 p-[1px] rounded-full mb-4">
                        <div className="bg-gray-900 rounded-full px-4 py-1">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400 font-bold uppercase tracking-wider text-xs">
                                Campaña de Lanzamiento
                            </span>
                        </div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Únete al Círculo Exclusivo de los <span className="text-teal-400">Primeros 100</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                        Asegura tu posición como Aliado Fundador y obtén beneficios vitalicios.
                    </p>

                    {/* Urgency Counter / Banner */}
                    <div className="inline-flex items-center gap-4 bg-red-500/10 border border-red-500/30 rounded-lg px-6 py-3 text-red-300 animate-pulse">
                        <i className="fas fa-hourglass-half"></i>
                        <span className="font-bold">Ciéress de Inscripción: Febrero 2026</span>
                        <span className="w-px h-4 bg-red-500/30 mx-2"></span>
                        <span className="text-sm">Cupos Restantes: <strong className="text-white">87/100</strong></span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Starter Plan */}
                    <Card className="bg-gray-800 border-gray-700 opacity-80 hover:opacity-100 transition-all">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                            <p className="text-gray-400 text-sm mb-6">Para operadores locales iniciando su digitalización.</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">$49</span>
                                <span className="text-gray-500">/mes</span>
                            </div>
                            <Button variant="outline" className="w-full mb-8 border-gray-600 text-gray-300 hover:border-white hover:text-white">
                                Empezar Ahora
                            </Button>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li className="flex items-center">
                                    <i className="fas fa-check text-green-500 mr-2"></i>
                                    Auditoría Básica T.H.R.I.V.E.
                                </li>
                                <li className="flex items-center">
                                    <i className="fas fa-check text-green-500 mr-2"></i>
                                    Conexión a 1 OTA
                                </li>
                                <li className="flex items-center">
                                    <i className="fas fa-check text-green-500 mr-2"></i>
                                    Soporte por Email
                                </li>
                            </ul>
                        </div>
                    </Card>

                    {/* PRO Plan (Best Value) */}
                    <div className="relative transform md:-translate-y-4">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg shadow-teal-500/40 z-20">
                            MÁS POPULAR
                        </div>
                        <Card className="bg-gray-800 border-teal-500 shadow-[0_0_30px_rgba(20,184,166,0.15)] relative overflow-hidden h-full">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-teal-400 mb-2">Aliado Fundador</h3>
                                <p className="text-gray-300 text-sm mb-6">El paquete completo de aceleración.</p>

                                <div className="mb-8">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-lg text-gray-500 line-through decoration-red-500 decoration-2">$199</span>
                                        <span className="text-5xl font-bold text-white">$149</span>
                                    </div>
                                    <span className="text-teal-400 text-sm font-bold">Ahorras $50/mes de por vida</span>
                                </div>

                                <Button variant="primary" className="w-full py-4 text-lg mb-8 bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-500/20">
                                    Asegurar mi Precio Fundador
                                </Button>

                                <div className="space-y-4">
                                    <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-3">
                                        <p className="text-sm text-teal-200 flex items-start">
                                            <i className="fas fa-star text-yellow-400 mt-1 mr-2 shrink-0"></i>
                                            <strong>Beneficio Estrella:</strong> 0% Booking Fee en Viator durante los primeros 6 meses.
                                        </p>
                                    </div>
                                    <ul className="space-y-4 text-gray-300 text-sm">
                                        <li className="flex items-center">
                                            <i className="fas fa-check-circle text-teal-400 mr-2"></i>
                                            <strong>Acceso Total</strong> al Motor T.H.R.I.V.E.
                                        </li>
                                        <li className="flex items-center">
                                            <i className="fas fa-check-circle text-teal-400 mr-2"></i>
                                            <strong>Marketplace B2B Global</strong> (Ilimitado)
                                        </li>
                                        <li className="flex items-center">
                                            <i className="fas fa-check-circle text-teal-400 mr-2"></i>
                                            Reportes de Salud Mensuales
                                        </li>
                                        <li className="flex items-center">
                                            <i className="fas fa-check-circle text-teal-400 mr-2"></i>
                                            Consultoría de Onboarding (1:1)
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Enterprise Plan */}
                    <Card className="bg-gray-800 border-gray-700 opacity-80 hover:opacity-100 transition-all">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                            <p className="text-gray-400 text-sm mb-6">Para cadenas y grandes operadores.</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">Custom</span>
                            </div>
                            <Button variant="outline" className="w-full mb-8 border-gray-600 text-gray-300 hover:border-white hover:text-white">
                                Contactar Ventas
                            </Button>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li className="flex items-center">
                                    <i className="fas fa-check text-green-500 mr-2"></i>
                                    API dedicada
                                </li>
                                <li className="flex items-center">
                                    <i className="fas fa-check text-green-500 mr-2"></i>
                                    SLA Garantizado
                                </li>
                                <li className="flex items-center">
                                    <i className="fas fa-check text-green-500 mr-2"></i>
                                    Account Manager Dedicado
                                </li>
                            </ul>
                        </div>
                    </Card>
                </div>

                {/* Agencies Callout */}
                <div className="mt-16 text-center max-w-2xl mx-auto border-t border-gray-800 pt-10">
                    <p className="text-gray-400 mb-4">¿Eres una Agencia de Viajes?</p>
                    <a href="#" className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center transition-colors">
                        Regístrate gratis para comprar inventario verificado <i className="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default PricingTable;
