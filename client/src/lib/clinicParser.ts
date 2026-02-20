import * as XLSX from "xlsx";

/* ─── COLUMN MAP: flexible column name detection ─── */
const COLUMN_MAP: Record<string, string[]> = {
  faturamento: ["faturamento", "receita", "valor pago", "valor recebido", "total", "valor consulta", "revenue", "payment", "pago"],
  custo: ["custo", "despesa", "gasto", "expense", "cost", "despesas"],
  status: ["status", "situação", "situacao", "resultado", "outcome", "atendimento", "presença", "presenca"],
  paciente: ["paciente", "nome", "patient", "name", "cliente", "client"],
  data: ["data", "date", "dia", "data atendimento", "data consulta"],
  motivo_cancelamento: ["motivo", "motivo cancelamento", "reason", "justificativa", "causa", "motivo falta"],
  investimento_ads: ["investimento", "ads", "gasto ads", "budget", "verba", "gasto campanha", "custo ads", "meta ads", "google ads"],
  canal: ["canal", "origem", "source", "channel", "mídia", "midia"],
  leads: ["leads", "contatos", "prospects", "novos leads", "captações"],
};

const NOSHOW_VALUES = ["faltou", "no-show", "noshow", "não compareceu", "ausente", "nao compareceu", "não veio", "falta", "absent"];
const CANCELADO_VALUES = ["cancelado", "cancelada", "cancelamento", "canceled", "cancelled", "desmarcado", "desmarcada"];
const REALIZADO_VALUES = ["realizado", "compareceu", "atendido", "concluído", "concluido", "presente", "done", "completed", "ok", "feito"];

function normalize(str: string): string {
  if (!str) return "";
  return String(str).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, "").trim();
}

function detectColumn(header: string): string | null {
  const norm = normalize(header);
  for (const [key, synonyms] of Object.entries(COLUMN_MAP)) {
    if (synonyms.some(s => norm.includes(normalize(s)))) return key;
  }
  return null;
}

function detectStatus(value: string): "no-show" | "cancelado" | "realizado" | "desconhecido" {
  const norm = normalize(value);
  if (NOSHOW_VALUES.some(v => norm.includes(normalize(v)))) return "no-show";
  if (CANCELADO_VALUES.some(v => norm.includes(normalize(v)))) return "cancelado";
  if (REALIZADO_VALUES.some(v => norm.includes(normalize(v)))) return "realizado";
  return "desconhecido";
}

export interface ParseResult {
  faturamento_bruto: number;
  total_pacientes: number;
  no_shows_abs: number;
  cancelamentos: number;
  investimento_ads: number;
  leads: number;
  pareto: Record<string, number>;
  pareto_array: { motivo: string; freq: number }[];
  canais: Record<string, number>;
  colunas_detectadas: string[];
  colunas_nao_reconhecidas: string[];
  total_linhas: number;
}

export async function parseClinicFile(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (!rows.length) { reject(new Error("Planilha vazia ou sem dados reconhecíveis.")); return; }

        const headers = Object.keys(rows[0]);
        const columnMapping: Record<string, string> = {};
        const unmappedColumns: string[] = [];

        headers.forEach(h => {
          const key = detectColumn(h);
          if (key) columnMapping[h] = key;
          else unmappedColumns.push(h);
        });

        const result: ParseResult = {
          faturamento_bruto: 0, total_pacientes: 0, no_shows_abs: 0, cancelamentos: 0,
          investimento_ads: 0, leads: 0, pareto: {}, pareto_array: [], canais: {},
          colunas_detectadas: Object.values(columnMapping), colunas_nao_reconhecidas: unmappedColumns,
          total_linhas: rows.length,
        };

        rows.forEach((row) => {
          const rowData: Record<string, any> = {};
          for (const [originalCol, internalKey] of Object.entries(columnMapping)) {
            rowData[internalKey] = row[originalCol];
          }

          if (rowData.faturamento !== undefined) {
            const val = parseFloat(String(rowData.faturamento).replace(/[^0-9.,]/g, "").replace(",", "."));
            if (!isNaN(val)) result.faturamento_bruto += val;
          }

          if (rowData.status !== undefined || rowData.paciente !== undefined) {
            result.total_pacientes++;
            const statusRaw = rowData.status || "";
            const statusType = detectStatus(statusRaw);
            if (statusType === "no-show" || statusType === "cancelado") {
              result.no_shows_abs++;
              if (statusType === "cancelado") result.cancelamentos++;
              const motivo = normalize(rowData.motivo_cancelamento) || "não identificado";
              result.pareto[motivo] = (result.pareto[motivo] || 0) + 1;
            }
          }

          if (rowData.canal !== undefined) {
            const canal = String(rowData.canal).trim() || "Desconhecido";
            result.canais[canal] = (result.canais[canal] || 0) + 1;
          }

          if (rowData.investimento_ads !== undefined) {
            const val = parseFloat(String(rowData.investimento_ads).replace(/[^0-9.,]/g, "").replace(",", "."));
            if (!isNaN(val)) result.investimento_ads += val;
          }

          if (rowData.leads !== undefined) {
            const val = parseInt(rowData.leads);
            if (!isNaN(val)) result.leads += val;
          }
        });

        result.pareto_array = Object.entries(result.pareto)
          .map(([motivo, freq]) => ({ motivo, freq }))
          .sort((a, b) => b.freq - a.freq);

        resolve(result);
      } catch (err: any) {
        reject(new Error("Erro ao processar arquivo: " + err.message));
      }
    };
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo."));
    reader.readAsArrayBuffer(file);
  });
}

export function buildRoutingLog(parsed: ParseResult, cac?: number): string[] {
  const steps: string[] = [];
  steps.push(`Arquivo reconhecido: ${parsed.total_linhas} linhas analisadas`);
  steps.push(`Colunas identificadas: [${parsed.colunas_detectadas.join(", ")}]`);
  if (parsed.colunas_nao_reconhecidas.length)
    steps.push(`Colunas ignoradas (não reconhecidas): [${parsed.colunas_nao_reconhecidas.join(", ")}]`);
  if (parsed.faturamento_bruto > 0)
    steps.push(`=> Roteando faturamento (R$ ${parsed.faturamento_bruto.toLocaleString("pt-BR")}) → Dashboard Principal`);
  if (parsed.total_pacientes > 0)
    steps.push(`=> Roteando ${parsed.total_pacientes} pacientes → Agenda & Capacidade`);
  if (parsed.no_shows_abs > 0)
    steps.push(`=> Roteando ${parsed.no_shows_abs} no-shows → Pareto de Cancelamentos (OKRs/Sprints)`);
  if (parsed.investimento_ads > 0 && cac !== undefined)
    steps.push(`=> Roteando investimento em Ads → Canais de Aquisição (CAC calculado: R$ ${cac})`);
  if (Object.keys(parsed.canais).length)
    steps.push(`=> Roteando canais de origem → Funil Comercial`);
  steps.push(`Roteamento finalizado. Dashboard atualizado com sucesso.`);
  return steps;
}

export function buildWarnings(parsed: ParseResult): string[] {
  const warnings: string[] = [];
  const motivo_desconhecido = parsed.pareto["não identificado"] || 0;
  if (motivo_desconhecido > 0)
    warnings.push(`${motivo_desconhecido} cancelamentos sem motivo identificado — preencha a coluna "Motivo" na planilha.`);
  if (parsed.colunas_nao_reconhecidas.length > 0)
    warnings.push(`Colunas não reconhecidas foram ignoradas: ${parsed.colunas_nao_reconhecidas.join(", ")}`);
  const taxa_noshow = parsed.no_shows_abs / (parsed.total_pacientes || 1);
  if (taxa_noshow > 0.1)
    warnings.push(`Taxa de No-Show acima de 10% (${(taxa_noshow * 100).toFixed(1)}%) — acione um Sprint de redução.`);
  return warnings;
}
