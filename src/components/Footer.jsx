export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-brand-darker border-t border-white/10">
            <div className="container-custom section">
                <div className="grid md:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="md:col-span-2">
                        <h3 className="text-2xl font-bold font-display mb-4">
                            <span className="text-gradient">SAT Connect</span>
                        </h3>
                        <p className="text-gray-400 mb-6 max-w-md">
                            Plataforma B2B que conecta proveedores de tours con agentes de viajes.
                            Auditoría inteligente, tarifas preferenciales y tecnología de clase mundial.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="w-10 h-10 bg-white/5 hover:bg-brand-accent/20 border border-white/10 hover:border-brand-accent rounded-lg flex items-center justify-center transition-all"
                                aria-label="Facebook"
                            >
                                <i className="fab fa-facebook-f text-gray-400 hover:text-brand-accent"></i>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-white/5 hover:bg-brand-accent/20 border border-white/10 hover:border-brand-accent rounded-lg flex items-center justify-center transition-all"
                                aria-label="Instagram"
                            >
                                <i className="fab fa-instagram text-gray-400 hover:text-brand-accent"></i>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-white/5 hover:bg-brand-accent/20 border border-white/10 hover:border-brand-accent rounded-lg flex items-center justify-center transition-all"
                                aria-label="LinkedIn"
                            >
                                <i className="fab fa-linkedin-in text-gray-400 hover:text-brand-accent"></i>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-white/5 hover:bg-brand-accent/20 border border-white/10 hover:border-brand-accent rounded-lg flex items-center justify-center transition-all"
                                aria-label="Twitter"
                            >
                                <i className="fab fa-twitter text-gray-400 hover:text-brand-accent"></i>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Enlaces Rápidos</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#thrive" className="text-gray-400 hover:text-brand-accent transition-colors">
                                    T.H.R.I.V.E. Engine
                                </a>
                            </li>
                            <li>
                                <a href="#pricing" className="text-gray-400 hover:text-brand-accent transition-colors">
                                    Precios
                                </a>
                            </li>
                            <li>
                                <a href="#marketplace" className="text-gray-400 hover:text-brand-accent transition-colors">
                                    Marketplace
                                </a>
                            </li>
                            <li>
                                <a href="#onboarding" className="text-gray-400 hover:text-brand-accent transition-colors">
                                    Registrarse
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal & Contact */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 mb-6">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-brand-accent transition-colors">
                                    Términos de Servicio
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-brand-accent transition-colors">
                                    Política de Privacidad
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-brand-accent transition-colors">
                                    FAQ
                                </a>
                            </li>
                        </ul>

                        <h4 className="font-semibold text-white mb-4">Contacto</h4>
                        <ul className="space-y-2">
                            <li className="text-gray-400 flex items-center gap-2">
                                <i className="fas fa-envelope text-brand-accent"></i>
                                info@satconnect.travel
                            </li>
                            <li className="text-gray-400 flex items-center gap-2">
                                <i className="fas fa-phone text-brand-accent"></i>
                                +52 (55) 1234-5678
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        © {currentYear} SAT Connect. Todos los derechos reservados.
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">Powered by</span>
                        <img
                            src="/powered-by-bokun.png"
                            alt="Bókun"
                            className="h-8 opacity-70 hover:opacity-100 transition-opacity"
                        />
                    </div>
                </div>
            </div>
        </footer>
    )
}
