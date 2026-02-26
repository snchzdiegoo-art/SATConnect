"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { Send, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TicketForm() {
    const { user } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [topic, setTopic] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const payload = {
            agent_id: user?.id || "anonymous",
            agent_email: user?.primaryEmailAddress?.emailAddress || "no-email",
            topic: topic,
            subject: formData.get("subject"),
            description: formData.get("description"),
            timestamp: new Date().toISOString(),
        };

        try {
            // 🚀 TRIAD DELEGATION:
            // Envía el requerimiento al orquestador n8n (o a la ruta local proxy por CORS)
            const res = await fetch("/api/webhooks/support", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Error enviando el ticket");

            toast.success("¡Ticket Nivel 1 enviado a Operaciones!", {
                description: "Hemos recibido tu consulta técnica. Un especialista revisará tu entorno o inventario en breve."
            });
            // Optionally reset form here
        } catch (error) {
            toast.error("Error intermitente de comunicación", {
                description: "Nuestra conexión al Hub falló. Por favor, reintenta en un par de segundos."
            });
            console.error("HubSpot/n8n Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full h-full bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00FFC2]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="text-xl font-syne font-semibold text-gray-900 dark:text-white">SAT Operations Support</h3>
                    <p className="text-sm font-inter text-gray-500 dark:text-gray-400 mt-1">Soporte centralizado Nivel 1. No contactar a Bókun HQ.</p>
                </div>
                <div className="bg-[#00FFC2]/10 p-2 rounded-lg border border-[#00FFC2]/20">
                    <Info className="w-5 h-5 text-[#00FFC2]" />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 ml-1">Área o Tipo de Incidencia</label>
                    <Select onValueChange={setTopic} required>
                        <SelectTrigger className="w-full bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 h-11 focus:ring-[#00FFC2]/50">
                            <SelectValue placeholder="Selecciona el departamento afectado" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-[#07101E] dark:border-white/10">
                            <SelectItem value="thrive">Penalización T.H.R.I.V.E. Score</SelectItem>
                            <SelectItem value="health">Health Score General (Marketplace)</SelectItem>
                            <SelectItem value="inventory">Bloqueo de Inventario / Bókun Error</SelectItem>
                            <SelectItem value="billing">Dudas de Comisiones o CFDI</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 ml-1">Asunto</label>
                    <Input
                        name="subject"
                        placeholder="Ej. Mi Health Score bajó repentinamente"
                        required
                        className="bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 h-11 focus:ring-[#00FFC2]/50"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 ml-1">Descripción de la Situación</label>
                    <Textarea
                        name="description"
                        placeholder="Por favor, incluye códigos de reservas afectados o detalles técnicos si los tienes..."
                        required
                        className="min-h-[120px] bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 resize-none focus:ring-[#00FFC2]/50"
                    />
                </div>

                <Button
                    disabled={isSubmitting || !topic}
                    className="w-full mt-2 bg-[#00FFC2] text-[#07101E] hover:bg-[#00FFC2]/80 font-bold h-12 text-sm uppercase tracking-wide hover:shadow-[0_0_15px_rgba(0,255,194,0.4)] transition-all"
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Enviar Ticket a HQ</>}
                </Button>
            </form>
        </div>
    );
}
