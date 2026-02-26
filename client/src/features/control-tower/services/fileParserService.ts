import Papa from "papaparse";
import type { IngestionParsedRow } from "@shared/types";

const COLUMN_ALIASES: Record<keyof Omit<IngestionParsedRow, "id">, string[]> = {
  timestamp: ["timestamp", "data", "date", "datetime", "event_at"],
  channel: ["channel", "canal", "origem", "source", "fonte"],
  professional: ["professional", "profissional", "dentista", "dentist", "doctor", "colaborador"],
  procedure: ["procedure", "procedimento", "servico", "service"],
  status: ["status", "situacao", "sit", "attendance_status"],
  pipeline: ["pipeline", "funil", "stage_pipeline"],
  unit: ["unit", "unidade", "clinic_unit", "filial"],
  entries: ["entries", "entradas", "receita", "inflow", "valor_entrada"],
  exits: ["exits", "saidas", "despesas", "outflow", "valor_saida"],
  slotsAvailable: ["slotsavailable", "slots_available", "slots", "agenda_slots", "disponiveis"],
  slotsEmpty: ["slotsempty", "slots_empty", "slots_vazios", "ociosos"],
  ticketMedio: ["ticketmedio", "ticket_medio", "ticket", "avg_ticket"],
  custoVariavel: ["custovariavel", "custo_variavel", "variable_cost", "cost"],
  durationMinutes: ["durationminutes", "duration_minutes", "duracao", "tempo_min"],
  materialList: ["materiallist", "material_list", "materiais", "insumos"],
  waitMinutes: ["waitminutes", "wait_minutes", "espera", "tempo_espera"],
  npsScore: ["npsscore", "nps_score", "nps", "satisfacao", "nota"],
  baseOldRevenueCurrent: ["baseoldrevenuecurrent", "base_old_revenue_current", "receita_base_antiga_atual"],
  baseOldRevenuePrevious: ["baseoldrevenueprevious", "base_old_revenue_previous", "receita_base_antiga_anterior"],
  crmLeadId: ["crmleadid", "crm_lead_id", "lead_id", "kommo_lead_id"],
  sourceType: ["sourcetype", "source_type", "origem_dado", "data_source_type"],
};

const STATUS_MAP: Array<{ values: string[]; status: IngestionParsedRow["status"] }> = [
  { values: ["noshow", "no-show", "nao compareceu", "faltou", "ausente"], status: "noshow" },
  { values: ["cancelado", "cancelada", "cancelled", "cancel"], status: "cancelado" },
  { values: ["realizado", "concluido", "completed", "done", "atendido"], status: "realizado" },
  { values: ["agendado", "scheduled", "pendente"], status: "agendado" },
];

export interface FileParserResult {
  fileType: "pdf" | "csv" | "xlsx";
  rows: IngestionParsedRow[];
  warnings: string[];
}

function normalize(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const raw = String(value ?? "").replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  const parsed = Number(raw.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toInt(value: unknown, fallback = 0): number {
  return Math.round(toNumber(value, fallback));
}

function normalizeStatus(value: unknown): IngestionParsedRow["status"] {
  const current = normalize(value);
  for (const map of STATUS_MAP) {
    if (map.values.some(item => current.includes(normalize(item)))) return map.status;
  }
  return "agendado";
}

function normalizeMaterials(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(item => String(item)).filter(Boolean);
  const text = String(value ?? "").trim();
  if (!text) return [];
  return text.split(/[;,|]/).map(item => item.trim()).filter(Boolean);
}

function findSourceKey(headers: string[], target: keyof Omit<IngestionParsedRow, "id">): string | null {
  const aliases = COLUMN_ALIASES[target];
  for (const header of headers) {
    const normalizedHeader = normalize(header).replace(/[^a-z0-9]/g, "");
    if (aliases.some(alias => normalizedHeader.includes(normalize(alias).replace(/[^a-z0-9]/g, "")))) {
      return header;
    }
  }
  return null;
}

function mapObjectToRow(record: Record<string, unknown>, index: number): IngestionParsedRow {
  const headers = Object.keys(record);
  const source: Partial<Record<keyof Omit<IngestionParsedRow, "id">, string>> = {};

  (Object.keys(COLUMN_ALIASES) as Array<keyof Omit<IngestionParsedRow, "id">>).forEach(target => {
    const key = findSourceKey(headers, target);
    if (key) source[target] = key;
  });

  const timestampValue = source.timestamp ? record[source.timestamp] : undefined;
  const rawTimestamp = String(timestampValue ?? "");
  const timestamp = rawTimestamp ? new Date(rawTimestamp) : new Date();
  const safeTimestamp = Number.isNaN(timestamp.getTime()) ? new Date() : timestamp;

  return {
    id: `row-${index + 1}`,
    timestamp: safeTimestamp.toISOString(),
    channel: String((source.channel ? record[source.channel] : "") || "unknown"),
    professional: String((source.professional ? record[source.professional] : "") || "unassigned"),
    procedure: String((source.procedure ? record[source.procedure] : "") || "general"),
    status: normalizeStatus(source.status ? record[source.status] : "agendado"),
    pipeline: String((source.pipeline ? record[source.pipeline] : "") || "").trim() || undefined,
    unit: String((source.unit ? record[source.unit] : "") || "").trim() || undefined,
    entries: toNumber(source.entries ? record[source.entries] : 0),
    exits: toNumber(source.exits ? record[source.exits] : 0),
    slotsAvailable: toInt(source.slotsAvailable ? record[source.slotsAvailable] : 0),
    slotsEmpty: toInt(source.slotsEmpty ? record[source.slotsEmpty] : 0),
    ticketMedio: toNumber(source.ticketMedio ? record[source.ticketMedio] : 0),
    custoVariavel: toNumber(source.custoVariavel ? record[source.custoVariavel] : 0),
    durationMinutes: toInt(source.durationMinutes ? record[source.durationMinutes] : 0),
    materialList: normalizeMaterials(source.materialList ? record[source.materialList] : ""),
    waitMinutes: toInt(source.waitMinutes ? record[source.waitMinutes] : 0),
    npsScore: toInt(source.npsScore ? record[source.npsScore] : 0),
    baseOldRevenueCurrent: toNumber(source.baseOldRevenueCurrent ? record[source.baseOldRevenueCurrent] : 0),
    baseOldRevenuePrevious: toNumber(source.baseOldRevenuePrevious ? record[source.baseOldRevenuePrevious] : 0),
    crmLeadId: String((source.crmLeadId ? record[source.crmLeadId] : "") || "").trim() || undefined,
    sourceType: ((): IngestionParsedRow["sourceType"] => {
      const raw = String((source.sourceType ? record[source.sourceType] : "") || "").trim().toLowerCase();
      if (raw === "crm" || raw === "api" || raw === "webhook" || raw === "manual" || raw === "upload") return raw;
      return undefined;
    })(),
  };
}

export function parseCsvContent(content: string): IngestionParsedRow[] {
  const parsed = Papa.parse<Record<string, unknown>>(content, {
    header: true,
    skipEmptyLines: true,
  });
  return parsed.data.map((record, index) => mapObjectToRow(record, index));
}

export function parsePdfTextContent(content: string): IngestionParsedRow[] {
  const lines = content
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];

  const separator = lines[0]!.includes(";") ? ";" : lines[0]!.includes("|") ? "|" : "\t";
  const header = lines[0]!.split(separator).map(item => item.trim());
  const records = lines.slice(1).map(line => {
    const values = line.split(separator).map(item => item.trim());
    const record: Record<string, unknown> = {};
    header.forEach((key, idx) => {
      record[key] = values[idx] ?? "";
    });
    return record;
  });

  return records.map((record, index) => mapObjectToRow(record, index));
}

export async function parseIngestionFile(file: File): Promise<FileParserResult> {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const warnings: string[] = [];

  if (extension === "csv") {
    const buffer = await file.arrayBuffer();
    const content = new TextDecoder("utf-8").decode(buffer);
    return {
      fileType: "csv",
      rows: parseCsvContent(content),
      warnings,
    };
  }

  if (extension === "xlsx" || extension === "xls") {
    warnings.push("Upload .xlsx/.xls temporariamente desabilitado por seguranca. Exporte a planilha como .csv e tente novamente.");
    return {
      fileType: "xlsx",
      rows: [],
      warnings,
    };
  }

  if (extension === "pdf") {
    const buffer = await file.arrayBuffer();
    const content = new TextDecoder("latin1").decode(buffer);
    const rows = parsePdfTextContent(content);
    if (rows.length === 0) {
      warnings.push("PDF sem estrutura tabular detectada. Use PDF textual com delimitadores.");
    }
    return {
      fileType: "pdf",
      rows,
      warnings,
    };
  }

  warnings.push("Tipo de arquivo nao suportado. Somente .pdf e .csv.");
  return { fileType: "csv", rows: [], warnings };
}
