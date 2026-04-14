"use client";

/**
 * UploadCenter.tsx
 * SAT Connect — B2B Load Center
 * Glassmorphism + Clean Tech-Global aesthetic
 * Abyssal Teal #0F2F35 · Neon Mint #00FFC2
 */

import { useCallback, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Prospect {
  id: number;
  empresa?: string | null;
  contacto?: string | null;
  email?: string | null;
  pagina_web?: string | null;
  motor_reservas?: string | null;
  is_enriched: boolean;
  enrich_status?: Record<string, string> | null;
}

interface BatchMeta {
  batchId: number;
  total: number;
  filename: string;
}

interface EnrichFieldEvent {
  type: "field" | "start" | "done" | "error";
  prospectId?: number;
  field?: string;
  status?: "pending" | "found" | "not_found" | "skipped";
  value?: string;
  enriched?: number;
  total?: number;
}

interface HubSpotResult {
  synced: number;
  failed: number;
  listName: string;
  errors?: string[];
}

type AppStep = "idle" | "uploading" | "uploaded" | "enriching" | "done";

// ─── Constants ────────────────────────────────────────────────────────────────

const FIELD_LABELS: Record<string, string> = {
  pais: "País",
  estado: "Estado",
  ciudad: "Ciudad",
  empresa: "Empresa",
  pagina_web: "Web",
  telefono: "Tel",
  email: "Email",
  linkedin_empresa: "LI Empresa",
  linkedin_contacto: "LI Contacto",
  motor_reservas: "Motor",
  puesto: "Puesto",
  contacto: "Contacto",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    found: { label: "✓", cls: "bg-[#00FFC2]/20 text-[#00FFC2]" },
    not_found: { label: "✗", cls: "bg-red-500/20 text-red-400" },
    pending: { label: "…", cls: "bg-yellow-400/20 text-yellow-300 animate-pulse" },
    skipped: { label: "—", cls: "bg-white/10 text-white/40" },
  };
  const cfg = map[status] ?? { label: status, cls: "bg-white/10 text-white/40" };
  return (
    <span
      className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold ${cfg.cls}`}
    >
      {cfg.label}
    </span>
  );
}

function ProgressRing({
  value,
  total,
}: {
  value: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="relative flex items-center justify-center w-16 h-16">
      <svg className="absolute" width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#ffffff10" strokeWidth="4" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="#00FFC2"
          strokeWidth="4"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.4s ease", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
        />
      </svg>
      <span className="text-sm font-bold text-[#00FFC2]">{pct}%</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function UploadCenter() {
  const [step, setStep] = useState<AppStep>("idle");
  const [batch, setBatch] = useState<BatchMeta | null>(null);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [enrichedCount, setEnrichedCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [hsResult, setHsResult] = useState<HubSpotResult | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Upload ──────────────────────────────────────────────────────────────────

  const handleFile = useCallback(async (file: File) => {
    setUploadError(null);
    setStep("uploading");

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/prospects/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error ?? "Error al subir el archivo");
        setStep("idle");
        return;
      }

      setBatch({ batchId: data.batchId, total: data.total, filename: data.filename });

      // Fetch prospect rows for display (initial snapshot)
      const prospectsRes = await fetch(`/api/prospects/batch/${data.batchId}`);
      if (prospectsRes.ok) {
        const rows = await prospectsRes.json();
        setProspects(rows);
      }

      setStep("uploaded");
    } catch {
      setUploadError("Error de conexión. Intenta de nuevo.");
      setStep("idle");
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  // ─── Enrichment (SSE) ────────────────────────────────────────────────────────

  const startEnrichment = useCallback(async () => {
    if (!batch) return;
    setStep("enriching");
    setEnrichedCount(0);

    const source = new EventSource(`/api/prospects/enrich/${batch.batchId}`);

    source.onmessage = (evt) => {
      const event: EnrichFieldEvent = JSON.parse(evt.data);

      if (event.type === "field" && event.prospectId && event.field && event.status) {
        const { prospectId, field, status, value } = event;
        setProspects((prev) =>
          prev.map((p) => {
            if (p.id !== prospectId) return p;
            return {
              ...p,
              [field]: value ?? p[field as keyof Prospect],
              enrich_status: { ...(p.enrich_status ?? {}), [field]: status },
            };
          })
        );
      }

      if (event.type === "done") {
        setEnrichedCount(event.enriched ?? batch.total);
        setStep("done");
        source.close();
      }

      if (event.type === "error") {
        setStep("done");
        source.close();
      }
    };

    source.onerror = () => {
      setStep("done");
      source.close();
    };
  }, [batch]);

  // ─── CSV Export ──────────────────────────────────────────────────────────────

  const downloadCsv = () => {
    if (!batch) return;
    window.open(`/api/prospects/export/${batch.batchId}`, "_blank");
  };

  // ─── HubSpot Sync ─────────────────────────────────────────────────────────────

  const syncHubSpot = async () => {
    if (!batch || isSyncing) return;
    setIsSyncing(true);
    try {
      const res = await fetch(`/api/prospects/hubspot/sync/${batch.batchId}`, {
        method: "POST",
      });
      const data = await res.json();
      setHsResult(data);
    } catch {
      setHsResult({ synced: 0, failed: 0, listName: "", errors: ["Error de conexión"] });
    } finally {
      setIsSyncing(false);
    }
  };

  // ─── Reset ───────────────────────────────────────────────────────────────────

  const reset = () => {
    setStep("idle");
    setBatch(null);
    setProspects([]);
    setEnrichedCount(0);
    setHsResult(null);
    setUploadError(null);
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "linear-gradient(135deg, #0A1F26 0%, #0F2F35 50%, #0D2830 100%)" }}
    >
      {/* Header */}
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #00FFC2, #00B48A)" }}
            >
              <svg
                className="w-5 h-5 text-[#0F2F35]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 8l-3-3m3 3l3-3"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Load Center{" "}
                <span className="text-[#00FFC2]">B2B</span>
              </h1>
              <p className="text-sm text-white/50">
                Ingesta · Enriquecimiento · HubSpot Sync
              </p>
            </div>
          </div>

          {step !== "idle" && (
            <button
              onClick={reset}
              className="text-sm text-white/40 hover:text-white/80 border border-white/10 hover:border-white/30 px-4 py-1.5 rounded-lg transition-all"
            >
              ↩ Nuevo lote
            </button>
          )}
        </div>

        {/* Progress steps pill */}
        <div className="mt-4 flex items-center gap-1 text-xs text-white/40">
          {(["Subir", "Enriquecer", "Exportar"] as const).map((label, i) => {
            const active = (i === 0 && (step === "idle" || step === "uploading" || step === "uploaded")) ||
              (i === 1 && step === "enriching") ||
              (i === 2 && step === "done");
            return (
              <span key={label} className="flex items-center gap-1">
                <span className={`px-2 py-0.5 rounded-full ${active ? "bg-[#00FFC2]/20 text-[#00FFC2] font-semibold" : ""}`}>
                  {label}
                </span>
                {i < 2 && <span>→</span>}
              </span>
            );
          })}
        </div>
      </div>

      <div className="px-6 max-w-7xl mx-auto pb-16 space-y-6">
        {/* ── IDLE: Drop zone ───────────────────────────────────────────────── */}
        {(step === "idle" || step === "uploading") && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className="relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300"
            style={{
              borderColor: isDragging ? "#00FFC2" : "rgba(255,255,255,0.15)",
              background: isDragging
                ? "rgba(0,255,194,0.06)"
                : "rgba(255,255,255,0.03)",
              backdropFilter: "blur(12px)",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <div className="py-20 flex flex-col items-center gap-4 select-none">
              {step === "uploading" ? (
                <>
                  <div className="w-12 h-12 border-2 border-[#00FFC2] border-t-transparent rounded-full animate-spin" />
                  <p className="text-white/60">Procesando archivo…</p>
                </>
              ) : (
                <>
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(0,255,194,0.1)" }}
                  >
                    <svg className="w-8 h-8 text-[#00FFC2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-white">
                      Arrastra tu base de prospectos aquí
                    </p>
                    <p className="text-sm text-white/40 mt-1">
                      Compatible con <span className="text-[#00FFC2]">.xlsx</span>,{" "}
                      <span className="text-[#00FFC2]">.xls</span>,{" "}
                      <span className="text-[#00FFC2]">.csv</span> · El mapeo de columnas es automático
                    </p>
                  </div>
                  <button
                    className="mt-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-[#0F2F35] transition-all hover:scale-105 active:scale-95"
                    style={{ background: "linear-gradient(135deg, #00FFC2, #00B48A)" }}
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  >
                    Seleccionar archivo
                  </button>
                </>
              )}
            </div>
            {uploadError && (
              <p className="text-center text-red-400 text-sm pb-4">{uploadError}</p>
            )}
          </div>
        )}

        {/* ── UPLOADED: Ready to enrich ─────────────────────────────────────── */}
        {step === "uploaded" && batch && (
          <div className="rounded-2xl p-6 flex items-center justify-between"
            style={{ background: "rgba(0,255,194,0.06)", border: "1px solid rgba(0,255,194,0.2)", backdropFilter: "blur(12px)" }}>
            <div>
              <p className="text-[#00FFC2] font-semibold">
                ✓ {batch.filename} cargado
              </p>
              <p className="text-sm text-white/50 mt-0.5">
                {batch.total} prospectos detectados — listos para enriquecimiento
              </p>
            </div>
            <button
              onClick={startEnrichment}
              className="px-6 py-3 rounded-xl font-bold text-[#0F2F35] transition-all hover:scale-105 active:scale-95 shadow-lg"
              style={{ background: "linear-gradient(135deg, #00FFC2, #00B48A)", boxShadow: "0 4px 20px rgba(0,255,194,0.3)" }}
            >
              🚀 Iniciar Enriquecimiento
            </button>
          </div>
        )}

        {/* ── ENRICHING: Progress header ────────────────────────────────────── */}
        {(step === "enriching" || step === "done") && batch && (
          <div className="rounded-2xl p-5 flex items-center justify-between"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}>
            <div className="flex items-center gap-4">
              <ProgressRing value={enrichedCount} total={batch.total} />
              <div>
                <p className="font-semibold text-white">
                  {step === "done" ? "✓ Enriquecimiento completado" : "Enriqueciendo…"}
                </p>
                <p className="text-sm text-white/50">
                  {enrichedCount} / {batch.total} prospectos procesados
                </p>
              </div>
            </div>

            {step === "done" && (
              <div className="flex items-center gap-3">
                <button
                  onClick={downloadCsv}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-[#00FFC2]/40 text-[#00FFC2] hover:bg-[#00FFC2]/10 transition-all"
                >
                  ⬇ Descargar CSV
                </button>
                <button
                  onClick={syncHubSpot}
                  disabled={isSyncing}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm text-[#0F2F35] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-wait"
                  style={{ background: "linear-gradient(135deg, #00FFC2, #00B48A)" }}
                >
                  {isSyncing ? "Sincronizando…" : "⚡ Sincronizar con HubSpot"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── HubSpot result banner ─────────────────────────────────────────── */}
        {hsResult && (
          <div
            className="rounded-2xl px-6 py-4 flex items-start gap-4"
            style={{
              background: hsResult.failed > 0 ? "rgba(239,68,68,0.08)" : "rgba(0,255,194,0.08)",
              border: `1px solid ${hsResult.failed > 0 ? "rgba(239,68,68,0.3)" : "rgba(0,255,194,0.3)"}`,
            }}
          >
            <div className="text-2xl">{hsResult.failed > 0 ? "⚠️" : "✅"}</div>
            <div>
              <p className="font-semibold text-white">
                HubSpot Sync: {hsResult.synced} sincronizados · {hsResult.failed} fallidos
              </p>
              <p className="text-sm text-white/50 mt-0.5">
                Lista creada:{" "}
                <span className="text-[#00FFC2]">{hsResult.listName}</span>
              </p>
              {hsResult.errors?.length ? (
                <p className="text-xs text-red-400 mt-1">
                  {hsResult.errors.slice(0, 3).join(" · ")}
                </p>
              ) : null}
            </div>
          </div>
        )}

        {/* ── Prospects Table ───────────────────────────────────────────────── */}
        {prospects.length > 0 && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="font-semibold text-white">
                Prospectos{" "}
                <span className="text-white/40 font-normal text-sm ml-1">
                  ({prospects.length} filas)
                </span>
              </h2>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#00FFC2]" /> Encontrado
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-400" /> No encontrado
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white/20" /> Pendiente
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-4 py-3 text-white/40 font-medium whitespace-nowrap">
                      Empresa
                    </th>
                    <th className="text-left px-4 py-3 text-white/40 font-medium whitespace-nowrap">
                      Contacto
                    </th>
                    <th className="text-left px-4 py-3 text-white/40 font-medium whitespace-nowrap">
                      Email
                    </th>
                    <th className="text-left px-4 py-3 text-white/40 font-medium whitespace-nowrap">
                      Web
                    </th>
                    <th className="text-left px-4 py-3 text-white/40 font-medium whitespace-nowrap">
                      Motor
                    </th>
                    {/* Enrichment field status columns */}
                    {Object.entries(FIELD_LABELS)
                      .slice(0, 6)
                      .map(([key, label]) => (
                        <th
                          key={key}
                          className="text-center px-2 py-3 text-white/30 font-medium whitespace-nowrap text-xs"
                        >
                          {label}
                        </th>
                      ))}
                    <th className="text-center px-4 py-3 text-white/40 font-medium whitespace-nowrap">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prospects.map((p, idx) => (
                    <tr
                      key={p.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <td className="px-4 py-3 font-medium text-white max-w-[160px] truncate">
                        {p.empresa ?? <span className="text-white/20 italic">vacío</span>}
                      </td>
                      <td className="px-4 py-3 text-white/70 whitespace-nowrap">
                        {p.contacto ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-white/60 font-mono text-xs max-w-[180px] truncate">
                        {p.email ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-[#00FFC2]/70 text-xs max-w-[140px] truncate">
                        {p.pagina_web ? (
                          <a
                            href={p.pagina_web}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#00FFC2] transition-colors"
                          >
                            {p.pagina_web.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                          </a>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {p.motor_reservas ? (
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              background: p.motor_reservas === "(no encontrado)"
                                ? "rgba(239,68,68,0.15)"
                                : "rgba(0,255,194,0.15)",
                              color: p.motor_reservas === "(no encontrado)"
                                ? "rgb(252,165,165)"
                                : "#00FFC2",
                            }}
                          >
                            {p.motor_reservas}
                          </span>
                        ) : "—"}
                      </td>
                      {/* Enrichment field badges */}
                      {Object.keys(FIELD_LABELS)
                        .slice(0, 6)
                        .map((key) => (
                          <td key={key} className="px-2 py-3 text-center">
                            {p.enrich_status?.[key] ? (
                              <StatusBadge status={p.enrich_status[key]} />
                            ) : (
                              <span className="text-white/10">·</span>
                            )}
                          </td>
                        ))}
                      <td className="px-4 py-3 text-center">
                        {p.is_enriched ? (
                          <span className="text-[#00FFC2] text-xs font-semibold">✓ Listo</span>
                        ) : step === "enriching" ? (
                          <span className="inline-block w-3 h-3 border border-[#00FFC2] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span className="text-white/20 text-xs">Pendiente</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
