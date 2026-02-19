import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCalendarClient } from "@/lib/calendar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, AlertCircle, MapPin, Clock, Users, X, ExternalLink, Video } from "lucide-react";
import Link from "next/link";
import { CreateEventButton } from "@/components/calendar/create-event-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReconnectGmailButton } from "@/components/mail/reconnect-button";
import { ResizableThreePanelLayout } from "@/components/mail/resizable-layout";
import { DeleteEventButton } from "@/components/calendar/delete-event-button";
import { UserCard } from "@/components/dashboard/user-card";

interface GEvent {
    id: string;
    summary?: string;
    description?: string;
    location?: string;
    start?: { dateTime?: string; date?: string };
    end?: { dateTime?: string; date?: string };
    colorId?: string;
    htmlLink?: string;
    attendees?: { email: string; displayName?: string; responseStatus?: string }[];
    organizer?: { email: string; displayName?: string };
    conferenceData?: { entryPoints?: { entryPointType: string; uri: string; label?: string }[]; conferenceSolution?: { name: string } };
}

const GCAL_COLORS: Record<string, string> = {
    "1": "#7986cb", "2": "#33b679", "3": "#8e24aa", "4": "#e67c73",
    "5": "#f6bf26", "6": "#f4511e", "7": "#039be5", "8": "#616161",
    "9": "#3f51b5", "10": "#0b8043", "11": "#d60000",
    default: "#14b8a6",
};

function getEventColor(colorId?: string) {
    return GCAL_COLORS[colorId ?? "default"] ?? GCAL_COLORS.default;
}

function parseDate(event: GEvent): Date {
    return new Date(event.start?.dateTime ?? event.start?.date ?? "");
}

function buildGrid(year: number, month: number): Date[] {
    const startPad = new Date(year, month, 1).getDay();
    const days: Date[] = [];
    for (let i = -startPad; i < 42 - startPad; i++) {
        days.push(new Date(year, month, 1 + i));
    }
    return days;
}

const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const RSVP_LABELS: Record<string, string> = {
    accepted: "✅ Aceptó", declined: "❌ Rechazó",
    tentative: "❓ Tentativo", needsAction: "⏳ Pendiente",
};

export default async function CalendarPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const params = await searchParams;
    const now = new Date();

    const year = parseInt((params.year as string) ?? String(now.getFullYear()), 10);
    const month = parseInt((params.month as string) ?? String(now.getMonth()), 10);
    const activeEventId = params.eventId as string | undefined;

    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    let events: GEvent[] = [];
    let activeEvent: GEvent | null = null;
    let error: string | null = null;

    try {
        const cal = await getCalendarClient(userId);
        const timeMin = new Date(year, month, 1).toISOString();
        const timeMax = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
        const res = await cal.events.list({ calendarId: "primary", timeMin, timeMax, singleEvents: true, orderBy: "startTime", maxResults: 250 });
        events = (res.data.items ?? []) as GEvent[];
        if (activeEventId) {
            try {
                const evRes = await cal.events.get({ calendarId: "primary", eventId: activeEventId });
                activeEvent = evRes.data as GEvent;
            } catch { /* ignore */ }
        }
    } catch (e: any) {
        error = e.message;
    }

    if (error) {
        const isAuth = error.includes("No Google OAuth token") || error.includes("invalid_grant") || error.includes("insufficientPermissions") || error.includes("Bad Request");
        return (
            <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
                <Card className="max-w-md border-amber-500/20 bg-amber-500/5">
                    <CardHeader className="text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-amber-500 mb-2" />
                        <CardTitle className="text-amber-500">{isAuth ? "Reconecta tu cuenta" : "Error de Calendar"}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-gray-400">{isAuth ? "Necesitamos permisos de Google Calendar. Reconecta tu cuenta para continuar." : error}</p>
                        <div className="flex flex-col gap-2 w-full max-w-xs mx-auto">
                            <ReconnectGmailButton redirectTo="/dashboard/workspace/calendar" />
                            <Button asChild variant="ghost" className="text-xs text-gray-500"><Link href="/dashboard/workspace">← Workspace</Link></Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const eventsByDay: Record<string, GEvent[]> = {};
    for (const ev of events) {
        const d = parseDate(ev);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        if (!eventsByDay[key]) eventsByDay[key] = [];
        eventsByDay[key].push(ev);
    }

    const days = buildGrid(year, month);
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const upcomingEvents = events.filter(e => new Date(e.start?.dateTime ?? e.start?.date ?? "") >= now).slice(0, 6);

    const filterStr = (extra: Record<string, string>) =>
        `/dashboard/workspace/calendar?${new URLSearchParams(extra).toString()}`;

    // ── Sidebar panel ─────────────────────────────────────────────────────────
    const sidebarPanel = (
        <>
            <div className="p-4 border-b border-white/5 shrink-0">
                <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Próximos</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                {upcomingEvents.length === 0 && (
                    <p className="text-xs text-gray-500 text-center pt-6">Sin próximos eventos</p>
                )}
                {upcomingEvents.map(ev => {
                    const d = parseDate(ev);
                    const color = getEventColor(ev.colorId);
                    const isAllDay = !ev.start?.dateTime;
                    const time = isAllDay ? "Todo el día" : d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
                    const dateLabel = d.toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" });
                    return (
                        <Link key={ev.id} href={filterStr({ year: String(year), month: String(month), eventId: ev.id })} className="p-2.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors block">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                                <p className="text-xs font-medium text-white truncate">{ev.summary || "(Sin título)"}</p>
                            </div>
                            <p className="text-[10px] text-gray-400 pl-4">{dateLabel}</p>
                            <p className="text-[10px] text-gray-500 pl-4">{time}</p>
                        </Link>
                    );
                })}
            </div>
        </>
    );

    // ── Calendar grid panel ────────────────────────────────────────────────────
    const gridPanel = (
        <>
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 shrink-0">
                <Link href={filterStr({ year: String(prevYear), month: String(prevMonth) })} className="w-9 h-9 flex items-center justify-center rounded-lg text-white bg-white/10 hover:bg-white/20 transition-colors">
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <h2 className="text-base font-semibold text-white">{MONTH_NAMES[month]} {year}</h2>
                <Link href={filterStr({ year: String(nextYear), month: String(nextMonth) })} className="w-9 h-9 flex items-center justify-center rounded-lg text-white bg-white/10 hover:bg-white/20 transition-colors">
                    <ChevronRight className="h-5 w-5" />
                </Link>
            </div>
            <div className="grid grid-cols-7 border-b border-white/5 shrink-0">
                {DAY_NAMES.map(d => <div key={d} className="py-2 text-center text-[11px] font-semibold text-gray-300 uppercase tracking-wide">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 flex-1 overflow-y-auto" style={{ gridTemplateRows: "repeat(6, minmax(80px, 1fr))" }}>
                {days.map((day, idx) => {
                    const isCurrentMonth = day.getMonth() === month;
                    const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
                    const isToday = key === todayStr;
                    const dayEvents = eventsByDay[key] ?? [];
                    return (
                        <div key={idx} className={`border-b border-r border-white/5 p-1.5 overflow-hidden flex flex-col ${!isCurrentMonth ? "opacity-30" : ""} ${isToday ? "bg-teal-500/5" : ""}`}>
                            <div className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday ? "bg-teal-500 text-gray-900 font-bold" : isCurrentMonth ? "text-gray-300" : "text-gray-600"}`}>
                                {day.getDate()}
                            </div>
                            <div className="flex flex-col gap-0.5 overflow-hidden">
                                {dayEvents.slice(0, 3).map(ev => {
                                    const color = getEventColor(ev.colorId);
                                    const evTime = !ev.start?.dateTime ? "" : parseDate(ev).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
                                    return (
                                        <Link key={ev.id} href={filterStr({ year: String(year), month: String(month), eventId: ev.id })} className="rounded px-1.5 py-0.5 flex items-center gap-1 truncate hover:opacity-80 transition-opacity" style={{ backgroundColor: color }} title={ev.summary}>
                                            <span className="text-[10px] truncate text-white font-medium">
                                                {evTime && <span className="opacity-80 mr-0.5">{evTime}</span>}
                                                {ev.summary || "(Sin título)"}
                                            </span>
                                        </Link>
                                    );
                                })}
                                {dayEvents.length > 3 && <span className="text-[10px] text-gray-500 pl-1">+{dayEvents.length - 3} más</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );

    // ── Event detail panel (optional) ─────────────────────────────────────────
    const detailPanel = activeEvent ? (
        <>
            <div className="p-4 border-b border-white/5 flex items-start justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: getEventColor(activeEvent.colorId) }} />
                    <h3 className="text-sm font-semibold text-white leading-tight">{activeEvent.summary || "(Sin título)"}</h3>
                </div>
                <Link href={filterStr({ year: String(year), month: String(month) })} className="text-gray-500 hover:text-white shrink-0 transition-colors">
                    <X className="h-4 w-4" />
                </Link>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {/* Date/Time */}
                <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                    <div>
                        {activeEvent.start?.dateTime ? (
                            <>
                                <p className="text-xs text-gray-300">{new Date(activeEvent.start.dateTime).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(activeEvent.start.dateTime).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                                    {activeEvent.end?.dateTime && ` – ${new Date(activeEvent.end.dateTime).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`}
                                </p>
                            </>
                        ) : (
                            <p className="text-xs text-gray-300">
                                {activeEvent.start?.date ? new Date(activeEvent.start.date).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" }) : "—"}
                                <span className="text-gray-500 ml-1">· Todo el día</span>
                            </p>
                        )}
                    </div>
                </div>
                {/* Location */}
                {activeEvent.location && (
                    <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-gray-300 break-words">{activeEvent.location}</p>
                    </div>
                )}
                {/* Description */}
                {activeEvent.description && (
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Descripción</p>
                        <p className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">{activeEvent.description.replace(/<[^>]+>/g, "")}</p>
                    </div>
                )}
                {/* Attendees */}
                {activeEvent.attendees && activeEvent.attendees.length > 0 && (
                    <div>
                        <div className="flex items-center gap-1 mb-2">
                            <Users className="h-3.5 w-3.5 text-gray-500" />
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Invitados ({activeEvent.attendees.length})</p>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {activeEvent.attendees.map(a => (
                                <div key={a.email} className="flex items-center justify-between gap-2 bg-white/5 rounded px-2.5 py-1.5">
                                    <div className="min-w-0">
                                        {a.displayName && <p className="text-xs font-medium text-white truncate">{a.displayName}</p>}
                                        <p className="text-[10px] text-gray-500 truncate">{a.email}</p>
                                    </div>
                                    <span className="text-[10px] shrink-0 text-gray-500">{RSVP_LABELS[a.responseStatus ?? "needsAction"] ?? ""}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Meet link */}
                {activeEvent.conferenceData?.entryPoints?.filter(e => e.entryPointType === "video").map(ep => (
                    <a key={ep.uri} href={ep.uri} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg px-3 py-2 transition-colors">
                        <Video className="h-4 w-4 text-blue-400 shrink-0" />
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-blue-300">Unirse a Google Meet</p>
                            <p className="text-[10px] text-blue-400/60 truncate">{ep.label || ep.uri}</p>
                        </div>
                    </a>
                ))}
            </div>
            <div className="p-3 border-t border-white/5 shrink-0 flex flex-col gap-2">
                {activeEvent.htmlLink && (
                    <a href={activeEvent.htmlLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-medium text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 transition-colors">
                        <ExternalLink className="h-3 w-3" />
                        Abrir en Google Calendar
                    </a>
                )}
                <DeleteEventButton
                    eventId={activeEvent.id}
                    redirectTo={filterStr({ year: String(year), month: String(month) })}
                />
            </div>
        </>
    ) : undefined;

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-3">
            {/* Top Bar */}
            <div className="flex items-center gap-3">
                <Button asChild variant="ghost" size="sm" className="text-gray-400 hover:text-white gap-2">
                    <Link href="/dashboard/workspace"><ArrowLeft className="h-4 w-4" />Workspace</Link>
                </Button>
                <h1 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-teal-400" />
                    Calendario
                </h1>
                <div className="ml-auto flex items-center gap-3">
                    <CreateEventButton />
                    <UserCard />
                </div>
            </div>

            {/* Resizable three-panel layout */}
            <ResizableThreePanelLayout
                defaultLeftWidth={208}
                minLeft={140}
                maxLeft={380}
                defaultRightWidth={288}
                minRight={220}
                maxRight={480}
                storageKeyLeft="cal-left-width"
                storageKeyRight="cal-right-width"
                left={sidebarPanel}
                center={gridPanel}
                right={detailPanel}
            />
        </div>
    );
}
