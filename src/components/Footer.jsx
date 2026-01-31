import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-950 text-white pt-20 pb-10 border-t border-gray-800">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <img src="/Logo-SATConnect-v3.svg" alt="SAT Connect" className="h-10 mb-6 opacity-80" />
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            El ecosistema híbrido que conecta la tecnología global con la operación local.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-500 hover:text-teal-400 transition-colors"><i className="fab fa-linkedin text-xl"></i></a>
                            <a href="#" className="text-gray-500 hover:text-teal-400 transition-colors"><i className="fab fa-instagram text-xl"></i></a>
                            <a href="#" className="text-gray-500 hover:text-teal-400 transition-colors"><i className="fab fa-facebook text-xl"></i></a>
                        </div>
                    </div>

                    {/* Solutions */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Soluciones</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-teal-400 transition-colors">T.H.R.I.V.E. Engine</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Marketplace B2B</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Integración API</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Programa de Partners</a></li>
                        </ul>
                    </div>

                    {/* Legal & Support */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Soporte</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Términos y Condiciones</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Política de Privacidad</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Inventory Data Standard</a></li>
                        </ul>
                    </div>

                    {/* Contact Badge */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Contacto</h4>
                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                            <div className="flex items-center mb-3">
                                <i className="fas fa-envelope text-teal-500 mr-3"></i>
                                <a href="mailto:aliados@satconnect.travel" className="text-gray-300 hover:text-white text-sm">aliados@satconnect.travel</a>
                            </div>
                            <div className="flex items-center">
                                <i className="fas fa-map-marker-alt text-teal-500 mr-3"></i>
                                <span className="text-gray-500 text-sm">Ciudad de México, MX</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Badges & Copyright */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-600 text-sm">
                        &copy; {new Date().getFullYear()} SAT Connect. Todos los derechos reservados.
                    </p>

                    {/* Certificates */}
                    <div className="flex flex-wrap items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 border border-gray-700 rounded px-3 py-1">
                            <i className="fas fa-bolt text-yellow-500"></i> Powered by Bókun
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 border border-gray-700 rounded px-3 py-1">
                            <i className="fas fa-check-circle text-teal-500"></i> SAT México Certified
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 border border-gray-700 rounded px-3 py-1">
                            <i className="fab fa-stripe text-indigo-400 text-lg"></i> Secure Payments
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
