"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <nav className="fixed w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-white/5 p-2 rounded-lg group-hover:bg-white/10 transition-colors">
                            {/* Replace with actual logo path in public/ later, using text for now or verify public/ exists */}
                            <div className="h-8 w-8 bg-teal-500 rounded-sm flex items-center justify-center font-bold text-black">SC</div>
                        </div>
                        <span className="font-bold text-xl tracking-tight hidden sm:block">SAT<span className="text-teal-400">CONNECT</span></span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className={cn(
                                "text-sm font-medium transition-colors",
                                isActive("/") ? "text-teal-400" : "text-gray-300 hover:text-white"
                            )}
                        >
                            Proveedores
                        </Link>
                        <Link
                            href="/marketplace"
                            className={cn(
                                "text-sm font-medium transition-colors",
                                isActive("/marketplace")
                                    ? "text-teal-400"
                                    : "text-gray-300 hover:text-white"
                            )}
                        >
                            Agencias
                        </Link>
                        <Link
                            href="/platform"
                            className={cn(
                                "text-sm font-medium transition-colors",
                                isActive("/platform")
                                    ? "text-teal-400"
                                    : "text-gray-300 hover:text-white"
                            )}
                        >
                            Plataforma
                        </Link>
                    </div>

                    {/* CTAs & Trust */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                                Facturamos en México
                            </span>
                        </div>
                        <Button variant="primary" className="py-2 px-4 text-sm">
                            Acceso Clientes
                        </Button>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-gray-300 hover:text-white focus:outline-none"
                    >
                        {/* Simple Hamburger Icon */}
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-gray-900 border-t border-gray-800 absolute w-full left-0">
                    <div className="flex flex-col p-6 gap-4">
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className="text-gray-300 hover:text-teal-400 font-medium"
                        >
                            Proveedores
                        </Link>
                        <Link
                            href="/marketplace"
                            onClick={() => setIsOpen(false)}
                            className="text-gray-300 hover:text-teal-400 font-medium"
                        >
                            Agencias
                        </Link>
                        <Link
                            href="/platform"
                            onClick={() => setIsOpen(false)}
                            className="text-gray-300 hover:text-teal-400 font-medium"
                        >
                            Plataforma
                        </Link>
                        <div className="h-px bg-gray-800 my-2"></div>
                        <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-2">
                            Facturamos en MXN y USD
                        </p>
                        <Button variant="primary" className="w-full justify-center">
                            Acceso Clientes
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    )
}
