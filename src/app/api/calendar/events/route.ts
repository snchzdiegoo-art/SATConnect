import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCalendarClient } from "@/lib/calendar";

// datetime-local gives "2026-02-20T17:00" — Google needs "2026-02-20T17:00:00"
function normalizeDateTime(dt: string): string {
    if (!dt) return dt;
    if (/T\d{2}:\d{2}:\d{2}/.test(dt)) return dt;
    if (/T\d{2}:\d{2}$/.test(dt)) return dt + ":00";
    return dt;
}

// POST /api/calendar/events
export async function POST(request: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await request.json();
    const { title, description, location, startDateTime, endDateTime, allDay, startDate, endDate, attendees, includeMeet } = body;

    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    try {
        const calendar = await getCalendarClient(userId);

        const event: any = {
            summary: title,
            description: description || undefined,
            location: location || undefined,
        };

        if (allDay) {
            event.start = { date: startDate };
            event.end = { date: endDate || startDate };
        } else {
            event.start = { dateTime: normalizeDateTime(startDateTime), timeZone: "America/Mexico_City" };
            event.end = { dateTime: normalizeDateTime(endDateTime), timeZone: "America/Mexico_City" };
        }

        if (Array.isArray(attendees) && attendees.length > 0) {
            event.attendees = attendees.map((a: { email: string; name?: string }) => ({
                email: a.email,
                ...(a.name ? { displayName: a.name } : {}),
            }));
        }

        // Google Meet conference
        if (includeMeet) {
            event.conferenceData = {
                createRequest: {
                    requestId: `${userId}-${Date.now()}`,
                    conferenceSolutionKey: { type: "hangoutsMeet" },
                },
            };
        }

        const res = await calendar.events.insert({
            calendarId: "primary",
            sendUpdates: attendees?.length ? "all" : "none",
            conferenceDataVersion: includeMeet ? 1 : 0,
            requestBody: event,
        });

        return NextResponse.json({ event: res.data });
    } catch (error: any) {
        const detail = error?.response?.data?.error?.message || error?.message || "Failed to create event";
        console.error("Calendar create event error:", detail, error?.response?.data);
        return NextResponse.json({ error: detail }, { status: 500 });
    }
}
