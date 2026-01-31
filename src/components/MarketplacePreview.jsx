import { useState } from 'react'
import Card from './ui/Card'
import Badge from './ui/Badge'

export default function MarketplacePreview() {
    const [showModal, setShowModal] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)

    const products = [
        {
            id: 1,
            name: 'Tour en Globo Aerostático',
            provider: 'SAT México Tours',
            location: 'Teotihuacán',
            price: 2499,
            publicPrice: 2999,
            rating: 4.9,
            reviews: 127,
            image: '/assets/products/tour_hot_air_balloon_1769827665147.png',
            badge: 'Healthy'
        },
        {
            id: 2,
            name: 'Snorkeling en Cenotes',
            provider: 'Riviera Adventures',
            location: 'Riviera Maya',
            price: 1299,
            publicPrice: 1599,
            rating: 4.8,
            reviews: 93,
            image: '/assets/products/tour_cenote_snorkeling_1769827679210.png',
            badge: 'Healthy'
        },
        {
            id: 3,
            name: 'Tour Gastronómico CDMX',
            provider: 'Sabores de México',
            location: 'Ciudad de México',
            price: 899,
            publicPrice: 1099,
            rating: 5.0,
            reviews: 156,
            image: '/assets/products/tour_food_mexicity_1769827695584.png',
            badge: 'Healthy'
        },
        {
            id: 4,
            name: 'Parapente Valle de Bravo',
            provider: 'Adventure México',
            location: 'Valle de Bravo',
            price: 1599,
            publicPrice: 1899,
            rating: 4.9,
            reviews: 78,
            image: '/assets/products/tour_paragliding_valle_1769827708506.png',
            badge: 'Healthy'
        },
        {
            id: 5,
            name: 'Avistamiento de Ballenas',
            provider: 'Baja Expeditions',
            location: 'Baja California',
            price: 3499,
            publicPrice: 3999,
            rating: 5.0,
            reviews: 64,
            image: '/assets/products/tour_whale_watching_1769827721960.png',
            badge: 'Healthy'
        },
        {
            id: 6,
            name: 'Tour Mezcalero Oaxaca',
            provider: 'Tradiciones Oaxaqueñas',
            location: 'Oaxaca',
            price: 799,
            publicPrice: 999,
            rating: 4.8,
            reviews: 112,
            image: '/assets/products/tour_mezcal_oaxaca_1769827736105.png',
            badge: 'Healthy'
        }
    ]

    const handleProductClick = (product) => {
        setSelectedProduct(product)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedProduct(null)
    }

    const calculateDiscount = (price, publicPrice) => {
        return Math.round(((publicPrice - price) / publicPrice) * 100)
    }

    return (
        <section id="marketplace" className="section bg-brand-darker">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
                        Marketplace <span className="text-gradient">B2B Exclusivo</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Todos los productos han sido auditados con el sistema T.H.R.I.V.E.
                        Accede a tarifas preferenciales exclusivas para agentes registrados
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                        <Card
                            key={product.id}
                            hover={true}
                            className={`cursor-pointer group overflow-hidden p-0 animate-fade-in animation-delay-${index * 200}`}
                            onClick={() => handleProductClick(product)}
                        >
                            {/* Product Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                {/* Badge Overlay */}
                                <div className="absolute top-4 right-4">
                                    <Badge variant="success">
                                        <i className="fas fa-check-circle"></i>
                                        {product.badge}
                                    </Badge>
                                </div>
                                {/* Discount Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-brand-accent text-white text-xs font-bold px-2 py-1 rounded">
                                        -{calculateDiscount(product.price, product.publicPrice)}%
                                    </span>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-6">
                                {/* Provider */}
                                <p className="text-xs text-gray-500 uppercase mb-1">{product.provider}</p>

                                {/* Product Name */}
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-accent transition-colors">
                                    {product.name}
                                </h3>

                                {/* Location */}
                                <p className="text-sm text-gray-400 mb-3 flex items-center gap-1">
                                    <i className="fas fa-map-marker-alt text-brand-accent"></i>
                                    {product.location}
                                </p>

                                {/* Rating */}
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className={`fas fa-star ${i < Math.floor(product.rating) ? '' : 'opacity-30'}`}></i>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        {product.rating} ({product.reviews} reseñas)
                                    </span>
                                </div>

                                {/* Pricing */}
                                <div className="flex items-baseline justify-between">
                                    <div>
                                        <span className="text-2xl font-bold text-brand-accent">${product.price}</span>
                                        <span className="text-sm text-gray-500 ml-2 line-through">${product.publicPrice}</span>
                                    </div>
                                    <span className="text-xs text-emerald-400 font-medium">
                                        Tarifa B2B
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <p className="text-gray-300 mb-6">
                        Estos son solo algunos de los cientos de productos auditados disponibles
                    </p>
                    <a
                        href="#onboarding"
                        className="btn btn-primary inline-flex items-center gap-2"
                    >
                        <i className="fas fa-unlock"></i>
                        Acceder al Marketplace Completo
                    </a>
                </div>
            </div>

            {/* Modal */}
            {showModal && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closeModal}>
                    <div className="glass-strong p-8 rounded-3xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center">
                            <i className="fas fa-lock text-brand-accent text-5xl mb-4"></i>
                            <h3 className="text-2xl font-bold mb-4">Acceso Exclusivo</h3>
                            <p className="text-gray-300 mb-6">
                                Regístrate como Aliado Fundador para acceder al marketplace completo
                                y reservar <strong className="text-brand-accent">{selectedProduct.name}</strong> con tarifa preferencial.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={closeModal}
                                    className="btn btn-secondary flex-1"
                                >
                                    Cerrar
                                </button>
                                <a
                                    href="#onboarding"
                                    onClick={closeModal}
                                    className="btn btn-primary flex-1"
                                >
                                    Registrarme
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
