import { describe, expect, it } from "vitest";
import {
  parseCsvContent,
  parsePdfTextContent,
} from "@/features/control-tower/services/fileParserService";

describe("fileParserService", () => {
  it("parses CSV with heterogeneous headers", () => {
    const csv = [
      "Data,Canal,Profissional,Procedimento,Situacao,Receita,Despesas,Slots Disponiveis,Slots Vazios,Ticket Medio",
      "2026-02-01,meta,Ana,Consulta,Realizado,1200,450,20,3,380",
      "2026-02-02,google,Bruno,Limpeza,No-Show,800,320,18,6,300",
    ].join("\n");

    const rows = parseCsvContent(csv);
    expect(rows).toHaveLength(2);
    expect(rows[0]?.status).toBe("realizado");
    expect(rows[1]?.status).toBe("noshow");
    expect(rows[1]?.slotsEmpty).toBe(6);
  });

  it("parses textual PDF-like tabular content deterministically", () => {
    const content = [
      "timestamp;channel;professional;procedure;status;entries;exits;slots_available;slots_empty;ticket_medio",
      "2026-02-01T09:00:00Z;meta;Ana;Consulta;realizado;900;300;18;2;360",
      "2026-02-01T10:00:00Z;google;Bruno;Limpeza;noshow;600;250;16;5;280",
    ].join("\n");

    const rows = parsePdfTextContent(content);
    expect(rows).toHaveLength(2);
    expect(rows[0]?.procedure).toBe("Consulta");
    expect(rows[1]?.status).toBe("noshow");
  });
});
