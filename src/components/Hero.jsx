import React, { useState, useEffect, useRef } from 'react';
import Button from './ui/Button';
import Badge from './ui/Badge';

const Hero = () => {
    const [currentVideo, setCurrentVideo] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const videoRefs = useRef([]);

    // Array of all hero videos
    const videos = [
        { src: '/videos/hero/3562633-hd_1920_1080_24fps.mp4', name: 'Playa Paradisíaca' },
        { src: '/videos/hero/5738684-hd_1920_1080_30fps.mp4', name: 'Costa Dorada' },
        { src: '/videos/hero/7206023-hd_1920_1080_24fps.mp4', name: 'Atardecer Tropical' },
        { src: '/videos/hero/7613415-hd_1920_1080_24fps.mp4', name: 'Aguas Cristalinas' },
        { src: '/videos/hero/7772313-hd_1920_1080_24fps.mp4', name: 'Horizonte Infinito' },
        { src: '/videos/hero/7772365-hd_1920_1080_24fps.mp4', name: 'Naturaleza Vibrante' },
        { src: '/videos/hero/7772376-hd_1920_1080_24fps.mp4', name: 'Paisaje Épico' },
        { src: '/videos/hero/8638793-hd_1920_1080_30fps.mp4', name: 'Aventura Mexicana' }
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
                    <Badge variant="success" className="text-sm md:text-base px-4 py-2 animate-pulse bg-teal-500/20 text-teal-300 border-teal-500/50">
                        <i className="fas fa-map-marked-alt mr-2"></i>
                        {videos[currentVideo].name}
                    </Badge>
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    Tu Inventario Turístico: <span className="text-teal-400">Auditado</span>, <span className="text-teal-400">Saneado</span> y <span className="text-blue-500">Conectado Globalmente</span>.
                </h1>

                {/* Subheadline */}
                <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto">
                    Deja de luchar con Excel y la invisibilidad online. <strong>SAT Connect</strong> fusiona la tecnología de <span className="text-white font-semibold">Bókun</span> con la inteligencia de mercado de <span className="text-white font-semibold">SAT México</span> para escalar tu negocio.
                </p>

                {/* Stats (Optional - Keeping generic/impressive based on prompt hint or removing if too cluttered. Keeping for credibility) */}
                <div className="flex flex-wrap justify-center gap-8 mb-10 opacity-80 scale-90">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-teal-400 mb-1">1,000+</div>
                        <div className="text-gray-300 text-sm">Tours Auditados</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-400 mb-1">24/7</div>
                        <div className="text-gray-300 text-sm">Sincronización</div>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                    <Button
                        variant="primary"
                        onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
                        className="text-lg px-8 py-5 shadow-[0_0_20px_rgba(20,184,166,0.5)] hover:shadow-[0_0_30px_rgba(20,184,166,0.7)] bg-teal-600 hover:bg-teal-500 border-none transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <i className="fas fa-star mr-2 text-yellow-300"></i>
                        Quiero ser Aliado Fundador
                        <span className="block text-xs font-normal opacity-90 mt-1">(Cupos Limitados)</span>
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => document.getElementById('thrive-engine').scrollIntoView({ behavior: 'smooth' })}
                        className="text-lg px-8 py-5 text-white border-white/30 hover:bg-white/10 hover:border-white transition-all"
                    >
                        <i className="fas fa-microchip mr-2"></i>
                        Descubrir el Motor T.H.R.I.V.E.
                    </Button>
                </div>

                {/* Channel Partners Logos (Keep as social proof) */}
                <div className="mb-8">
                    <p className="text-xs text-gray-500 text-center mb-4 uppercase tracking-widest">
                        Potenciado por Bókun, conectando con:
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-6 max-w-4xl mx-auto opacity-60 hover:opacity-100 transition-opacity duration-500">
                        {/* Expedia */}
                        <div className="text-white text-xl">
                            <i className="fab fa-expeditedssl mr-2"></i>Expedia
                        </div>
                        {/* Booking.com */}
                        <div className="text-white text-xl">
                            <i className="fas fa-bed mr-2"></i>Booking.com
                        </div>
                        {/* Airbnb */}
                        <div className="text-white text-xl">
                            <i className="fab fa-airbnb mr-2"></i>Airbnb
                        </div>
                        {/* Viator */}
                        <div className="text-white text-xl">
                            <i className="fas fa-route mr-2"></i>Viator
                        </div>
                        {/* GetYourGuide */}
                        <div className="text-white text-xl">
                            <i className="fas fa-map-marked-alt mr-2"></i>GetYourGuide
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center items-center gap-6 text-teal-200/60 text-xs tracking-wider uppercase">
                    <div className="flex items-center">
                        <i className="fas fa-check-circle mr-2"></i>
                        Tecnología Oficial Bókun
                    </div>
                    <div className="flex items-center">
                        <i className="fas fa-shield-alt mr-2"></i>
                        Pagos Seguros
                    </div>
                </div>

                {/* Video Carousel Indicators */}
                <div className="flex justify-center gap-2 mt-8 flex-wrap">
                    {videos.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToVideo(index)}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentVideo
                                ? 'bg-teal-500 w-6'
                                : 'bg-white/20 hover:bg-white/40'
                                }`}
                            aria-label={`Ir a video ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                <i className="fas fa-chevron-down text-white/50 text-2xl"></i>
            </div>
        </section>
    );
};

export default Hero;
