/**
 * POST /api/prospects/upload
 * Accepts multipart/form-data with a .xlsx or .csv file.
 * Parses, normalises columns, creates ProspectBatch + N Prospect rows.
 */

import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Column fuzzy-mapping ─────────────────────────────────────────────────────
// Maps common header variations → canonical DB field name

const COLUMN_MAP: Record<string, string> = {
  // Pais
  país: "pais", pais: "pais", country: "pais",
  // Estado
  estado: "estado", state: "estado", province: "estado",
  // Ciudad
  ciudad: "ciudad", city: "ciudad",
  // Segmento
  segmento: "segmento", segment: "segmento", "tipo de experiencia": "segmento",
  // Perfil
  perfil: "perfil", profile: "perfil",
  // Empresa
  empresa: "empresa", company: "empresa", "nombre comercial": "empresa", "nombre de empresa": "empresa",
  // Industria
  industria: "industria", industry: "industria",
  // Tamaño empresa
  "tamaño empresa": "tamano_empresa", "tamano empresa": "tamano_empresa",
  "tamaño de empresa": "tamano_empresa", "company size": "tamano_empresa", employees: "tamano_empresa",
  // Contacto
  contacto: "contacto", contact: "contacto", nombre: "contacto", "nombre completo": "contacto",
  // Puesto
  puesto: "puesto", cargo: "puesto", position: "puesto", jobtitle: "puesto", "job title": "puesto",
  // LinkedIn contacto
  "linkedin contacto": "linkedin_contacto", "linkedin del contacto": "linkedin_contacto",
  "linkedin contact": "linkedin_contacto",
  // LinkedIn empresa
  "linkedin empresa": "linkedin_empresa", "linkedin de la empresa": "linkedin_empresa",
  "linkedin company": "linkedin_empresa",
  // Teléfono
  teléfono: "telefono", telefono: "telefono", phone: "telefono", tel: "telefono",
  // Email
  email: "email", correo: "email", "correo electrónico": "email", "e-mail": "email",
  // Página web
  "página web": "pagina_web", "pagina web": "pagina_web", website: "pagina_web", web: "pagina_web",
  url: "pagina_web",
  // Motor de reservas
  "motor de reservas": "motor_reservas", "booking engine": "motor_reservas",
  "sistema de reservas": "motor_reservas",
  // Notas
  notas: "notas", notes: "notas", comentarios: "notas",
};

const ARRAY_FIELDS = new Set(["segmento", "industria"]);
const PROFILE_VALUES = new Set(["STANDARD", "PRO", "PREMIUM"]);

function normalizeKey(header: string): string {
  return header.trim().toLowerCase().replace(/\s+/g, " ");
}

function parseArrayField(value: string): string[] {
  return value
    .split(/[,;|\/]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function parseProfile(value: string): "STANDARD" | "PRO" | "PREMIUM" {
  const upper = value.toUpperCase().trim();
  if (PROFILE_VALUES.has(upper)) return upper as "STANDARD" | "PRO" | "PREMIUM";
  return "STANDARD";
}

function mapRow(
  rawRow: Record<string, string>
): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};

  for (const [rawKey, rawValue] of Object.entries(rawRow)) {
    const normalised = normalizeKey(rawKey);
    const dbField = COLUMN_MAP[normalised];
    if (!dbField || rawValue === undefined || rawValue === null) continue;

    const val = String(rawValue).trim();
    if (!val) continue;

    if (ARRAY_FIELDS.has(dbField)) {
      mapped[dbField] = parseArrayField(val);
    } else if (dbField === "perfil") {
      mapped[dbField] = parseProfile(val);
    } else {
      mapped[dbField] = val;
    }
  }

  return mapped;
}

// ─── Route Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext ?? "")) {
      return NextResponse.json(
        { error: "Only .xlsx, .xls, or .csv files are accepted" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Parse with xlsx (handles both XLSX and CSV)
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonRows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
      defval: "",
      raw: false,
    });

    if (!jsonRows.length) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 });
    }

    // Create batch record
    const batch = await prisma.prospectBatch.create({
      data: {
        filename: file.name,
        status: "PENDING",
        total: jsonRows.length,
        enriched: 0,
      },
    });

    // Map and insert all rows
    const createData = jsonRows.map((row) => ({
      batch_id: batch.id,
      ...mapRow(row),
    }));

    await prisma.prospect.createMany({
      data: createData as Prisma.ProspectCreateManyInput[],
    });

    return NextResponse.json({
      batchId: batch.id,
      total: jsonRows.length,
      filename: file.name,
    });
  } catch (err) {
    console.error("[upload] Error:", err);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}
