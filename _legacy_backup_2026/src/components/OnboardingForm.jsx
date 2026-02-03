import { useState } from 'react'
import Card from './ui/Card'
import Button from './ui/Button'

export default function OnboardingForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        bokunId: '',
        userType: '',
        acceptTerms: false
    })

    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido'
        }

        if (!formData.company.trim()) {
            newErrors.company = 'El nombre de la empresa es requerido'
        }

        if (!formData.userType) {
            newErrors.userType = 'Selecciona un tipo de usuario'
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'Debes aceptar los términos'
        }

        return newErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newErrors = validateForm()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setIsSubmitting(true)

        // TODO: Replace with actual FormSpree endpoint
        // For now, simulate API call
        try {
            // Simulated API call
            await new Promise(resolve => setTimeout(resolve, 1500))

            // In production, use FormSpree or your endpoint:
            /*
            const response = await fetch(import.meta.env.VITE_FORM_ENDPOINT, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData)
            })
            */

            setIsSuccess(true)
            setFormData({
                name: '',
                email: '',
                company: '',
                bokunId: '',
                userType: '',
                acceptTerms: false
            })
        } catch (error) {
            setErrors({ submit: 'Hubo un error. Por favor intenta de nuevo.' })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <section id="onboarding" className="section bg-brand-dark">
                <div className="container-custom">
                    <div className="max-w-2xl mx-auto">
                        <Card className="text-center">
                            <i className="fas fa-check-circle text-emerald-400 text-6xl mb-6"></i>
                            <h2 className="text-3xl font-bold mb-4">¡Gracias por tu interés!</h2>
                            <p className="text-gray-300 mb-6">
                                Hemos recibido tu solicitud. Nuestro equipo te contactará en las próximas 24 horas
                                {formData.userType === 'provider' ? (
                                    <> para guiarte en el proceso de <strong>auditoría T.H.R.I.V.E.</strong> y activación como Aliado Fundador.</>
                                ) : formData.userType === 'agent' ? (
                                    <> para activar tu cuenta y darte acceso al <strong>marketplace de tours verificados</strong>.</>
                                ) : (
                                    <> para entender tus necesidades y guiarte en el siguiente paso.</>
                                )}
                            </p>
                            <Button
                                variant="ghost"
                                onClick={() => setIsSuccess(false)}
                            >
                                Enviar otra solicitud
                            </Button>
                        </Card>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section id="onboarding" className="section bg-brand-dark">
            <div className="container-custom">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
                            Únete al <span className="text-gradient">Ecosistema SAT Connect</span>
                        </h2>
                        <p className="text-xl text-gray-400">
                            <strong className="text-white">Proveedores:</strong> Auditoría T.H.R.I.V.E. gratuita.{' '}
                            <strong className="text-white">Agencias:</strong> Acceso inmediato al marketplace
                        </p>
                    </div>

                    {/* Form Card */}
                    <Card>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                    Nombre Completo *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="Juan Pérez"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-400">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Corporativo *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="juan@empresa.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-400">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Company */}
                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                                    Nombre de la Empresa *
                                </label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="Mi Tour Operadora S.A."
                                />
                                {errors.company && (
                                    <p className="mt-1 text-sm text-red-400">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.company}
                                    </p>
                                )}
                            </div>

                            {/* Bókun ID */}
                            <div>
                                <label htmlFor="bokunId" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                    Bókun ID
                                    <span className="text-xs text-gray-500">(Opcional)</span>
                                    <button
                                        type="button"
                                        className="text-brand-accent hover:text-brand-accent/80"
                                        title="Si ya usas Bókun, proporciona tu ID para integración más rápida"
                                    >
                                        <i className="fas fa-info-circle"></i>
                                    </button>
                                </label>
                                <input
                                    type="text"
                                    id="bokunId"
                                    name="bokunId"
                                    value={formData.bokunId}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="BK-12345"
                                />
                            </div>

                            {/* User Type */}
                            <div>
                                <label htmlFor="userType" className="block text-sm font-medium text-gray-300 mb-2">
                                    Tipo de Usuario *
                                </label>
                                <select
                                    id="userType"
                                    name="userType"
                                    value={formData.userType}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option value="">Selecciona una opción</option>
                                    <option value="provider">Proveedor de Tours/Actividades</option>
                                    <option value="agent">Agente de Viajes</option>
                                    <option value="other">Otro</option>
                                </select>
                                {errors.userType && (
                                    <p className="mt-1 text-sm text-red-400">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.userType}
                                    </p>
                                )}
                            </div>

                            {/* Terms */}
                            <div>
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="acceptTerms"
                                        checked={formData.acceptTerms}
                                        onChange={handleChange}
                                        className="mt-1"
                                    />
                                    <span className="text-sm text-gray-300">
                                        Acepto recibir información sobre SAT Connect y acepto los{' '}
                                        <a href="#" className="text-brand-accent hover:underline">términos de servicio</a>
                                        {' '}y{' '}
                                        <a href="#" className="text-brand-accent hover:underline">política de privacidad</a>
                                    </span>
                                </label>
                                {errors.acceptTerms && (
                                    <p className="mt-1 text-sm text-red-400">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.acceptTerms}
                                    </p>
                                )}
                            </div>

                            {/* Submit Error */}
                            {errors.submit && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                                    <i className="fas fa-exclamation-triangle mr-2"></i>
                                    {errors.submit}
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full justify-center text-lg"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-paper-plane"></i>
                                        Solicitar Auditoría Gratuita
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Trust Indicators */}
                        <div className="mt-6 pt-6 border-t border-white/10 text-center">
                            <p className="text-xs text-gray-500">
                                <i className="fas fa-lock mr-1"></i>
                                Tus datos están seguros. No compartimos información con terceros.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    )
}
