/**
 * GET /api/prospects/enrich/[batchId]
 * Server-Sent Events (SSE) stream that enriches all pending prospects
 * and emits real-time progress events per prospect field.
 */

import { NextRequest, NextResponse } from "next/server";
import { enrichBatch } from "@/services/scraperService";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  const { batchId: batchIdStr } = await params;
  const batchId = parseInt(batchIdStr, 10);

  if (isNaN(batchId)) {
    return NextResponse.json({ error: "Invalid batchId" }, { status: 400 });
  }

  const batch = await prisma.prospectBatch.findUnique({
    where: { id: batchId },
  });

  if (!batch) {
    return NextResponse.json({ error: "Batch not found" }, { status: 404 });
  }

  // ─── SSE Stream ──────────────────────────────────────────────────────────────
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      try {
        send({ type: "start", batchId, total: batch.total });

        for await (const event of enrichBatch(batchId)) {
          send({ type: "field", ...event });
        }

        // Final status
        const finalBatch = await prisma.prospectBatch.findUnique({
          where: { id: batchId },
          select: { status: true, enriched: true, total: true },
        });

        send({ type: "done", batchId, ...finalBatch });
      } catch (err) {
        send({ type: "error", message: String(err) });
        await prisma.prospectBatch.update({
          where: { id: batchId },
          data: { status: "FAILED" },
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
