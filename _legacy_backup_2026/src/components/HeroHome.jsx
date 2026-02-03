import React, { useState, useEffect, useRef } from 'react';
import Button from './ui/Button';
import Badge from './ui/Badge';

const HeroHome = () => {
    const [currentVideo, setCurrentVideo] = useState(0);
    const videoRefs = useRef([]);

    // Array of all hero videos (Reuse existing assets)
    const videos = [
        { src: '/videos/hero/3562633-hd_1920_1080_24fps.mp4', name: 'Playa Paradisíaca' },
        { src: '/videos/hero/5738684-hd_1920_1080_30fps.mp4', name: 'Costa Dorada' },
        // ... keeping a few for variety
    ];

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Video Background (Static first video for simplicity/speed in this version or loop) */}
            <div className="absolute inset-0 w-full h-full">
                <video
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src="/videos/hero/3562633-hd_1920_1080_24fps.mp4" type="video/mp4" />
                </video>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 py-20 text-center">
                {/* Glassmorphic Header/Logo Placeholder (Navbar is separate now, but keeping logo focus if needed or removing since Navbar has it) */}
                {/* We rely on Navbar for the logo now to keep it clean, or keep a large center logo? 
                    The prompt says "Page 1: Home". Simplicity.
                    Let's remove the extra logo here and focus on the Headline.
                */}

                <div className="mt-20">
                    <Badge variant="primary" className="mb-6 animate-pulse px-4 py-2 text-sm bg-teal-500/20 text-teal-300 border-teal-500/50">
                        <i className="fas fa-rocket mr-2"></i> El SaaS para Proveedores de Tours
                    </Badge>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight max-w-5xl mx-auto">
                        Vende tus tours en todo el mundo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">sin complicaciones.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
                        Administra tus reservas, acepta pagos y conéctate con las agencias más grandes de México en un solo lugar.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Button
                            variant="primary"
                            className="text-lg px-10 py-5 bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-500/30 transform hover:-translate-y-1 transition-all"
                        >
                            Comienza Gratis hoy mismo
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-lg px-8 py-5 border-white/20 hover:bg-white/10"
                        >
                            <i className="fas fa-play-circle mr-2"></i> Ver Demo en 1 min
                        </Button>
                    </div>

                    <p className="mt-8 text-sm text-gray-500">
                        <i className="fas fa-check-circle text-teal-500 mr-2"></i> Facturamos en México y en Pesos
                    </p>
                </div>
            </div>
        </section>
    );
};

export default HeroHome;
