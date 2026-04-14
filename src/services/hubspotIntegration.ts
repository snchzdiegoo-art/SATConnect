/**
 * hubspotIntegration.ts
 * SAT Connect — HubSpot CRM Connector
 *
 * Maps the 17 canonical prospect columns to HubSpot Contacts & Companies.
 * Uses HubSpot API v3 with a Private App Token.
 */

import { PrismaClient, type Prospect } from "@prisma/client";

const prisma = new PrismaClient();

const HS_BASE = "https://api.hubapi.com";
const HS_TOKEN = process.env.HUBSPOT_PRIVATE_APP_TOKEN ?? "";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HubSpotResult {
  contactId?: string;
  companyId?: string;
  error?: string;
}

interface BatchSyncResult {
  synced: number;
  failed: number;
  errors: string[];
  listId?: number;
  listName: string;
}

// ─── HubSpot API Helpers ──────────────────────────────────────────────────────

async function hsRequest(
  method: string,
  path: string,
  body?: unknown
): Promise<unknown> {
  const response = await fetch(`${HS_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${HS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HubSpot API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

// ─── Company Sync ─────────────────────────────────────────────────────────────

async function upsertCompany(prospect: Prospect): Promise<string | null> {
  const properties: Record<string, string> = {};

  if (prospect.empresa) properties.name = prospect.empresa;
  if (prospect.pagina_web) properties.website = prospect.pagina_web;
  if (prospect.telefono) properties.phone = prospect.telefono;
  if (prospect.industria?.length)
    properties.industry = prospect.industria.join("; ");
  if (prospect.tamano_empresa)
    properties.numberofemployees = prospect.tamano_empresa;
  if (prospect.linkedin_empresa)
    properties.linkedin_company_page = prospect.linkedin_empresa;
  if (prospect.ciudad) properties.city = prospect.ciudad;
  if (prospect.estado) properties.state = prospect.estado;
  if (prospect.pais) properties.country = prospect.pais;
  if (prospect.motor_reservas)
    properties.booking_engine__sat_ = prospect.motor_reservas;

  if (!properties.name) return null;

  try {
    // Search by domain first to avoid duplicates
    const searchBody = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "domain",
              operator: "EQ",
              value: prospect.pagina_web ?? "",
            },
          ],
        },
      ],
      properties: ["name", "domain"],
      limit: 1,
    };

    const searchRes = (await hsRequest(
      "POST",
      "/crm/v3/objects/companies/search",
      searchBody
    )) as { results?: Array<{ id: string }> };

    if (searchRes?.results?.length) {
      const existingId = searchRes.results[0].id;
      await hsRequest("PATCH", `/crm/v3/objects/companies/${existingId}`, {
        properties,
      });
      return existingId;
    }

    // Create new company
    const created = (await hsRequest("POST", "/crm/v3/objects/companies", {
      properties,
    })) as { id: string };
    return created.id;
  } catch {
    return null;
  }
}

// ─── Contact Sync ─────────────────────────────────────────────────────────────

async function upsertContact(
  prospect: Prospect,
  companyId: string | null
): Promise<string | null> {
  const properties: Record<string, string> = {};

  if (prospect.contacto) {
    const parts = prospect.contacto.split(" ");
    properties.firstname = parts[0] ?? "";
    properties.lastname = parts.slice(1).join(" ");
  }
  if (prospect.email) properties.email = prospect.email;
  if (prospect.telefono) properties.phone = prospect.telefono;
  if (prospect.puesto) properties.jobtitle = prospect.puesto;
  if (prospect.linkedin_contacto)
    properties.linkedinbio = prospect.linkedin_contacto;
  if (prospect.empresa) properties.company = prospect.empresa;
  if (prospect.pais) properties.country = prospect.pais;
  if (prospect.ciudad) properties.city = prospect.ciudad;
  if (prospect.estado) properties.state = prospect.estado;
  if (prospect.notas) properties.notes_last_contacted = prospect.notas;

  // Custom SAT Connect properties
  if (prospect.perfil) properties.sat_prospect_profile = prospect.perfil;
  if (prospect.segmento?.length)
    properties.sat_segment = prospect.segmento.join("; ");
  if (prospect.motor_reservas)
    properties.sat_booking_engine = prospect.motor_reservas;

  if (!properties.email && !properties.firstname) return null;

  try {
    // Search by email to avoid duplicates
    let contactId: string | null = null;

    if (prospect.email) {
      const searchRes = (await hsRequest(
        "POST",
        "/crm/v3/objects/contacts/search",
        {
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "email",
                  operator: "EQ",
                  value: prospect.email,
                },
              ],
            },
          ],
          properties: ["email"],
          limit: 1,
        }
      )) as { results?: Array<{ id: string }> };

      if (searchRes?.results?.length) {
        contactId = searchRes.results[0].id;
        await hsRequest(
          "PATCH",
          `/crm/v3/objects/contacts/${contactId}`,
          { properties }
        );
      }
    }

    if (!contactId) {
      const created = (await hsRequest(
        "POST",
        "/crm/v3/objects/contacts",
        { properties }
      )) as { id: string };
      contactId = created.id;
    }

    // Associate contact ↔ company if we have both IDs
    if (contactId && companyId) {
      await hsRequest(
        "PUT",
        `/crm/v3/objects/contacts/${contactId}/associations/companies/${companyId}/contact_to_company`,
        {}
      ).catch(() => null); // non-fatal
    }

    return contactId;
  } catch {
    return null;
  }
}

// ─── Static List Management ───────────────────────────────────────────────────

async function getOrCreateList(listName: string): Promise<number | null> {
  try {
    // Create static list (HubSpot v1 API for list management)
    const created = (await hsRequest("POST", "/contacts/v1/lists", {
      name: listName,
      dynamic: false,
      filters: [],
    })) as { listId?: number };
    return created?.listId ?? null;
  } catch {
    return null;
  }
}

async function addContactsToList(
  listId: number,
  vidIds: string[]
): Promise<void> {
  if (!vidIds.length) return;
  // HubSpot v1 lists accept vids (legacy) or email-based contacts
  // Using contact IDs (object IDs) via batch add
  await hsRequest(`POST`, `/contacts/v1/lists/${listId}/add`, {
    vids: vidIds.map(Number).filter(Boolean),
  }).catch(() => null); // non-fatal — list may use new IDs
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Syncs a single prospect to HubSpot. Returns contact + company IDs. */
export async function syncProspect(
  prospectId: number
): Promise<HubSpotResult> {
  const prospect = await prisma.prospect.findUnique({
    where: { id: prospectId },
  });
  if (!prospect) return { error: "Prospect not found" };

  const companyId = await upsertCompany(prospect);
  const contactId = await upsertContact(prospect, companyId);

  if (!contactId && !companyId) {
    return { error: "Could not create contact or company in HubSpot" };
  }

  await prisma.prospect.update({
    where: { id: prospectId },
    data: {
      hubspot_contact_id: contactId ?? undefined,
      hubspot_company_id: companyId ?? undefined,
      hubspot_synced_at: new Date(),
    },
  });

  return { contactId: contactId ?? undefined, companyId: companyId ?? undefined };
}

/**
 * Syncs all prospects in a batch to HubSpot.
 * Creates a dated static list and adds all synced contacts to it.
 */
export async function syncBatch(batchId: number): Promise<BatchSyncResult> {
  const today = new Date().toISOString().slice(0, 10);
  const listName = `Prospectos SAT Connect - ${today}`;

  const prospects = await prisma.prospect.findMany({
    where: { batch_id: batchId },
    select: { id: true },
  });

  const errors: string[] = [];
  const syncedContactIds: string[] = [];
  let synced = 0;
  let failed = 0;

  for (const { id } of prospects) {
    const result = await syncProspect(id);
    if (result.error || (!result.contactId && !result.companyId)) {
      failed++;
      errors.push(`Prospect ${id}: ${result.error ?? "unknown error"}`);
    } else {
      synced++;
      if (result.contactId) syncedContactIds.push(result.contactId);
    }
  }

  // Add all synced contacts to a new static list
  let listId: number | undefined;
  if (syncedContactIds.length) {
    const id = await getOrCreateList(listName);
    if (id) {
      listId = id;
      await addContactsToList(id, syncedContactIds);
    }
  }

  return { synced, failed, errors, listId, listName };
}

/**
 * Generates a CSV string from all prospects in a batch.
 * Ready for HubSpot manual import.
 */
export async function generateExportCsv(batchId: number): Promise<string> {
  const prospects = await prisma.prospect.findMany({
    where: { batch_id: batchId },
    orderBy: { id: "asc" },
  });

  const headers = [
    "País",
    "Estado",
    "Ciudad",
    "Segmento",
    "Perfil",
    "Empresa",
    "Industria",
    "Tamaño Empresa",
    "Contacto",
    "Puesto",
    "LinkedIn Contacto",
    "LinkedIn Empresa",
    "Teléfono",
    "Email",
    "Página Web",
    "Motor de Reservas",
    "Notas",
  ];

  const rows = prospects.map((p) => [
    p.pais ?? "",
    p.estado ?? "",
    p.ciudad ?? "",
    (p.segmento ?? []).join("; "),
    p.perfil ?? "",
    p.empresa ?? "",
    (p.industria ?? []).join("; "),
    p.tamano_empresa ?? "",
    p.contacto ?? "",
    p.puesto ?? "",
    p.linkedin_contacto ?? "",
    p.linkedin_empresa ?? "",
    p.telefono ?? "",
    p.email ?? "",
    p.pagina_web ?? "",
    p.motor_reservas ?? "",
    p.notas ?? "",
  ]);

  const escape = (v: string) =>
    `"${v.replace(/"/g, '""')}"`;

  const lines = [
    headers.map(escape).join(","),
    ...rows.map((row) => row.map(escape).join(",")),
  ];

  return lines.join("\n");
}
