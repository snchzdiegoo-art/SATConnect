import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from './ui/Button';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-white/5 p-2 rounded-lg group-hover:bg-white/10 transition-colors">
                            <img src="/Logo-SATConnect-v3.svg" alt="SAT Connect" className="h-10 w-auto" />
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            to="/"
                            className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-teal-400' : 'text-gray-300 hover:text-white'}`}
                        >
                            Proveedores
                        </Link>
                        <Link
                            to="/marketplace"
                            className={`text-sm font-medium transition-colors ${isActive('/marketplace') ? 'text-teal-400' : 'text-gray-300 hover:text-white'}`}
                        >
                            Agencias
                        </Link>
                        <Link
                            to="/platform"
                            className={`text-sm font-medium transition-colors ${isActive('/platform') ? 'text-teal-400' : 'text-gray-300 hover:text-white'}`}
                        >
                            Plataforma
                        </Link>
                    </div>

                    {/* CTAs & Trust */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                                <i className="fas fa-flag text-green-500 mr-1"></i> Facturamos en México
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
                        <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-gray-900 border-t border-gray-800 absolute w-full left-0">
                    <div className="flex flex-col p-6 gap-4">
                        <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-teal-400 font-medium">Proveedores</Link>
                        <Link to="/marketplace" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-teal-400 font-medium">Agencias</Link>
                        <Link to="/platform" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-teal-400 font-medium">Plataforma</Link>
                        <div className="h-px bg-gray-800 my-2"></div>
                        <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-2">
                            <i className="fas fa-flag text-green-500"></i> Facturamos en MXN y USD
                        </p>
                        <Button variant="primary" className="w-full justify-center">Acceso Clientes</Button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
