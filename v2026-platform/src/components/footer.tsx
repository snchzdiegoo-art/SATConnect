import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-gray-950 pt-20 pb-12 relative overflow-hidden">
            {/* STANDARD DIVIDER (Green Line) */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0 flex items-center gap-3">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg">
                            <img src="/Logo-SATConnect-v3.svg" alt="SAT Connect" className="h-8 w-auto" />
                        </div>
                        <div>
                            {/* Redundant text removed, just the copyright */}
                            <p className="text-gray-500 text-sm mt-0.5">© 2026 SAT México. Todos los derechos reservaods.</p>
                        </div>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-400">
                        <Link href="#" className="hover:text-teal-400">Términos</Link>
                        <Link href="#" className="hover:text-teal-400">Privacidad</Link>
                        <Link href="#" className="hover:text-teal-400">Contacto</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
