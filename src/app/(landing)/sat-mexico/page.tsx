"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";

// ─── Types ──────────────────────────────────────────────────────────────────

interface BenefitCardProps {
    icon: string;
    title: string;
    description: string;
    stat: string;
}

interface CompetitorRow {
    feature: string;
    satConnect: boolean;
    fareHarbor: boolean;
    peekPro: boolean;
    checkfront: boolean;
}

// ─── Data ───────────────────────────────────────────────────────────────────

const BENEFITS: BenefitCardProps[] = [
    {
        icon: "🌐",
        title: "Distribución Global Automática",
        description:
            "Viator, Expedia, Klook y Project Expedition sincronizados desde un solo panel. Sin carga manual, sin errores de paridad.",
        stat: "+4 OTAs conectadas",
    },
    {
        icon: "⚡",
        title: "Motor T.H.R.I.V.E.",
        description:
            "Algoritmo de auditoría continua (0-100 pts) que bloquea automáticamente cualquier tour con errores antes de publicarse.",
        stat: "0 errores de distribución",
    },
    {
        icon: "🤝",
        title: "B2Bridge Marketplace",
        description:
            "Red B2B privada de agencias, concierges y reps. Gestión de tarifas netas y markups totalmente automatizada.",
        stat: "Canal B2B exclusivo",
    },
    {
        icon: "📊",
        title: "Centro de Control en Tiempo Real",
        description:
            "Dashboard financiero y de reservas visible desde cualquier dispositivo. KPIs, alertas y análisis de rentabilidad.",
        stat: "Data en <5 segundos",
    },
];

const COMPARISON: CompetitorRow[] = [
    {
        feature: "SaaS + OTA Distribution + B2B Marketplace",
        satConnect: true,
        fareHarbor: false,
        peekPro: false,
        checkfront: false,
    },
    {
        feature: "Motor de auditoría algorítmica (T.H.R.I.V.E.)",
        satConnect: true,
        fareHarbor: false,
        peekPro: false,
        checkfront: false,
    },
    {
        feature: "Integración nativa con TripAdvisor / Bókun",
        satConnect: true,
        fareHarbor: false,
        peekPro: false,
        checkfront: false,
    },
    {
        feature: "Soporte local en español + Onboarding VIP",
        satConnect: true,
        fareHarbor: false,
        peekPro: false,
        checkfront: false,
    },
    {
        feature: "Posicionamiento GEO para IA (Viator AI search)",
        satConnect: true,
        fareHarbor: false,
        peekPro: false,
        checkfront: false,
    },
    {
        feature: "B2B Marketplace con markup configurable",
        satConnect: true,
        fareHarbor: false,
        peekPro: true,
        checkfront: false,
    },
    {
        feature: "Distribución multicanal OTAs",
        satConnect: true,
        fareHarbor: true,
        peekPro: true,
        checkfront: true,
    },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function BenefitCard({ icon, title, description, stat }: BenefitCardProps) {
    return (
        <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md transition-all duration-300 hover:border-teal-400/40 hover:bg-white/[0.04] hover:shadow-[0_0_20px_rgba(45,207,191,0.15)]">
            <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl">{icon}</span>
                <span className="rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-medium text-teal-300">
                    {stat}
                </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm leading-relaxed text-gray-400">{description}</p>
        </div>
    );
}

function CheckIcon({ value }: { value: boolean }) {
    if (value) {
        return (
            <span className="text-lg font-bold text-teal-400" aria-label="Sí">
                ✓
            </span>
        );
    }
    return (
        <span className="text-lg text-gray-600" aria-label="No">
            ✗
        </span>
    );
}

function DemoForm() {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        preferred: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch("/api/webhooks/demo-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    source: "sat-mexico-landing",
                    type: "demo_request",
                    data: formData,
                    timestamp: new Date().toISOString(),
                }),
            });
        } catch {
            // Fire and forget — n8n handles confirmation email
        }
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-teal-400/30 bg-teal-400/5 p-8 text-center">
                <span className="text-5xl">✅</span>
                <h3 className="text-xl font-bold text-white">
                    ¡Solicitud recibida, Jorge!
                </h3>
                <p className="text-gray-400">
                    Recibirás una confirmación y el enlace de la demo en tu correo en los
                    próximos minutos.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-400">
                        Nombre completo
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="Jorge Paredes"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-teal-400/50 focus:bg-white/[0.07]"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-400">
                        Correo corporativo
                    </label>
                    <input
                        type="email"
                        required
                        placeholder="jorge@satmexico.com.mx"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-teal-400/50 focus:bg-white/[0.07]"
                    />
                </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-400">Teléfono</label>
                    <input
                        type="tel"
                        placeholder="+52 (55) 0000-0000"
                        value={formData.phone}
                        onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                        }
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-teal-400/50 focus:bg-white/[0.07]"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-400">
                        Preferencia de horario
                    </label>
                    <select
                        value={formData.preferred}
                        onChange={(e) =>
                            setFormData({ ...formData, preferred: e.target.value })
                        }
                        className="rounded-xl border border-white/10 bg-[#0F2F35] px-4 py-3 text-sm text-white outline-none transition focus:border-teal-400/50"
                    >
                        <option value="">Selecciona un horario</option>
                        <option value="morning">Mañana (9:00 - 12:00)</option>
                        <option value="afternoon">Tarde (13:00 - 17:00)</option>
                        <option value="evening">Vespertino (17:00 - 19:00)</option>
                    </select>
                </div>
            </div>
            <button
                type="submit"
                className="mt-2 rounded-xl bg-[#00FFC2] px-6 py-4 text-sm font-bold text-[#030712] transition-all duration-200 hover:bg-[#2DD4BF] hover:shadow-[0_0_20px_rgba(0,255,194,0.4)]"
            >
                Agendar mi Demo de 30 minutos →
            </button>
            <p className="text-center text-xs text-gray-500">
                Sin compromisos. La demo es gratuita y sin presión de venta.
            </p>
        </form>
    );
}

function EcosystemPreview() {
    const tours = [
        {
            name: "City Tour Cancún VIP",
            health: 97,
            status: "HEALTHY",
            channels: 4,
            pvp: "$1,200 MXN",
        },
        {
            name: "Cenote Experience — Tulum",
            health: 85,
            status: "HEALTHY",
            channels: 3,
            pvp: "$2,400 MXN",
        },
        {
            name: "Xoximilco Corporate Night",
            health: 72,
            status: "INCOMPLETE",
            channels: 0,
            pvp: "$3,800 MXN",
        },
        {
            name: "Chichen Itza Premium",
            health: 91,
            status: "HEALTHY",
            channels: 4,
            pvp: "$1,800 MXN",
        },
    ];

    const statusColor = (s: string) =>
        s === "HEALTHY"
            ? "text-teal-400 bg-teal-400/10 border-teal-400/30"
            : "text-amber-400 bg-amber-400/10 border-amber-400/30";

    return (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0f]">
            {/* Titlebar */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.02] px-4 py-3">
                <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/60" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                    <div className="h-3 w-3 rounded-full bg-green-500/60" />
                </div>
                <span className="ml-2 text-xs text-gray-500">
                    app.satconnect.travel — SAT México DMC
                </span>
                <span className="ml-auto rounded-full bg-teal-400/20 px-2 py-0.5 text-xs font-medium text-teal-400">
                    PREVIEW
                </span>
            </div>

            {/* Dashboard Header */}
            <div className="border-b border-white/5 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500">Bienvenido de vuelta</p>
                        <h4 className="font-bold text-white">SAT México DMC 🌵</h4>
                    </div>
                    <div className="flex gap-2">
                        {["Viator", "Expedia", "Klook", "B2Bridge"].map((ch) => (
                            <span
                                key={ch}
                                className="rounded-full border border-teal-400/20 bg-teal-400/10 px-2 py-0.5 text-[10px] text-teal-300"
                            >
                                {ch}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-4 divide-x divide-white/5 border-b border-white/5">
                {[
                    { label: "Ventas MTD", value: "$48,200", color: "text-teal-400" },
                    { label: "Tours Activos", value: "24", color: "text-white" },
                    { label: "T.H.R.I.V.E. Avg", value: "86/100", color: "text-white" },
                    {
                        label: "Reservas B2B",
                        value: "143",
                        color: "text-emerald-400",
                    },
                ].map((kpi) => (
                    <div key={kpi.label} className="px-4 py-3">
                        <p className="text-[10px] text-gray-500">{kpi.label}</p>
                        <p className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</p>
                    </div>
                ))}
            </div>

            {/* Tour Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/5 text-left text-xs text-gray-500">
                            <th className="px-4 py-2 font-medium">Tour</th>
                            <th className="px-4 py-2 font-medium">T.H.R.I.V.E</th>
                            <th className="px-4 py-2 font-medium">Estado</th>
                            <th className="px-4 py-2 font-medium">Canales</th>
                            <th className="px-4 py-2 font-medium">PVP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tours.map((tour) => (
                            <tr
                                key={tour.name}
                                className="border-b border-white/[0.03] transition hover:bg-white/[0.02]"
                            >
                                <td className="px-4 py-3 font-medium text-white">
                                    {tour.name}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-700">
                                            <div
                                                className="h-full rounded-full bg-teal-400"
                                                style={{ width: `${tour.health}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-400">{tour.health}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusColor(tour.status)}`}
                                    >
                                        {tour.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center text-gray-300">
                                    {tour.channels > 0 ? (
                                        <span className="text-teal-400">{tour.channels} OTAs</span>
                                    ) : (
                                        <span className="text-amber-400">Bloqueado</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-gray-300">{tour.pvp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="px-4 py-2 text-center text-[10px] text-gray-600">
                * Vista previa simulada. Los datos reales se configuran durante el
                onboarding.
            </p>
        </div>
    );
}

function LockedDemoSection({ isUnlocked }: { isUnlocked: boolean }) {
    if (!isUnlocked) {
        return (
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-64 w-64 rounded-full bg-teal-400/5 blur-3xl" />
                </div>
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <span className="text-5xl">🔒</span>
                    <h3 className="text-xl font-bold text-white">
                        Presentación Interactiva
                    </h3>
                    <p className="max-w-md text-gray-400">
                        Esta sección se activa al inicio de tu demo. Agendaremos juntos el
                        recorrido completo por el ecosistema SAT Connect personalizado para
                        SAT México.
                    </p>
                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-500">
                        Se activa automáticamente durante la llamada
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-teal-400/30 bg-teal-400/5 p-8">
            <div className="mb-6 flex items-center gap-3">
                <span className="h-3 w-3 animate-pulse rounded-full bg-teal-400" />
                <span className="text-sm font-medium text-teal-400">
                    Demo en vivo — SAT México DMC
                </span>
            </div>
            <h3 className="mb-4 text-2xl font-bold text-white">
                Presentación Interactiva Activada ✓
            </h3>
            <p className="text-gray-400">
                La presentación completa está disponible. Navega por las secciones junto
                con el presentador.
            </p>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

function SatMexicoContent() {
    const searchParams = useSearchParams();
    const isDemoMode = searchParams.get("demo") === "active";

    return (
        <main className="min-h-screen bg-[#030712] text-white">
            {/* ── Dot grid overlay ── */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />

            {/* ── Header ── */}
            <header className="relative z-10 flex items-center justify-between border-b border-white/5 px-6 py-4">
                <Link href="/" className="text-lg font-bold tracking-tight">
                    SAT<span className="text-teal-400">Connect</span>
                </Link>
                <div className="flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/5 px-3 py-1.5">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-teal-400" />
                    <span className="text-xs text-teal-300">
                        Propuesta exclusiva para SAT México DMC
                    </span>
                </div>
            </header>

            <div className="relative z-10 mx-auto max-w-5xl px-4 py-16">
                {/* ── HERO ── */}
                <section className="mb-20 text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-300">
                        <span>⚽</span>
                        <span>FIFA World Cup 2026 — México como sede principal</span>
                    </div>

                    <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                        Jorge, hoy <span className="text-teal-400">SAT México</span>
                        <br />
                        tiene el perfil para liderar el
                        <br />
                        <span className="bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">
                            turismo del Mundial 2026
                        </span>
                    </h1>

                    <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400">
                        +800 eventos anuales, 90% de retención y +16 años de experiencia con
                        FIFA. El ecosistema que te falta para convertir ese historial en
                        distribución digital masiva ya existe.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="#agenda"
                            className="rounded-xl bg-[#00FFC2] px-8 py-4 text-sm font-bold text-[#030712] transition-all duration-200 hover:bg-[#2DD4BF] hover:shadow-[0_0_24px_rgba(0,255,194,0.4)]"
                        >
                            Agendar Demo de 30 min →
                        </a>
                        <a
                            href="#ecosistema"
                            className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-medium text-white transition hover:bg-white/10"
                        >
                            Ver el ecosistema
                        </a>
                    </div>
                </section>

                {/* ── STATS FIFA ── */}
                <section className="mb-20">
                    <div className="grid gap-4 sm:grid-cols-3">
                        {[
                            {
                                value: "$1.24B",
                                label: "USD de derrame turístico estimado en México",
                                icon: "🏟️",
                            },
                            {
                                value: "70%",
                                label: "de reservas OTA mediadas por IA en 2026",
                                icon: "🤖",
                            },
                            {
                                value: "3-5x",
                                label: "más reservas para operadores en OTAs vs. fuera",
                                icon: "📈",
                            },
                        ].map((s) => (
                            <div
                                key={s.value}
                                className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F2F35] to-[#030712] p-6 text-center"
                            >
                                <span className="text-3xl">{s.icon}</span>
                                <p className="mt-2 text-3xl font-bold text-teal-400">
                                    {s.value}
                                </p>
                                <p className="mt-1 text-xs text-gray-400">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── BENEFICIOS ── */}
                <section className="mb-20">
                    <div className="mb-10 text-center">
                        <h2 className="mb-3 text-3xl font-bold">Lo que SAT Connect hace por ti</h2>
                        <p className="text-gray-400">
                            Una sola plataforma reemplaza el trabajo de 2-3 analistas de inventario.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {BENEFITS.map((b) => (
                            <BenefitCard key={b.title} {...b} />
                        ))}
                    </div>
                </section>

                {/* ── ECOSISTEMA PREVIEW ── */}
                <section className="mb-20" id="ecosistema">
                    <div className="mb-8 text-center">
                        <h2 className="mb-3 text-3xl font-bold">
                            Así quedaría SAT México en el ecosistema
                        </h2>
                        <p className="text-gray-400">
                            Pre-visualización de tu panel de control. Datos reales se
                            configuran en el onboarding.
                        </p>
                    </div>
                    <EcosystemPreview />
                </section>

                {/* ── COMPARATIVA ── */}
                <section className="mb-20">
                    <div className="mb-8 text-center">
                        <h2 className="mb-3 text-3xl font-bold">SAT Connect vs. el mercado</h2>
                        <p className="text-gray-400">
                            El único ecosistema que combina SaaS + OTAs + B2B Marketplace en una sola plataforma.
                        </p>
                    </div>
                    <div className="overflow-x-auto rounded-2xl border border-white/10">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.02]">
                                    <th className="px-4 py-4 text-left text-gray-400 font-medium">
                                        Funcionalidad
                                    </th>
                                    {[
                                        {
                                            label: "SAT Connect",
                                            highlight: true,
                                        },
                                        { label: "FareHarbor", highlight: false },
                                        { label: "Peek Pro", highlight: false },
                                        { label: "Checkfront", highlight: false },
                                    ].map((h) => (
                                        <th
                                            key={h.label}
                                            className={`px-4 py-4 text-center text-sm font-bold ${h.highlight ? "text-teal-400" : "text-gray-400"}`}
                                        >
                                            {h.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {COMPARISON.map((row, i) => (
                                    <tr
                                        key={row.feature}
                                        className={`border-b border-white/5 transition hover:bg-white/[0.02] ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}
                                    >
                                        <td className="px-4 py-3 text-gray-300">{row.feature}</td>
                                        <td className="px-4 py-3 text-center">
                                            <CheckIcon value={row.satConnect} />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <CheckIcon value={row.fareHarbor} />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <CheckIcon value={row.peekPro} />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <CheckIcon value={row.checkfront} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* ── AGENDA ── */}
                <section className="mb-20" id="agenda">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md">
                        <div className="mb-6 text-center">
                            <h2 className="mb-2 text-3xl font-bold">
                                Agenda tu demo personalizada
                            </h2>
                            <p className="text-gray-400">
                                30 minutos. Sin compromiso. Te mostramos el ecosistema configurado para SAT México.
                            </p>
                        </div>
                        <DemoForm />
                    </div>
                </section>

                {/* ── DEMO BLOQUEADA ── */}
                <section className="mb-20">
                    <div className="mb-6 text-center">
                        <h2 className="mb-2 text-2xl font-bold">Presentación de Demo</h2>
                        <p className="text-sm text-gray-500">
                            {isDemoMode
                                ? "Demo activa — navegando junto al presentador"
                                : "Se activa automáticamente al inicio de tu demo agendada"}
                        </p>
                    </div>
                    <LockedDemoSection isUnlocked={isDemoMode} />
                </section>
            </div>

            {/* ── FOOTER ── */}
            <footer className="border-t border-white/5 px-6 py-8 text-center text-xs text-gray-600">
                <p>
                    Esta propuesta fue preparada exclusivamente para{" "}
                    <strong className="text-gray-400">SAT México DMC</strong> por el
                    equipo de SAT Connect.
                </p>
                <p className="mt-1">
                    © 2026 SAT Connect — Powered by Bókun (a TripAdvisor company)
                </p>
            </footer>
        </main>
    );
}

export default function SatMexicoPage() {
    return (
        <Suspense>
            <SatMexicoContent />
        </Suspense>
    );
}
