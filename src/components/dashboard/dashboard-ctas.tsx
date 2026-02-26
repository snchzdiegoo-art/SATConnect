"use client"

import { Zap, Inbox, CreditCard } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export function DashboardCTAs() {
    const handlePendingFeature = (featureName: string) => {
        toast.loading(`Iniciando módulo de ${featureName}...`, {
            id: 'pending-feature',
        });

        setTimeout(() => {
            toast.error("Integración en Cola", {
                id: 'pending-feature',
                description: "Este módulo requiere sincronización con la API de producción. Acceso pendiente.",
                icon: <CreditCard className="w-4 h-4 text-rose-500" />
            });
        }, 1500);
    }

    return (
        <div className="flex items-center gap-3 shrink-0">
            <Link
                href="/dashboard/workspace/inbox"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all shadow-xl backdrop-blur-md"
            >
                <Inbox className="w-4 h-4 text-teal-400" />
                Abrir Workspace
            </Link>
            <button
                onClick={() => handlePendingFeature("Inventario")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/30 hover:bg-teal-500/20 transition-all shadow-[0_0_20px_rgba(41,255,198,0.1)] backdrop-blur-md"
            >
                <Zap className="h-4 w-4" />
                Nuevo Inventario
            </button>
        </div>
    )
}
