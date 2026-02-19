import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getGmailClient } from "@/lib/gmail";

export async function POST(request: Request) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { to, subject, body } = await request.json();

    if (!to || !subject || !body) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    try {
        const gmail = await getGmailClient(userId);

        // Build RFC 2822 email message
        const message = [
            `To: ${to}`,
            `Subject: ${subject}`,
            "Content-Type: text/plain; charset=utf-8",
            "MIME-Version: 1.0",
            "",
            body,
        ].join("\r\n");

        // Base64url encode (Gmail API requirement)
        const encodedMessage = Buffer.from(message)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: encodedMessage,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Send email error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to send email" },
            { status: 500 }
        );
    }
}
