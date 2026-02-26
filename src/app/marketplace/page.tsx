import { HeroMarketplace } from "@/components/hero-marketplace";
import { Footer } from "@/components/footer";
import { SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { LogIn, ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AgentPulse } from "@/components/agent-pulse";

export default async function MarketplacePage() {
    const user = await currentUser();

    return (
        <div className="min-h-screen bg-[#070b14] text-white selection:bg-teal-500/30">
            <AgentPulse />
            {/* Top Navigation for Marketplace */}
            <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src="/logo_final.svg" alt="SAT Connect" className="h-8 w-auto" />
                    <span className="text-sm font-bold tracking-widest text-blue-400 uppercase">Marketplace</span>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-gray-300 hover:text-white gap-2">
                                Ir al Dashboard <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    ) : (
                        <SignInButton mode="modal">
                            <Button variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 gap-2">
                                <LogIn className="w-4 h-4" /> Acceso Agentes
                            </Button>
                        </SignInButton>
                    )}
                </div>
            </nav>

            <main className="pt-16">
                <HeroMarketplace />

                {/* Marketplace Features Section */}
                <section className="py-24 bg-gradient-to-b from-[#070b14] to-black relative">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)' }} />

                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                            <div className="flex flex-col items-center group">
                                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6 group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Tarifas Netas Reales</h3>
                                <p className="text-gray-400 leading-relaxed">Acceso a precios de operador directo sin intermediarios ocultos.</p>
                            </div>

                            <div className="flex flex-col items-center group">
                                <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-6 group-hover:scale-110 transition-transform">
                                    <Zap className="w-8 h-8 text-teal-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Confirmación Instantánea</h3>
                                <p className="text-gray-400 leading-relaxed">Sincronización directa con el inventario de T.H.R.I.V.E. Engine.</p>
                            </div>

                            <div className="flex flex-col items-center group">
                                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-6 group-hover:scale-110 transition-transform">
                                    <Globe className="w-8 h-8 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Alcance Global B2B</h3>
                                <p className="text-gray-400 leading-relaxed">Conecta tu agencia con los mejores tours de México en segundos.</p>
                            </div>
                        </div>

                        <div className="mt-24 p-12 rounded-[2rem] bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 text-center backdrop-blur-3xl overflow-hidden relative">
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-500/10 rounded-full blur-[100px]" />

                            <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para escalar tu operación?</h2>
                            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
                                Únete a la red de agencias más avanzada de México y empieza a reservar con la tecnología por delante.
                            </p>

                            {!user && (
                                <SignInButton mode="modal">
                                    <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white px-10 h-14 rounded-xl shadow-xl shadow-blue-500/20">
                                        Registrar mi Agencia Ahora
                                    </Button>
                                </SignInButton>
                            )}
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </div>
    );
}
