"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PenSquare, X, Send, Loader2 } from "lucide-react";

interface ComposeModalProps {
    defaultTo?: string;
    defaultSubject?: string;
}

export function ComposeButton({ defaultTo = "", defaultSubject = "" }: ComposeModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [to, setTo] = useState(defaultTo);
    const [subject, setSubject] = useState(defaultSubject);
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSend = async () => {
        if (!to || !subject || !body) {
            setStatus("error");
            setErrorMsg("Por favor completa todos los campos.");
            return;
        }
        setSending(true);
        setStatus("idle");
        try {
            const res = await fetch("/api/mail/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ to, subject, body }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Error al enviar");
            }
            setStatus("success");
            setTimeout(() => {
                setIsOpen(false);
                setTo(defaultTo);
                setSubject(defaultSubject);
                setBody("");
                setStatus("idle");
            }, 1500);
        } catch (e: any) {
            setStatus("error");
            setErrorMsg(e.message);
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            {/* Compose Button */}
            <Button
                onClick={() => setIsOpen(true)}
                className="bg-teal-500 hover:bg-teal-400 text-gray-900 font-semibold gap-2 shadow-[0_0_20px_rgba(41,255,198,0.3)]"
            >
                <PenSquare className="h-4 w-4" />
                Redactar
            </Button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-end p-6"
                    style={{ pointerEvents: "none" }}
                >
                    {/* Modal */}
                    <div
                        className="w-full max-w-md glass-panel rounded-xl shadow-2xl border border-white/10 flex flex-col"
                        style={{ pointerEvents: "all" }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                            <h3 className="text-sm font-semibold text-white">Nuevo mensaje</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Fields */}
                        <div className="flex flex-col gap-px bg-white/5">
                            <div className="flex items-center px-4 bg-transparent">
                                <span className="text-xs text-gray-500 w-12 shrink-0">Para</span>
                                <Input
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    placeholder="destinatario@ejemplo.com"
                                    className="border-0 bg-transparent text-sm text-white placeholder:text-gray-600 focus-visible:ring-0 px-0 h-10"
                                />
                            </div>
                            <div className="flex items-center px-4 bg-white/[0.02] border-t border-b border-white/5">
                                <span className="text-xs text-gray-500 w-12 shrink-0">Asunto</span>
                                <Input
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Asunto del correo"
                                    className="border-0 bg-transparent text-sm text-white placeholder:text-gray-600 focus-visible:ring-0 px-0 h-10"
                                />
                            </div>
                        </div>

                        {/* Body */}
                        <Textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Escribe tu mensaje aquí..."
                            className="flex-1 resize-none border-0 border-t border-white/5 bg-transparent text-sm text-gray-200 placeholder:text-gray-600 focus-visible:ring-0 rounded-none px-4 py-3 min-h-[180px]"
                        />

                        {/* Footer */}
                        <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
                            <div className="text-xs">
                                {status === "success" && (
                                    <span className="text-teal-400">✓ Enviado correctamente</span>
                                )}
                                {status === "error" && (
                                    <span className="text-red-400">{errorMsg}</span>
                                )}
                            </div>
                            <Button
                                onClick={handleSend}
                                disabled={sending}
                                size="sm"
                                className="bg-teal-500 hover:bg-teal-400 text-gray-900 font-semibold gap-2"
                            >
                                {sending ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                    <Send className="h-3 w-3" />
                                )}
                                Enviar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
