import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

interface ParetoItem { motivo: string; freq: number; }
interface AppState { faturamento_bruto: number; total_pacientes: number; no_shows_abs: number; cac: number; ltv: number; roi: number; churn: number; lucro: number; pareto: ParetoItem[]; }

const INIT: AppState = { faturamento_bruto: 145000, total_pacientes: 412, no_shows_abs: 76, cac: 125.5, ltv: 1250, roi: 3.5, churn: 5.2, lucro: 28.5, pareto: [{ motivo: "Preço", freq: 45 }, { motivo: "Distância", freq: 25 }, { motivo: "Horário", freq: 15 }, { motivo: "Esqueceu", freq: 5 }] };

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Google+Sans:wght@400;500;700&display=swap');
.D{--bg:#0f1115;--sf:#1a1d24;--sfh:#252a33;--sfa:#2e3540;--bd:#2e3540;--bdl:#3e4756;--tp:#e2e8f0;--ts:#94a3b8;--gb:#8ab4f8;--gbh:#aecbfa;--gbb:rgba(138,180,248,.15);--gbt:#8ab4f8;--gr:#f28b82;--grb:rgba(242,139,130,.15);--grt:#f28b82;--gy:#fdd663;--gyb:rgba(253,214,99,.15);--gyt:#fdd663;--gg:#81c995;--ggb:rgba(129,201,149,.15);--ggt:#81c995;--gp:#c58af9;--sw:260px;--th:70px;--rc:16px;--rb:100px;--s1:0 4px 12px rgba(0,0,0,.4);--s2:0 8px 24px rgba(0,0,0,.6);--bf:blur(8px);--ob:rgba(15,17,21,.7)}
.D.lt{--bg:#f8f9fa;--sf:#fff;--sfh:#f1f3f4;--sfa:#e8eaed;--bd:#dadce0;--bdl:#bdc1c6;--tp:#202124;--ts:#5f6368;--gb:#1a73e8;--gbh:#1b66c9;--gbb:#e8f0fe;--gbt:#1967d2;--gr:#ea4335;--grb:#fce8e6;--grt:#c5221f;--gy:#fbbc04;--gyb:#fef7e0;--gyt:#e37400;--gg:#34a853;--ggb:#e6f4ea;--ggt:#137333;--gp:#9333ea;--s1:0 1px 3px rgba(60,64,67,.3);--s2:0 4px 8px rgba(60,64,67,.15);--ob:rgba(255,255,255,.7)}
.D{background-color:var(--bg);background-image:radial-gradient(var(--bd) 1px,transparent 1px);background-size:24px 24px;color:var(--tp);font-family:'Google Sans','Roboto',sans-serif;min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased;transition:background-color .3s,color .3s;display:flex;animation:fi .5s}
.D h1,.D h2,.D h3,.D h4,.D h5,.gf{font-family:'Google Sans','Roboto',sans-serif}
.sb{width:var(--sw);background:var(--sf);border-right:1px solid var(--bd);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:200;transition:background-color .3s,border-color .3s}
.sb-l{padding:20px 24px;display:flex;align-items:center;gap:12px;height:var(--th);border-bottom:1px solid transparent}
.sb-i{width:32px;height:32px;border-radius:8px;background:var(--gb);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-family:'Google Sans'}
.sb-n{font-size:18px;font-weight:500;color:var(--tp);font-family:'Google Sans'}
.sb-nv{flex:1;padding:12px 0;overflow-y:auto}.sb-nv::-webkit-scrollbar{width:4px}.sb-nv::-webkit-scrollbar-thumb{background:var(--bd);border-radius:4px}
.sb-gl{font-size:11px;font-weight:500;text-transform:uppercase;color:var(--ts);padding:8px 24px;margin-top:8px;letter-spacing:.8px}
.ni{display:flex;align-items:center;gap:16px;padding:0 24px;height:40px;cursor:pointer;font-size:14px;font-weight:500;color:var(--tp);border-radius:0 100px 100px 0;margin-right:16px;transition:background .2s}
.ni:hover{background:var(--sfh)}.ni.a{background:var(--gbb);color:var(--gbt)}.ni.a svg{stroke:var(--gbt)}
.ni svg{width:20px;height:20px;flex-shrink:0;stroke:var(--ts);stroke-width:1.5;fill:none}
.sb-bt{padding:16px;border-top:1px solid var(--bd)}
.uc{display:flex;align-items:center;gap:12px;padding:8px;border-radius:8px;cursor:pointer;transition:background .2s}.uc:hover{background:var(--sfh)}
.av{width:32px;height:32px;border-radius:50%;background:var(--tp);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:var(--bg)}
.un{font-size:13px;font-weight:500;color:var(--tp);white-space:nowrap;text-overflow:ellipsis;overflow:hidden}
.ue{font-size:11px;color:var(--ts)}
.mn{margin-left:var(--sw);flex:1;display:flex;flex-direction:column;min-width:0}
.tb{height:var(--th);background:var(--sf);border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;padding:0 32px;position:sticky;top:0;z-index:100;transition:background-color .3s,border-color .3s}
.tb-t{font-size:20px;font-weight:500;color:var(--tp);font-family:'Google Sans'}
.ct{padding:32px;flex:1;display:none;max-width:1400px;margin:0 auto;width:100%}.ct.a{display:block;animation:fi .4s}
.cd{background:var(--sf);border:1px solid var(--bd);border-radius:var(--rc);transition:transform .3s ease,box-shadow .3s ease,background-color .3s,border-color .3s;overflow:hidden;box-shadow:var(--s1);position:relative;margin-bottom:24px}
.cd.hv:hover{box-shadow:var(--s2);border-color:var(--bdl);transform:translateY(-2px)}
.cd-h{padding:20px 24px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--bd)}
.cd-t{font-size:16px;font-weight:500;color:var(--tp);font-family:'Google Sans'}
.cd-b{padding:24px;position:relative}
.kg{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:24px}
.kp{background:var(--sf);border:1px solid var(--bd);border-radius:var(--rc);padding:20px;box-shadow:var(--s1);transition:transform .2s,border-color .2s;position:relative}
.kp:hover{transform:translateY(-2px);border-color:var(--bdl)}
.kl{font-size:13px;font-weight:500;color:var(--ts);margin-bottom:12px;font-family:'Google Sans'}
.kv{font-size:32px;font-weight:400;color:var(--tp);font-family:'Google Sans';margin-bottom:6px}
.km{font-size:12px;color:var(--ts);display:flex;align-items:center;gap:6px}
.lk{position:relative;border-radius:var(--rc);margin-bottom:24px;overflow:hidden}
.lk-c.lkd{filter:var(--bf);opacity:.4;pointer-events:none;user-select:none;transition:filter .3s,opacity .3s}
.lk-c.ulk{filter:none;opacity:1;pointer-events:auto;transition:filter .3s,opacity .3s}
.lk-o{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:10;background:var(--ob);border-radius:inherit}
.lk-cd{background:var(--sf);border:1px solid var(--bdl);padding:32px;border-radius:16px;text-align:center;max-width:360px;box-shadow:var(--s2);animation:su .3s ease}
.lk-cd h3{margin-bottom:8px;color:var(--tp);font-family:'Google Sans';font-size:16px}
.lk-cd p{font-size:13px;color:var(--ts);margin-bottom:24px;line-height:1.5}
.bg{padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600;letter-spacing:.3px;display:inline-block}
.bg.nt{background:var(--sfh);color:var(--ts)}.bg.sc{background:var(--ggb);color:var(--ggt)}.bg.dg{background:var(--grb);color:var(--grt)}.bg.in{background:var(--gbb);color:var(--gbt)}.bg.wn{background:var(--gyb);color:var(--gyt)}
.ab{background:var(--gyb);border-left:4px solid var(--gy);padding:16px;border-radius:8px;margin-bottom:24px}
.al{background:var(--gbb);border-left:4px solid var(--gb);padding:16px;border-radius:4px 8px 8px 4px;margin-bottom:24px}
.al-t{font-weight:700;color:var(--gbt);margin-bottom:4px;font-size:14px}
.al-d{font-size:13px;color:var(--tp);line-height:1.5}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:24px}.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px}.g21{display:grid;grid-template-columns:2fr 1fr;gap:24px;margin-bottom:24px}
.es{text-align:center;padding:40px 24px;background:rgba(0,0,0,.05);border-radius:8px;border:1px dashed var(--bd)}
.dt{width:100%;border-collapse:collapse;text-align:left}.dt th{font-size:12px;font-weight:500;color:var(--ts);padding:12px 16px;border-bottom:1px solid var(--bd)}.dt td{font-size:13px;color:var(--tp);padding:16px;border-bottom:1px solid var(--sfh)}.dt tr:hover td{background:rgba(255,255,255,.02)}
.bt{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 24px;border-radius:var(--rb);font-family:'Google Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s;border:none;outline:none}
.bp{background:var(--gb);color:#000;font-weight:600}.bp:hover{filter:brightness(1.1);box-shadow:var(--s1);transform:translateY(-1px)}
.bs{background:var(--sfh);color:var(--tp);border:1px solid var(--bd)}.bs:hover{background:var(--sfa);border-color:var(--bdl)}
.bgh{background:transparent;color:var(--tp);border:1px solid transparent}.bgh:hover{background:var(--sfh);border-color:var(--bd)}
.bu{background:linear-gradient(135deg,var(--gp),var(--gb));color:#fff;font-weight:bold;border-radius:var(--rb);border:none;padding:10px 24px;cursor:pointer}.bu:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 4px 12px rgba(197,138,249,.3)}
.bai{background:linear-gradient(135deg,var(--gp),var(--gb));color:#000;font-weight:600;border-radius:var(--rb);border:none;padding:10px 24px;cursor:pointer}.bai:hover{filter:brightness(1.1);transform:translateY(-1px)}
.fl{font-size:13px;font-weight:500;color:var(--ts);margin-bottom:8px;display:block;text-align:left}
.fi,.fs{width:100%;background:var(--sfh);border:1px solid var(--bd);color:var(--tp);font-family:'Roboto',sans-serif;font-size:14px;padding:12px 16px;border-radius:8px;outline:none;transition:border .2s;margin-bottom:16px}.fi:focus,.fs:focus{border-color:var(--gb)}
.fr{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.tn{display:flex;border-bottom:1px solid var(--bd);margin-bottom:24px;gap:8px}
.tbn{padding:12px 24px;font-size:14px;font-weight:500;color:var(--ts);cursor:pointer;border-bottom:3px solid transparent;transition:color .2s;font-family:'Google Sans';background:none;border-top:none;border-left:none;border-right:none}.tbn.a{color:var(--gb);border-bottom-color:var(--gb)}
.mo{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);animation:fi .2s}
.ml{background:var(--sf);border-radius:16px;border:1px solid var(--bd);width:90%;max-width:500px;box-shadow:var(--s2);overflow:hidden;animation:su .3s ease}
.ml-h{padding:24px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--bd)}
.ml-t{font-size:18px;font-weight:500;font-family:'Google Sans';color:var(--tp);display:flex;align-items:center;gap:8px}
.ml-x{cursor:pointer;color:var(--ts);font-size:20px;background:transparent;border:none;padding:8px;border-radius:50%;transition:background .2s}
.ml-b{padding:24px}
.ml-f{padding:16px 24px;background:rgba(0,0,0,.1);display:flex;justify-content:flex-end;gap:12px;border-top:1px solid var(--bd)}
.tc{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:10px}
.tt{background:var(--gbt);color:#000;padding:12px 24px;border-radius:100px;font-size:14px;font-weight:bold;display:flex;align-items:center;gap:12px;animation:ti .3s ease;box-shadow:0 8px 16px rgba(138,180,248,.2)}
.rt{background:#0f1115;border:1px solid var(--bd);border-radius:8px;padding:16px;font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--gg);min-height:150px;text-align:left}
.pm{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:10000;padding:40px;overflow-y:auto;backdrop-filter:blur(4px)}
.pp{background:#fff;color:#000;max-width:800px;margin:0 auto;padding:40px;box-shadow:0 10px 30px rgba(0,0,0,.5);border-radius:4px}
.pl{background:#f8f9fa;padding:20px;border-radius:8px;border:1px solid #dadce0;margin-top:32px;text-align:left}
.pl h4{color:#1a73e8;margin-bottom:12px;font-family:'Google Sans'}
.pl li{margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #e8eaed;line-height:1.5;font-size:12px;color:#5f6368}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes su{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes ti{from{transform:translateY(100px);opacity:0}to{transform:translateY(0);opacity:1}}
.fu{animation:su .5s ease both}.s1{animation-delay:.05s}.s2{animation-delay:.1s}
@media(max-width:768px){.sb{display:none}.mn{margin-left:0}.g2,.g3,.g21{grid-template-columns:1fr}.fr{grid-template-columns:1fr}}
`;

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [app, setApp] = useState<AppState>(INIT);
  const [scr, setScr] = useState("dashboard");
  // Plan is determined by user role from admin (no manual selector)
  const plan: string = "Pro";
  const [lt, setLt] = useState(false);
  const [toasts, setToasts] = useState<string[]>([]);
  const [modal, setModal] = useState<string | null>(null);
  const [rLogs, setRLogs] = useState<string[]>([]);
  const [rDone, setRDone] = useState(false);
  const [qA, setQA] = useState("Selecione uma métrica acima");
  const [qL, setQL] = useState("O sistema traduzirá os dados para facilitar a tomada de decisão.");
  const [audit, setAudit] = useState(false);
  const [dTab, setDTab] = useState("fin");
  const [fTipo, setFTipo] = useState("Receita");
  const [fVal, setFVal] = useState("");
  const [pSt, setPSt] = useState("Compareceu");
  const [pMot, setPMot] = useState("");
  const [pdf, setPdf] = useState(false);
  const rRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { if (!loading && !user) setLocation("/login"); }, [loading, user, setLocation]);

  const toast = useCallback((m: string) => { setToasts(p => [...p, m]); setTimeout(() => setToasts(p => p.slice(1)), 3000); }, []);

  const txN = app.total_pacientes > 0 ? (app.no_shows_abs / app.total_pacientes) * 100 : 0;
  const txC = app.total_pacientes > 0 ? ((app.total_pacientes - app.no_shows_abs) / app.total_pacientes) * 100 : 0;
  const isE = plan === "Essential";
  const nE = plan !== "Enterprise";

  const pareto = useCallback(() => {
    const s = [...app.pareto].sort((a, b) => b.freq - a.freq);
    const t = s.reduce((x, i) => x + i.freq, 0); let ac = 0;
    return s.map(i => { const p = t > 0 ? (i.freq / t) * 100 : 0; ac += p; return { ...i, pct: p, acum: ac }; });
  }, [app.pareto]);

  const gc = lt ? "#e8eaed" : "#2e3540", tc = lt ? "#5f6368" : "#94a3b8", lc = lt ? "#1a73e8" : "#8ab4f8", dc = lt ? "#f1f3f4" : "#2e3540";

  const ansQ = (q: string) => {
    if (!q) { setQA("Selecione uma métrica acima"); setQL("O sistema traduzirá os dados para facilitar a tomada de decisão."); return; }
    const d: Record<string, [string, string]> = {
      cac: [`R$ ${app.cac.toLocaleString("pt-BR")}`, "Custo de Aquisição de Clientes: O valor gasto em marketing para trazer 1 novo paciente."],
      ltv: [`R$ ${app.ltv.toLocaleString("pt-BR")}`, "Lifetime Value: O quanto um paciente gasta em média durante todo o relacionamento com a clínica."],
      roi: [`${app.roi}x`, "Retorno sobre Investimento: Para cada R$1 investido, a clínica retorna este multiplicador."],
      churn: [`${app.churn}%`, "Taxa de Evasão: Pacientes que deixaram de realizar acompanhamento recorrente."],
      lucro: [`${app.lucro}%`, "Margem de Lucro: O percentual limpo que sobra após pagar todos os custos fixos e variáveis."],
    };
    if (d[q]) { setQA(d[q][0]); setQL(d[q][1]); }
  };

  const startAI = (type: string, close?: string) => {
    if (close) setModal(null);
    setModal("ai"); setRLogs([]); setRDone(false);
    let steps: string[] = [];
    if (type === "csv") steps = ["Carregando arquivo CSV...", "IA GLX analisando colunas: [Data, Paciente, Status, Valor]", "=> Roteando 'Status' para o módulo: Agenda & Capacidade", "=> Mapeando 'No-Show' para o módulo: Sprints & OKRs (Pareto)", "=> Roteando 'Valor' para o módulo: Dashboard (Faturamento)", "Processamento concluído. Relatório PDF atualizado com novas métricas."];
    else if (type === "crm") steps = ["Autenticando API do CRM (HubSpot/RD)...", "Extraindo pipeline de vendas e contatos...", "=> Roteando 'Leads Captados' para o módulo: Funil Comercial", "=> Roteando 'Conversões' para o módulo: Dashboard Essencial", "Sincronização em tempo real estabelecida."];
    else if (type === "token") steps = ["Validando Token de Integração...", "Mapeando eventos de rastreamento (Pageview, Lead, Purchase)...", "=> Roteando 'Custo de Campanha' para: Canais de Aquisição", "=> Calculando e roteando 'CAC' e 'ROAS'", "Tracking ativado com sucesso."];
    let i = 0;
    const nx = () => { if (i < steps.length) { setRLogs(p => [...p, `> ${steps[i]}`]); i++; rRef.current = setTimeout(nx, 800); } else { setRLogs(p => [...p, "> Roteamento Finalizado. O Dashboard foi alimentado."]); setRDone(true); setApp(p => ({ ...p, faturamento_bruto: p.faturamento_bruto + Math.floor(Math.random() * 10000), total_pacientes: p.total_pacientes + Math.floor(Math.random() * 50) })); } };
    rRef.current = setTimeout(nx, 800);
  };

  const regFin = () => { const v = parseFloat(fVal); if (isNaN(v) || v <= 0) { toast("Insira um valor válido."); return; } if (fTipo === "Receita") { setApp(p => ({ ...p, faturamento_bruto: p.faturamento_bruto + v })); toast("Receita computada com sucesso! Gráficos atualizados."); } else toast("Custo registrado."); setFVal(""); };

  const salvarAt = () => {
    setApp(p => {
      const n = { ...p, total_pacientes: p.total_pacientes + 1 };
      if (pSt === "No-Show" || pSt === "Cancelada") {
        n.no_shows_abs = p.no_shows_abs + 1; let m = pMot.trim();
        if (!m) { setAudit(true); m = "Não Identificado"; } else setAudit(false);
        const np = [...p.pareto]; const f = np.find(x => x.motivo.toLowerCase() === m.toLowerCase());
        if (f) f.freq++; else np.push({ motivo: m, freq: 1 }); n.pareto = np;
      } return n;
    }); toast("Atendimento computado! Analisando impacto..."); setPMot("");
  };

  const titles: Record<string, string> = { dashboard: "Visão Geral", realtime: "Tempo Real", agenda: "Agenda & Capacidade", equipe: "Equipe", sprints: "Sprints & OKRs", funil: "Funil Comercial", canais: "Canais", integracoes: "Integrações", dados: "Entrada Manual", relatorios: "Exportações", diagnostico: "Diagnóstico GLX", configuracoes: "Configurações" };

  const pd = pareto();
  const pCD: any = { labels: pd.map(d => d.motivo), datasets: [{ type: "line", label: "% Acumulado", data: pd.map(d => d.acum), borderColor: "#fbbc04", borderWidth: 3, yAxisID: "y1", tension: 0.3, pointRadius: 4 }, { type: "bar", label: "Frequência (No-Shows)", data: pd.map(d => d.freq), backgroundColor: lc, borderRadius: 4, yAxisID: "y" }] };
  const pO: any = { responsive: true, maintainAspectRatio: false, scales: { y: { type: "linear", position: "left", grid: { color: gc }, ticks: { color: tc } }, y1: { type: "linear", position: "right", max: 100, grid: { drawOnChartArea: false }, ticks: { color: tc, callback: (v: any) => v + "%" } }, x: { grid: { display: false }, ticks: { color: tc } } }, plugins: { legend: { labels: { color: tc } } } };
  const eCD = { labels: ["Unidade Matriz", "Filial Sul", "Filial Norte"], datasets: [{ label: "Faturamento", data: [120000, 85000, 60000], backgroundColor: lc, borderRadius: 4 }, { label: "Custos", data: [70000, 50000, 40000], backgroundColor: lt ? "#ea4335" : "#f28b82", borderRadius: 4 }] };
  const lvCD = { labels: ["08:00", "10:00", "12:00", "14:00", "16:00"], datasets: [{ label: "Atendimentos", data: [5, 12, 8, 15, 6], borderColor: lc, tension: 0.3, fill: false }] };
  const fCD = { labels: ["Sem Dados"], datasets: [{ data: [1], backgroundColor: [dc], borderWidth: 0 }] };
  const dCD = { labels: ["Mês 1", "Mês 2", "Mês 3", "Mês 4", "Mês 5", "Mês 6"], datasets: [{ label: "Valores", data: [80, 95, 110, 130, 125, 145], backgroundColor: lc, borderRadius: 4 }] };
  const bO: any = { responsive: true, maintainAspectRatio: false, scales: { y: { grid: { color: gc }, ticks: { color: tc } }, x: { grid: { display: false }, ticks: { color: tc } } }, plugins: { legend: { labels: { color: tc } } } };

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0f1115", color: "#e2e8f0" }}><p>Carregando...</p></div>;
  if (!user) return null;

  const uN = user.name || "Cliente";
  const uI = uN.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const Lk = ({ locked, title, msg, btn, children }: { locked: boolean; title: string; msg: string; btn: string; children: React.ReactNode }) => (
    <div className="lk fu s2">{locked && <div className="lk-o"><div className="lk-cd"><h3>{title}</h3><p>{msg}</p><button className="bt bu">{btn}</button></div></div>}<div className={`lk-c ${locked ? "lkd" : "ulk"}`}>{children}</div></div>
  );

  const nav = [
    { g: "Visão Geral", items: [{ id: "dashboard", l: "Dashboard", i: <svg viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg> }, { id: "realtime", l: "Tempo Real", i: <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg> }] },
    { g: "Operação & Equipe", items: [{ id: "agenda", l: "Agenda & Capacidade", i: <svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg> }, { id: "equipe", l: "Equipe", i: <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg> }, { id: "sprints", l: "Sprints & OKRs", i: <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h5v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg> }] },
    { g: "Comercial", items: [{ id: "funil", l: "Funil de Vendas", i: <svg viewBox="0 0 24 24"><path d="M3 4l9 16 9-16H3zm3.38 2h11.25L12 16 6.38 6z"/></svg> }, { id: "canais", l: "Canais", i: <svg viewBox="0 0 24 24"><path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27z"/></svg> }] },
    { g: "Gestão e Integrações", items: [{ id: "integracoes", l: "Integrações / CRM", i: <svg viewBox="0 0 24 24"><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9c.04-.65-.2-1.29-.67-1.72l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06c.43.47 1.07.71 1.72.67H9a2 2 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a2 2 0 0 0 1 1.51c.65.04 1.29-.2 1.72-.67l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06c-.47.43-.71 1.07-.67 1.72V9a2 2 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a2 2 0 0 0-1.51 1z"/></svg> }, { id: "dados", l: "Entrada de Dados", i: <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg> }, { id: "relatorios", l: "Relatórios PDF", i: <svg viewBox="0 0 24 24"><path d="M19 8H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm0 10H5v-8h14v8z"/><path d="M18 4l-4-4h-4l-4 4h12z"/></svg> }, { id: "diagnostico", l: "Diagnóstico GLX", i: <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" stroke="none"/></svg> }, { id: "configuracoes", l: "Configurações", i: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9c.04-.65-.2-1.29-.67-1.72l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06c.43.47 1.07.71 1.72.67H9a2 2 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a2 2 0 0 0 1 1.51c.65.04 1.29-.2 1.72-.67l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06c-.47.43-.71 1.07-.67 1.72V9a2 2 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a2 2 0 0 0-1.51 1z"/></svg> }] },
  ];

  return (<><style>{CSS}</style><div className={`D ${lt ? "lt" : ""}`}>
    <div className="tc">{toasts.map((t, i) => <div key={i} className="tt">{t}</div>)}</div>

    {/* MODAL: AI ROUTER */}
    {modal === "ai" && <div className="mo" onClick={() => setModal(null)}><div className="ml" style={{ maxWidth: 600, borderColor: "var(--gp)" }} onClick={e => e.stopPropagation()}><div className="ml-h"><div className="ml-t" style={{ color: "var(--gp)" }}>🧠 IA GLX: Roteador de Dados</div></div><div className="ml-b"><p style={{ fontSize: 13, color: "var(--ts)", marginBottom: 16 }}>Analisando payload recebido e distribuindo informações pelos módulos estratégicos do Dashboard...</p><div className="rt">{rLogs.map((l, i) => <div key={i} style={{ color: i === rLogs.length - 1 && rDone ? "var(--gb)" : undefined, marginTop: i === rLogs.length - 1 && rDone ? 16 : 0 }}>{l}</div>)}</div></div>{rDone && <div className="ml-f"><button className="bt bp" onClick={() => { setModal(null); setScr("dashboard"); }}>Ver Dashboard Atualizado</button></div>}</div></div>}

    {/* MODAL: PROFISSIONAL */}
    {modal === "prof" && <div className="mo" onClick={() => setModal(null)}><div className="ml" onClick={e => e.stopPropagation()}><div className="ml-h"><div className="ml-t">Adicionar Profissional</div><button className="ml-x" onClick={() => setModal(null)}>✕</button></div><div className="ml-b"><div style={{ marginBottom: 16 }}><label className="fl">Nome Completo</label><input type="text" className="fi" placeholder="Ex: Dr. João Silva" /></div><div><label className="fl">Função / Especialidade</label><select className="fs"><option>Médico(a)</option><option>Recepção</option><option>Comercial</option><option>Gerência</option></select></div></div><div className="ml-f"><button className="bt bs" onClick={() => setModal(null)}>Cancelar</button><button className="bt bp" onClick={() => { setModal(null); toast("Profissional adicionado com sucesso!"); }}>Salvar</button></div></div></div>}

    {/* MODAL: SPRINT */}
    {modal === "sprint" && <div className="mo" onClick={() => setModal(null)}><div className="ml" onClick={e => e.stopPropagation()}><div className="ml-h"><div className="ml-t">Nova Iniciativa (Sprint)</div><button className="ml-x" onClick={() => setModal(null)}>✕</button></div><div className="ml-b"><div style={{ marginBottom: 16 }}><label className="fl">Nome da Iniciativa</label><input type="text" className="fi" placeholder="Ex: Reduzir No-Show em 10%" /></div><div className="fr"><div><label className="fl">Responsável</label><input type="text" className="fi" /></div><div><label className="fl">Prazo</label><input type="date" className="fi" /></div></div></div><div className="ml-f"><button className="bt bs" onClick={() => setModal(null)}>Cancelar</button><button className="bt bp" onClick={() => { setModal(null); toast("Sprint criado! Vamos à execução."); }}>Criar Sprint</button></div></div></div>}

    {/* MODAL: OKR */}
    {modal === "okr" && <div className="mo" onClick={() => setModal(null)}><div className="ml" onClick={e => e.stopPropagation()}><div className="ml-h"><div className="ml-t">Definir Novo OKR</div><button className="ml-x" onClick={() => setModal(null)}>✕</button></div><div className="ml-b"><div style={{ marginBottom: 16 }}><label className="fl">Objetivo (O)</label><input type="text" className="fi" placeholder="Ex: Escalar a Clínica" /></div><div><label className="fl">Resultado Chave (KR)</label><input type="text" className="fi" placeholder="Ex: Atingir 500k de faturamento" /></div></div><div className="ml-f"><button className="bt bs" onClick={() => setModal(null)}>Cancelar</button><button className="bt bp" onClick={() => { setModal(null); toast("OKR registrado para o trimestre."); }}>Salvar OKR</button></div></div></div>}

    {/* MODAL: AGENDA CSV */}
    {modal === "agenda" && <div className="mo" onClick={() => setModal(null)}><div className="ml" onClick={e => e.stopPropagation()}><div className="ml-h"><div className="ml-t">Importar Agenda (CSV)</div><button className="ml-x" onClick={() => setModal(null)}>✕</button></div><div className="ml-b"><div className="es" style={{ padding: 30 }}><div style={{ fontSize: 24, marginBottom: 12 }}>📁</div><p style={{ fontSize: 14, color: "var(--ts)" }}>Arraste seu arquivo .CSV aqui ou clique para selecionar.</p><input type="file" style={{ marginTop: 16, color: "var(--tp)" }} /></div></div><div className="ml-f"><button className="bt bs" onClick={() => setModal(null)}>Cancelar</button><button className="bt bp" onClick={() => startAI("csv", "agenda")}>Importar via IA Router</button></div></div></div>}

    {/* PDF PREVIEW */}
    {pdf && <div className="pm"><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, maxWidth: 800, margin: "0 auto 24px" }}><h2 style={{ color: "white", fontFamily: "'Google Sans'" }}>Pré-visualização do PDF Comercial</h2><div style={{ display: "flex", gap: 12 }}><button className="bt bs" onClick={() => setPdf(false)}>Voltar</button><button className="bt bp" onClick={() => { toast("PDF gerado e salvo com sucesso!"); setPdf(false); }}>Confirmar e Baixar</button></div></div><div className="pp"><h1 style={{ borderBottom: "2px solid #1a73e8", paddingBottom: 16, marginBottom: 32, fontFamily: "'Google Sans'" }}>GLX Report Executivo</h1><div style={{ display: "flex", gap: 24, marginBottom: 32 }}><div style={{ flex: 1, background: "#f8f9fa", padding: 20, borderRadius: 8, border: "1px solid #dadce0" }}><div style={{ fontSize: 12, color: "#5f6368" }}>Faturamento Mês</div><div style={{ fontSize: 28, fontWeight: "bold", color: "#202124" }}>R$ {app.faturamento_bruto.toLocaleString("pt-BR")}</div></div><div style={{ flex: 1, background: "#fce8e6", padding: 20, borderRadius: 8, border: "1px solid #fad2cf" }}><div style={{ fontSize: 12, color: "#c5221f" }}>Taxa de No-Show</div><div style={{ fontSize: 28, fontWeight: "bold", color: "#c5221f" }}>{txN.toFixed(1)}%</div></div></div><div style={{ height: 300, background: "#f8f9fa", border: "1px solid #dadce0", borderRadius: 8, padding: 10 }}><Bar data={pCD} options={{ ...pO, scales: { ...pO.scales, y: { ...pO.scales.y, grid: { color: "#e8eaed" }, ticks: { color: "#5f6368" } }, y1: { ...pO.scales.y1, grid: { drawOnChartArea: false }, ticks: { color: "#5f6368", callback: (v: any) => v + "%" } }, x: { grid: { display: false }, ticks: { color: "#5f6368" } } }, plugins: { legend: { labels: { color: "#5f6368" } } } }} /></div><div className="pl"><h4>Dicionário de Interpretação (Glossário Comercial)</h4><ul style={{ listStyle: "none", padding: 0 }}><li><strong>Faturamento Bruto:</strong> Receita total de consultas finalizadas.</li><li><strong>Taxa de No-Show:</strong> Ociosidade crítica. Acima de 10% impacta severamente o Custo Fixo da operação.</li><li><strong>Pareto de Cancelamento:</strong> Princípio 80/20. Identifica os motivos principais de perda comercial para ação imediata na gestão.</li></ul></div></div></div>}

    {/* SIDEBAR */}
    <aside className="sb"><div className="sb-l"><div className="sb-i">G</div><div className="sb-n">GLX Workspace</div></div><nav className="sb-nv">{nav.map(g => <div key={g.g}><div className="sb-gl">{g.g}</div>{g.items.map(it => <div key={it.id} className={`ni ${scr === it.id ? "a" : ""}`} onClick={() => setScr(it.id)}>{it.i} {it.l}</div>)}</div>)}</nav><div className="sb-bt"><div className="uc"><div className="av">{uI}</div><div><div className="un">{uN}</div><div className="ue">Workspace Híbrido</div></div></div></div></aside>

    {/* MAIN */}
    <main className="mn">
      <header className="tb"><div className="tb-t">{titles[scr] || "Workspace"}</div><div style={{ display: "flex", gap: 16, alignItems: "center" }}><button className="bt bp" onClick={() => setPdf(true)}>Exportar PDF</button><button className="bt bgh" onClick={() => setLt(!lt)} style={{ fontSize: 16 }}>☀️ / 🌙</button></div></header>

      {/* DASHBOARD */}
      <div className={`ct ${scr === "dashboard" ? "a" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }} className="fu"><div><h1 className="gf" style={{ marginBottom: 4 }}>Visão Geral</h1><div style={{ color: "var(--ts)", fontSize: 14, marginTop: 4 }}>Acompanhamento estratégico. Arraste os blocos para reorganizar.</div></div><select className="fs" style={{ margin: 0, width: 200 }} onChange={() => toast("Filtrando dados pelo período selecionado...")}><option>Este Mês (Atual)</option><option>Mês Passado</option><option>Últimos 90 dias</option></select></div>
        <div className="cd hv fu s1"><div className="cd-h" style={{ background: "rgba(138,180,248,.05)" }}><div className="cd-t">Análise Guiada GLX</div><select className="fs" style={{ width: "auto", margin: 0 }} onChange={e => ansQ(e.target.value)}><option value="">Selecione uma pergunta estratégica...</option><option value="cac">Qual é o CAC atual?</option><option value="ltv">Qual é o LTV projetado?</option><option value="roi">Qual é o ROI das campanhas?</option><option value="churn">Qual é o Churn (Cancelamento)?</option><option value="lucro">Qual é a Margem de Lucro?</option></select></div><div className="cd-b"><h2 style={{ fontSize: 28, color: "var(--gb)", fontFamily: "'Google Sans'" }}>{qA}</h2><p style={{ fontSize: 13, color: "var(--ts)", marginTop: 8 }}>{qL}</p></div></div>
        {audit && <div className="ab"><strong className="gf">⚠️ Atenção (Auditoria GLX):</strong> Seus dados manuais possuem cancelamentos sem motivos preenchidos.</div>}
        <h3 style={{ marginBottom: 16, color: "var(--ts)" }} className="gf fu s1">Métricas Essenciais</h3>
        <div className="kg fu s1"><div className="kp hv"><div className="kl">Faturamento Mês</div><div className="kv">R$ {app.faturamento_bruto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div><div className="km"><span className="bg sc">+12%</span> vs mês anterior</div></div><div className="kp hv"><div className="kl">Total Agendamentos</div><div className="kv">{app.total_pacientes}</div><div className="km"><span className="bg nt">Atualizado agora</span></div></div><div className="kp hv"><div className="kl">Taxa de No-Show</div><div className="kv" style={{ color: "var(--gr)" }}>{txN.toFixed(1)}%</div><div className="km"><span className="bg in">Meta &lt; 10%</span></div></div><div className="kp hv"><div className="kl">Conversão Geral</div><div className="kv">{txC.toFixed(1)}%</div><div className="km"><span className="bg wn">Abaixo da média</span></div></div></div>
        <div className="cd hv fu s2"><div className="cd-h"><div className="cd-t">Tendência Mensal</div></div><div className="cd-b" style={{ height: 250 }}><Bar data={dCD} options={{ ...bO, plugins: { legend: { display: false } } }} /></div></div>
        <h3 style={{ marginTop: 32, marginBottom: 16, color: "var(--ts)" }} className="gf">Análises Pro (Avançado)</h3>
        <Lk locked={isE} title="Gráfico de Pareto (Plano PRO)" msg="Identifique a causa raiz de cancelamentos e libere métricas de CAC e Estoque." btn="Desbloquear Plano Pro"><div className="kg" style={{ gridTemplateColumns: "repeat(3,1fr)" }}><div className="kp"><div className="kl">Projeção Faturamento</div><div className="kv">R$ {(app.faturamento_bruto * 1.3).toLocaleString("pt-BR")}</div></div><div className="kp"><div className="kl">LTV Projetado</div><div className="kv">R$ 1.250</div></div><div className="kp"><div className="kl">CAC Médio</div><div className="kv">R$ {app.cac.toLocaleString("pt-BR")}</div></div></div><div className="cd"><div className="cd-h"><div className="cd-t">Gráfico de Pareto: Motivos de Cancelamento</div></div><div className="cd-b" style={{ height: 300 }}><Bar data={pCD} options={pO} /></div></div></Lk>
        <h3 style={{ marginTop: 32, marginBottom: 16, color: "var(--ts)" }} className="gf">Governança Enterprise (Redes)</h3>
        <Lk locked={nE} title="Escalabilidade para Redes" msg="Exclusivo para clínicas com múltiplas unidades. Obtenha o DRE consolidado e comparações." btn="Falar com Especialista GLX"><div className="cd" style={{ marginBottom: 0 }}><div className="cd-h"><div className="cd-t">Comparativo Consolidado Multi-Unidades</div></div><div className="cd-b" style={{ height: 250 }}><Bar data={eCD} options={bO} /></div></div></Lk>
      </div>

      {/* TEMPO REAL */}
      <div className={`ct ${scr === "realtime" ? "a" : ""}`}><div className="fu" style={{ marginBottom: 24 }}><h1 className="gf">Métricas em Tempo Real</h1><div style={{ color: "var(--ts)", fontSize: 14, marginTop: 4 }}>Aguardando conexão com integrações de calendário e recepção.</div></div><div className="cd hv fu s1"><div className="cd-h"><div className="cd-t">Fluxo de Recepção Hoje</div></div><div className="cd-b" style={{ height: 300 }}><Line data={lvCD} options={{ ...bO, plugins: { legend: { display: false } } }} /></div></div></div>

      {/* AGENDA */}
      <div className={`ct ${scr === "agenda" ? "a" : ""}`}><div className="fu" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}><div><h1 className="gf">Agenda &amp; Capacidade</h1><div style={{ color: "var(--ts)", fontSize: 14, marginTop: 4 }}>Gerencie a ocupação e importe seus dados de agendamento.</div></div><button className="bt bs" onClick={() => setModal("agenda")}>Importar Agenda (CSV)</button></div><div className="kg fu s1" style={{ marginBottom: 24 }}><div className="kp hv"><div className="kl">Utilização da Agenda</div><div className="kv">0%</div></div><div className="kp hv"><div className="kl">Faltas (No-Show)</div><div className="kv">0</div></div><div className="kp hv"><div className="kl">Tempo Médio Espera</div><div className="kv">0 min</div></div><div className="kp hv"><div className="kl">Slots Livres</div><div className="kv">0</div></div></div><Lk locked={isE} title="Mapa da Agenda (PRO)" msg="Visualize os slots ocupados graficamente." btn="Ver Planos"><div className="cd hv" style={{ margin: 0 }}><div className="cd-h"><div className="cd-t">Mapa de Calor da Agenda</div></div><div className="cd-b"><div className="es"><div style={{ fontSize: 14, color: "var(--ts)" }}>Importe um CSV ou conecte o CRM para visualizar a ocupação visualmente.</div></div></div></div></Lk></div>

      {/* EQUIPE */}
      <div className={`ct ${scr === "equipe" ? "a" : ""}`}><div className="fu" style={{ marginBottom: 24 }}><h1 className="gf">Equipe &amp; Produtividade</h1><div style={{ color: "var(--ts)", fontSize: 14, marginTop: 4 }}>Acompanhamento do corpo clínico e administrativo.</div></div><div className="cd hv fu s1"><div className="cd-h"><div className="cd-t">Membros Cadastrados</div><button className="bt bp" style={{ fontSize: 13, padding: "6px 16px" }} onClick={() => setModal("prof")}>+ Adicionar Profissional</button></div><div className="cd-b" style={{ padding: 0 }}><table className="dt"><thead><tr><th>Profissional</th><th>Função</th><th>Aderência Processual</th><th>Status</th></tr></thead><tbody><tr><td colSpan={4} style={{ textAlign: "center", padding: 32, color: "var(--ts)" }}>A equipe está vazia. Adicione profissionais.</td></tr></tbody></table></div></div></div>

      {/* SPRINTS & OKRs */}
      <div className={`ct ${scr === "sprints" ? "a" : ""}`}><div className="fu" style={{ marginBottom: 24 }}><h1 className="gf">Sprints &amp; OKRs</h1><div style={{ color: "var(--ts)", fontSize: 14, marginTop: 4 }}>Central de execução estratégica e prestação de contas.</div></div><div className="g2 fu s1" style={{ marginBottom: 24 }}><div className="cd hv"><div className="cd-h"><div className="cd-t">Painel de Sprints</div><button className="bt bs" style={{ fontSize: 13, padding: "6px 16px" }} onClick={() => setModal("sprint")}>+ Add Sprint</button></div><div className="cd-b" style={{ padding: 0 }}><table className="dt"><thead><tr><th>Iniciativa</th><th>Dono</th><th>Status</th></tr></thead><tbody><tr><td colSpan={3} style={{ textAlign: "center", padding: 24, color: "var(--ts)" }}>Nenhum sprint ativo. Crie uma iniciativa para resolver gargalos.</td></tr></tbody></table></div></div><Lk locked={isE} title="Gestão de OKRs (PRO)" msg="Alinhe Sprints com metas globais." btn="Liberar OKRs"><div className="cd hv" style={{ margin: 0, height: "100%" }}><div className="cd-h"><div className="cd-t">Deck de OKRs (Trimestre)</div><button className="bt bs" style={{ fontSize: 13, padding: "6px 16px" }} onClick={() => setModal("okr")}>+ Add OKR</button></div><div className="cd-b" style={{ padding: 0 }}><table className="dt"><thead><tr><th>Objetivo</th><th>Key Result</th><th>Progresso</th></tr></thead><tbody><tr><td colSpan={3} style={{ textAlign: "center", padding: 24, color: "var(--ts)" }}>Sem metas globais definidas.</td></tr></tbody></table></div></div></Lk></div></div>

      {/* FUNIL */}
      <div className={`ct ${scr === "funil" ? "a" : ""}`}><div className="fu" style={{ marginBottom: 24 }}><h1 className="gf">Funil Comercial</h1><div style={{ color: "var(--ts)", fontSize: 14, marginTop: 4 }}>Acompanhe a jornada do paciente desde a captação até o retorno.</div></div><div className="g21 fu s1"><Lk locked={isE} title="Gráfico Visual (PRO)" msg="Mapeamento visual da jornada." btn="Fazer Upgrade"><div className="cd hv" style={{ margin: 0 }}><div className="cd-h"><div className="cd-t">Visão do Funil</div></div><div className="cd-b" style={{ height: 300 }}><Doughnut data={fCD} options={{ responsive: true, maintainAspectRatio: false, plugins: { tooltip: { enabled: false }, legend: { display: false } }, cutout: "75%" } as any} /></div></div></Lk><div className="cd hv" style={{ margin: 0 }}><div className="cd-h"><div className="cd-t">Detalhamento</div></div><div className="cd-b">{["1. Leads (Contatos)", "2. Agendamentos", "3. Comparecimento", "4. Convertidos (Venda)", "5. Retorno / LTV"].map((l, i, a) => <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: i < a.length - 1 ? 14 : 0, borderBottom: i < a.length - 1 ? "1px solid var(--bd)" : "none", paddingBottom: i < a.length - 1 ? 10 : 0 }}><span>{l}</span><b>0</b></div>)}</div></div></div></div>

      {/* CANAIS */}
      <div className={`ct ${scr === "canais" ? "a" : ""}`}><div className="fu" style={{ marginBottom: 24 }}><h1 className="gf">Canais de Aquisição</h1><div style={{ color: "var(--ts)", fontSize: 14, marginTop: 4 }}>Investimento, ROI e Custo de Aquisição (CAC)</div></div><div className="kg fu s1"><div className="kp hv"><div className="kl">Investimento (Ads)</div><div className="kv">R$ 0,00</div></div><div className="kp hv"><div className="kl">Custo por Lead (CPL)</div><div className="kv">R$ 0,00</div></div><div className="kp hv"><div className="kl">CAC Médio</div><div className="kv">R$ 0,00</div></div><div className="kp hv"><div className="kl">ROAS</div><div className="kv">0x</div></div></div></div>

      {/* INTEGRAÇÕES */}
      <div className={`ct ${scr === "integracoes" ? "a" : ""}`}><div className="fu" style={{ marginBottom: 24 }}><h1 className="gf">Integrações de API e Token</h1><div style={{ color: "var(--ts)", fontSize: 14, marginTop: 4 }}>Toda API e Token leva os dados para o sistema e distribui onde deve ser alocado.</div></div><div className="fu s1" style={{ marginBottom: 24 }}><div className="cd hv" style={{ margin: 0 }}><div className="cd-b"><h3 style={{ marginBottom: 8 }}>Integração API (Google Sheets)</h3><p style={{ fontSize: 12, color: "var(--ts)", marginBottom: 16 }}>Puxe dados em tempo real da sua planilha.</p><div style={{ display: "flex", gap: 8 }}><input type="text" className="fi" placeholder="URL da API..." style={{ margin: 0 }} /><button className="bt bs" onClick={() => startAI("csv")}>Conectar</button></div></div></div></div><div className="g3 fu s2"><Lk locked={isE} title="GTM (PRO)" msg="Gestão de tags avançada." btn="Upgrade"><div className="cd hv" style={{ margin: 0, height: "100%" }}><div className="cd-b"><h3 style={{ marginBottom: 8 }}>Integração Token (GTM)</h3><p style={{ fontSize: 12, color: "var(--ts)", marginBottom: 12 }}>Tracking de funil avançado.</p><div style={{ display: "flex", gap: 8 }}><input type="text" className="fi" style={{ margin: 0 }} placeholder="GTM-XXXXXXX" /><button className="bt bs" onClick={() => startAI("token")}>Salvar</button></div></div></div></Lk><Lk locked={isE} title="Meta Pixel (PRO)" msg="Rastreie conversões de anúncios." btn="Upgrade"><div className="cd hv" style={{ margin: 0, height: "100%" }}><div className="cd-b"><h3 style={{ marginBottom: 8 }}>Integração Token (Meta Pixel)</h3><p style={{ fontSize: 12, color: "var(--ts)", marginBottom: 12 }}>Rastreie conversões de anúncios.</p><div style={{ display: "flex", gap: 8 }}><input type="text" className="fi" style={{ margin: 0 }} placeholder="ID do Pixel" /><button className="bt bs" onClick={() => startAI("token")}>Salvar</button></div></div></div></Lk><Lk locked={nE} title="Integração CRM (ENTERPRISE)" msg="Conexão nativa com HubSpot." btn="Ativar Enterprise"><div className="cd hv" style={{ margin: 0, borderLeft: "4px solid var(--gb)", height: "100%" }}><div className="cd-b"><h3 style={{ marginBottom: 8 }}>Integração API (CRM Externo)</h3><p style={{ fontSize: 12, color: "var(--ts)", marginBottom: 12 }}>HubSpot, RD Station. Distribuição automática.</p><button className="bt bs" style={{ width: "100%" }} onClick={() => startAI("crm")}>Autenticar</button></div></div></Lk></div></div>

      {/* ENTRADA DE DADOS */}
      <div className={`ct ${scr === "dados" ? "a" : ""}`}><div className="fu" style={{ marginBottom: 24 }}><h1 className="gf">Entrada de Dados Manual</h1><div style={{ color: "var(--ts)", fontSize: 14, marginTop: 4 }}>Use quando não houver conexão automática de APIs. Atualiza gráficos em tempo real.</div></div><div className="al fu"><div className="al-t">Governança e Playbook GLX</div><div className="al-d">Sempre que não houver integração automática (API/CRM), a inserção de dados deverá seguir rigorosamente o Playbook. As inserções manuais são auditadas.</div></div><div className="cd hv fu s1"><div className="cd-h"><div className="tn" style={{ margin: 0, border: "none" }}><button className={`tbn ${dTab === "fin" ? "a" : ""}`} onClick={() => setDTab("fin")}>Lançamento Financeiro</button><button className={`tbn ${dTab === "pac" ? "a" : ""}`} onClick={() => setDTab("pac")}>Atendimento / Paciente</button></div></div><div className="cd-b" style={{ paddingTop: 24 }}>{dTab === "fin" && <div><div className="fr"><div><label className="fl">Tipo</label><select className="fs" value={fTipo} onChange={e => setFTipo(e.target.value)}><option value="Receita">Receita (Faturamento)</option><option value="Custo">Custo Fixo</option></select></div><div><label className="fl">Valor (R$)</label><input type="number" className="fi" value={fVal} onChange={e => setFVal(e.target.value)} placeholder="Ex: 500" /></div></div><button className="bt bp" onClick={regFin}>Registrar Financeiro</button></div>}{dTab === "pac" && <div><div className="fr"><div><label className="fl">Status do Agendamento</label><select className="fs" value={pSt} onChange={e => { setPSt(e.target.value); if (e.target.value === "Compareceu") setPMot(""); }}><option value="Compareceu">Realizada (Compareceu)</option><option value="No-Show">Faltou (No-Show)</option><option value="Cancelada">Cancelada</option></select></div><div><label className="fl">Motivo (Obrigatório se Faltou/Cancelou)</label><input type="text" className="fi" value={pMot} onChange={e => setPMot(e.target.value)} placeholder="Ex: Preço, Chuva, Trânsito..." disabled={pSt === "Compareceu"} /></div></div><button className="bt bp" onClick={salvarAt}>Salvar Atendimento</button></div>}</div></div></div>

      {/* RELATÓRIOS */}
      <div className={`ct ${scr === "relatorios" ? "a" : ""}`}><div className="fu" style={{ marginBottom: 24 }}><h1 className="gf">Relatórios e Exportações</h1><div style={{ color: "var(--ts)", fontSize: 14, marginTop: 4 }}>Fechamentos e apresentação da base bruta.</div></div><div className="g2 fu s1" style={{ marginBottom: 24 }}><div className="cd hv"><div className="cd-b" style={{ textAlign: "center", padding: "40px 20px" }}><h3 style={{ marginBottom: 8 }}>Relatório Gerencial PDF</h3><p style={{ fontSize: 13, color: "var(--ts)", marginBottom: 24 }}>PDF comercial com legendas explicativas (O que significa tal indicador).</p><button className="bt bp" onClick={() => setPdf(true)}>Pré-visualizar e Baixar PDF</button></div></div><div className="cd hv"><div className="cd-b" style={{ textAlign: "center", padding: "40px 20px" }}><h3 style={{ marginBottom: 8 }}>Exportar CSV</h3><p style={{ fontSize: 13, color: "var(--ts)", marginBottom: 24 }}>Toda a base de dados do sistema no formato CSV.</p><button className="bt bs" onClick={() => { toast("Preparando CSV..."); setTimeout(() => toast("Arquivo CSV exportado!"), 1500); }}>Baixar CSV</button></div></div></div></div>

      {/* DIAGNÓSTICO */}
      <div className={`ct ${scr === "diagnostico" ? "a" : ""}`}><div className="fu" style={{ marginBottom: 24 }}><h1 className="gf">Diagnóstico GLX</h1><div style={{ color: "var(--ts)", fontSize: 14, marginTop: 4 }}>Análise de maturidade da sua operação.</div></div><div className="cd hv fu s1"><div className="cd-b" style={{ textAlign: "center", padding: "60px 20px" }}><div style={{ fontSize: 64, fontWeight: 700, color: "var(--bdl)", fontFamily: "'Google Sans'" }}>00</div><div style={{ fontSize: 16, fontWeight: 500, marginTop: 8 }}>Diagnóstico em Análise</div><div style={{ fontSize: 13, color: "var(--ts)", marginTop: 8 }}>Insira volume de dados na operação para o motor calcular seu Score de Maturidade.</div></div></div></div>

      {/* CONFIGURAÇÕES */}
      <div className={`ct ${scr === "configuracoes" ? "a" : ""}`}><div className="fu" style={{ marginBottom: 24 }}><h1 className="gf">Configurações Gerais</h1></div><div className="cd hv fu s1"><div className="cd-h"><div className="cd-t">Parâmetros e Metas Ouro</div></div><div className="cd-b"><div className="fr"><div><label className="fl">Meta Faturamento (R$)</label><input type="number" className="fi" placeholder="0,00" /></div><div><label className="fl">Limite Aceitável No-Show (%)</label><input type="number" className="fi" placeholder="Ex: 10" /></div></div><div className="fr"><div><label className="fl">Meta NPS</label><input type="number" className="fi" placeholder="Ex: 75" /></div><div><label className="fl">Tempo Limite Espera Recepção (min)</label><input type="number" className="fi" placeholder="Ex: 15" /></div></div><button className="bt bp" onClick={() => toast("Configurações salvas.")}>Atualizar Metas</button></div></div></div>

    </main>
  </div></>);
}
