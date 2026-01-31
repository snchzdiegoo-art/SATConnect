import Card from './ui/Card'

export default function ThriveEngine() {
    const pillars = [
        {
            icon: 'fa-shield-halved',
            title: 'Trust',
            description: 'Verificación de credibilidad y reputación del proveedor mediante auditorías exhaustivas y certificaciones validadas.'
        },
        {
            icon: 'fa-heart-pulse',
            title: 'Health',
            description: 'Estado operativo del producto evaluado en tiempo real, desde disponibilidad hasta cumplimiento de estándares.'
        },
        {
            icon: 'fa-chart-line',
            title: 'Revenue',
            description: 'Optimización de precios y comisiones para maximizar rentabilidad sin sacrificar competitividad en el mercado.'
        },
        {
            icon: 'fa-plug',
            title: 'Integration',
            description: 'Conectividad perfecta con sistemas Bókun, Viator, TripAdvisor y otras plataformas de distribución.'
        },
        {
            icon: 'fa-gem',
            title: 'Value',
            description: 'Propuesta de valor única identificada y potenciada para destacar en un mercado saturado.'
        },
        {
            icon: 'fa-star',
            title: 'Experience',
            description: 'Calidad de la experiencia del cliente medida y mejorada continuamente con datos y feedback real.'
        }
    ]

    return (
        <section id="thrive" className="section bg-brand-darker">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
                        El <span className="text-gradient">T.H.R.I.V.E. Engine</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Sistema de auditoría de 6 pilares que asegura que solo productos "Healthy" lleguen a tu marketplace
                    </p>
                </div>

                {/* Pillars Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pillars.map((pillar, index) => (
                        <Card
                            key={pillar.title}
                            hover={true}
                            className={`animate-fade-in animation-delay-${index * 200}`}
                        >
                            <div className="flex flex-col items-center text-center">
                                {/* Icon */}
                                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                                    <i className={`fas ${pillar.icon} text-2xl text-white`}></i>
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold mb-3 text-white">{pillar.title}</h3>

                                {/* Description */}
                                <p className="text-gray-400 leading-relaxed mb-4">{pillar.description}</p>

                                {/* Badge */}
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-medium">
                                    <i className="fas fa-check-circle"></i>
                                    Auditado por SAT México
                                </span>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <p className="text-gray-300 mb-6">
                        ¿Quieres que auditemos tu inventario con el motor T.H.R.I.V.E.?
                    </p>
                    <a
                        href="#onboarding"
                        className="btn btn-primary inline-flex items-center gap-2"
                    >
                        <i className="fas fa-clipboard-check"></i>
                        Solicitar Auditoría Gratuita
                    </a>
                </div>
            </div>
        </section>
    )
}
