"use client";

import { useState } from "react";
import {
    Cpu,
    Wifi,
    Zap,
    ShieldCheck,
    Database,
    ArrowRight,
    RefreshCcw,
    AlertCircle,
    Globe,
    Lock,
    Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function BokunClient() {
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSync, setLastSync] = useState<string | null>(null);

    const handleSync = async () => {
        setIsSyncing(true);
        toast.loading("Sincronizando Catálogo Bókun...", { id: "bokun-sync" });

        try {
            const response = await fetch("/api/bokun/sync", { method: "POST" });
            const result = await response.json();

            if (!response.ok) throw new Error(result.error || "Sync failed");

            setIsSyncing(false);
            setLastSync(new Date().toLocaleTimeString());
            toast.success("Sincronización Completada", {
                id: "bokun-sync",
                description: "Se han actualizado las experiencias y variantes exitosamente."
            });
        } catch (error: any) {
            setIsSyncing(false);
            toast.error("Error de Sincronización", {
                id: "bokun-sync",
                description: error.message || "No se pudo conectar con el motor de Bókun."
            });
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#070b14] relative overflow-hidden p-8">
            {/* Tech Pattern Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)' }} />

            {/* Header */}
            <div className="flex items-center justify-between mb-10 relative z-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                            <Cpu className="w-6 h-6 text-blue-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white font-syne tracking-tight">
                            Bókun Command Center
                        </h1>
                    </div>
                    <p className="text-sm text-gray-400/80 font-medium">Control de Inventario y Reservas — Central Operating Unit</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end mr-4">
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Last Data Pulse</span>
                        <span className="text-xs font-mono text-blue-400">{lastSync || "Pending First Sync"}</span>
                    </div>
                    <Button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="bg-blue-600 hover:bg-blue-500 text-white gap-2 px-6 h-12 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    >
                        <RefreshCcw className={cn("w-4 h-4", isSyncing && "animate-spin")} />
                        Run Catalog Sync
                    </Button>
                </div>
            </div>

            {/* Main Infrastructure Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

                {/* Connection Status & Telemetry */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="bg-white/[0.03] border-white/5 backdrop-blur-xl rounded-[2rem] overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400">Connection Engine</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Wifi className="w-5 h-5 text-emerald-400" />
                                    <span className="font-medium text-gray-200">API Gateway</span>
                                </div>
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Active</Badge>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Zap className="w-5 h-5 text-blue-400" />
                                    <span className="font-medium text-gray-200">Webhook Listener</span>
                                </div>
                                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Listening</Badge>
                            </div>

                            <div className="space-y-3 pt-4">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500 font-bold uppercase">Rate Limit Consumption</span>
                                    <span className="text-gray-300 font-mono">12 / 400 req/min</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-[12%] bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-600/10 via-transparent to-transparent border-blue-500/10 backdrop-blur-xl rounded-[2rem]">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-blue-400/60">Auth Protocol</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 rounded-2xl bg-black/60 border border-blue-500/20 space-y-4">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    <span className="text-xs font-bold text-gray-300 italic">HMAC-SHA1 Signature Validated</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-[10px] text-gray-500 uppercase tracking-tighter">Access Key</div>
                                    <div className="text-[10px] text-gray-300 font-mono text-right">BK-942...X82</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-tighter">Secret Key</div>
                                    <div className="text-[10px] text-teal-400/80 font-mono text-right flex items-center justify-end gap-1">
                                        <Lock className="w-2.5 h-2.5" /> Encrypted
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Infrastructure Map (Visual Design) */}
                <div className="lg:col-span-8">
                    <Card className="h-full bg-white/[0.02] border-white/5 backdrop-blur-xl rounded-[2rem] relative overflow-hidden flex flex-col pt-12">
                        {/* Background Grid Pattern */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px]" />

                        <div className="px-10 mb-12">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-blue-400" />
                                Structural Blueprint
                            </h2>
                            <p className="text-gray-400 text-sm max-w-lg leading-relaxed">
                                Visual flow of data synchronization between Bókun SaaS endpoints and the SAT Connect B2Bridge OS Core via persistent background workers.
                            </p>
                        </div>

                        {/* Visual Flow Representation */}
                        <div className="flex-1 flex items-center justify-around px-10 pb-16">
                            {/* Node 1: Bókun */}
                            <div className="flex flex-col items-center gap-4 group">
                                <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center relative group-hover:border-blue-500/40 group-hover:bg-blue-500/5 transition-all duration-500">
                                    <img src="/integrations/bokun.png" className="w-12 h-12 grayscale group-hover:grayscale-0 transition-all opacity-50 group-hover:opacity-100" alt="Bókun" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="text-xs text-blue-400 font-bold uppercase">Bókun</span>' }} />
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-4 border-[#070b14]" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-blue-400 transition-colors">Bókun SaaS</span>
                            </div>

                            <div className="flex-1 flex items-center justify-center px-4">
                                <div className="h-px flex-1 bg-gradient-to-r from-white/5 via-blue-500/30 to-white/5 relative">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#070b14] px-2">
                                        <ArrowRight className="w-5 h-5 text-blue-400/50 animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            {/* Node 2: API & Logic */}
                            <div className="flex flex-col items-center gap-4 group">
                                <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center relative group-hover:border-teal-500/40 group-hover:bg-teal-500/5 transition-all duration-500">
                                    <Cpu className="w-10 h-10 text-gray-400 group-hover:text-teal-400 transition-all duration-500" />
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full border-4 border-[#070b14]" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-teal-400 transition-colors">Sync Engine</span>
                            </div>

                            <div className="flex-1 flex items-center justify-center px-4">
                                <div className="h-px flex-1 bg-gradient-to-r from-white/5 via-teal-500/30 to-white/5 relative">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#070b14] px-2">
                                        <ArrowRight className="w-5 h-5 text-teal-400/50 animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            {/* Node 3: Database */}
                            <div className="flex flex-col items-center gap-4 group">
                                <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center relative group-hover:border-purple-500/40 group-hover:bg-purple-500/5 transition-all duration-500">
                                    <Database className="w-10 h-10 text-gray-400 group-hover:text-purple-400 transition-all duration-500" />
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border-4 border-[#070b14]" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-purple-400 transition-colors">Prisma DB</span>
                            </div>
                        </div>

                        {/* Recent Activity Mini-Feed */}
                        <div className="bg-black/40 border-t border-white/5 p-8">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 underline decoration-blue-500/30 decoration-2 underline-offset-8">Live Webhook Stream</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-[11px] py-1 border-b border-white/[0.02]">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1 h-3 bg-emerald-500 rounded-full" />
                                        <span className="text-gray-300">BOOKING_CONFIRMED</span>
                                        <span className="text-gray-500">Experience ID: 12093</span>
                                    </div>
                                    <span className="text-gray-600 font-mono">14:23:01</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] py-1 border-b border-white/[0.02]">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1 h-3 bg-blue-500 rounded-full" />
                                        <span className="text-gray-300">INVENTORY_UPDATE</span>
                                        <span className="text-gray-500">Variant: Default (Adult)</span>
                                    </div>
                                    <span className="text-gray-600 font-mono">13:58:45</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] py-1">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1 h-3 bg-rose-500 rounded-full" />
                                        <span className="text-gray-300">RATE_LIMIT_HIT</span>
                                        <span className="text-gray-500">Headers: retry-after: 5s</span>
                                    </div>
                                    <span className="text-gray-600 font-mono">11:12:30</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Integration Modules & Importance List */}
            <div className="mt-8 relative z-10 pb-12">
                <Card className="bg-white/[0.02] border-white/5 backdrop-blur-xl rounded-[2rem] overflow-hidden">
                    <CardHeader className="px-10 pt-10 pb-6 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
                                <Activity className="w-5 h-5 text-teal-400" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold text-white font-syne tracking-tight">Bókun Integration Ecosystem</CardTitle>
                                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Strategic Capabilities & Unified Logic</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-10 py-8">
                        <IntegrationEcosystem />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function IntegrationEcosystem() {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const modules = [
        {
            id: "v2-api",
            title: "Direct V2 API",
            badge: "Inventory Sync Engine",
            priority: "Critical",
            color: "blue",
            shortDesc: "Sincronización masiva de experiencias, variantes de precio y disponibilidad en tiempo real.",
            content: {
                whatWhy: "Motor de sincronización directa que consume los endpoints V2 de Bókun para mantener una réplica exacta del catálogo en nuestra base de datos Prisma. Es la base de toda la operación B2B.",
                importance: "Sin esta pieza, el Marketplace mostraría precios desactualizados o permitiría compras de tours que ya no tienen cupos, destruyendo la confianza del agente.",
                benefits: "Elimina la carga manual de productos, garantiza paridad de precios y permite búsquedas ultrarrápidas localmente sin depender de la latencia de Bókun.",
                ideas: "IA-driven mapping: Usar LLMs para categorizar automáticamente descripciones de Bókun en nuestros canales de marketing de forma creativa."
            }
        },
        {
            id: "booking-api",
            title: "Booking API",
            badge: "Transaction Processor",
            priority: "Critical",
            color: "teal",
            shortDesc: "Manejo de reservas, pagos externos y estados de confirmación para el marketplace B2B.",
            content: {
                whatWhy: "Interface encargada de empujar las transacciones al sistema central de Bókun, respetando el flujo de reserva externa para permitir el procesamiento de pagos propio.",
                importance: "Es el 'Revenue Driver'. Es la pieza que convierte una intención de compra en una reserva confirmada y pagada en el ecosistema B2Bridge.",
                benefits: "Control total sobre el flujo de checkout, capacidad de aplicar descuentos/markups en tiempo real y conciliación automática de pagos.",
                ideas: "Venta Sugerida (Upselling): Analizar el carrito de Bókun para sugerir experiencias complementarias antes de disparar el POST de reserva."
            }
        },
        {
            id: "webhooks",
            title: "Webhooks v2",
            badge: "Event Listener",
            priority: "High",
            color: "purple",
            shortDesc: "Notificaciones push instantáneas para cancelaciones, upgrades y cambios de inventario.",
            content: {
                whatWhy: "Escuchador pasivo que reacciona a cambios externos en Bókun (ej. si el operador cancela un tour). Evita el 'polling' constante y optimiza el consumo de la API.",
                importance: "Garantiza la agilidad operativa. Si una reserva cambia en Bókun, nuestro sistema lo sabe en milisegundos, permitiendo alertar al agente de inmediato.",
                benefits: "Reducción masiva de tráfico de red, actualización instantánea de la UI y automatización de procesos post-venta (emails de cancelación).",
                ideas: "Real-time Slack/Teams Alerts: Notificar a los Super Admins sobre reservas de alto valor o cancelaciones críticas vía push."
            }
        },
        {
            id: "zapier",
            title: "Zapier / Make",
            badge: "Marketing Flow",
            priority: "Medium",
            color: "orange",
            shortDesc: "Conexión con CRM, envío de correos post-venta y analítica externa sin código.",
            content: {
                whatWhy: "Capa de abstracción que permite conectar eventos de reserva con +5000 aplicaciones externas sin escribir código adicional en el núcleo (Core OS).",
                importance: "Permite una escalabilidad operativa barata. El equipo de marketing puede crear flujos de fidelización sin necesidad de intervención de ingeniería.",
                benefits: "Flexibilidad total, implementación rápida de nuevas herramientas externas y bajo costo de mantenimiento.",
                ideas: "Automated Review Request: 24h después del tour, disparar un flujo que pida una reseña y la publique en el landing de SAT Connect."
            }
        },
        {
            id: "b2b-channel",
            title: "B2B Channel",
            badge: "Distribution Hub",
            priority: "High",
            color: "emerald",
            shortDesc: "Configuración de canales específicos para agencias aliadas con comisiones netas.",
            content: {
                whatWhy: "Lógica de distribución que segmenta productos y precios según el contrato de la agencia conectada a B2Bridge. Actúa como el filtro comercial del Marketplace.",
                importance: "Es la herramienta de negociación. Permite definir márgenes de beneficio específicos y visibilidad de catálogo por perfil de partner.",
                benefits: "Gestión centralizada de múltiples partners con diferentes condiciones comerciales sin duplicar inventario.",
                ideas: "Dynamic Tiering: Subir automáticamente el porcentaje de comisión de una agencia si alcanza un volumen de ventas mensual X."
            }
        },
        {
            id: "stripe-bridge",
            title: "Stripe Bridge",
            badge: "FinOps Optimizer",
            priority: "Strategic",
            color: "indigo",
            shortDesc: "Orquestación de pagos para eludir comisiones nativas de Bókun y optimizar el flujo de caja.",
            content: {
                whatWhy: "Integración de pasarelas de pago externas que procesan el dinero directamente y luego notifican a Bókun que la reserva está pagada.",
                importance: "Maximización de márgenes. Evita el 1-2% de comisión por procesamiento de Bókun, lo que en gran volumen representa miles de dólares.",
                benefits: "Flujo de dinero instantáneo a la cuenta de la empresa, soporte para métodos de pago locales y menores fees transaccionales.",
                ideas: "Crypto Payments: Habilitar pagos en USDC para agencias internacionales, convirtiendo a fiat antes de confirmar en Bókun."
            }
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod) => (
                <div
                    key={mod.id}
                    onClick={() => setExpandedId(expandedId === mod.id ? null : mod.id)}
                    className={cn(
                        "p-6 rounded-2xl bg-black/40 border transition-all duration-500 cursor-pointer overflow-hidden flex flex-col group",
                        expandedId === mod.id
                            ? "border-teal-500/50 bg-teal-500/5 col-span-1 md:col-span-2 lg:col-span-3 scale-[1.01] shadow-[0_0_30px_rgba(20,184,166,0.1)]"
                            : "border-white/5 hover:border-white/20"
                    )}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex flex-col">
                            <Badge className={cn(
                                "mb-2 w-fit",
                                mod.color === "blue" && "bg-blue-500/10 text-blue-400 border-blue-500/20",
                                mod.color === "teal" && "bg-teal-500/10 text-teal-400 border-teal-500/20",
                                mod.color === "purple" && "bg-purple-500/10 text-purple-400 border-purple-500/20",
                                mod.color === "orange" && "bg-orange-500/10 text-orange-400 border-orange-500/20",
                                mod.color === "emerald" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                                mod.color === "indigo" && "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                            )}>
                                {mod.badge}
                            </Badge>
                            <h4 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">{mod.title}</h4>
                        </div>
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded border",
                            mod.priority === "Critical" ? "text-rose-400 border-rose-500/30" : "text-teal-400 border-teal-500/30"
                        )}>
                            {mod.priority}
                        </span>
                    </div>

                    <p className={cn(
                        "text-xs text-gray-400 leading-relaxed transition-all duration-500",
                        expandedId === mod.id ? "mb-8 text-sm text-gray-300" : "line-clamp-2"
                    )}>
                        {mod.shortDesc}
                    </p>

                    <div className={cn(
                        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-700",
                        expandedId === mod.id ? "opacity-100 translate-y-0 h-auto visible" : "opacity-0 translate-y-4 h-0 invisible"
                    )}>
                        <div className="space-y-2">
                            <h5 className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">¿Qué hace y Por qué?</h5>
                            <p className="text-xs text-gray-400 leading-relaxed font-medium">{mod.content.whatWhy}</p>
                        </div>
                        <div className="space-y-2">
                            <h5 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Importancia Estratégica</h5>
                            <p className="text-xs text-gray-400 leading-relaxed font-medium">{mod.content.importance}</p>
                        </div>
                        <div className="space-y-2">
                            <h5 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Beneficios Directos</h5>
                            <p className="text-xs text-gray-400 leading-relaxed font-medium">{mod.content.benefits}</p>
                        </div>
                        <div className="space-y-2">
                            <h5 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Posibilidades e Ideas</h5>
                            <p className="text-xs text-gray-400 leading-relaxed font-medium italic">{mod.content.ideas}</p>
                        </div>
                    </div>

                    {!expandedId && (
                        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-blue-400/60 uppercase group-hover:text-blue-400 transition-colors">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                            Click to expand blueprints
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
