import React, { useState, useEffect, useRef } from 'react';
import Button from './ui/Button';
import Badge from './ui/Badge';

const Hero = () => {
    const [currentVideo, setCurrentVideo] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const videoRefs = useRef([]);

    // Array of all hero videos
    const videos = [
        { src: '/videos/hero/12270222_3840_2160_30fps.mp4', name: 'Playa Paradisíaca' },
        { src: '/videos/hero/12377531_3840_2160_24fps.mp4', name: 'Costa Dorada' },
        { src: '/videos/hero/13073518_3840_2160_30fps.mp4', name: 'Atardecer Tropical' },
        { src: '/videos/hero/13457566_3840_2160_30fps.mp4', name: 'Aguas Cristalinas' },
        { src: '/videos/hero/14972248_1920_1080_24fps.mp4', name: 'Horizonte Infinito' },
        { src: '/videos/hero/16679786-hd_1920_1080_24fps.mp4', name: 'Naturaleza Vibrante' },
        { src: '/videos/hero/17480599-uhd_2562_1440_60fps.mp4', name: 'Paisaje Épico' },
        { src: '/videos/hero/18690716-uhd_3840_2160_30fps.mp4', name: 'Aventura Mexicana' },
        { src: '/videos/hero/3562633-hd_1920_1080_24fps.mp4', name: 'Destino Soñado' },
        { src: '/videos/hero/6943026-hd_1920_1080_25fps.mp4', name: 'Maravilla Natural' },
        { src: '/videos/hero/7206043-hd_1920_1080_24fps.mp4', name: 'Paraíso Escondido' },
        { src: '/videos/hero/7613415-hd_1920_1080_24fps.mp4', name: 'Experiencia Única' }
    ];

    // Handle video end event - transition to next video
    useEffect(() => {
        const currentVideoElement = videoRefs.current[currentVideo];

        if (currentVideoElement) {
            const handleVideoEnd = () => {
                setIsTransitioning(true);
                setTimeout(() => {
                    setCurrentVideo((prev) => (prev + 1) % videos.length);
                    setIsTransitioning(false);
                }, 800); // Transition duration
            };

            currentVideoElement.addEventListener('ended', handleVideoEnd);

            // Play current video
            currentVideoElement.play().catch(err => {
                console.log('Video autoplay prevented:', err);
            });

            return () => {
                currentVideoElement.removeEventListener('ended', handleVideoEnd);
            };
        }
    }, [currentVideo, videos.length]);

    // Preload next video
    useEffect(() => {
        const nextIndex = (currentVideo + 1) % videos.length;
        const nextVideo = videoRefs.current[nextIndex];
        if (nextVideo) {
            nextVideo.load();
        }
    }, [currentVideo, videos.length]);

    const goToVideo = (index) => {
        if (index !== currentVideo) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentVideo(index);
                setIsTransitioning(false);
            }, 800);
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Video Background Carousel */}
            <div className="absolute inset-0 w-full h-full">
                {videos.map((video, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentVideo ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <video
                            ref={(el) => (videoRefs.current[index] = el)}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                            preload={index === currentVideo || index === (currentVideo + 1) % videos.length ? 'auto' : 'none'}
                        >
                            <source src={video.src} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 py-20 text-center">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <img
                        src="/Logo-SATConnect-v3.svg"
                        alt="SAT Connect Logo"
                        className="h-20 md:h-28 w-auto drop-shadow-2xl"
                    />
                </div>

                {/* Video Name Badge */}
                <div className="flex justify-center mb-6">
                    <Badge variant="success" className="text-sm md:text-base px-4 py-2 animate-pulse">
                        <i className="fas fa-map-marked-alt mr-2"></i>
                        {videos[currentVideo].name}
                    </Badge>
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    El <span className="text-primary-500">Marketplace B2B</span> que Conecta{' '}
                    <span className="text-accent-500">Proveedores</span> con Agencias Globales
                </h1>

                {/* Subheadline */}
                <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto">
                    <strong className="text-white">Proveedores:</strong> Distribuye tu inventario en 62+ canales globales.{' '}
                    <strong className="text-white">Agencias:</strong> Accede a tours verificados con auditoría T.H.R.I.V.E.
                </p>

                {/* Stats */}
                <div className="flex flex-wrap justify-center gap-8 mb-8">
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-accent-400 mb-2">1,000+</div>
                        <div className="text-gray-300">Tours Curados</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">24/7</div>
                        <div className="text-gray-300">API en Tiempo Real</div>
                    </div>
                </div>

                {/* Channel Partners Logos */}
                <div className="mb-12">
                    <p className="text-sm text-gray-400 text-center mb-4 uppercase tracking-wide">
                        Distribuye en los principales canales globales:
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto">
                        {/* Expedia */}
                        <div className="text-white text-2xl opacity-70 hover:opacity-100 transition-opacity">
                            <i className="fab fa-expeditedssl"></i>
                            <span className="ml-2 font-bold">Expedia</span>
                        </div>
                        {/* Booking.com */}
                        <div className="text-white text-2xl opacity-70 hover:opacity-100 transition-opacity">
                            <i className="fas fa-bed"></i>
                            <span className="ml-2 font-bold">Booking.com</span>
                        </div>
                        {/* Airbnb */}
                        <div className="text-white text-2xl opacity-70 hover:opacity-100 transition-opacity">
                            <i className="fab fa-airbnb"></i>
                            <span className="ml-2 font-bold">Airbnb</span>
                        </div>
                        {/* Viator */}
                        <div className="text-white text-2xl opacity-70 hover:opacity-100 transition-opacity">
                            <i className="fas fa-route"></i>
                            <span className="ml-2 font-bold">Viator</span>
                        </div>
                        {/* GetYourGuide */}
                        <div className="text-white text-2xl opacity-70 hover:opacity-100 transition-opacity">
                            <i className="fas fa-map-marked-alt"></i>
                            <span className="ml-2 font-bold">GetYourGuide</span>
                        </div>
                        {/* Y más... */}
                        <div className="text-gray-400 text-lg">
                            <span className="font-semibold">+ 50 más</span>
                        </div>
                    </div>
                </div>
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
                    <Button
                        variant="primary"
                        onClick={() => document.getElementById('onboarding').scrollIntoView({ behavior: 'smooth' })}
                        className="text-lg px-8 py-4 shadow-2xl hover:shadow-primary-500/50 transition-all duration-300"
                    >
                        <i className="fas fa-rocket mr-2"></i>
                        Empieza Gratis Ahora
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => document.getElementById('thrive-engine').scrollIntoView({ behavior: 'smooth' })}
                        className="text-lg px-8 py-4 text-white border-white hover:bg-white/10"
                    >
                        <i className="fas fa-play-circle mr-2"></i>
                        Ver Cómo Funciona
                    </Button>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center items-center gap-6 text-gray-400 text-sm">
                    <div className="flex items-center">
                        <i className="fas fa-shield-alt text-accent-400 mr-2"></i>
                        Seguro SSL 256-bit
                    </div>
                    <div className="flex items-center">
                        <i className="fas fa-lock text-accent-400 mr-2"></i>
                        Datos Encriptados
                    </div>
                    <div className="flex items-center">
                        <i className="fas fa-check-circle text-accent-400 mr-2"></i>
                        Sin Tarjeta Requerida
                    </div>
                </div>

                {/* Video Carousel Indicators */}
                <div className="flex justify-center gap-2 mt-12 flex-wrap">
                    {videos.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToVideo(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentVideo
                                ? 'bg-primary-500 w-8'
                                : 'bg-white/30 hover:bg-white/50'
                                }`}
                            aria-label={`Ir a video ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                <div className="flex flex-col items-center text-white/70 hover:text-white transition-colors cursor-pointer">
                    <span className="text-sm mb-2">Descubre Más</span>
                    <i className="fas fa-chevron-down animate-bounce"></i>
                </div>
            </div>
        </section>
    );
};

export default Hero;
