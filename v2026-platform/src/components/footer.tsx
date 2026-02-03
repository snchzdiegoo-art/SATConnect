import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-gray-950 border-t border-gray-800 py-12">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <span className="font-bold text-xl tracking-tight text-white">SAT<span className="text-teal-400">CONNECT</span></span>
                        <p className="text-gray-500 text-sm mt-2">© 2026 SAT México. Todos los derechos reservados.</p>
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
