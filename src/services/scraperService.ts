/**
 * scraperService.ts
 * SAT Connect — B2B Lead Enrichment Engine
 *
 * Orchestrates Apify (primary) + ScrapingBee (fallback) to fill every
 * missing field in a Prospect record.
 * CRITICAL RULE: If data is not found anywhere → "(no encontrado)"
 * NEVER leave a required field blank.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Types ────────────────────────────────────────────────────────────────────

export type EnrichFieldStatus = "pending" | "found" | "not_found" | "skipped";

export interface EnrichEvent {
  prospectId: number;
  field: string;
  status: EnrichFieldStatus;
  value?: string;
}

type EnrichCallback = (event: EnrichEvent) => void;

// ─── Constants ────────────────────────────────────────────────────────────────

const NOT_FOUND = "(no encontrado)";

const APIFY_TOKEN = process.env.APIFY_API_TOKEN ?? "";
const SCRAPINGBEE_KEY = process.env.SCRAPINGBEE_API_KEY ?? "";

/** Fields that MUST be filled — ordered by enrichment priority */
const ENRICHABLE_FIELDS = [
  "empresa",
  "pagina_web",
  "telefono",
  "email",
  "linkedin_empresa",
  "linkedin_contacto",
  "motor_reservas",
  "puesto",
  "contacto",
  "pais",
  "estado",
  "ciudad",
] as const;

type EnrichableField = (typeof ENRICHABLE_FIELDS)[number];

// ─── Apify Helpers ────────────────────────────────────────────────────────────

async function runApifyGoogleSearch(query: string): Promise<string | null> {
  if (!APIFY_TOKEN) return null;
  try {
    // Trigger a Google Search scraper run (sync — waits for result)
    const response = await fetch(
      "https://api.apify.com/v2/acts/apify~google-search-scraper/run-sync-get-dataset-items?token=" +
        APIFY_TOKEN +
        "&timeout=30",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queries: query,
          maxPagesPerQuery: 1,
          resultsPerPage: 3,
          countryCode: "mx",
          languageCode: "es",
          mobileResults: false,
        }),
      }
    );

    if (!response.ok) return null;
    const items = (await response.json()) as Array<{
      organicResults?: Array<{ url?: string; title?: string; description?: string }>;
    }>;
    const first = items?.[0]?.organicResults?.[0];
    return first?.url ?? first?.description ?? null;
  } catch {
    return null;
  }
}

async function runApifyLinkedInScraper(
  companyName: string
): Promise<{ url?: string; employees?: string; website?: string } | null> {
  if (!APIFY_TOKEN) return null;
  try {
    const response = await fetch(
      "https://api.apify.com/v2/acts/curious_coder~linkedin-company-scraper/run-sync-get-dataset-items?token=" +
        APIFY_TOKEN +
        "&timeout=40",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchCompanyName: companyName,
          proxy: { useApifyProxy: true, apifyProxyGroups: ["RESIDENTIAL"] },
        }),
      }
    );
    if (!response.ok) return null;
    const items = (await response.json()) as Array<{
      url?: string;
      employeeCount?: number;
      website?: string;
    }>;
    const first = items?.[0];
    if (!first) return null;
    return {
      url: first.url,
      employees: first.employeeCount?.toString(),
      website: first.website,
    };
  } catch {
    return null;
  }
}

// ─── ScrapingBee Helpers ──────────────────────────────────────────────────────

async function fetchWithScrapingBee(url: string): Promise<string | null> {
  if (!SCRAPINGBEE_KEY || !url) return null;
  try {
    const endpoint =
      `https://app.scrapingbee.com/api/v1/?` +
      new URLSearchParams({
        api_key: SCRAPINGBEE_KEY,
        url: url,
        render_js: "false",
        extract_rules: JSON.stringify({
          email: { selector: "a[href^='mailto:']", attribute: "href" },
          phone: { selector: "a[href^='tel:']", attribute: "href" },
          bokun: { selector: "script[src*='bokun']", attribute: "src" },
          rezdy: { selector: "script[src*='rezdy']", attribute: "src" },
          fareharbor: { selector: "script[src*='fareharbor']", attribute: "src" },
          checkfront: { selector: "script[src*='checkfront']", attribute: "src" },
        }),
      });
    const response = await fetch(endpoint);
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

function detectBookingEngine(html: string | null): string {
  if (!html) return NOT_FOUND;
  const lower = html.toLowerCase();
  if (lower.includes("bokun") || lower.includes("bókun")) return "Bókun";
  if (lower.includes("rezdy")) return "Rezdy";
  if (lower.includes("fareharbor")) return "FareHarbor";
  if (lower.includes("checkfront")) return "Checkfront";
  if (lower.includes("satconnect") || lower.includes("sat-connect")) return "SATConnect";
  return "n/a";
}

function extractEmailFromHtml(html: string | null): string | null {
  if (!html) return null;
  const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
  const matches = html.match(emailRegex) ?? [];
  // Exclude common false positives
  const filtered = matches.filter(
    (e) => !e.includes("wixpress") && !e.includes("sentry") && !e.includes("example")
  );
  return filtered[0] ?? null;
}

function extractPhoneFromHtml(html: string | null): string | null {
  if (!html) return null;
  const telRegex = /href="tel:([^"]+)"/i;
  const match = html.match(telRegex);
  return match?.[1] ?? null;
}

// ─── Core Enrichment Logic ────────────────────────────────────────────────────

async function enrichField(
  field: EnrichableField,
  prospect: {
    empresa?: string | null;
    pagina_web?: string | null;
    ciudad?: string | null;
    pais?: string | null;
  }
): Promise<string | null> {
  const empresa = prospect.empresa ?? "";
  const web = prospect.pagina_web ?? "";
  const location = [prospect.ciudad, prospect.pais].filter(Boolean).join(", ");

  switch (field) {
    case "pagina_web": {
      if (!empresa) return null;
      const result = await runApifyGoogleSearch(
        `"${empresa}" site oficial ${location}`
      );
      // Extract domain from the URL result
      if (result) {
        try {
          return new URL(result).origin;
        } catch {
          return result;
        }
      }
      return null;
    }

    case "email": {
      // First try scraping the website directly
      const html = await fetchWithScrapingBee(web);
      const fromWeb = extractEmailFromHtml(html);
      if (fromWeb) return fromWeb;
      // Fallback: Google search
      const googled = await runApifyGoogleSearch(`email contacto "${empresa}" ${location}`);
      if (googled && googled.includes("@")) return googled;
      return null;
    }

    case "telefono": {
      const html = await fetchWithScrapingBee(web);
      const phone = extractPhoneFromHtml(html);
      if (phone) return phone;
      const googled = await runApifyGoogleSearch(`telefono "${empresa}" ${location}`);
      if (googled) return googled;
      return null;
    }

    case "linkedin_empresa": {
      const li = await runApifyLinkedInScraper(empresa);
      return li?.url ?? null;
    }

    case "linkedin_contacto": {
      // Google search for the decision-maker LinkedIn
      const result = await runApifyGoogleSearch(
        `site:linkedin.com/in CEO OR Director OR Fundador "${empresa}"`
      );
      return result ?? null;
    }

    case "motor_reservas": {
      const html = await fetchWithScrapingBee(web);
      return detectBookingEngine(html);
    }

    case "empresa": {
      const result = await runApifyGoogleSearch(
        `agencia turismo ${location} empresa`
      );
      return result ?? null;
    }

    case "puesto":
    case "contacto": {
      const result = await runApifyGoogleSearch(
        `"${empresa}" CEO Director fundador contacto LinkedIn`
      );
      return result ?? null;
    }

    default:
      return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Enriches a single prospect record.
 * Calls onEvent callback with real-time progress per field.
 */
export async function enrichProspect(
  prospectId: number,
  onEvent?: EnrichCallback
): Promise<void> {
  const prospect = await prisma.prospect.findUnique({
    where: { id: prospectId },
  });

  if (!prospect) throw new Error(`Prospect ${prospectId} not found`);

  // Build current enrich_status snapshot
  const currentStatus =
    (prospect.enrich_status as Record<string, EnrichFieldStatus>) ?? {};
  const updates: Record<string, string | null> = {};
  const newStatus: Record<string, EnrichFieldStatus> = { ...currentStatus };

  for (const field of ENRICHABLE_FIELDS) {
    // Skip if already has a value
    const existing = prospect[field as keyof typeof prospect] as string | null;
    if (existing && existing !== "" && existing !== NOT_FOUND) {
      newStatus[field] = "skipped";
      onEvent?.({ prospectId, field, status: "skipped", value: existing });
      continue;
    }

    onEvent?.({ prospectId, field, status: "pending" });
    newStatus[field] = "pending";

    try {
      const value = await enrichField(
        field,
        prospect as {
          empresa?: string | null;
          pagina_web?: string | null;
          ciudad?: string | null;
          pais?: string | null;
        }
      );

      if (value) {
        updates[field] = value;
        newStatus[field] = "found";
        onEvent?.({ prospectId, field, status: "found", value });
      } else {
        updates[field] = NOT_FOUND;
        newStatus[field] = "not_found";
        onEvent?.({ prospectId, field, status: "not_found", value: NOT_FOUND });
      }
    } catch {
      updates[field] = NOT_FOUND;
      newStatus[field] = "not_found";
      onEvent?.({ prospectId, field, status: "not_found", value: NOT_FOUND });
    }
  }

  // Commit all updates in one DB write
  await prisma.prospect.update({
    where: { id: prospectId },
    data: {
      ...updates,
      enrich_status: newStatus,
      is_enriched: true,
    },
  });
}

/**
 * Enriches all un-enriched prospects in a batch.
 * Yields enrichment events via async generator for SSE streaming.
 */
export async function* enrichBatch(
  batchId: number
): AsyncGenerator<EnrichEvent> {
  const prospects = await prisma.prospect.findMany({
    where: { batch_id: batchId, is_enriched: false },
    select: { id: true },
  });

  await prisma.prospectBatch.update({
    where: { id: batchId },
    data: { status: "ENRICHING" },
  });

  let enrichedCount = 0;

  for (const { id } of prospects) {
    const events: EnrichEvent[] = [];

    await enrichProspect(id, (e) => events.push(e));

    for (const e of events) {
      yield e;
    }

    enrichedCount++;
    await prisma.prospectBatch.update({
      where: { id: batchId },
      data: { enriched: enrichedCount },
    });
  }

  await prisma.prospectBatch.update({
    where: { id: batchId },
    data: { status: "DONE" },
  });
}
