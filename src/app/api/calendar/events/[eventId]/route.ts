import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCalendarClient } from "@/lib/calendar";

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { eventId } = await params;
    if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 });

    try {
        const calendar = await getCalendarClient(userId);
        await calendar.events.delete({ calendarId: "primary", eventId, sendUpdates: "all" });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        const detail = error?.response?.data?.error?.message || error?.message || "Failed to delete event";
        console.error("Calendar delete error:", detail);
        return NextResponse.json({ error: detail }, { status: 500 });
    }
}
