/**
 * GET /api/prospects/batch/[batchId]
 * Returns all prospect rows for a given batch (lightweight snapshot).
 */

import { NextRequest, NextResponse } from "next/server";
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

  const prospects = await prisma.prospect.findMany({
    where: { batch_id: batchId },
    orderBy: { id: "asc" },
    select: {
      id: true,
      empresa: true,
      contacto: true,
      email: true,
      pagina_web: true,
      motor_reservas: true,
      is_enriched: true,
      enrich_status: true,
    },
  });

  return NextResponse.json(prospects);
}
