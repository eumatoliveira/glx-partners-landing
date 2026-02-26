import { useMemo, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import type { IngestionParsedRow } from "@shared/types";
import type { Language } from "@/i18n";
import type { ControlTowerLocale } from "@/lib/controlTowerLocale";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { parseIngestionFile } from "../services/fileParserService";
import { Panel } from "./shared";
import FormulaTooltip from "./FormulaTooltip";

interface DataIngestionProps {
  language: Language;
  locale: ControlTowerLocale;
  onCommitted?: () => void;
}

type EditableKey =
  | "timestamp"
  | "channel"
  | "professional"
  | "procedure"
  | "status"
  | "entries"
  | "exits"
  | "slotsAvailable"
  | "slotsEmpty"
  | "ticketMedio";

const VALID_STATUS: IngestionParsedRow["status"][] = ["agendado", "realizado", "cancelado", "noshow"];

export default function DataIngestion({ language, locale, onCommitted }: DataIngestionProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [rows, setRows] = useState<IngestionParsedRow[]>([]);
  const [fileType, setFileType] = useState<"pdf" | "csv" | "xlsx">("csv");
  const [fileName, setFileName] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);

  const commitMutation = trpc.controlTower.commitIngestionBatch.useMutation({
    onSuccess: () => {
      toast.success(locale.parser.commitSuccess);
      onCommitted?.();
    },
    onError: () => {
      toast.error(locale.parser.commitError);
    },
  });

  const visibleRows = useMemo(() => rows.slice(0, 120), [rows]);

  const parseFile = async (file: File) => {
    setIsParsing(true);
    try {
      const parsed = await parseIngestionFile(file);
      setRows(parsed.rows);
      setWarnings(parsed.warnings);
      setFileType(parsed.fileType);
      setFileName(file.name);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    await parseFile(file);
  };

  const updateCell = (rowId: string, key: EditableKey, value: string) => {
    setRows(prev =>
      prev.map(row => {
        if (row.id !== rowId) return row;
        if (key === "entries" || key === "exits" || key === "ticketMedio") {
          const parsed = Number(value.replace(",", "."));
          return { ...row, [key]: Number.isFinite(parsed) ? parsed : 0 };
        }
        if (key === "slotsAvailable" || key === "slotsEmpty") {
          const parsed = Number(value);
          return { ...row, [key]: Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0 };
        }
        if (key === "status") {
          const normalized = VALID_STATUS.includes(value as IngestionParsedRow["status"]) ? (value as IngestionParsedRow["status"]) : "agendado";
          return { ...row, status: normalized };
        }
        return { ...row, [key]: value } as IngestionParsedRow;
      }),
    );
  };

  const handleCommit = async () => {
    if (rows.length === 0) {
      toast.error(locale.parser.noRows);
      return;
    }
    await commitMutation.mutateAsync({
      fileName: fileName || `upload-${Date.now()}.${fileType}`,
      fileType,
      rows,
      metadata: {
        warningCount: warnings.length,
      },
    });
  };

  return (
    <Panel title={locale.parser.title} metricKey="faturamento_liquido" language={language}>
      <p className="mb-3 text-xs text-slate-300">{locale.parser.subtitle}</p>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition ${
          isDragOver ? "border-orange-500 bg-orange-500/10" : "border-slate-700 bg-slate-900/70"
        }`}
      >
        <UploadCloud className="mx-auto h-6 w-6 text-orange-400" />
        <p className="mt-2 text-sm font-medium text-slate-100">{locale.parser.dropTitle}</p>
        <p className="text-xs text-slate-400">{locale.parser.dropSubtitle}</p>
        {isParsing ? <p className="mt-2 text-xs text-orange-300">{locale.parser.parsing}</p> : null}
        {fileName ? <p className="mt-2 text-xs text-cyan-300">{fileName}</p> : null}
        <input
          ref={inputRef}
          hidden
          type="file"
          accept=".pdf,.csv"
          onChange={async event => {
            const file = event.target.files?.[0];
            if (file) await parseFile(file);
          }}
        />
      </div>

      {warnings.length > 0 ? (
        <div className="mt-3 space-y-1 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-200">
          {warnings.map((warning, index) => (
            <p key={`${warning}-${index}`}>- {warning}</p>
          ))}
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span>{locale.parser.parsedRows}: {rows.length}</span>
          <FormulaTooltip metricKey="faturamento_liquido" language={language} />
        </div>
        <button
          type="button"
          onClick={handleCommit}
          disabled={commitMutation.isPending || rows.length === 0}
          className="rounded-md bg-orange-500 px-3 py-2 text-xs font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
        >
          {commitMutation.isPending ? locale.actions.refreshing : locale.parser.commit}
        </button>
      </div>

      <div className="mt-3 overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-900">
            <tr className="text-left text-slate-300">
              <th className="px-2 py-2">{locale.parser.columns.timestamp}</th>
              <th className="px-2 py-2">{locale.parser.columns.channel}</th>
              <th className="px-2 py-2">{locale.parser.columns.professional}</th>
              <th className="px-2 py-2">{locale.parser.columns.procedure}</th>
              <th className="px-2 py-2">{locale.parser.columns.status}</th>
              <th className="px-2 py-2">{locale.parser.columns.entries}</th>
              <th className="px-2 py-2">{locale.parser.columns.exits}</th>
              <th className="px-2 py-2">{locale.parser.columns.slotsAvailable}</th>
              <th className="px-2 py-2">{locale.parser.columns.slotsEmpty}</th>
              <th className="px-2 py-2">{locale.parser.columns.ticketMedio}</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map(row => (
              <tr key={row.id} className="border-t border-slate-800 text-slate-200">
                <td className="px-2 py-1">
                  <input
                    className="w-44 rounded border border-slate-700 bg-slate-900 px-2 py-1"
                    value={row.timestamp}
                    onChange={event => updateCell(row.id, "timestamp", event.target.value)}
                  />
                </td>
                <td className="px-2 py-1">
                  <input className="w-28 rounded border border-slate-700 bg-slate-900 px-2 py-1" value={row.channel} onChange={event => updateCell(row.id, "channel", event.target.value)} />
                </td>
                <td className="px-2 py-1">
                  <input className="w-28 rounded border border-slate-700 bg-slate-900 px-2 py-1" value={row.professional} onChange={event => updateCell(row.id, "professional", event.target.value)} />
                </td>
                <td className="px-2 py-1">
                  <input className="w-28 rounded border border-slate-700 bg-slate-900 px-2 py-1" value={row.procedure} onChange={event => updateCell(row.id, "procedure", event.target.value)} />
                </td>
                <td className="px-2 py-1">
                  <select
                    className="w-24 rounded border border-slate-700 bg-slate-900 px-2 py-1"
                    value={row.status}
                    onChange={event => updateCell(row.id, "status", event.target.value)}
                  >
                    {VALID_STATUS.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-1">
                  <input className="w-20 rounded border border-slate-700 bg-slate-900 px-2 py-1" value={row.entries} onChange={event => updateCell(row.id, "entries", event.target.value)} />
                </td>
                <td className="px-2 py-1">
                  <input className="w-20 rounded border border-slate-700 bg-slate-900 px-2 py-1" value={row.exits} onChange={event => updateCell(row.id, "exits", event.target.value)} />
                </td>
                <td className="px-2 py-1">
                  <input className="w-20 rounded border border-slate-700 bg-slate-900 px-2 py-1" value={row.slotsAvailable} onChange={event => updateCell(row.id, "slotsAvailable", event.target.value)} />
                </td>
                <td className="px-2 py-1">
                  <input className="w-20 rounded border border-slate-700 bg-slate-900 px-2 py-1" value={row.slotsEmpty} onChange={event => updateCell(row.id, "slotsEmpty", event.target.value)} />
                </td>
                <td className="px-2 py-1">
                  <input className="w-20 rounded border border-slate-700 bg-slate-900 px-2 py-1" value={row.ticketMedio} onChange={event => updateCell(row.id, "ticketMedio", event.target.value)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
