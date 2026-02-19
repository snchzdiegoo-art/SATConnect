"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Loader2, CalendarPlus, Check, UserPlus, Trash2, Video } from "lucide-react";

interface Attendee { email: string; name: string; }

interface CreateEventButtonProps {
    onEventCreated?: () => void;
    defaultDate?: string;
}

function addOneHour(dt: string): string {
    if (!dt) return dt;
    const d = new Date(dt);
    d.setHours(d.getHours() + 1);
    // Return in datetime-local format "YYYY-MM-DDTHH:mm"
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function CreateEventButton({ onEventCreated, defaultDate }: CreateEventButtonProps) {
    const today = defaultDate ?? new Date().toISOString().slice(0, 10);
    const nowHour = new Date().getHours();
    const startDefault = `${today}T${String(nowHour).padStart(2, "0")}:00`;
    const endDefault = addOneHour(startDefault);

    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [allDay, setAllDay] = useState(false);
    const [includeMeet, setIncludeMeet] = useState(false);
    const [startDateTime, setStartDateTime] = useState(startDefault);
    const [endDateTime, setEndDateTime] = useState(endDefault);
    const [endCustomized, setEndCustomized] = useState(false);
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [newEmail, setNewEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    // Auto-update end time whenever start changes (unless user manually set end)
    useEffect(() => {
        if (!endCustomized) {
            setEndDateTime(addOneHour(startDateTime));
        }
    }, [startDateTime, endCustomized]);

    const reset = () => {
        setTitle(""); setDescription(""); setLocation("");
        setAllDay(false); setIncludeMeet(false);
        setAttendees([]); setNewEmail("");
        setStartDateTime(startDefault); setEndDateTime(endDefault);
        setEndCustomized(false);
        setStartDate(today); setEndDate(today);
        setStatus("idle"); setErrorMsg("");
    };

    const addAttendee = () => {
        const email = newEmail.trim();
        if (!email || !email.includes("@")) return;
        if (attendees.some(a => a.email === email)) return;
        setAttendees([...attendees, { email, name: "" }]);
        setNewEmail("");
    };

    const removeAttendee = (email: string) =>
        setAttendees(attendees.filter(a => a.email !== email));

    const handleCreate = async () => {
        if (!title) { setStatus("error"); setErrorMsg("El título es requerido."); return; }
        setSending(true); setStatus("idle");
        try {
            const res = await fetch("/api/calendar/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, location, allDay, startDateTime, endDateTime, startDate, endDate, attendees, includeMeet }),
            });
            if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Error al crear evento"); }
            setStatus("success");
            setTimeout(() => { setIsOpen(false); reset(); onEventCreated?.(); }, 1500);
        } catch (e: any) {
            setStatus("error"); setErrorMsg(e.message);
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <Button onClick={() => setIsOpen(true)} className="bg-teal-500 hover:bg-teal-400 text-gray-900 font-semibold gap-2 shadow-[0_0_20px_rgba(41,255,198,0.3)]">
                <Plus className="h-4 w-4" />Nuevo Evento
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-lg glass-panel rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden max-h-[90vh]">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <CalendarPlus className="h-4 w-4 text-teal-400" />Nuevo Evento
                            </h3>
                            <button onClick={() => { setIsOpen(false); reset(); }} className="text-gray-400 hover:text-white transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="flex flex-col gap-4 p-5 overflow-y-auto">
                            {/* Title */}
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">Título *</label>
                                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Reunión, llamada, recordatorio..." className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" onKeyDown={e => e.key === "Enter" && handleCreate()} />
                            </div>

                            {/* Toggles row */}
                            <div className="flex items-center gap-5 flex-wrap">
                                {/* All Day */}
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <button onClick={() => setAllDay(!allDay)} className={`w-10 h-5 rounded-full transition-colors relative ${allDay ? "bg-teal-500" : "bg-white/10"}`}>
                                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${allDay ? "left-5" : "left-0.5"}`} />
                                    </button>
                                    <span className="text-sm text-gray-300">Todo el día</span>
                                </label>

                                {/* Include Meet */}
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <button onClick={() => setIncludeMeet(!includeMeet)} className={`w-10 h-5 rounded-full transition-colors relative ${includeMeet ? "bg-blue-500" : "bg-white/10"}`}>
                                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${includeMeet ? "left-5" : "left-0.5"}`} />
                                    </button>
                                    <span className="text-sm text-gray-300 flex items-center gap-1">
                                        <Video className="h-3.5 w-3.5 text-blue-400" />Google Meet
                                    </span>
                                </label>
                            </div>

                            {/* Date/Time */}
                            {allDay ? (
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="text-xs text-gray-400 mb-1 block">Inicio</label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                                    <div><label className="text-xs text-gray-400 mb-1 block">Fin</label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-white/5 border-white/10 text-white" /></div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-gray-400 mb-1 block">Inicio</label>
                                        <Input type="datetime-local" value={startDateTime} onChange={e => { setStartDateTime(e.target.value); setEndCustomized(false); }} className="bg-white/5 border-white/10 text-white" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 mb-1 flex items-center justify-between">
                                            <span>Fin</span>
                                            {!endCustomized && <span className="text-teal-500 text-[10px]">auto +1h</span>}
                                        </label>
                                        <Input type="datetime-local" value={endDateTime} onChange={e => { setEndDateTime(e.target.value); setEndCustomized(true); }} className="bg-white/5 border-white/10 text-white" />
                                    </div>
                                </div>
                            )}

                            {/* Location */}
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">Ubicación (opcional)</label>
                                <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Dirección, enlace de Zoom, sala..." className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
                            </div>

                            {/* Attendees */}
                            <div>
                                <label className="text-xs text-gray-400 mb-1 flex items-center gap-1"><UserPlus className="h-3 w-3" /> Invitados</label>
                                <div className="flex gap-2 mb-2">
                                    <Input value={newEmail} onChange={e => setNewEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && addAttendee()} placeholder="correo@invitado.com" type="email" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 flex-1" />
                                    <Button type="button" onClick={addAttendee} size="sm" variant="outline" className="border-teal-500/40 text-teal-400 hover:bg-teal-500/10 shrink-0">Agregar</Button>
                                </div>
                                {attendees.length > 0 && (
                                    <div className="flex flex-col gap-1">
                                        {attendees.map(a => (
                                            <div key={a.email} className="flex items-center justify-between bg-white/5 rounded px-3 py-1.5">
                                                <span className="text-xs text-gray-300">{a.email}</span>
                                                <button onClick={() => removeAttendee(a.email)} className="text-gray-600 hover:text-red-400 transition-colors ml-2"><Trash2 className="h-3 w-3" /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">Descripción (opcional)</label>
                                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Notas adicionales..." rows={3} className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 resize-none" />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between px-5 py-4 border-t border-white/10 shrink-0">
                            <div className="text-xs">
                                {status === "success" && <span className="text-teal-400 flex items-center gap-1"><Check className="h-3 w-3" /> Evento creado</span>}
                                {status === "error" && <span className="text-red-400">{errorMsg}</span>}
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => { setIsOpen(false); reset(); }} className="text-gray-400">Cancelar</Button>
                                <Button onClick={handleCreate} disabled={sending} size="sm" className="bg-teal-500 hover:bg-teal-400 text-gray-900 font-semibold gap-2">
                                    {sending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CalendarPlus className="h-3 w-3" />}Crear
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
