/**
 * GET /api/prospects/export/[batchId]
 * Returns a CSV file of all 17 canonical columns, ready for HubSpot import.
 */

import { NextRequest, NextResponse } from "next/server";
import { generateExportCsv } from "@/services/hubspotIntegration";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  const { batchId: batchIdStr } = await params;
  const batchId = parseInt(batchIdStr, 10);

  if (isNaN(batchId)) {
    return NextResponse.json({ error: "Invalid batchId" }, { status: 400 });
  }

  try {
    const csv = await generateExportCsv(batchId);
    const today = new Date().toISOString().slice(0, 10);
    const filename = `prospectos-satconnect-${today}.csv`;

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("[export] Error:", err);
    return NextResponse.json(
      { error: "Failed to generate CSV export" },
      { status: 500 }
    );
  }
}
