import { auth } from "@clerk/nextjs/server";
import { getGmailClient } from "@/lib/gmail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Mail, ArrowLeft, Circle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReconnectGmailButton } from "@/components/mail/reconnect-button";
import { EmailBody } from "@/components/mail/email-body";
import { ComposeButton } from "@/components/mail/compose-button";
import { ResizableMailLayout } from "@/components/mail/resizable-layout";
import { UserCard } from "@/components/dashboard/user-card";

const getHeader = (headers: any[] | undefined, name: string): string =>
    (headers ?? []).find((h) => h?.name === name)?.value ?? "";

export default async function MailPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const params = await searchParams;
    const threadId = params?.threadId as string | undefined;
    const filter = params?.filter as string | undefined;

    let threads: any[] = [];
    let unreadCount = 0;
    let error: string | null = null;
    let activeThread: any = null;

    try {
        const gmail = await getGmailClient(userId);

        const query = filter === "unread" ? "is:unread in:inbox" : "in:inbox";

        const [listRes, unreadRes] = await Promise.all([
            gmail.users.threads.list({ userId: "me", maxResults: 20, q: query }),
            gmail.users.threads.list({ userId: "me", maxResults: 1, q: "is:unread in:inbox" }),
        ]);

        unreadCount = unreadRes.data.resultSizeEstimate ?? 0;

        if (listRes.data.threads) {
            threads = await Promise.all(
                listRes.data.threads.map(async (t) => {
                    if (!t.id) return null;
                    try {
                        const detail = await gmail.users.threads.get({
                            userId: "me",
                            id: t.id,
                            format: "metadata",
                            metadataHeaders: ["Subject", "From", "Date"],
                        });
                        const msgs = detail.data.messages ?? [];
                        const isUnread = msgs.some(
                            (m: any) => Array.isArray(m.labelIds) && m.labelIds.includes("UNREAD")
                        );
                        return { id: t.id, snippet: t.snippet, isUnread, ...detail.data };
                    } catch {
                        return null;
                    }
                })
            ).then((r) => r.filter(Boolean));
        }

        if (threadId) {
            try {
                const res = await gmail.users.threads.get({ userId: "me", id: threadId, format: "full" });
                activeThread = res.data;
            } catch (e) {
                console.error("Active thread fetch failed:", e);
            }
        }
    } catch (e: any) {
        console.error("Gmail Error:", e);
        error = e.message;
    }

    if (error) {
        const isAuth =
            error.includes("No Google OAuth token") ||
            error.includes("invalid_grant") ||
            error.includes("Insufficient Permission") ||
            error.includes("Bad Request");
        return (
            <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
                <Card className="max-w-md border-amber-500/20 bg-amber-500/5">
                    <CardHeader className="text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-amber-500 mb-2" />
                        <CardTitle className="text-amber-500">
                            {isAuth ? "Conexión Requerida" : "Error de Sincronización"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-gray-400">{isAuth ? "Necesitamos permisos de Google actualizados." : `Error: ${error}`}</p>
                        <div className="flex flex-col gap-2 w-full max-w-xs mx-auto">
                            <ReconnectGmailButton />
                            <Button asChild variant="ghost" className="text-xs text-gray-500">
                                <Link href="/dashboard/workspace">← Workspace</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // ── Left panel (thread list) ──────────────────────────────────────────────
    const leftPanel = (
        <>
            {/* Filter Tabs */}
            <div className="flex border-b border-white/5 shrink-0">
                <Link
                    href="/dashboard/workspace/mail"
                    className={`flex-1 text-center py-3 text-xs font-medium transition-colors ${!filter ? "text-teal-400 border-b-2 border-teal-400" : "text-gray-500 hover:text-gray-300"
                        }`}
                >
                    Todos
                </Link>
                <Link
                    href="/dashboard/workspace/mail?filter=unread"
                    className={`flex-1 text-center py-3 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${filter === "unread"
                        ? "text-teal-400 border-b-2 border-teal-400"
                        : "text-gray-500 hover:text-gray-300"
                        }`}
                >
                    <Circle className="h-2 w-2 fill-current text-teal-400" />
                    No leídos
                    {unreadCount > 0 && (
                        <span className="bg-teal-500/20 text-teal-400 rounded-full px-1.5 text-[10px] font-bold">
                            {unreadCount}
                        </span>
                    )}
                </Link>
            </div>

            {/* Thread List */}
            <ScrollArea className="flex-1">
                <div className="flex flex-col">
                    {threads.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-600">
                            <Mail className="h-8 w-8 mb-2 opacity-30" />
                            <p className="text-sm">{filter === "unread" ? "Sin no leídos" : "Sin correos"}</p>
                        </div>
                    )}
                    {threads.map((thread: any) => {
                        const isSelected = thread.id === threadId;
                        const isUnread: boolean = thread.isUnread ?? false;
                        const headers = thread.messages?.[0]?.payload?.headers ?? [];
                        const subject = getHeader(headers, "Subject") || "(Sin Asunto)";
                        const fromFull = getHeader(headers, "From");
                        const from = fromFull.includes("<")
                            ? fromFull.split("<")[0].trim()
                            : fromFull.trim() || "Desconocido";
                        const dateRaw = getHeader(headers, "Date");
                        const date = dateRaw
                            ? new Date(dateRaw).toLocaleDateString("es-MX", { month: "short", day: "numeric" })
                            : "";

                        return (
                            <Link
                                key={thread.id}
                                href={`/dashboard/workspace/mail?threadId=${thread.id}${filter ? `&filter=${filter}` : ""}`}
                                className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${isSelected
                                    ? "bg-teal-500/10 border-l-2 border-teal-500"
                                    : isUnread
                                        ? "bg-white/[0.02]"
                                        : ""
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center gap-2 min-w-0">
                                        {isUnread && (
                                            <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
                                        )}
                                        <span
                                            className={`truncate text-sm ${isUnread
                                                ? "font-semibold text-white"
                                                : isSelected
                                                    ? "text-teal-300 font-medium"
                                                    : "text-gray-400"
                                                }`}
                                        >
                                            {from}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-gray-600 shrink-0 ml-2">{date}</span>
                                </div>
                                <p
                                    className={`text-xs mb-1 truncate ${isUnread ? "font-medium text-gray-200" : "text-gray-500"
                                        }`}
                                >
                                    {subject}
                                </p>
                                <p className="text-[11px] text-gray-600 line-clamp-1">{thread.snippet}</p>
                            </Link>
                        );
                    })}
                </div>
            </ScrollArea>
        </>
    );

    // ── Right panel (thread detail) ───────────────────────────────────────────
    const findHtml = (parts: any[]): string | null => {
        for (const p of parts ?? []) {
            if (p?.mimeType === "text/html" && p?.body?.data)
                return Buffer.from(p.body.data, "base64").toString("utf-8");
            const nested = findHtml(p?.parts ?? []);
            if (nested) return nested;
        }
        return null;
    };
    const findText = (parts: any[]): string | null => {
        for (const p of parts ?? [])
            if (p?.mimeType === "text/plain" && p?.body?.data)
                return Buffer.from(p.body.data, "base64").toString("utf-8");
        return null;
    };

    const rightPanel = activeThread ? (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-5 border-b border-white/5 shrink-0">
                <div className="flex items-start justify-between mb-3">
                    <h1 className="text-xl font-bold text-white leading-tight pr-4">
                        {getHeader(activeThread.messages?.[0]?.payload?.headers, "Subject") || "(Sin Asunto)"}
                    </h1>
                    <Button asChild variant="ghost" size="sm" className="shrink-0 text-gray-400 hover:text-white">
                        <Link href={`/dashboard/workspace/mail${filter ? `?filter=${filter}` : ""}`}>
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Volver
                        </Link>
                    </Button>
                </div>
                <Badge variant="outline" className="border-teal-500/30 text-teal-400 bg-teal-500/5 text-xs">
                    {activeThread.messages?.length ?? 1} mensaje{(activeThread.messages?.length ?? 1) !== 1 ? "s" : ""}
                </Badge>
            </div>

            <ScrollArea className="flex-1 p-5">
                <div className="space-y-6">
                    {activeThread.messages?.map((msg: any) => {
                        const headers = msg?.payload?.headers ?? [];
                        const from = getHeader(headers, "From");
                        const date = msg.internalDate
                            ? new Date(Number(msg.internalDate)).toLocaleString("es-MX", {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })
                            : "";

                        const parts = msg.payload?.parts ?? [msg.payload];
                        const htmlBody = findHtml(parts);
                        const textBody = findText(parts);
                        const rawData = msg.payload?.body?.data
                            ? Buffer.from(msg.payload.body.data, "base64").toString("utf-8")
                            : null;

                        let body = htmlBody
                            || (textBody ? `<pre style="white-space:pre-wrap;font-family:inherit">${textBody}</pre>` : null)
                            || (rawData ? `<pre style="white-space:pre-wrap;font-family:inherit">${rawData}</pre>` : null)
                            || "Sin contenido";

                        return (
                            <div key={msg.id}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                        {from.trim()[0]?.toUpperCase() || "?"}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-sm font-medium text-white truncate">{from || "Desconocido"}</div>
                                        <div className="text-xs text-gray-500">{date}</div>
                                    </div>
                                </div>
                                <EmailBody html={body} />
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-3">
            <Mail className="h-16 w-16 opacity-20" />
            <p className="text-sm">Selecciona un correo para leerlo</p>
        </div>
    );

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-3">
            {/* Top Bar */}
            <div className="flex items-center gap-3">
                <Button asChild variant="ghost" size="sm" className="text-gray-400 hover:text-white gap-2">
                    <Link href="/dashboard/workspace">
                        <ArrowLeft className="h-4 w-4" />
                        Dashboard
                    </Link>
                </Button>
                <h1 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Mail className="h-5 w-5 text-teal-400" />
                    Bandeja de Entrada
                    {unreadCount > 0 && (
                        <span className="text-xs font-bold bg-teal-500 text-gray-900 rounded-full px-2 py-0.5">
                            {unreadCount}
                        </span>
                    )}
                </h1>
                <div className="ml-auto flex items-center gap-3">
                    <ComposeButton />
                    <UserCard />
                </div>
            </div>

            {/* Resizable Two-Panel Layout */}
            <ResizableMailLayout
                defaultLeftWidth={280}
                minLeft={200}
                maxLeft={600}
                left={leftPanel}
                right={rightPanel}
            />
        </div>
    );
}
