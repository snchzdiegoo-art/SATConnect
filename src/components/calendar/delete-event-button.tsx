"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteEventButtonProps {
    eventId: string;
    redirectTo: string;
}

export function DeleteEventButton({ eventId, redirectTo }: DeleteEventButtonProps) {
    const router = useRouter();
    const [confirming, setConfirming] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const handleDelete = async () => {
        setDeleting(true);
        setError("");
        try {
            const res = await fetch(`/api/calendar/events/${eventId}`, { method: "DELETE" });
            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.error || "Error al eliminar");
            }
            router.push(redirectTo);
            router.refresh();
        } catch (e: any) {
            setError(e.message);
            setDeleting(false);
            setConfirming(false);
        }
    };

    if (confirming) {
        return (
            <div className="flex flex-col gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 text-xs text-red-400">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>¿Eliminar este evento? Esta acción no se puede deshacer.</span>
                </div>
                {error && <p className="text-[10px] text-red-400">{error}</p>}
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirming(false)}
                        disabled={deleting}
                        className="flex-1 text-gray-400 hover:text-white text-xs h-7"
                    >
                        Cancelar
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 bg-red-500 hover:bg-red-400 text-white text-xs h-7 gap-1"
                    >
                        {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                        Eliminar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setConfirming(true)}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
        >
            <Trash2 className="h-3 w-3" />
            Eliminar evento
        </button>
    );
}
