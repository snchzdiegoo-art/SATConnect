/**
 * POST /api/prospects/hubspot/sync/[batchId]
 * Syncs all enriched prospects in a batch to HubSpot CRM.
 * Creates Contacts + Companies, associates them, and adds to a static list.
 */

import { NextRequest, NextResponse } from "next/server";
import { syncBatch } from "@/services/hubspotIntegration";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  const { batchId: batchIdStr } = await params;
  const batchId = parseInt(batchIdStr, 10);

  if (isNaN(batchId)) {
    return NextResponse.json({ error: "Invalid batchId" }, { status: 400 });
  }

  if (!process.env.HUBSPOT_PRIVATE_APP_TOKEN) {
    return NextResponse.json(
      {
        error:
          "HUBSPOT_PRIVATE_APP_TOKEN is not configured. Add it to your .env file.",
      },
      { status: 503 }
    );
  }

  try {
    const result = await syncBatch(batchId);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[hubspot-sync] Error:", err);
    return NextResponse.json(
      { error: "HubSpot sync failed", details: String(err) },
      { status: 500 }
    );
  }
}
