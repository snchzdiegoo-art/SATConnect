import React from 'react';
import Button from './ui/Button';
import Badge from './ui/Badge';

const HeroMarketplace = () => {
    return (
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gray-900">
            {/* 
                VIDEO BACKGROUND SETUP:
                To use a video, uncomment the <video> block below and add your file to public/videos/
                For now, using a high-quality placeholder image as requested.
             */}

            {/* <div className="absolute inset-0 w-full h-full">
                <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
                    <source src="/videos/marketplace-hero.mp4" type="video/mp4" />
                </video>
             </div> */}

            {/* Background Image / Placeholder for video */}
            <div className="absolute inset-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1552083858-a937171e98bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent"></div>

            <div className="relative z-10 container mx-auto px-6 text-center pt-20">
                <Badge variant="blue" className="mb-6 inline-block bg-blue-500/20 text-blue-300 border-blue-500/50">
                    <i className="fas fa-briefcase mr-2"></i> Solo para Agencias de Viajes
                </Badge>

                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    El Inventario más <span className="text-blue-500">Confiable</span> de México a tu alcance.
                </h1>

                <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
                    Reserven tours directamente con tarifas preferenciales (Netas), disponibilidad en tiempo real y confirmación inmediata.
                </p>

                <div className="flex justify-center mb-12">
                    <Button
                        variant="primary"
                        className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30"
                    >
                        Regístrate como Agente B2B
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default HeroMarketplace;
