import Card from './ui/Card'
import Button from './ui/Button'
import Badge from './ui/Badge'
import CountdownTimer from './ui/CountdownTimer'

export default function PricingTable() {
    // Set target date to 30 days from now
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 30)

    const plans = [
        {
            name: 'Standard',
            price: 799,
            discountedPrice: 599,
            description: 'Perfecto para comenzar',
            features: [
                'Auditoría básica T.H.R.I.V.E.',
                'Hasta 10 productos',
                '1 usuario',
                'Soporte por email',
                'Integración Bókun',
                'Dashboard básico'
            ],
            cta: 'Comenzar Prueba',
            popular: false
        },
        {
            name: 'Pro',
            price: 1999,
            discountedPrice: 1499,
            description: 'El más elegido por proveedores',
            features: [
                'Auditoría completa T.H.R.I.V.E.',
                'Hasta 50 productos',
                '5 usuarios',
                'Soporte prioritario 24/7',
                'Integraciones múltiples',
                'Reportes avanzados',
                'Analytics en tiempo real',
                'White label básico'
            ],
            cta: 'Unirme como Fundador',
            popular: true
        },
        {
            name: 'Elite',
            price: 5499,
            discountedPrice: 4124,
            description: 'Solución empresarial completa',
            features: [
                'Todo en Pro +',
                'Productos ilimitados',
                'Usuarios ilimitados',
                'Account Manager dedicado',
                'White label completo',
                'API access',
                'Onboarding personalizado',
                'SLA garantizado'
            ],
            cta: 'Contactar Ventas',
            popular: false
        }
    ]

    const handlePlanClick = (planName) => {
        // TODO: Integrate Stripe Checkout
        // For now, scroll to onboarding form
        const element = document.getElementById('onboarding')
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <section id="pricing" className="section bg-brand-dark">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
                        Planes para <span className="text-gradient">Proveedores</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                        Únete a los primeros 100 miembros y obtén 25% de descuento de por vida
                    </p>

                    {/* Countdown Timer */}
                    <div className="inline-block glass-card px-8 py-6 rounded-2xl mb-4">
                        <p className="text-sm text-gray-400 mb-3 uppercase tracking-wide">
                            Oferta termina en:
                        </p>
                        <CountdownTimer targetDate={targetDate} />
                        <p className="text-xs text-gray-500 mt-3">
                            <i className="fas fa-users mr-2"></i>
                            Solo <strong className="text-brand-accent">47/100</strong> lugares disponibles
                        </p>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <Card
                            key={plan.name}
                            hover={true}
                            className={`relative ${plan.popular ? 'ring-2 ring-brand-accent scale-105' : ''} animate-fade-in animation-delay-${index * 200}`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <Badge variant="popular">
                                        <i className="fas fa-fire"></i>
                                        Más Popular
                                    </Badge>
                                </div>
                            )}

                            {/* Plan Name */}
                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                            {/* Pricing */}
                            <div className="mb-6">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-4xl font-bold text-white">${plan.discountedPrice}</span>
                                    <span className="text-gray-500 line-through">${plan.price}</span>
                                </div>
                                <p className="text-sm text-gray-400">USD/mes</p>
                                <div className="mt-2">
                                    <Badge variant="success">
                                        <i className="fas fa-tag"></i>
                                        Ahorra ${plan.price - plan.discountedPrice}/mes
                                    </Badge>
                                </div>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2 text-gray-300">
                                        <i className="fas fa-check text-brand-accent mt-1"></i>
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <Button
                                variant={plan.popular ? 'primary' : 'secondary'}
                                className="w-full justify-center"
                                onClick={() => handlePlanClick(plan.name)}
                            >
                                {plan.cta}
                                <i className="fas fa-arrow-right"></i>
                            </Button>
                        </Card>
                    ))}
                </div>

                {/* Agency Pricing Info */}
                <div className="mt-16 text-center">
                    <div className="glass-card inline-block px-8 py-6 rounded-2xl max-w-2xl">
                        <h3 className="text-2xl font-bold text-white mb-3">
                            <i className="fas fa-handshake text-accent-400 mr-2"></i>
                            ¿Eres Agencia o Agente de Viajes?
                        </h3>
                        <p className="text-lg text-gray-300 mb-4">
                            <strong className="text-white">Acceso 100% gratuito</strong> al marketplace de tours verificados.
                            Solo pagas comisión por reservas confirmadas.
                        </p>
                        <Button
                            variant="ghost"
                            className="text-accent-400 border-accent-400 hover:bg-accent-400/10"
                            onClick={() => {
                                const element = document.getElementById('onboarding')
                                if (element) element.scrollIntoView({ behavior: 'smooth' })
                            }}
                        >
                            <i className="fas fa-user-tie mr-2"></i>
                            Registrarme como Agencia
                        </Button>
                    </div>
                </div>

                {/* Trust Section */}
                <div className="mt-16 text-center">
                    <p className="text-gray-400 mb-4">
                        <i className="fas fa-shield-check text-brand-accent mr-2"></i>
                        Garantía de satisfacción de 14 días • Cancela cuando quieras
                    </p>
                    <div className="flex justify-center items-center gap-6 flex-wrap text-xs text-gray-500">
                        <span><i className="fas fa-lock mr-1"></i> Pagos seguros con Stripe</span>
                        <span><i className="fas fa-sync mr-1"></i> Sin contratos a largo plazo</span>
                        <span><i className="fas fa-headset mr-1"></i> Soporte en español</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
