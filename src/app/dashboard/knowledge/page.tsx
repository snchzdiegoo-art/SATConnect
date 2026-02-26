import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { TicketForm } from "@/components/knowledge/ticket-form";
import { Search, Book, PlayCircle, FileText, BadgeCheck, ShieldAlert } from "lucide-react";

export default async function KnowledgebasePage() {
    // 1. Clerk Verification Gate
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    // Role verification (Only travel_agents, admin, or super_admin allowed)
    const roleRaw = (user?.publicMetadata?.role as string) || "user";
    const isAuthorized = ["travel_agent", "admin", "super_admin"].includes(roleRaw);

    if (!isAuthorized) {
        // Redirect to a locked page or dashboard if user has no agency role
        redirect("/dashboard?error=unauthorized_knowledge");
    }

    // In a real scenario with Stripe, we'd also check user.publicMetadata.subscriptionStatus === "active"

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#070b14] pb-24">

            {/* HERO HEADER */}
            <div className="relative bg-[#0F2F35] dark:bg-[#07101E] text-white pt-20 pb-28 px-6 lg:px-12 overflow-hidden border-b border-teal-900/50 dark:border-white/5">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
                    <BadgeCheck className="w-12 h-12 text-[#00FFC2] mb-6" />
                    <h1 className="text-4xl md:text-6xl font-syne font-bold tracking-tight mb-6">
                        Partner Hub & Knowledgebase
                    </h1>
                    <p className="text-lg md:text-xl text-teal-100/80 font-inter max-w-2xl leading-relaxed mb-10">
                        El centro de operaciones y capacitación oficial para socios comerciales de SAT Connect. Encuentra respuestas, tutoriales y contacta al equipo de Nivel 1.
                    </p>

                    {/* Search Bar Feature */}
                    <div className="w-full max-w-2xl relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                        <div className="relative flex items-center bg-white/10 dark:bg-black/40 backdrop-blur-md rounded-2xl border border-white/20 dark:border-white/10 p-2">
                            <Search className="w-6 h-6 text-teal-300 ml-3" />
                            <input
                                type="text"
                                placeholder="Busca 'T.H.R.I.V.E. Score' o 'Ciclos de Facturación'..."
                                className="w-full bg-transparent border-none text-white placeholder:text-teal-200/50 px-4 py-3 focus:outline-none font-inter text-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-16 relative z-20 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Categorías de Ayuda (Left - 2 Cols) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Bento Categorias */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Card 1 */}
                        <div className="group bg-white dark:bg-[#0a0f1e] rounded-2xl p-8 shadow-xl dark:shadow-none border border-gray-100 dark:border-white/5 hover:border-teal-500/30 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                                <Book className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-syne font-bold text-gray-900 dark:text-white mb-3">Onboarding Bókun</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-inter leading-relaxed mb-6">
                                Aprende a conectar tu inventario, subir productos y entender los requerimientos T.H.R.I.V.E.
                            </p>
                            <a href="#" className="font-semibold text-teal-600 dark:text-[#00FFC2] hover:underline flex items-center">
                                Explorar guías <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </a>
                        </div>

                        {/* Card 2 */}
                        <div className="group bg-white dark:bg-[#0a0f1e] rounded-2xl p-8 shadow-xl dark:shadow-none border border-gray-100 dark:border-white/5 hover:border-teal-500/30 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                                <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-syne font-bold text-gray-900 dark:text-white mb-3">Finanzas & B2B</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-inter leading-relaxed mb-6">
                                Consulta nuestros ciclos de pago de comisiones, requerimientos de facturación (CFDI) y contratos.
                            </p>
                            <a href="#" className="font-semibold text-teal-600 dark:text-[#00FFC2] hover:underline flex items-center">
                                Ver Políticas <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </a>
                        </div>

                        {/* Card 3 (Full Width Video Section) */}
                        <div className="md:col-span-2 relative bg-gray-900 rounded-3xl overflow-hidden border border-white/10 group h-64 flex items-center justify-center cursor-pointer">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                            <div className="relative z-10 text-center flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <PlayCircle className="w-8 h-8 text-white fill-white/10" />
                                </div>
                                <h3 className="text-2xl font-syne font-bold text-white mb-2">Masterclass: Optimización T.H.R.I.V.E.</h3>
                                <p className="text-gray-300 font-inter">Duración: 45 min • Grabación del mes pasado</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Area (Support Form) */}
                <div className="lg:col-span-1">
                    <TicketForm />

                    {/* Compliance Note */}
                    <div className="mt-6 flex items-start gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                        <ShieldAlert className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-orange-700 dark:text-orange-400/90 font-inter leading-relaxed">
                            <strong>Nota de Cumplimiento:</strong> Por disposición operativa, todas las dudas y soportes técnicos deben ser escalados primeramente a través de este portal interno de SAT Connect. No contacte directamente al buzón corporativo de Bókun HQ.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
