import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import jsPDF from "jspdf";
import { type Lang, LANG_LABELS, LANG_FLAGS, t } from "@/lib/i18n";
import { parseClinicFile, buildRoutingLog, buildWarnings, type ParseResult } from "@/lib/clinicParser";
import { canAccessSection, getMinPlanForSection, normalizePlanTier, type SectionId } from "@shared/controlTowerRules";
import {
  Activity,
  Calendar,
  ClipboardList,
  Database,
  FileText,
  Filter,
  Info,
  LayoutDashboard,
  Lock,
  LogOut,
  Megaphone,
  Moon,
  Settings,
  Sun,
  Users,
} from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

/* â”€â”€â”€ TYPES â”€â”€â”€ */
interface ParetoItem { motivo: string; freq: number; }
interface AppState { faturamento_bruto: number; total_pacientes: number; no_shows_abs: number; cac: number; ltv: number; roi: number; churn: number; lucro: number; pareto: ParetoItem[]; }
interface IntegrationConfig { id: string; type: string; name: string; token: string; apiUrl: string; status: "active" | "inactive" | "pending" | "error"; lastSync: string | null; config: Record<string, string>; }
interface ManualRecord { id: string; type: "financial" | "attendance"; label: string; value: number | string; detail: string; createdAt: string; }
interface SprintItem { id: string; title: string; owner: string; deadline: string; progress: number; status: "backlog" | "executing" | "review" | "done"; linkedOkrId: string | null; }
interface OkrItem { id: string; objective: string; keyResult: string; owner: string; target: number; current: number; status: "todo" | "in_progress" | "checking" | "done"; }
interface TeamItem { id: string; name: string; role: string; appointments: number; conversion: number; status: "available" | "working" | "followup" | "goal_hit"; }
interface DashboardSettings {
  revenueGoal: number;
  noShowLimit: number;
  npsGoal: number;
  waitTimeLimit: number;
  conversionGoal: number;
  sprintCadenceDays: number;
  sprintWipLimit: number;
  teamDailyCapacity: number;
  okrCheckInDays: number;
  p1NoShowLimit: number;
  p1MarginLimit: number;
}

/* â”€â”€â”€ INITIAL STATE (ZEROED) â”€â”€â”€ */
const INIT: AppState = { faturamento_bruto: 0, total_pacientes: 0, no_shows_abs: 0, cac: 0, ltv: 0, roi: 0, churn: 0, lucro: 0, pareto: [] };

const DEFAULT_OKRS: OkrItem[] = [
  { id: "okr-growth-q1", objective: "Crescer faturamento com previsibilidade", keyResult: "Atingir R$ 2.8M no trimestre", owner: "Comercial", target: 2800000, current: 2140000, status: "in_progress" },
  { id: "okr-noshow-q1", objective: "Reduzir no-show", keyResult: "Levar no-show para <= 10%", owner: "Operacoes", target: 10, current: 12.6, status: "checking" },
  { id: "okr-efficiency-q1", objective: "Aumentar produtividade de agenda", keyResult: "Subir conversao geral para >= 78%", owner: "Equipe", target: 78, current: 71.4, status: "todo" },
];

const DEFAULT_SPRINTS: SprintItem[] = [
  { id: "spr-ads-tracking", title: "Tracking server-side para Ads", owner: "Time Performance", deadline: "2026-03-05", progress: 58, status: "executing", linkedOkrId: "okr-growth-q1" },
  { id: "spr-noshow-playbook", title: "Playbook anti no-show", owner: "Time Operacoes", deadline: "2026-02-28", progress: 84, status: "review", linkedOkrId: "okr-noshow-q1" },
  { id: "spr-funnel-ritual", title: "Ritual semanal de funil", owner: "Time Comercial", deadline: "2026-03-10", progress: 20, status: "backlog", linkedOkrId: "okr-efficiency-q1" },
];

const DEFAULT_TEAM: TeamItem[] = [
  { id: "team-ana", name: "Ana Paula", role: "Comercial", appointments: 132, conversion: 38.4, status: "working" },
  { id: "team-bruno", name: "Bruno Lima", role: "Operacoes", appointments: 98, conversion: 33.2, status: "followup" },
  { id: "team-carla", name: "Carla Souza", role: "Recepcao", appointments: 156, conversion: 41.1, status: "goal_hit" },
  { id: "team-diego", name: "Diego Nunes", role: "Gestao", appointments: 74, conversion: 28.9, status: "available" },
];

const DEFAULT_SETTINGS: DashboardSettings = {
  revenueGoal: 2800000,
  noShowLimit: 10,
  npsGoal: 75,
  waitTimeLimit: 15,
  conversionGoal: 78,
  sprintCadenceDays: 14,
  sprintWipLimit: 6,
  teamDailyCapacity: 18,
  okrCheckInDays: 7,
  p1NoShowLimit: 20,
  p1MarginLimit: 18,
};

const SPRINT_STATUS_ORDER: SprintItem["status"][] = ["backlog", "executing", "review", "done"];
const TEAM_STATUS_ORDER: TeamItem["status"][] = ["available", "working", "followup", "goal_hit"];
const OKR_STATUS_ORDER: OkrItem["status"][] = ["todo", "in_progress", "checking", "done"];

const SPRINT_STATUS_LABEL: Record<SprintItem["status"], string> = {
  backlog: "status.backlog",
  executing: "status.executing",
  review: "status.review",
  done: "status.done",
};

const TEAM_STATUS_LABEL: Record<TeamItem["status"], string> = {
  available: "status.available",
  working: "status.working",
  followup: "status.followup",
  goal_hit: "status.goalHit",
};

const OKR_STATUS_LABEL: Record<OkrItem["status"], string> = {
  todo: "status.todo",
  in_progress: "status.inProgress",
  checking: "status.checking",
  done: "status.done",
};

/* TEST SEED DATA */
const TEST_USER_EMAILS = new Set(["cliente.teste@glxpartners.com", "teste@glx.com"]);
const TEST_INTEGRATION_FORM: Record<string, string> = {
  google_ads_token: "123-456-7890",
  google_ads_url: "ya29.a0AfH6SMBGlxFakeGoogleAdsToken",
  gtm_token: "GTM-GLX1234",
  meta_pixel_token: "123456789012345",
  meta_capi_token: "EAAFakeMetaCapiTokenGLX1234567890",
  meta_capi_url: "123456789012345",
  google_sheets_url: "https://docs.google.com/spreadsheets/d/1GLXFAKEKPIID1234567890/edit#gid=0",
  excel_token: "6f4f59a2-8d7d-4b57-9b6d-ec7f8f0f4a25",
  excel_url: "2f3f9d2a-9dcf-4f7f-8bc0-9d38f6de4f43",
  powerbi_url: "https://app.powerbi.com/reportEmbed?reportId=11111111-2222-3333-4444-555555555555",
  hubspot_token: "pat-na1-glx-fake-hubspot-token-12345",
  rdstation_token: "rds_glx_fake_token_987654321",
};

const getTestIntegrations = (): IntegrationConfig[] => {
  const now = new Date().toISOString();
  return [
    { id: crypto.randomUUID(), type: "google_ads", name: "Google Ads", token: TEST_INTEGRATION_FORM.google_ads_token, apiUrl: TEST_INTEGRATION_FORM.google_ads_url, status: "active", lastSync: now, config: {} },
    { id: crypto.randomUUID(), type: "gtm", name: "GTM", token: TEST_INTEGRATION_FORM.gtm_token, apiUrl: "", status: "active", lastSync: now, config: {} },
    { id: crypto.randomUUID(), type: "meta_pixel", name: "Meta Pixel", token: TEST_INTEGRATION_FORM.meta_pixel_token, apiUrl: "", status: "active", lastSync: now, config: {} },
    { id: crypto.randomUUID(), type: "meta_capi", name: "Meta CAPI", token: TEST_INTEGRATION_FORM.meta_capi_token, apiUrl: TEST_INTEGRATION_FORM.meta_capi_url, status: "active", lastSync: now, config: {} },
    { id: crypto.randomUUID(), type: "google_sheets", name: "Google Sheets", token: "", apiUrl: TEST_INTEGRATION_FORM.google_sheets_url, status: "active", lastSync: now, config: {} },
    { id: crypto.randomUUID(), type: "excel", name: "Excel", token: TEST_INTEGRATION_FORM.excel_token, apiUrl: TEST_INTEGRATION_FORM.excel_url, status: "active", lastSync: now, config: {} },
    { id: crypto.randomUUID(), type: "powerbi", name: "Power BI", token: "", apiUrl: TEST_INTEGRATION_FORM.powerbi_url, status: "active", lastSync: now, config: {} },
    { id: crypto.randomUUID(), type: "hubspot", name: "HubSpot", token: TEST_INTEGRATION_FORM.hubspot_token, apiUrl: "", status: "active", lastSync: now, config: {} },
    { id: crypto.randomUUID(), type: "rdstation", name: "RD Station", token: TEST_INTEGRATION_FORM.rdstation_token, apiUrl: "", status: "active", lastSync: now, config: {} },
  ];
};

/* CSS */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Sora:wght@400;500;600;700&display=swap');
.D{--bg:#0B0B0C;--sf:#111113;--sfh:#1A1A1D;--sfa:#202024;--bd:#2a2a2e;--bdl:#3a3a40;--tp:#FFFFFF;--ts:#A1A1AA;--gb:#FF7A00;--gbh:#FF8C1A;--gbb:rgba(255,122,0,.12);--gbt:#FF7A00;--gr:#EF4444;--grb:rgba(239,68,68,.12);--grt:#EF4444;--gy:#FACC15;--gyb:rgba(250,204,21,.12);--gyt:#EAB308;--gg:#22C55E;--ggb:rgba(34,197,94,.12);--ggt:#16A34A;--gp:#FF7A00;--sw:260px;--th:70px;--rc:16px;--rb:100px;--s1:0 4px 12px rgba(0,0,0,.5);--s2:0 8px 24px rgba(0,0,0,.7);--bf:blur(8px);--ob:rgba(11,11,12,.8)}
.D.lt{--bg:#f8f9fa;--sf:#fff;--sfh:#f1f3f4;--sfa:#e8eaed;--bd:#dadce0;--bdl:#bdc1c6;--tp:#202124;--ts:#5f6368;--gb:#E66900;--gbh:#FF7A00;--gbb:rgba(255,122,0,.08);--gbt:#E66900;--gr:#ea4335;--grb:#fce8e6;--grt:#c5221f;--gy:#fbbc04;--gyb:#fef7e0;--gyt:#e37400;--gg:#34a853;--ggb:#e6f4ea;--ggt:#137333;--gp:#E66900;--s1:0 1px 3px rgba(60,64,67,.3);--s2:0 4px 8px rgba(60,64,67,.15);--ob:rgba(255,255,255,.7)}
.D{background-color:var(--bg);background-image:radial-gradient(1100px 480px at 12% -10%,rgba(255,122,0,.18),transparent 70%),radial-gradient(860px 420px at 88% -8%,rgba(56,189,248,.12),transparent 72%),linear-gradient(180deg,#090a0d 0%,#0b0d11 46%,#0a0b0f 100%);color:var(--tp);font-family:'Sora','Manrope',sans-serif;min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;font-feature-settings:'liga' 1,'kern' 1;transition:background-color .3s,color .3s;display:flex;animation:fi .5s}
.D h1,.D h2,.D h3,.D h4,.D h5,.gf{font-family:'Sora','Manrope',sans-serif}
.sb{width:var(--sw);background:var(--sf);border-right:1px solid var(--bd);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:200;transition:background-color .3s,border-color .3s}
.sb-l{padding:20px 24px;display:flex;align-items:center;gap:12px;height:var(--th);border-bottom:1px solid transparent}
.sb-i{width:32px;height:32px;border-radius:8px;overflow:hidden;display:flex;align-items:center;justify-content:center;font-weight:700;font-family:'Sora'}
.sb-i img{width:100%;height:100%;object-fit:contain}
.sb-n{font-size:18px;font-weight:500;color:var(--tp);font-family:'Sora'}
.sb-nv{flex:1;padding:12px 0;overflow-y:auto}.sb-nv::-webkit-scrollbar{width:4px}.sb-nv::-webkit-scrollbar-thumb{background:var(--bd);border-radius:4px}
.sb-gl{font-size:11px;font-weight:500;text-transform:uppercase;color:var(--ts);padding:8px 24px;margin-top:8px;letter-spacing:.8px}
.ni{display:flex;align-items:center;gap:16px;padding:0 24px;height:40px;cursor:pointer;font-size:14px;font-weight:500;color:var(--tp);border-radius:0 100px 100px 0;margin-right:16px;transition:background .2s}
.ni:hover{background:var(--sfh)}.ni.a{background:var(--gbb);color:var(--gbt)}.ni.a svg{stroke:var(--gbt)}
.ni svg{width:18px;height:18px;flex-shrink:0;stroke:var(--ts);stroke-width:1.8;fill:none;shape-rendering:geometricPrecision}
.sb-bt{padding:16px;border-top:1px solid var(--bd)}
.uc{display:flex;align-items:center;gap:12px;padding:8px;border-radius:8px;cursor:pointer;transition:background .2s}.uc:hover{background:var(--sfh)}
.av{width:32px;height:32px;border-radius:50%;background:var(--tp);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:var(--bg)}
.un{font-size:13px;font-weight:500;color:var(--tp);white-space:nowrap;text-overflow:ellipsis;overflow:hidden}
.ue{font-size:11px;color:var(--ts)}
.sb-lo{padding:8px 16px;margin-top:8px}.sb-lo button{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;padding:8px 16px;border-radius:8px;background:transparent;border:1px solid var(--gr);color:var(--gr);font-size:13px;font-weight:500;cursor:pointer;transition:all .2s;font-family:'Sora'}.sb-lo button:hover{background:var(--grb);border-color:var(--grt)}
.lang-sel{padding:8px 16px;margin-bottom:4px}
.lang-sel .lang-opts{display:flex;gap:6px;flex-wrap:wrap}.lang-sel .lang-btn{flex:1;background:var(--sfh);border:1px solid var(--bd);color:var(--ts);font-family:'Sora',sans-serif;font-size:12px;padding:6px 8px;border-radius:8px;cursor:pointer;transition:all .2s;text-align:center;white-space:nowrap}.lang-sel .lang-btn:hover{border-color:var(--gb);color:var(--tp)}.lang-sel .lang-btn.active{background:var(--gb);border-color:var(--gb);color:#fff;font-weight:500}
.lang-sel label{font-size:11px;font-weight:500;color:var(--ts);margin-bottom:4px;display:block;text-transform:uppercase;letter-spacing:.5px}
.mn{margin-left:var(--sw);flex:1;display:flex;flex-direction:column;min-width:0}
.tb{height:var(--th);background:var(--sf);border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;padding:0 32px;position:sticky;top:0;z-index:100;transition:background-color .3s,border-color .3s}
.tb-t{font-size:22px;font-weight:600;color:var(--tp);font-family:'Sora'}
.ct{padding:32px;flex:1;display:none;max-width:1400px;margin:0 auto;width:100%}.ct.a{display:block;animation:fi .4s}
.cd{background:var(--sf);border:1px solid var(--bd);border-radius:var(--rc);transition:transform .3s ease,box-shadow .3s ease,background-color .3s,border-color .3s;overflow:hidden;box-shadow:var(--s1);position:relative;margin-bottom:24px}
.cd.hv:hover{box-shadow:var(--s2);border-color:var(--bdl);transform:translateY(-2px)}
.cd-h{padding:20px 24px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--bd)}
.cd-t{font-size:16px;font-weight:500;color:var(--tp);font-family:'Sora'}
.cd-b{padding:24px;position:relative}
.kg{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:24px}
.kp{background:var(--sf);border:1px solid var(--bd);border-radius:var(--rc);padding:20px;box-shadow:var(--s1);transition:transform .2s,border-color .2s;position:relative}
.kp:hover{transform:translateY(-2px);border-color:var(--bdl)}
.kl{font-size:13px;font-weight:500;color:var(--ts);margin-bottom:12px;font-family:'Sora'}
.kv{font-size:34px;font-weight:500;color:var(--tp);font-family:'Sora';margin-bottom:6px;letter-spacing:-.02em}
.km{font-size:12px;color:var(--ts);display:flex;align-items:center;gap:6px}
.lk{position:relative;border-radius:var(--rc);margin-bottom:24px;overflow:hidden}
.lk-c.lkd{opacity:.5;pointer-events:none;user-select:none;transition:opacity .3s}
.lk-c.ulk{opacity:1;pointer-events:auto;transition:opacity .3s}
.lk-o{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:10;background:rgba(11,11,12,0.4);border-radius:inherit}
.lk-cd{background:var(--sf);border:1px solid var(--bdl);padding:32px;border-radius:16px;text-align:center;max-width:360px;box-shadow:var(--s2);animation:su .3s ease}
.lk-cd h3{margin-bottom:8px;color:var(--tp);font-family:'Sora';font-size:16px}
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
.bt{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 24px;border-radius:var(--rb);font-family:'Sora',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s;border:none;outline:none}
.bp{background:var(--gb);color:#000;font-weight:600}.bp:hover{filter:brightness(1.1);box-shadow:var(--s1);transform:translateY(-1px)}
.bs{background:var(--sfh);color:var(--tp);border:1px solid var(--bd)}.bs:hover{background:var(--sfa);border-color:var(--bdl)}
.bgh{background:transparent;color:var(--tp);border:1px solid transparent}.bgh:hover{background:var(--sfh);border-color:var(--bd)}
.theme-toggle{height:42px;width:42px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--bdl);background:linear-gradient(180deg,var(--sfh),var(--sf));color:var(--tp);cursor:pointer;transition:all .2s}
.theme-toggle:hover{transform:translateY(-1px);border-color:var(--gb);box-shadow:var(--s1);color:var(--gb)}
.bu{background:linear-gradient(135deg,var(--gp),var(--gb));color:#fff;font-weight:bold;border-radius:var(--rb);border:none;padding:10px 24px;cursor:pointer}.bu:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 4px 12px rgba(197,138,249,.3)}
.bai{background:linear-gradient(135deg,var(--gp),var(--gb));color:#000;font-weight:600;border-radius:var(--rb);border:none;padding:10px 24px;cursor:pointer}.bai:hover{filter:brightness(1.1);transform:translateY(-1px)}
.bd{background:transparent;color:var(--gr);border:1px solid var(--gr);padding:6px 12px;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;transition:all .2s;font-family:'Sora'}.bd:hover{background:var(--grb)}
.logic-note{background:linear-gradient(180deg,var(--sf),var(--sfh));border:1px solid var(--bd);border-radius:14px;padding:14px 16px;margin-bottom:18px}
.logic-title{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--gb);font-weight:700;margin-bottom:8px}
.logic-row{display:flex;justify-content:space-between;gap:16px;padding:8px 0;border-bottom:1px solid var(--bd)}
.logic-row:last-child{border-bottom:none;padding-bottom:0}
.logic-row span{font-size:12px;color:var(--ts)}
.logic-row strong{font-size:12px;color:var(--tp);font-weight:600;text-align:right}
.fl{font-size:13px;font-weight:500;color:var(--ts);margin-bottom:8px;display:block;text-align:left}
.fi,.fs{width:100%;background:var(--sfh);border:1px solid var(--bd);color:var(--tp);font-family:'Manrope',sans-serif;font-size:14px;padding:12px 16px;border-radius:8px;outline:none;transition:border .2s;margin-bottom:16px}.fi:focus,.fs:focus{border-color:var(--gb)}
.fr{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.tn{display:flex;border-bottom:1px solid var(--bd);margin-bottom:24px;gap:8px}
.tbn{padding:12px 24px;font-size:14px;font-weight:500;color:var(--ts);cursor:pointer;border-bottom:3px solid transparent;transition:color .2s;font-family:'Sora';background:none;border-top:none;border-left:none;border-right:none}.tbn.a{color:var(--gb);border-bottom-color:var(--gb)}
.mo{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);animation:fi .2s}
.ml{background:var(--sf);border-radius:16px;border:1px solid var(--bd);width:90%;max-width:500px;box-shadow:var(--s2);overflow:hidden;animation:su .3s ease}
.ml-h{padding:24px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--bd)}
.ml-t{font-size:18px;font-weight:500;font-family:'Sora';color:var(--tp);display:flex;align-items:center;gap:8px}
.ml-x{cursor:pointer;color:var(--ts);font-size:20px;background:transparent;border:none;padding:8px;border-radius:50%;transition:background .2s}
.ml-b{padding:24px}
.ml-f{padding:16px 24px;background:rgba(0,0,0,.1);display:flex;justify-content:flex-end;gap:12px;border-top:1px solid var(--bd)}
.tc{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:10px}
.tt{background:var(--sf);color:var(--tp);padding:14px 28px;border-radius:12px;font-size:14px;font-weight:500;box-shadow:var(--s2);border:1px solid var(--bd);animation:ti .3s ease;font-family:'Sora'}
.rt{background:#0f1115;border:1px solid var(--bd);border-radius:8px;padding:16px;font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--gg);min-height:150px;text-align:left}
.pm{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:10000;padding:40px;overflow-y:auto;backdrop-filter:blur(4px)}
.pp{background:#fff;color:#000;max-width:800px;margin:0 auto;padding:40px;box-shadow:0 10px 30px rgba(0,0,0,.5);border-radius:4px}
.pl{background:#f8f9fa;padding:20px;border-radius:8px;border:1px solid #dadce0;margin-top:32px;text-align:left}
.pl h4{color:#1a73e8;margin-bottom:12px;font-family:'Sora'}
.pl li{margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #e8eaed;line-height:1.5;font-size:12px;color:#5f6368}
.int-st{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:100px;font-size:11px;font-weight:600}
.int-st.act{background:var(--ggb);color:var(--ggt)}.int-st.pen{background:var(--gyb);color:var(--gyt)}.int-st.ina{background:var(--sfh);color:var(--ts)}.int-st.err{background:var(--grb);color:var(--grt)}
.int-dot{width:6px;height:6px;border-radius:50%;display:inline-block}
.int-dot.act{background:var(--gg)}.int-dot.pen{background:var(--gy)}.int-dot.ina{background:var(--ts)}.int-dot.err{background:var(--gr)}
.rec-box{background:linear-gradient(135deg,rgba(138,180,248,.08),rgba(197,138,249,.08));border:1px solid var(--bdl);border-radius:12px;padding:20px;margin-top:24px}
.rec-box h4{color:var(--gp);margin-bottom:8px;font-size:14px;font-family:'Sora'}
.rec-box p{font-size:12px;color:var(--ts);line-height:1.6}
.dz{border:2px dashed var(--bdl);border-radius:12px;padding:40px 24px;text-align:center;cursor:pointer;transition:border-color .2s,background .2s}.dz:hover{border-color:var(--gb);background:var(--gbb)}
.dz.over{border-color:var(--gb);background:var(--gbb)}
.rec-tbl{width:100%;border-collapse:collapse;text-align:left;margin-top:16px}.rec-tbl th{font-size:11px;font-weight:600;color:var(--ts);padding:10px 12px;border-bottom:1px solid var(--bd);text-transform:uppercase;letter-spacing:.5px}.rec-tbl td{font-size:13px;color:var(--tp);padding:12px;border-bottom:1px solid var(--sfh)}.rec-tbl tr:hover td{background:rgba(255,255,255,.02)}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes su{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes ti{from{transform:translateY(100px);opacity:0}to{transform:translateY(0);opacity:1}}
.fu{animation:su .5s ease both}.s1{animation-delay:.05s}.s2{animation-delay:.1s}
.lgd{background:linear-gradient(135deg,rgba(138,180,248,.06),rgba(197,138,249,.04));border:1px solid var(--bd);border-radius:12px;padding:16px 20px;margin-bottom:20px;transition:all .3s}
.lgd-hd{display:flex;align-items:center;gap:8px;cursor:pointer;user-select:none}
.lgd-ic{width:22px;height:22px;border-radius:50%;background:var(--gbb);display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;transition:transform .2s}
.lgd-ic.open{transform:rotate(180deg)}
.lgd-tl{font-size:13px;font-weight:600;color:var(--gb);font-family:'Sora'}
.lgd-bd{max-height:0;overflow:hidden;transition:max-height .4s ease,padding .3s;padding-top:0}
.lgd-bd.open{max-height:2000px;padding-top:14px}
.lgd-bd p,.lgd-bd li{font-size:12px;color:var(--ts);line-height:1.7;margin-bottom:6px}
.lgd-bd strong{color:var(--tp);font-weight:600}
.lgd-bd .lgd-term{display:grid;grid-template-columns:140px 1fr;gap:4px 12px;margin-bottom:8px}
.lgd-bd .lgd-term dt{font-weight:600;color:var(--gbt);font-size:12px}
.lgd-bd .lgd-term dd{font-size:12px;color:var(--ts);margin:0}
.lgd-bd .lgd-calc{background:var(--sfh);border-radius:8px;padding:12px 16px;margin:8px 0;font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--tp);border:1px solid var(--bd)}
.lgd-bd ul{padding-left:16px;margin:8px 0}
.ni.lk{opacity:.45;cursor:not-allowed}
.ni.lk:hover{background:transparent !important;opacity:.55}
.ni-lock{margin-left:auto;display:inline-flex;align-items:center;opacity:.9}
.kb-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.kb-col{background:var(--sfh);border:1px solid var(--bd);border-radius:12px;min-height:210px;padding:10px}
.kb-col.drop{border-color:var(--gb);box-shadow:0 0 0 1px rgba(255,122,0,.35)}
.kb-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.kb-t{font-size:12px;font-weight:700;color:var(--tp);letter-spacing:.03em;text-transform:uppercase}
.kb-c{font-size:11px;color:var(--ts);background:var(--sf);padding:2px 8px;border-radius:999px}
.kb-list{display:flex;flex-direction:column;gap:8px}
.kb-card{background:var(--sf);border:1px solid var(--bd);border-radius:10px;padding:10px;cursor:grab;transition:all .2s}
.kb-card:hover{border-color:var(--bdl);transform:translateY(-1px)}
.kb-card:active{cursor:grabbing}
.kb-tt{font-size:12px;font-weight:600;color:var(--tp);line-height:1.35}
.kb-sub{font-size:11px;color:var(--ts);margin-top:4px}
.kb-p{margin-top:8px;height:6px;border-radius:99px;background:var(--sfh);overflow:hidden}
.kb-p > span{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,var(--gb),#22C55E)}
.kb-map td{font-size:12px}
@media(max-width:768px){.sb{display:none}.mn{margin-left:0}.g2,.g3,.g21{grid-template-columns:1fr}.fr{grid-template-columns:1fr}}
`;

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [app, setApp] = useState<AppState>(INIT);
  const [scr, setScr] = useState("dashboard");
  const plan = normalizePlanTier((user as any)?.plan);
  const [lt, setLt] = useState(false);
  const [lang, setLang] = useState<Lang>("pt");
  const [toasts, setToasts] = useState<string[]>([]);
  const [modal, setModal] = useState<string | null>(null);
  const [rLogs, setRLogs] = useState<string[]>([]);
  const [rDone, setRDone] = useState(false);
  const [qA, setQA] = useState("");
  const [qL, setQL] = useState("");
  const [audit, setAudit] = useState(false);
  const [fTipo, setFTipo] = useState(() => t("data.revenue", "pt"));
  const [fVal, setFVal] = useState("");

  const [pdf, setPdf] = useState(false);
  const [records, setRecords] = useState<ManualRecord[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [openLegends, setOpenLegends] = useState<Record<string, boolean>>({});
  const toggleLegend = (id: string) => setOpenLegends(p => ({ ...p, [id]: !p[id] }));
  const [sprints, setSprints] = useState<SprintItem[]>(DEFAULT_SPRINTS);
  const [okrs, setOkrs] = useState<OkrItem[]>(DEFAULT_OKRS);
  const [teamBoard, setTeamBoard] = useState<TeamItem[]>(DEFAULT_TEAM);
  const [settings, setSettings] = useState<DashboardSettings>(DEFAULT_SETTINGS);
  const [boardsReady, setBoardsReady] = useState(false);
  const [dragSprintId, setDragSprintId] = useState<string | null>(null);
  const [dragTeamId, setDragTeamId] = useState<string | null>(null);
  const [dragOkrId, setDragOkrId] = useState<string | null>(null);
  const [dropSprintStatus, setDropSprintStatus] = useState<SprintItem["status"] | null>(null);
  const [dropTeamStatus, setDropTeamStatus] = useState<TeamItem["status"] | null>(null);
  const [dropOkrStatus, setDropOkrStatus] = useState<OkrItem["status"] | null>(null);
  const [sprintForm, setSprintForm] = useState({ title: "", owner: "", deadline: "", linkedOkrId: "" });
  const [okrForm, setOkrForm] = useState({ objective: "", keyResult: "", owner: "", target: "" });
  const [teamForm, setTeamForm] = useState({ name: "", role: "" });

  /* â”€â”€â”€ tRPC: MANUAL ENTRIES â”€â”€â”€ */
  const entriesQuery = trpc.manualEntries.list.useQuery({});
  const createEntryMut = trpc.manualEntries.create.useMutation({ onSuccess: () => entriesQuery.refetch() });
  const deleteEntryMut = trpc.manualEntries.delete.useMutation({ onSuccess: () => entriesQuery.refetch() });

  // Sync tRPC data to local records state
  useEffect(() => {
    if (entriesQuery.data) {
      const mapped: ManualRecord[] = entriesQuery.data.map((e: any) => ({
        id: String(e.id),
        type: e.category as "financial" | "attendance",
        label: e.label,
        value: e.value ? parseFloat(e.value) : 0,
        detail: e.detail || "\u2014",
        createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : new Date().toISOString(),
      }));
      setRecords(mapped);
      // Recalculate appState from DB records
      let fat = 0, pac = 0, ns = 0;
      const paretoMap: Record<string, number> = {};
      mapped.forEach(r => {
        if (r.type === "financial" && (r.label === "Receita" || r.label === "Receita (Faturamento)" || r.label === "Revenue" || r.label === "Ingreso" || r.label === "Ingreso (Facturaci\u00F3n)")) fat += (r.value as number);
        if (r.type === "attendance") { pac++; if (r.label === "No-Show" || r.label === "Cancelada" || r.label === "Cancelled" || r.label === "Cancelado") { ns++; const m = r.detail === "\u2014" ? t("misc.notIdentified", lang) : r.detail; paretoMap[m] = (paretoMap[m] || 0) + 1; } }
      });
      setApp(p => ({ ...p, faturamento_bruto: fat, total_pacientes: pac, no_shows_abs: ns, pareto: Object.entries(paretoMap).map(([motivo, freq]) => ({ motivo, freq })) }));
    }
  }, [entriesQuery.data]);
  const rRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* â”€â”€â”€ INTEGRATIONS STATE â”€â”€â”€ */
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [intTab, setIntTab] = useState("tracking");
  const [intForm, setIntForm] = useState<Record<string, string>>({});

  useEffect(() => { if (!loading && !user) setLocation("/login"); }, [loading, user, setLocation]);
  useEffect(() => {
    const email = ((user as any)?.email || "").toLowerCase();
    if (!TEST_USER_EMAILS.has(email)) return;
    setIntForm(prev => (Object.keys(prev).length > 0 ? prev : { ...TEST_INTEGRATION_FORM }));
    setIntegrations(prev => (prev.length > 0 ? prev : getTestIntegrations()));
  }, [user]);

  useEffect(() => {
    if (!user || typeof window === "undefined") return;
    const storageBase = `glx-controltower:${((user as any)?.email || "anon").toLowerCase()}`;
    const read = <T,>(suffix: string, fallback: T): T => {
      try {
        const raw = window.localStorage.getItem(`${storageBase}:${suffix}`);
        if (!raw) return fallback;
        return JSON.parse(raw) as T;
      } catch {
        return fallback;
      }
    };

    setSprints(read<SprintItem[]>("sprints", DEFAULT_SPRINTS));
    setOkrs(read<OkrItem[]>("okrs", DEFAULT_OKRS));
    setTeamBoard(read<TeamItem[]>("team", DEFAULT_TEAM));
    setSettings(read<DashboardSettings>("settings", DEFAULT_SETTINGS));
    setBoardsReady(true);
  }, [user]);

  useEffect(() => {
    if (!boardsReady || !user || typeof window === "undefined") return;
    const storageBase = `glx-controltower:${((user as any)?.email || "anon").toLowerCase()}`;
    window.localStorage.setItem(`${storageBase}:sprints`, JSON.stringify(sprints));
    window.localStorage.setItem(`${storageBase}:okrs`, JSON.stringify(okrs));
    window.localStorage.setItem(`${storageBase}:team`, JSON.stringify(teamBoard));
    window.localStorage.setItem(`${storageBase}:settings`, JSON.stringify(settings));
  }, [boardsReady, user, sprints, okrs, teamBoard, settings]);

  const toast = useCallback((m: string) => { setToasts(p => [...p, m]); setTimeout(() => setToasts(p => p.slice(1)), 3000); }, []);
  const _ = useCallback((key: Parameters<typeof t>[0]) => t(key, lang), [lang]);

  useEffect(() => {
    if (entriesQuery.error) {
      toast("Backend de dados indisponivel no momento. Mantendo dados locais para continuar operacao.");
    }
  }, [entriesQuery.error, toast]);

  const txN = app.total_pacientes > 0 ? (app.no_shows_abs / app.total_pacientes) * 100 : 0;
  const txC = app.total_pacientes > 0 ? ((app.total_pacientes - app.no_shows_abs) / app.total_pacientes) * 100 : 0;
  const isE = plan === "essencial";
  const nE = plan !== "enterprise";

  const pareto = useCallback(() => {
    const s = [...app.pareto].sort((a, b) => b.freq - a.freq);
    const total = s.reduce((x, i) => x + i.freq, 0); let ac = 0;
    return s.map(i => { const p = total > 0 ? (i.freq / total) * 100 : 0; ac += p; return { ...i, pct: p, acum: ac }; });
  }, [app.pareto]);

  const gc = lt ? "#e8eaed" : "#2e3540", tc = lt ? "#5f6368" : "#94a3b8", lc = lt ? "#1a73e8" : "#8ab4f8", dc = lt ? "#f1f3f4" : "#2e3540";
  const clamp = (v: number, min = 0, max = 100) => Math.min(max, Math.max(min, v));
  const sprintStatusCount = (status: SprintItem["status"]) => sprints.filter(s => s.status === status).length;
  const teamStatusCount = (status: TeamItem["status"]) => teamBoard.filter(member => member.status === status).length;
  const okrStatusCount = (status: OkrItem["status"]) => okrs.filter(okr => okr.status === status).length;
  const sprintDone = sprintStatusCount("done");
  const sprintSuccessRate = sprints.length ? Math.round((sprintDone / sprints.length) * 100) : 0;
  const okrAverageProgress = okrs.length
    ? Math.round(okrs.reduce((acc, okr) => acc + clamp((okr.current / Math.max(1, okr.target)) * 100), 0) / okrs.length)
    : 0;
  const teamSuccessRate = teamBoard.length ? Math.round((teamStatusCount("goal_hit") / teamBoard.length) * 100) : 0;

  const moveSprintStatus = useCallback((id: string, status: SprintItem["status"]) => {
    setSprints(prev => prev.map(item => {
      if (item.id !== id) return item;
      const progressMap: Record<SprintItem["status"], number> = {
        backlog: Math.min(item.progress, 25),
        executing: Math.max(item.progress, 35),
        review: Math.max(item.progress, 75),
        done: 100,
      };
      return { ...item, status, progress: clamp(progressMap[status]) };
    }));
  }, []);

  const moveTeamStatus = useCallback((id: string, status: TeamItem["status"]) => {
    setTeamBoard(prev => prev.map(item => {
      if (item.id !== id) return item;
      const conversionBoost = status === "goal_hit" ? 2.5 : status === "working" ? 1 : 0;
      return { ...item, status, conversion: Number(clamp(item.conversion + conversionBoost, 0, 99).toFixed(1)) };
    }));
  }, []);

  const moveOkrStatus = useCallback((id: string, status: OkrItem["status"]) => {
    setOkrs(prev => prev.map(item => {
      if (item.id !== id) return item;
      const progressMap: Record<OkrItem["status"], number> = {
        todo: Math.min(item.current, item.target * 0.2),
        in_progress: Math.max(item.current, item.target * 0.45),
        checking: Math.max(item.current, item.target * 0.8),
        done: item.target,
      };
      return { ...item, status, current: Number(progressMap[status].toFixed(1)) };
    }));
  }, []);

  const createSprint = () => {
    if (!sprintForm.title.trim() || !sprintForm.owner.trim()) {
      toast(_("toast.fillSprintFields"));
      return;
    }
    const payload: SprintItem = {
      id: `spr-${Date.now()}`,
      title: sprintForm.title.trim(),
      owner: sprintForm.owner.trim(),
      deadline: sprintForm.deadline || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      progress: 0,
      status: "backlog",
      linkedOkrId: sprintForm.linkedOkrId || null,
    };
    setSprints(prev => [payload, ...prev]);
    setSprintForm({ title: "", owner: "", deadline: "", linkedOkrId: "" });
    setModal(null);
    toast(_("toast.sprintCreated"));
  };

  const createOkr = () => {
    if (!okrForm.objective.trim() || !okrForm.keyResult.trim()) {
      toast(_("toast.fillOkrFields"));
      return;
    }
    const target = Number(okrForm.target || 100);
    const payload: OkrItem = {
      id: `okr-${Date.now()}`,
      objective: okrForm.objective.trim(),
      keyResult: okrForm.keyResult.trim(),
      owner: okrForm.owner.trim() || _("modal.management"),
      target: Number.isFinite(target) ? target : 100,
      current: 0,
      status: "todo",
    };
    setOkrs(prev => [payload, ...prev]);
    setOkrForm({ objective: "", keyResult: "", owner: "", target: "" });
    setModal(null);
    toast(_("toast.okrSaved"));
  };

  const createTeamMember = () => {
    if (!teamForm.name.trim() || !teamForm.role.trim()) {
      toast(_("toast.fillProfessionalFields"));
      return;
    }
    const payload: TeamItem = {
      id: `team-${Date.now()}`,
      name: teamForm.name.trim(),
      role: teamForm.role.trim(),
      appointments: 0,
      conversion: 0,
      status: "available",
    };
    setTeamBoard(prev => [payload, ...prev]);
    setTeamForm({ name: "", role: "" });
    setModal(null);
    toast(_("toast.professionalAdded"));
  };

  const ansQ = (q: string) => {
    if (!q) { setQA(_("qa.selectMetric")); setQL(_("qa.selectHint")); return; }
    const d: Record<string, [string, string]> = {
      cac: [`R$ ${app.cac.toLocaleString("pt-BR")}`, _("qa.cacDesc")],
      ltv: [`R$ ${app.ltv.toLocaleString("pt-BR")}`, _("qa.ltvDesc")],
      roi: [`${app.roi}x`, _("qa.roiDesc")],
      churn: [`${app.churn}%`, _("qa.churnDesc")],
      lucro: [`${app.lucro}%`, _("qa.profitDesc")],
    };
    if (d[q]) { setQA(d[q][0]); setQL(d[q][1]); }
  };

  const startAI = (type: string, close?: string) => {
    if (close) setModal(null);
    setModal("ai"); setRLogs([]); setRDone(false);
    let steps: string[] = [];
    if (type === "csv") steps = [_("ai.csv.loading"), _("ai.csv.analyzing"), _("ai.csv.routeStatus"), _("ai.csv.routePareto"), _("ai.csv.routeRevenue"), _("ai.csv.done")];
    else if (type === "crm") steps = [_("ai.crm.auth"), _("ai.crm.extract"), _("ai.crm.routeLeads"), _("ai.crm.routeConversions"), _("ai.crm.sync")];
    else if (type === "token") steps = [_("ai.token.validate"), _("ai.token.mapping"), _("ai.token.routeCost"), _("ai.token.routeCac"), _("ai.token.done")];
    else if (type === "sheets") steps = [_("ai.sheets.connect"), _("ai.sheets.validate"), _("ai.sheets.headers"), _("ai.sheets.route"), _("ai.sheets.sync")];
    else if (type === "meta_capi") steps = [_("ai.capi.init"), _("ai.capi.validate"), _("ai.capi.events"), _("ai.capi.matching"), _("ai.capi.done")];
    else if (type === "google_ads") steps = [_("ai.gads.connect"), _("ai.gads.validate"), _("ai.gads.enhanced"), _("ai.gads.mapping"), _("ai.gads.done")];
    else if (type === "file_import") steps = steps; // handled separately
    let i = 0;
    const nx = () => { if (i < steps.length) { setRLogs(p => [...p, `> ${steps[i]}`]); i++; rRef.current = setTimeout(nx, 800); } else { setRLogs(p => [...p, "> " + _("ai.routingDone")]); setRDone(true); } };
    rRef.current = setTimeout(nx, 800);
  };

  /* â”€â”€â”€ FILE IMPORT (Clinic Parser) â”€â”€â”€ */
  const handleFileImport = async (file: File) => {
    toast(_("file.analyzing"));
    try {
      const parsed = await parseClinicFile(file);
      // Update appState with parsed data
      setApp(prev => {
        const n = { ...prev };
        if (parsed.faturamento_bruto > 0) n.faturamento_bruto = parsed.faturamento_bruto;
        if (parsed.total_pacientes > 0) n.total_pacientes = parsed.total_pacientes;
        if (parsed.no_shows_abs > 0) n.no_shows_abs = parsed.no_shows_abs;
        if (parsed.pareto_array.length > 0) n.pareto = parsed.pareto_array;
        if (parsed.investimento_ads > 0 && parsed.total_pacientes > 0) {
          n.cac = parseFloat((parsed.investimento_ads / parsed.total_pacientes).toFixed(2));
        }
        return n;
      });

      // Open AI Router with real routing logs
      const routingSteps = buildRoutingLog(parsed, parsed.investimento_ads > 0 && parsed.total_pacientes > 0 ? parseFloat((parsed.investimento_ads / parsed.total_pacientes).toFixed(2)) : undefined);
      const warnings = buildWarnings(parsed);

      setModal("ai"); setRLogs([]); setRDone(false);
      let i = 0;
      const allSteps = [...routingSteps];
      if (warnings.length > 0) {
        allSteps.push(_("ai.auditAlerts"));
        warnings.forEach(w => allSteps.push(`  â€” ${w}`));
      }
      allSteps.push("âœ… " + _("file.success"));

      const nx = () => {
        if (i < allSteps.length) {
          setRLogs(p => [...p, `> ${allSteps[i]}`]); i++;
          rRef.current = setTimeout(nx, 700);
        } else { setRDone(true); }
      };
      rRef.current = setTimeout(nx, 700);
    } catch (err: any) {
      toast(`${_("toast.error")}: ${err.message}`);
    }
  };

  /* â”€â”€â”€ REAL PDF GENERATION â”€â”€â”€ */
  const generatePDF = useCallback(() => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    const m = 20;
    let y = 20;
    doc.setFillColor(15, 17, 21); doc.rect(0, 0, w, 40, "F");
    doc.setTextColor(138, 180, 248); doc.setFontSize(22); doc.setFont("helvetica", "bold");
    doc.text(_("pdf.title"), m, 26);
    doc.setFontSize(10); doc.setTextColor(148, 163, 184);
    doc.text(`${_("pdf.generatedAt")}: ${new Date().toLocaleDateString(lang === "en" ? "en-US" : lang === "es" ? "es-ES" : "pt-BR")} ${_("pdf.at")} ${new Date().toLocaleTimeString(lang === "en" ? "en-US" : lang === "es" ? "es-ES" : "pt-BR")}`, m, 34);
    y = 50;
    doc.setTextColor(32, 33, 36); doc.setFontSize(14); doc.setFont("helvetica", "bold");
    doc.text(_("pdf.essentialMetrics"), m, y); y += 10;
    const kpis = [
      { label: _("pdf.grossRevenue"), value: `R$ ${app.faturamento_bruto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
      { label: _("pdf.totalAppointments"), value: String(app.total_pacientes) },
      { label: _("pdf.noshowRate"), value: `${txN.toFixed(1)}%` },
      { label: _("pdf.overallConversion"), value: `${txC.toFixed(1)}%` },
      { label: "CAC", value: `R$ ${app.cac.toLocaleString("pt-BR")}` },
      { label: "LTV", value: `R$ ${app.ltv.toLocaleString("pt-BR")}` },
      { label: "ROI", value: `${app.roi}x` },
      { label: "Churn", value: `${app.churn}%` },
    ];
    const colW = (w - 2 * m) / 2;
    kpis.forEach((kpi, i) => {
      const col = i % 2; const row = Math.floor(i / 2);
      const x = m + col * colW; const ky = y + row * 18;
      doc.setFillColor(248, 249, 250); doc.roundedRect(x, ky, colW - 4, 14, 2, 2, "F");
      doc.setFontSize(9); doc.setTextColor(95, 99, 104); doc.setFont("helvetica", "normal");
      doc.text(kpi.label, x + 4, ky + 5);
      doc.setFontSize(12); doc.setTextColor(32, 33, 36); doc.setFont("helvetica", "bold");
      doc.text(kpi.value, x + 4, ky + 11);
    });
    y += Math.ceil(kpis.length / 2) * 18 + 10;
    const pd = pareto();
    if (pd.length > 0) {
      doc.setFontSize(14); doc.setTextColor(32, 33, 36); doc.setFont("helvetica", "bold");
      doc.text(_("pdf.paretoTitle"), m, y); y += 8;
      doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(95, 99, 104);
      doc.text(_("pdf.reason"), m, y); doc.text(_("pdf.freq"), m + 80, y); doc.text(_("pdf.cumPercent"), m + 100, y);
      y += 2; doc.setDrawColor(218, 220, 224); doc.line(m, y, w - m, y); y += 5;
      doc.setFont("helvetica", "normal"); doc.setTextColor(32, 33, 36);
      pd.forEach(item => { doc.text(item.motivo, m, y); doc.text(String(item.freq), m + 80, y); doc.text(`${item.acum.toFixed(1)}%`, m + 100, y); y += 6; });
      y += 8;
    }
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.setTextColor(26, 115, 232);
    doc.text(_("pdf.glossaryTitle"), m, y); y += 7;
    doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(95, 99, 104);
    const glossary = [_("pdf.glossary1"), _("pdf.glossary2"), _("pdf.glossary3"), _("pdf.glossary4"), _("pdf.glossary5"), _("pdf.glossary6")];
    glossary.forEach(line => { if (y > 270) { doc.addPage(); y = 20; } doc.text(line, m, y, { maxWidth: w - 2 * m }); y += 5; });
    doc.setFillColor(15, 17, 21); doc.rect(0, 285, w, 12, "F");
    doc.setTextColor(148, 163, 184); doc.setFontSize(8);
    doc.text(_("pdf.footer"), m, 292);
    doc.save(`GLX_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    toast(_("toast.pdfGenerated")); setPdf(false);
  }, [app, txN, txC, pareto, toast, _]);

  /* â”€â”€â”€ DATA ENTRY HANDLERS â”€â”€â”€ */
  const regFin = () => {
    const v = parseFloat(fVal);
    if (isNaN(v) || v <= 0) { toast(_("toast.invalidValue")); return; }
    createEntryMut.mutate({
      category: "financial",
      entryType: fTipo,
      label: fTipo,
      value: v.toString(),
      detail: `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    });
    if (fTipo === "Receita" || fTipo.includes("Receita")) { toast(_("toast.revenueAdded")); }
    else toast(_("toast.costAdded"));
    setFVal("");
  };



  const deleteRecord = (id: string) => {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return;
    deleteEntryMut.mutate({ id: numId });
    setDeleteConfirm(null);
    toast(_("toast.recordDeleted"));
  };

  /* â”€â”€â”€ INTEGRATION HELPERS â”€â”€â”€ */
  const saveIntegration = (type: string, name: string) => {
    const token = intForm[`${type}_token`] || "";
    const apiUrl = intForm[`${type}_url`] || "";
    if (!token && !apiUrl) { toast(_("toast.fillField")); return; }
    const existing = integrations.find(i => i.type === type);
    if (existing) {
      setIntegrations(prev => prev.map(i => i.type === type ? { ...i, token, apiUrl, status: "active" as const, lastSync: new Date().toISOString() } : i));
    } else {
      setIntegrations(prev => [...prev, { id: crypto.randomUUID(), type, name, token, apiUrl, status: "active", lastSync: new Date().toISOString(), config: {} }]);
    }
    toast(`${name} ${_("toast.integrationSaved")}`);
    startAI(type === "meta_pixel" || type === "meta_capi" ? "meta_capi" : type === "google_ads" || type === "google_ads_enhanced" ? "google_ads" : type === "google_sheets" ? "sheets" : "token");
  };

  const removeIntegration = (type: string) => {
    setIntegrations(prev => prev.filter(i => i.type !== type));
    setIntForm(prev => { const n = { ...prev }; delete n[`${type}_token`]; delete n[`${type}_url`]; return n; });
    toast(_("toast.integrationRemoved"));
  };

  const getIntStatus = (type: string) => integrations.find(i => i.type === type)?.status || "inactive";
  const isIntActive = (type: string) => getIntStatus(type) === "active";

  const StatusBadge = ({ type }: { type: string }) => {
    const st = getIntStatus(type);
    const labels: Record<string, string> = { active: _("int.active"), inactive: _("int.inactive"), pending: _("int.pending"), error: _("int.error") };
    return <span className={`int-st ${st === "active" ? "act" : st === "pending" ? "pen" : st === "error" ? "err" : "ina"}`}><span className={`int-dot ${st === "active" ? "act" : st === "pending" ? "pen" : st === "error" ? "err" : "ina"}`} />{labels[st]}</span>;
  };

  const titles: Record<string, string> = {
    dashboard: _("title.dashboard"), realtime: _("title.realtime"), agenda: _("title.agenda"), equipe: _("title.equipe"),
    sprints: _("title.sprints"), funil: _("title.funil"), canais: _("title.canais"), integracoes: _("title.integracoes"),
    dados: _("title.dados"), relatorios: _("title.relatorios"), configuracoes: _("title.configuracoes"),
  };

  const pd = pareto();
  const hasParetoData = pd.length > 0;
  const pCD: any = hasParetoData ? { labels: pd.map(d => d.motivo), datasets: [{ type: "line", label: _("chart.cumPercent"), data: pd.map(d => d.acum), borderColor: "#fbbc04", borderWidth: 3, yAxisID: "y1", tension: 0.3, pointRadius: 4 }, { type: "bar", label: _("chart.freqNoShows"), data: pd.map(d => d.freq), backgroundColor: lc, borderRadius: 4, yAxisID: "y" }] } : { labels: [_("chart.noData")], datasets: [{ data: [0], backgroundColor: [dc] }] };
  const pO: any = { responsive: true, maintainAspectRatio: false, scales: { y: { type: "linear", position: "left", grid: { color: gc }, ticks: { color: tc } }, y1: { type: "linear", position: "right", max: 100, grid: { drawOnChartArea: false }, ticks: { color: tc, callback: (v: any) => v + "%" } }, x: { grid: { display: false }, ticks: { color: tc } } }, plugins: { legend: { labels: { color: tc } } } };

  const monthLabels = [_("chart.month1"), _("chart.month2"), _("chart.month3"), _("chart.month4"), _("chart.month5"), _("chart.month6")];
  const revenueBase = app.faturamento_bruto > 0 ? app.faturamento_bruto : 2400000;
  const monthlyRevenueSeries = monthLabels.map((_, idx) => Math.round(revenueBase * (0.72 + idx * 0.055)));
  const monthlyCostSeries = monthlyRevenueSeries.map(v => Math.round(v * 0.62));
  const monthlyMarginSeries = monthlyRevenueSeries.map((v, idx) => v - monthlyCostSeries[idx]);
  const noShowReference = txN > 0 ? txN : 18.3;
  const monthlyNoShowSeries = monthLabels.map((_, idx) => Number((Math.max(7, noShowReference + Math.sin(idx * 0.9) * 2.1)).toFixed(1)));

  const dCD = {
    labels: monthLabels,
    datasets: [
      { type: "bar", label: _("chart.revenue"), data: monthlyRevenueSeries, backgroundColor: lt ? "rgba(26,115,232,.25)" : "rgba(255,122,0,.35)", borderRadius: 8 },
      { type: "line", label: _("chart.margin"), data: monthlyMarginSeries, borderColor: lt ? "#137333" : "#22C55E", backgroundColor: "transparent", tension: 0.35, pointRadius: 3, borderWidth: 2.5 },
      { type: "line", label: _("chart.noshowPercent"), data: monthlyNoShowSeries, borderColor: "#FACC15", yAxisID: "y1", tension: 0.35, pointRadius: 3, borderDash: [5, 5], borderWidth: 2 },
    ],
  };

  const hourlyLabels = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  const flowBase = Math.max(4, Math.round((app.total_pacientes || 90) / hourlyLabels.length));
  const liveFlowSeries = hourlyLabels.map((_, idx) => Math.max(1, Math.round(flowBase + Math.sin((idx + 1) * 0.8) * 3 + idx * 0.35)));
  const liveCapacitySeries = hourlyLabels.map(() => flowBase + 5);
  const lvCD = {
    labels: hourlyLabels,
    datasets: [
      { label: _("chart.appointments"), data: liveFlowSeries, borderColor: lt ? "#1a73e8" : "#8ab4f8", tension: 0.32, fill: false, pointRadius: 2, borderWidth: 2.4 },
      { label: _("chart.capacity"), data: liveCapacitySeries, borderColor: lt ? "#ea4335" : "#f28b82", borderDash: [4, 4], tension: 0.2, fill: false, pointRadius: 0, borderWidth: 1.8 },
    ],
  };

  const leadsTotal = Math.max(120, app.total_pacientes + app.no_shows_abs + 38);
  const scheduledTotal = Math.round(leadsTotal * 0.64);
  const attendedTotal = Math.max(0, scheduledTotal - app.no_shows_abs);
  const conversionRate = txC > 0 ? txC / 100 : 0.72;
  const convertedTotal = Math.max(0, Math.round(attendedTotal * conversionRate));
  const funnelDropTop = Math.max(0, leadsTotal - scheduledTotal);
  const funnelNoShow = Math.max(0, scheduledTotal - attendedTotal);
  const funnelNoClose = Math.max(0, attendedTotal - convertedTotal);
  const fCD = {
    labels: [_("funnel.topLoss"), _("funnel.noshow"), _("funnel.notConverted"), _("funnel.converted")],
    datasets: [
      {
        data: [funnelDropTop, funnelNoShow, funnelNoClose, convertedTotal],
        backgroundColor: [lt ? "#9aa0a6" : "#60646f", lt ? "#ea4335" : "#f28b82", lt ? "#fbbc04" : "#fdd663", lt ? "#34a853" : "#22C55E"],
        borderWidth: 0,
      },
    ],
  };

  const marketingSpend = Math.max(38000, Math.round(revenueBase * 0.11));
  const channelLabels = ["Google Ads", "Meta Ads", "Organico", "Parcerias"];
  const channelSplit = [0.42, 0.31, 0.17, 0.1];
  const channelRoas = [3.6, 3.1, 4.4, 2.7];
  const channelSpend = channelSplit.map(v => Math.round(marketingSpend * v));
  const channelRevenue = channelSpend.map((v, idx) => Math.round(v * channelRoas[idx]));
  const weightedRoas = Number((channelRevenue.reduce((a, b) => a + b, 0) / marketingSpend).toFixed(2));
  const avgCpl = Math.round(marketingSpend / Math.max(120, leadsTotal));

  const channelCD = {
    labels: channelLabels,
    datasets: [
      { type: "bar", label: "Investimento", data: channelSpend, backgroundColor: lt ? "rgba(26,115,232,.25)" : "rgba(255,122,0,.35)", borderRadius: 8 },
      { type: "line", label: "ROAS", data: channelRoas, yAxisID: "y1", borderColor: lt ? "#34a853" : "#22C55E", tension: 0.28, pointRadius: 3, borderWidth: 2.2 },
    ],
  };

  const sprintKanbanCD = {
    labels: SPRINT_STATUS_ORDER.map(status => _(SPRINT_STATUS_LABEL[status] as any)),
    datasets: [{ label: _("chart.cardsByStage"), data: SPRINT_STATUS_ORDER.map(status => sprintStatusCount(status)), backgroundColor: ["#6b7280", "#3b82f6", "#f59e0b", "#22c55e"], borderRadius: 8 }],
  };

  const okrKanbanCD = {
    labels: OKR_STATUS_ORDER.map(status => _(OKR_STATUS_LABEL[status] as any)),
    datasets: [{ label: _("chart.okrByStage"), data: OKR_STATUS_ORDER.map(status => okrStatusCount(status)), backgroundColor: ["#64748b", "#3b82f6", "#f59e0b", "#22c55e"], borderRadius: 8 }],
  };

  const okrProgressCD = {
    labels: okrs.map(o => o.objective.length > 28 ? `${o.objective.slice(0, 28)}...` : o.objective),
    datasets: [{ label: _("chart.progressPercent"), data: okrs.map(o => Math.round(clamp((o.current / Math.max(1, o.target)) * 100))), backgroundColor: lt ? "rgba(26,115,232,.35)" : "rgba(255,122,0,.42)", borderRadius: 8 }],
  };

  const teamKanbanCD = {
    labels: TEAM_STATUS_ORDER.map(status => _(TEAM_STATUS_LABEL[status] as any)),
    datasets: [{ label: _("chart.professionals"), data: TEAM_STATUS_ORDER.map(status => teamStatusCount(status)), backgroundColor: ["#94a3b8", "#3b82f6", "#f59e0b", "#22c55e"], borderRadius: 8 }],
  };

  const eCD = {
    labels: monthLabels,
    datasets: [
      { label: _("chart.revenue"), data: monthlyRevenueSeries, backgroundColor: lt ? "rgba(26,115,232,.35)" : "rgba(255,122,0,.4)", borderRadius: 8 },
      { label: _("chart.costs"), data: monthlyCostSeries, backgroundColor: lt ? "rgba(234,67,53,.35)" : "rgba(242,139,130,.35)", borderRadius: 8 },
    ],
  };

  const bO: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { grid: { color: gc }, ticks: { color: tc } },
      y1: { display: false, position: "right", grid: { drawOnChartArea: false }, ticks: { color: tc } },
      x: { grid: { display: false }, ticks: { color: tc } },
    },
    plugins: { legend: { labels: { color: tc } } },
  };
  const revenueGoal = Math.max(1, settings.revenueGoal || Math.round(revenueBase * 1.05));
  const revenueProgress = Number(((app.faturamento_bruto / revenueGoal) * 100).toFixed(1));
  const conversionGoal = settings.conversionGoal || 78;
  const noShowGoal = settings.noShowLimit || 10;
  const canAccess = (sectionId: string) => canAccessSection(plan, sectionId as SectionId);

  // Keep hook order stable across loading/auth transitions.
  useEffect(() => {
    if (!canAccess(scr)) {
      setScr("dashboard");
    }
  }, [plan, scr]);

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0f1115", color: "#e2e8f0" }}><p>{_("misc.loading")}</p></div>;
  if (!user) return null;

  const uN = user.name || _("misc.client");
  const uI = uN.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const Lk = ({ locked, title, msg, btn, children }: { locked: boolean; title: string; msg: string; btn: string; children: React.ReactNode }) => (
    <div className="lk fu s2">{locked && <div className="lk-o"><div className="lk-cd"><h3>{title}</h3><p>{msg}</p><button className="bt bu">{btn}</button></div></div>}<div className={`lk-c ${locked ? "lkd" : "ulk"}`}>{children}</div></div>
  );

  const Lgd = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className="lgd">
      <div className="lgd-hd" onClick={() => toggleLegend(id)}>
        <span className={`lgd-ic ${openLegends[id] ? "open" : ""}`}><Info size={13} /></span>
        <span className="lgd-tl">{title}</span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--ts)" }}>{openLegends[id] ? _("lgd.collapse") : _("lgd.expand")}</span>
      </div>
      <div className={`lgd-bd ${openLegends[id] ? "open" : ""}`}>{children}</div>
    </div>
  );

  const nav = [
    {
      g: _("nav.overview"),
      items: [
        { id: "dashboard", l: _("nav.dashboard"), i: <LayoutDashboard size={18} /> },
        { id: "realtime", l: _("nav.realtime"), i: <Activity size={18} />, min: "pro" },
      ],
    },
    {
      g: _("nav.operations"),
      items: [
        { id: "agenda", l: _("nav.agenda"), i: <Calendar size={18} />, min: "pro" },
        { id: "equipe", l: _("nav.equipe"), i: <Users size={18} />, min: "pro" },
        { id: "sprints", l: _("nav.sprints"), i: <ClipboardList size={18} />, min: "pro" },
      ],
    },
    {
      g: _("nav.commercial"),
      items: [
        { id: "funil", l: _("nav.funil"), i: <Filter size={18} />, min: "pro" },
        { id: "canais", l: _("nav.canais"), i: <Megaphone size={18} />, min: "pro" },
      ],
    },
    {
      g: _("nav.management"),
      items: [
        { id: "integracoes", l: _("nav.integracoes"), i: <Settings size={18} />, min: "enterprise" },
        { id: "dados", l: _("nav.dados"), i: <Database size={18} /> },
        { id: "relatorios", l: _("nav.relatorios"), i: <FileText size={18} />, min: "pro" },
        { id: "configuracoes", l: _("nav.configuracoes"), i: <Filter size={18} /> },
      ],
    },
  ];
  return (<><style>{CSS}</style><div className={`D ${lt ? "lt" : ""}`}>
    <div className="tc">{toasts.map((t, i) => <div key={i} className="tt">{t}</div>)}</div>

    {/* MODAL: AI ROUTER */}
    {modal === "ai" && <div className="mo" onClick={() => setModal(null)}><div className="ml" style={{ maxWidth: 600, borderColor: "var(--gp)" }} onClick={e => e.stopPropagation()}><div className="ml-h"><div className="ml-t" style={{ color: "var(--gp)" }}>{_("ai.title")}</div></div><div className="ml-b"><p style={{ fontSize: 13, color: "var(--ts)", marginBottom: 16 }}>{_("ai.analyzing")}</p><div className="rt">{rLogs.map((l, i) => <div key={i} style={{ color: i === rLogs.length - 1 && rDone ? "var(--gb)" : l.includes("âš ï¸") ? "var(--gy)" : l.includes("â€”") && rLogs[i-1]?.includes("âš ï¸") ? "var(--gy)" : l.includes("âœ…") ? "var(--gb)" : undefined, marginTop: l.includes("âš ï¸") || l.includes("âœ…") ? 12 : 0 }}>{l}</div>)}</div></div>{rDone && <div className="ml-f"><button className="bt bp" onClick={() => { setModal(null); setScr("dashboard"); }}>{_("btn.viewDashboard")}</button></div>}</div></div>}

    {/* MODAL: PROFISSIONAL */}
    {modal === "prof" && (
      <div className="mo" onClick={() => setModal(null)}>
        <div className="ml" onClick={e => e.stopPropagation()}>
          <div className="ml-h">
            <div className="ml-t">{_("modal.addProfessional")}</div>
            <button className="ml-x" onClick={() => setModal(null)}>x</button>
          </div>
          <div className="ml-b">
            <div style={{ marginBottom: 16 }}>
              <label className="fl">{_("modal.fullName")}</label>
              <input
                type="text"
                className="fi"
                placeholder={_("modal.fullNamePlaceholder")}
                value={teamForm.name}
                onChange={e => setTeamForm(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="fl">{_("modal.roleSpecialty")}</label>
              <select
                className="fs"
                value={teamForm.role}
                onChange={e => setTeamForm(p => ({ ...p, role: e.target.value }))}
              >
                <option value="">{_("modal.select")}</option>
                <option>{_("modal.doctor")}</option>
                <option>{_("modal.reception")}</option>
                <option>{_("modal.commercial")}</option>
                <option>{_("modal.management")}</option>
              </select>
            </div>
          </div>
          <div className="ml-f">
            <button className="bt bs" onClick={() => setModal(null)}>{_("btn.cancel")}</button>
            <button className="bt bp" onClick={createTeamMember}>{_("btn.save")}</button>
          </div>
        </div>
      </div>
    )}
    {/* MODAL: SPRINT */}
    {modal === "sprint" && (
      <div className="mo" onClick={() => setModal(null)}>
        <div className="ml" onClick={e => e.stopPropagation()}>
          <div className="ml-h">
            <div className="ml-t">{_("modal.newSprint")}</div>
            <button className="ml-x" onClick={() => setModal(null)}>x</button>
          </div>
          <div className="ml-b">
            <div style={{ marginBottom: 16 }}>
              <label className="fl">{_("modal.initiativeName")}</label>
              <input
                type="text"
                className="fi"
                placeholder={_("modal.initiativePlaceholder")}
                value={sprintForm.title}
                onChange={e => setSprintForm(p => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div className="fr">
              <div>
                <label className="fl">{_("modal.responsible")}</label>
                <input
                  type="text"
                  className="fi"
                  value={sprintForm.owner}
                  onChange={e => setSprintForm(p => ({ ...p, owner: e.target.value }))}
                />
              </div>
              <div>
                <label className="fl">{_("modal.deadline")}</label>
                <input
                  type="date"
                  className="fi"
                  value={sprintForm.deadline}
                  onChange={e => setSprintForm(p => ({ ...p, deadline: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="fl">{_("modal.linkToOkr")}</label>
              <select
                className="fs"
                value={sprintForm.linkedOkrId}
                onChange={e => setSprintForm(p => ({ ...p, linkedOkrId: e.target.value }))}
              >
                <option value="">{_("modal.noLink")}</option>
                {okrs.map(okr => (
                  <option key={okr.id} value={okr.id}>{okr.objective}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="ml-f">
            <button className="bt bs" onClick={() => setModal(null)}>{_("btn.cancel")}</button>
            <button className="bt bp" onClick={createSprint}>{_("modal.createSprint")}</button>
          </div>
        </div>
      </div>
    )}
    {/* MODAL: OKR */}
    {modal === "okr" && (
      <div className="mo" onClick={() => setModal(null)}>
        <div className="ml" onClick={e => e.stopPropagation()}>
          <div className="ml-h">
            <div className="ml-t">{_("modal.newOkr")}</div>
            <button className="ml-x" onClick={() => setModal(null)}>x</button>
          </div>
          <div className="ml-b">
            <div style={{ marginBottom: 16 }}>
              <label className="fl">{_("modal.objectiveO")}</label>
              <input
                type="text"
                className="fi"
                placeholder={_("modal.objectivePlaceholder")}
                value={okrForm.objective}
                onChange={e => setOkrForm(p => ({ ...p, objective: e.target.value }))}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="fl">{_("modal.keyResultKR")}</label>
              <input
                type="text"
                className="fi"
                placeholder={_("modal.keyResultPlaceholder")}
                value={okrForm.keyResult}
                onChange={e => setOkrForm(p => ({ ...p, keyResult: e.target.value }))}
              />
            </div>
            <div className="fr">
              <div>
                <label className="fl">{_("modal.responsible")}</label>
                <input
                  type="text"
                  className="fi"
                  value={okrForm.owner}
                  onChange={e => setOkrForm(p => ({ ...p, owner: e.target.value }))}
                />
              </div>
              <div>
                <label className="fl">{_("modal.target")}</label>
                <input
                  type="number"
                  className="fi"
                  value={okrForm.target}
                  onChange={e => setOkrForm(p => ({ ...p, target: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <div className="ml-f">
            <button className="bt bs" onClick={() => setModal(null)}>{_("btn.cancel")}</button>
            <button className="bt bp" onClick={createOkr}>{_("btn.save")} OKR</button>
          </div>
        </div>
      </div>
    )}
    {/* MODAL: AGENDA CSV */}
    {modal === "agenda" && <div className="mo" onClick={() => setModal(null)}><div className="ml" onClick={e => e.stopPropagation()}><div className="ml-h"><div className="ml-t">{_("modal.importAgenda")}</div><button className="ml-x" onClick={() => setModal(null)}>âœ•</button></div><div className="ml-b"><div className="es" style={{ padding: 30 }}><div style={{ fontSize: 24, marginBottom: 12 }}>ðŸ“</div><p style={{ fontSize: 14, color: "var(--ts)" }}>{_("file.dropzone")}</p><input type="file" accept=".xlsx,.xls,.csv" style={{ marginTop: 16, color: "var(--tp)" }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFileImport(f); }} /></div></div><div className="ml-f"><button className="bt bs" onClick={() => setModal(null)}>{_("btn.cancel")}</button><button className="bt bp" onClick={() => startAI("csv", "agenda")}>{_("btn.iaRouter")}</button></div></div></div>}

    {/* MODAL: DELETE CONFIRM */}
    {deleteConfirm && <div className="mo" onClick={() => setDeleteConfirm(null)}><div className="ml" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}><div className="ml-h"><div className="ml-t" style={{ color: "var(--gr)" }}>{_("modal.confirmDelete")}</div></div><div className="ml-b"><p style={{ fontSize: 14, color: "var(--ts)" }}>{_("data.confirmDelete")}</p></div><div className="ml-f"><button className="bt bs" onClick={() => setDeleteConfirm(null)}>{_("btn.cancel")}</button><button className="bt bp" style={{ background: "var(--gr)" }} onClick={() => deleteRecord(deleteConfirm)}>{_("btn.delete")}</button></div></div></div>}

    {/* PDF PREVIEW */}
    {pdf && <div className="pm"><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, maxWidth: 800, margin: "0 auto 24px" }}><h2 style={{ color: "white", fontFamily: "'Sora'" }}>{_("pdf.previewTitle")}</h2><div style={{ display: "flex", gap: 12 }}><button className="bt bs" onClick={() => setPdf(false)}>{_("btn.back")}</button><button className="bt bp" onClick={generatePDF}>{_("btn.download")}</button></div></div><div className="pp"><h1 style={{ borderBottom: "2px solid #1a73e8", paddingBottom: 16, marginBottom: 32, fontFamily: "'Sora'" }}>{_("pdf.reportTitle")}</h1><div style={{ display: "flex", gap: 24, marginBottom: 32 }}><div style={{ flex: 1, background: "#f8f9fa", padding: 20, borderRadius: 8, border: "1px solid #dadce0" }}><div style={{ fontSize: 12, color: "#5f6368" }}>{_("kpi.revenue")}</div><div style={{ fontSize: 28, fontWeight: "bold", color: "#202124" }}>R$ {app.faturamento_bruto.toLocaleString("pt-BR")}</div></div><div style={{ flex: 1, background: "#fce8e6", padding: 20, borderRadius: 8, border: "1px solid #fad2cf" }}><div style={{ fontSize: 12, color: "#c5221f" }}>{_("kpi.noshow")}</div><div style={{ fontSize: 28, fontWeight: "bold", color: "#c5221f" }}>{txN.toFixed(1)}%</div></div></div>{hasParetoData && <div style={{ height: 300, background: "#f8f9fa", border: "1px solid #dadce0", borderRadius: 8, padding: 10 }}><Bar data={pCD} options={{ ...pO, scales: { ...pO.scales, y: { ...pO.scales.y, grid: { color: "#e8eaed" }, ticks: { color: "#5f6368" } }, y1: { ...pO.scales.y1, grid: { drawOnChartArea: false }, ticks: { color: "#5f6368", callback: (v: any) => v + "%" } }, x: { grid: { display: false }, ticks: { color: "#5f6368" } } }, plugins: { legend: { labels: { color: "#5f6368" } } } }} /></div>}<div className="pl"><h4>{_("pdf.glossaryTitle")}</h4><ul style={{ listStyle: "none", padding: 0 }}><li><strong>{_("pdf.grossRevenue")}:</strong> {_("pdf.grossRevenueDesc")}</li><li><strong>{_("pdf.noshowRate")}:</strong> {_("pdf.noshowRateDesc")}</li><li><strong>{_("pdf.paretoCancel")}:</strong> {_("pdf.paretoCancelDesc")}</li><li><strong>CAC:</strong> {_("pdf.cacDesc")}</li><li><strong>LTV:</strong> {_("pdf.ltvDesc")}</li></ul></div></div></div>}

    {/* SIDEBAR */}
    <aside className="sb">
      <div className="sb-l"><div className="sb-i"><img src="/images/logo-transparent.png" alt="GLX" /></div><div className="sb-n">GLX CONTROL TOWER</div></div>
      <nav className="sb-nv">
        {nav.map(g => (
          <div key={g.g}>
            <div className="sb-gl">{g.g}</div>
            {g.items.map(it => {
              const sectionId = it.id as SectionId;
              const requiredPlan = getMinPlanForSection(sectionId);
              const locked = !canAccess(sectionId);
              return (
                <div
                  key={it.id}
                  className={`ni ${scr === it.id ? "a" : ""} ${locked ? "lk" : ""}`}
                  onClick={() => {
                    if (locked) {
                      toast(`${_("plan.upgradeMsg")} ${_("plan." + requiredPlan as any)}.`);
                      return;
                    }
                    setScr(it.id);
                  }}
                >
                  {it.i} {it.l}
                  {locked && <span className="ni-lock"><Lock size={12} /></span>}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="plan-badge" style={{ margin: "8px 16px", padding: "8px 12px", borderRadius: 8, background: plan === "enterprise" ? "rgba(168,85,247,.15)" : plan === "pro" ? "rgba(245,158,11,.15)" : "rgba(16,185,129,.15)", border: `1px solid ${plan === "enterprise" ? "rgba(168,85,247,.3)" : plan === "pro" ? "rgba(245,158,11,.3)" : "rgba(16,185,129,.3)"}`, textAlign: "center", fontSize: 12 }}><div style={{ fontWeight: 600, color: plan === "enterprise" ? "#a855f7" : plan === "pro" ? "#f59e0b" : "#10b981" }}>{_("plan.current")}: {_((`plan.${plan}`) as any)}</div></div>
      <div className="lang-sel">
        <label>{_("misc.language")}</label>
        <div className="lang-opts">
          {(Object.keys(LANG_LABELS) as Lang[]).map(l => <button key={l} className={`lang-btn ${lang === l ? "active" : ""}`} onClick={() => setLang(l)}>{LANG_FLAGS[l]} {LANG_LABELS[l]}</button>)}
        </div>
      </div>
      <div className="sb-bt">
        <div className="uc"><div className="av">{uI}</div><div><div className="un">{uN}</div><div className="ue">{user.email || "cliente@glx.com"}</div></div></div>
        <div className="sb-lo"><button onClick={() => { logout(); setLocation("/"); }}><LogOut size={16} />{_("btn.logout")}</button></div>
      </div>
    </aside>

    {/* MAIN */}
    <main className="mn">
      <header className="tb">
        <div className="tb-t">{titles[scr] || _("dash.workspace")}</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button className="bt bp" onClick={() => setPdf(true)}>{_("btn.exportPdf")}</button>
          <button className="theme-toggle" onClick={() => setLt(!lt)} aria-label="Alternar tema">
            {lt ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* DASHBOARD */}
      <div className={`ct ${scr === "dashboard" ? "a" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }} className="fu"><div><h1 className="gf" style={{ marginBottom: 4 }}>{_("dash.overview")}</h1><div style={{ color: "var(--ts)", fontSize: 14, marginTop: 4 }}>{_("dash.subtitle")}</div></div><select className="fs" style={{ margin: 0, width: 200 }} onChange={() => toast(_("dash.filteringData"))}><option>{_("misc.thisMonth")}</option><option>{_("misc.lastMonth")}</option><option>{_("misc.last90days")}</option></select></div>
        <div className="cd hv fu s1"><div className="cd-h" style={{ background: "rgba(138,180,248,.05)" }}><div className="cd-t">{_("dash.guidedAnalysis")}</div><select className="fs" style={{ width: "auto", margin: 0 }} onChange={e => ansQ(e.target.value)}><option value="">{_("dash.selectQuestion")}</option><option value="cac">{_("qa.cacQuestion")}</option><option value="ltv">{_("qa.ltvQuestion")}</option><option value="roi">{_("qa.roiQuestion")}</option><option value="churn">{_("qa.churnQuestion")}</option><option value="lucro">{_("qa.profitQuestion")}</option></select></div><div className="cd-b"><h2 style={{ fontSize: 28, color: "var(--gb)", fontFamily: "'Sora'" }}>{qA}</h2><p style={{ fontSize: 13, color: "var(--ts)", marginTop: 8 }}>{qL}</p></div></div>
        {audit && <div className="ab"><strong className="gf">âš ï¸ {_("ai.auditAlerts")}</strong> {_("misc.auditWarning")}</div>}
        <Lgd id="kpi-main" title={_("lgd.dashTitle")}>
          <dl className="lgd-term">
            <dt>{_("lgd.dashRevenue")}</dt><dd>{_("lgd.dashRevenueDesc")}</dd>
            <dt>{_("lgd.dashAppointments")}</dt><dd>{_("lgd.dashAppointmentsDesc")}</dd>
            <dt>{_("lgd.dashNoshow")}</dt><dd>{_("lgd.dashNoshowDesc")}</dd>
            <dt>{_("lgd.dashConversion")}</dt><dd>{_("lgd.dashConversionDesc")}</dd>
          </dl>
          <div className="lgd-calc">{_("lgd.dashFormula").split("\n").map((l,i) => <span key={i}>{l}<br/></span>)}</div>
          <p><strong>{_("lgd.dashSource")}</strong></p>
        </Lgd>
        <h3 style={{ marginBottom: 16, color: "var(--ts)" }} className="gf fu s1">{_("dash.essentialMetrics")}</h3>
        <div className="kg fu s2">
          <div className="kp"><div className="kl">{_("kpi.revenue")}</div><div className="kv">R$ {app.faturamento_bruto.toLocaleString("pt-BR")}</div><div className="km">{_("kpi.goal")}: R$ {revenueGoal.toLocaleString("pt-BR")} ({isFinite(revenueProgress) ? revenueProgress : 0}%)</div></div>
          <div className="kp"><div className="kl">{_("kpi.appointments")}</div><div className="kv">{app.total_pacientes}</div><div className="km">{_("kpi.estimatedAvgTicket")}: R$ {Math.round(app.faturamento_bruto / Math.max(1, app.total_pacientes)).toLocaleString("pt-BR")}</div></div>
          <div className="kp"><div className="kl">{_("kpi.noshow")}</div><div className="kv" style={{ color: txN > noShowGoal ? "var(--gr)" : "var(--tp)" }}>{txN.toFixed(1)}%</div><div className="km">{txN > noShowGoal ? _("dash.aboveLimit") : _("dash.withinGoal")} ({_("kpi.goal")} {noShowGoal}%)</div></div>
          <div className="kp"><div className="kl">{_("kpi.conversion")}</div><div className="kv" style={{ color: txC < conversionGoal ? "var(--gyt)" : "var(--gg)" }}>{txC.toFixed(1)}%</div><div className="km">{_("settings.conversionGoal")}: {conversionGoal}%</div></div>
        </div>

        <div className="cd hv fu s2" style={{ marginBottom: 16 }}>
          <div className="cd-h"><div className="cd-t">{_("dash.monthlyTrend")}</div></div>
          <div className="cd-b" style={{ height: 280 }}><Bar data={dCD as any} options={bO} /></div>
        </div>
        <div className="logic-note fu s1">
          <div className="logic-title">{_("logic.monthlyChartTitle")}</div>
          <div className="logic-row"><span>{_("logic.monthlyRevenueBar")}</span><strong>{_("logic.monthlyRevenueDesc")}</strong></div>
          <div className="logic-row"><span>{_("logic.monthlyMarginLine")}</span><strong>{_("logic.monthlyMarginDesc")}</strong></div>
          <div className="logic-row"><span>{_("logic.monthlyNoShowLine")}</span><strong>{_("logic.monthlyNoShowDesc")}</strong></div>
        </div>

        <Lgd id="guided-analysis" title={_("lgd.guidedTitle")}>
          <dl className="lgd-term">
            <dt>{_("lgd.cacLabel")}</dt><dd>{_("lgd.cacDesc")}</dd>
            <dt>{_("lgd.ltvLabel")}</dt><dd>{_("lgd.ltvDesc")}</dd>
            <dt>{_("lgd.roiLabel")}</dt><dd>{_("lgd.roiDesc")}</dd>
            <dt>{_("lgd.churnLabel")}</dt><dd>{_("lgd.churnDesc")}</dd>
            <dt>{_("lgd.profitLabel")}</dt><dd>{_("lgd.profitDesc")}</dd>
          </dl>
          <div className="lgd-calc">{_("lgd.guidedFormula").split("\n").map((l,i) => <span key={i}>{l}<br/></span>)}</div>
        </Lgd>
        <Lk locked={isE} title={_("lock.paretoTitle")} msg={_("lock.paretoMsg")} btn={_("btn.upgradePro")}>
          <div className="cd hv"><div className="cd-h"><div className="cd-t">{_("card.paretoTitle")}</div></div><div className="cd-b" style={{ height: 300 }}>{hasParetoData ? <Bar data={pCD} options={pO} /> : <div className="es">{_("dash.waitingData")}</div>}</div></div>
        </Lk>

        <Lgd id="pareto" title={_("lgd.paretoTitle")}>
          <p>{_("lgd.paretoIntro")}</p>
          <dl className="lgd-term">
            <dt>{_("lgd.paretoLeftAxis")}</dt><dd>{_("lgd.paretoLeftAxisDesc")}</dd>
            <dt>{_("lgd.paretoRightAxis")}</dt><dd>{_("lgd.paretoRightAxisDesc")}</dd>
          </dl>
          <div className="lgd-calc">{_("lgd.paretoFormula")}</div>
          <p>{_("lgd.paretoAction")}</p>
        </Lgd>
        <Lk locked={isE} title={_("dash.proAnalytics")} msg={_("lock.proMsg")} btn={_("btn.upgradePro")}>
          <div className="kg">
            <div className="kp"><div className="kl">{_("kpi.projRevenue")}</div><div className="kv">R$ {(app.faturamento_bruto * 1.1).toLocaleString("pt-BR")}</div></div>
            <div className="kp"><div className="kl">{_("kpi.ltvProj")}</div><div className="kv">R$ {app.ltv.toLocaleString("pt-BR")}</div></div>
            <div className="kp"><div className="kl">{_("kpi.cacAvg")}</div><div className="kv">R$ {app.cac.toLocaleString("pt-BR")}</div></div>
          </div>
        </Lk>

        <Lk locked={nE} title={_("dash.enterprise")} msg={_("lock.enterpriseMsg")} btn={_("btn.upgradeEnterprise")}>
          <div className="cd hv"><div className="cd-h"><div className="cd-t">{_("dash.enterprise")}</div></div><div className="cd-b" style={{ height: 280 }}><Bar data={eCD} options={bO} /></div></div>
        </Lk>
      </div>

      {/* TEMPO REAL */}
      <div className={`ct ${scr === "realtime" ? "a" : ""}`}><div className="fu" style={{ marginBottom: 24 }}><h1 className="gf">{_("title.realtime")}</h1><div style={{ color: "var(--ts)", fontSize: 14, marginTop: 4 }}>{_("sub.realtime")}</div></div>
        <Lgd id="realtime" title={_("lgd.realtimeTitle")}>
          <dl className="lgd-term">
            <dt>{_("lgd.realtimeFlow")}</dt><dd>{_("lgd.realtimeFlowDesc")}</dd>
            <dt>{_("lgd.realtimeBadge")}</dt><dd>{_("lgd.realtimeBadgeDesc")}</dd>
          </dl>
          <p>{_("lgd.realtimeUsage")}</p>
        </Lgd><div className="cd hv fu s1"><div className="cd-h"><div className="cd-t">{_("card.flowToday")}</div><span className="bg sc">{_("misc.live")}</span></div><div className="cd-b" style={{ height: 300 }}><Line data={lvCD as any} options={bO} /></div></div>
        <div className="logic-note fu s1">
          <div className="logic-title">{_("logic.realtimeFlowTitle")}</div>
          <div className="logic-row"><span>{_("logic.blueLine")}</span><strong>{_("logic.projectedHourlyAttendance")}</strong></div>
          <div className="logic-row"><span>{_("logic.dashedLine")}</span><strong>{_("logic.capacityByHour")}</strong></div>
        </div>
      </div>

      {/* AGENDA */}
      <div className={`ct ${scr === "agenda" ? "a" : ""}`}><div className="fu" style={{ marginBottom: 24 }}><h1 className="gf">{_("title.agenda")}</h1><div style={{ color: "var(--ts)", fontSize: 14, marginTop: 4 }}>{_("sub.agenda")}</div></div>
        <Lgd id="agenda" title={_("lgd.agendaTitle")}>
          <dl className="lgd-term">
            <dt>{_("lgd.agendaSlots")}</dt><dd>{_("lgd.agendaSlotsDesc")}</dd>
            <dt>{_("lgd.agendaOccupancy")}</dt><dd>{_("lgd.agendaOccupancyDesc")}</dd>
            <dt>{_("lgd.agendaHeatmap")}</dt><dd>{_("lgd.agendaHeatmapDesc")}</dd>
          </dl>
          <div className="lgd-calc">{_("lgd.agendaFormula").split("\n").map((l,i) => <span key={i}>{l}<br/></span>)}</div>
        </Lgd><div className="g2 fu s1"><div className="kp"><div className="kl">{_("kpi.slotsAvailable")}</div><div className="kv">0</div></div><div className="kp"><div className="kl">{_("kpi.occupancyRate")}</div><div className="kv">0%</div></div></div><div className="cd hv fu s2" style={{ marginTop: 24 }}><div className="cd-h"><div className="cd-t">{_("card.heatmap")}</div><button className="bt bs" onClick={() => setModal("agenda")}>{_("btn.importCsv")}</button></div><div className="cd-b"><div className="es">{_("dash.waitingData")} â€” {_("card.importData")}</div></div></div></div>

      {/* EQUIPE */}
      <div className={`ct ${scr === "equipe" ? "a" : ""}`}>
        <div className="fu" style={{ marginBottom: 24 }}>
          <h1 className="gf">{_("title.equipe")}</h1>
          <div style={{ color: "var(--ts)", fontSize: 14, marginTop: 4 }}>{_("sub.teamKanban")}</div>
        </div>

        <Lgd id="equipe" title={_("lgd.equipeTitle")}>
          <dl className="lgd-term">
            <dt>{_("lgd.equipeAppointments")}</dt><dd>{_("lgd.equipeAppointmentsDesc")}</dd>
            <dt>{_("lgd.equipeConversion")}</dt><dd>{_("lgd.equipeConversionDesc")}</dd>
          </dl>
          <div className="lgd-calc">{_("lgd.equipeFormula")}</div>
          <p>{_("lgd.equipeBenchmark")}</p>
        </Lgd>

        <div className="g2 fu s1" style={{ marginBottom: 24 }}>
          <div className="cd hv">
            <div className="cd-h">
              <div className="cd-t">{_("card.teamKanban")}</div>
              <span className="bg sc">{_("kpi.success")} {teamSuccessRate}%</span>
            </div>
            <div className="cd-b">
              <div className="kb-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))" }}>
                {TEAM_STATUS_ORDER.map(status => (
                  <div
                    key={status}
                    className={`kb-col ${dropTeamStatus === status ? "drop" : ""}`}
                    onDragOver={e => { e.preventDefault(); setDropTeamStatus(status); }}
                    onDragLeave={() => setDropTeamStatus(current => (current === status ? null : current))}
                    onDrop={e => {
                      e.preventDefault();
                      if (dragTeamId) moveTeamStatus(dragTeamId, status);
                      setDragTeamId(null);
                      setDropTeamStatus(null);
                    }}
                  >
                    <div className="kb-h">
                      <div className="kb-t">{_(TEAM_STATUS_LABEL[status] as any)}</div>
                      <div className="kb-c">{teamStatusCount(status)}</div>
                    </div>
                    <div className="kb-list">
                      {teamBoard.filter(member => member.status === status).map(member => (
                        <div
                          key={member.id}
                          className="kb-card"
                          draggable
                          onDragStart={() => setDragTeamId(member.id)}
                          onDragEnd={() => { setDragTeamId(null); setDropTeamStatus(null); }}
                        >
                          <div className="kb-tt">{member.name}</div>
                          <div className="kb-sub">{member.role} • {member.appointments} atend.</div>
                          <div className="kb-p"><span style={{ width: `${clamp(member.conversion)}%` }} /></div>
                          <div className="kb-sub">Conversao: {member.conversion.toFixed(1)}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="cd hv">
            <div className="cd-h"><div className="cd-t">{_("card.distributionProductivity")}</div></div>
            <div className="cd-b">
              <div style={{ height: 240, marginBottom: 16 }}><Bar data={teamKanbanCD as any} options={bO} /></div>
              <div className="logic-note" style={{ margin: 0 }}>
                <div className="logic-row"><span>{_("logic.successRate")}</span><strong>{teamSuccessRate}% {_("logic.successRateDesc")}</strong></div>
                <div className="logic-row"><span>{_("logic.dailyCapacityTarget")}</span><strong>{settings.teamDailyCapacity} {_("logic.dailyCapacityUnits")}</strong></div>
                <div className="logic-row"><span>{_("settings.conversionGoal")}</span><strong>{settings.conversionGoal}%</strong></div>
              </div>
            </div>
          </div>
        </div>

        <div className="cd hv fu s1">
          <div className="cd-h">
            <div className="cd-t">{_("card.registeredProfessionals")}</div>
            <button className="bt bp" onClick={() => setModal("prof")}>{_("btn.addProfessional")}</button>
          </div>
          <div className="cd-b">
            <table className="dt">
              <thead>
                <tr>
                  <th>{_("table.name")}</th>
                  <th>{_("table.role")}</th>
                  <th>{_("table.appointments")}</th>
                  <th>{_("table.conversion")}</th>
                  <th>{_("table.kanbanStatus")}</th>
                </tr>
              </thead>
              <tbody>
                {teamBoard.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--ts)" }}>{_("dash.waitingData")}</td></tr>
                ) : (
                  teamBoard.map(member => (
                    <tr key={member.id}>
                      <td>{member.name}</td>
                      <td>{member.role}</td>
                      <td>{member.appointments}</td>
                      <td>{member.conversion.toFixed(1)}%</td>
                      <td><span className="bg in">{_(TEAM_STATUS_LABEL[member.status] as any)}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* SPRINTS & OKRs */}
      <div className={`ct ${scr === "sprints" ? "a" : ""}`}>
        <div className="fu" style={{ marginBottom: 24 }}>
          <h1 className="gf">{_("title.sprints")}</h1>
          <div style={{ color: "var(--ts)", fontSize: 14, marginTop: 4 }}>{_("sub.sprintsKanban")}</div>
        </div>

        <Lgd id="sprints" title={_("lgd.sprintsTitle")}>
          <dl className="lgd-term">
            <dt>{_("lgd.sprintLabel")}</dt><dd>{_("lgd.sprintDesc")}</dd>
            <dt>{_("lgd.okrLabel")}</dt><dd>{_("lgd.okrDesc")}</dd>
            <dt>{_("lgd.objectiveLabel")}</dt><dd>{_("lgd.objectiveDesc")}</dd>
            <dt>{_("lgd.krLabel")}</dt><dd>{_("lgd.krDesc")}</dd>
          </dl>
          <p>{_("lgd.sprintsCycle")}</p>
        </Lgd>

        <div className="kg fu s1" style={{ marginBottom: 20 }}>
          <div className="kp"><div className="kl">{_("kpi.sprintSuccess")}</div><div className="kv">{sprintSuccessRate}%</div><div className="km">{sprintDone} {_("kpi.of")} {sprints.length} {_("kpi.sprintsDone")}</div></div>
          <div className="kp"><div className="kl">{_("kpi.okrAverage")}</div><div className="kv">{okrAverageProgress}%</div><div className="km">{_("kpi.okrAverageDesc")}</div></div>
          <div className="kp"><div className="kl">{_("kpi.operationalCadence")}</div><div className="kv">{settings.sprintCadenceDays}d</div><div className="km">{_("kpi.okrCheckinEvery")} {settings.okrCheckInDays} {_("kpi.days")}</div></div>
          <div className="kp"><div className="kl">{_("kpi.wipLimit")}</div><div className="kv">{settings.sprintWipLimit}</div><div className="km">{_("kpi.simultaneousItems")}</div></div>
        </div>

        <div className="g2 fu s1" style={{ marginBottom: 24 }}>
          <div className="cd hv">
            <div className="cd-h">
              <div className="cd-t">{_("card.sprintsKanban")}</div>
              <button className="bt bp" onClick={() => setModal("sprint")}>{_("btn.addSprint")}</button>
            </div>
            <div className="cd-b">
              <div className="kb-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
                {SPRINT_STATUS_ORDER.map(status => (
                  <div
                    key={status}
                    className={`kb-col ${dropSprintStatus === status ? "drop" : ""}`}
                    onDragOver={e => { e.preventDefault(); setDropSprintStatus(status); }}
                    onDragLeave={() => setDropSprintStatus(current => (current === status ? null : current))}
                    onDrop={e => {
                      e.preventDefault();
                      if (dragSprintId) moveSprintStatus(dragSprintId, status);
                      setDragSprintId(null);
                      setDropSprintStatus(null);
                    }}
                  >
                    <div className="kb-h"><div className="kb-t">{_(SPRINT_STATUS_LABEL[status] as any)}</div><div className="kb-c">{sprintStatusCount(status)}</div></div>
                    <div className="kb-list">
                      {sprints.filter(item => item.status === status).map(item => (
                        <div
                          key={item.id}
                          className="kb-card"
                          draggable
                          onDragStart={() => setDragSprintId(item.id)}
                          onDragEnd={() => { setDragSprintId(null); setDropSprintStatus(null); }}
                        >
                          <div className="kb-tt">{item.title}</div>
                          <div className="kb-sub">{item.owner} • {new Date(item.deadline).toLocaleDateString(lang === "en" ? "en-US" : lang === "es" ? "es-ES" : "pt-BR")}</div>
                          <div className="kb-p"><span style={{ width: `${clamp(item.progress)}%` }} /></div>
                          <div className="kb-sub">{item.progress}% {_("kpi.completed")}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="cd hv">
            <div className="cd-h">
              <div className="cd-t">{_("card.okrKanban")}</div>
              <button className="bt bp" onClick={() => setModal("okr")}>{_("btn.addOkr")}</button>
            </div>
            <div className="cd-b">
              <div className="kb-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
                {OKR_STATUS_ORDER.map(status => (
                  <div
                    key={status}
                    className={`kb-col ${dropOkrStatus === status ? "drop" : ""}`}
                    onDragOver={e => { e.preventDefault(); setDropOkrStatus(status); }}
                    onDragLeave={() => setDropOkrStatus(current => (current === status ? null : current))}
                    onDrop={e => {
                      e.preventDefault();
                      if (dragOkrId) moveOkrStatus(dragOkrId, status);
                      setDragOkrId(null);
                      setDropOkrStatus(null);
                    }}
                  >
                    <div className="kb-h"><div className="kb-t">{_(OKR_STATUS_LABEL[status] as any)}</div><div className="kb-c">{okrStatusCount(status)}</div></div>
                    <div className="kb-list">
                      {okrs.filter(okr => okr.status === status).map(okr => {
                        const progress = clamp((okr.current / Math.max(1, okr.target)) * 100);
                        return (
                          <div
                            key={okr.id}
                            className="kb-card"
                            draggable
                            onDragStart={() => setDragOkrId(okr.id)}
                            onDragEnd={() => { setDragOkrId(null); setDropOkrStatus(null); }}
                          >
                            <div className="kb-tt">{okr.objective}</div>
                            <div className="kb-sub">{okr.owner}</div>
                            <div className="kb-p"><span style={{ width: `${progress}%` }} /></div>
                            <div className="kb-sub">{Math.round(progress)}% • KR: {okr.keyResult}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="g2 fu s1" style={{ marginBottom: 24 }}>
          <div className="cd hv"><div className="cd-h"><div className="cd-t">{_("card.sprintSuccessFlow")}</div></div><div className="cd-b" style={{ height: 260 }}><Bar data={sprintKanbanCD as any} options={bO} /></div></div>
          <div className="cd hv"><div className="cd-h"><div className="cd-t">{_("card.okrProgressDistribution")}</div></div><div className="cd-b" style={{ height: 260 }}><Bar data={okrKanbanCD as any} options={bO} /></div></div>
        </div>

        <div className="cd hv fu s2" style={{ marginBottom: 18 }}>
          <div className="cd-h"><div className="cd-t">{_("card.sprintOkrMap")}</div></div>
          <div className="cd-b">
            <table className="dt kb-map">
              <thead>
                <tr>
                  <th>{_("table.sprint")}</th>
                  <th>{_("table.owner")}</th>
                  <th>{_("table.deadline")}</th>
                  <th>{_("table.progress")}</th>
                  <th>{_("table.linkedObjective")}</th>
                  <th>{_("table.keyResult")}</th>
                </tr>
              </thead>
              <tbody>
                {sprints.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--ts)" }}>{_("dash.waitingData")}</td></tr>
                ) : (
                  sprints.map(item => {
                    const linked = okrs.find(okr => okr.id === item.linkedOkrId);
                    return (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.owner}</td>
                        <td>{new Date(item.deadline).toLocaleDateString(lang === "en" ? "en-US" : lang === "es" ? "es-ES" : "pt-BR")}</td>
                        <td>{item.progress}%</td>
                        <td>{linked?.objective || _("modal.noLink")}</td>
                        <td>{linked?.keyResult || "—"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="logic-note fu s1">
          <div className="logic-title">{_("logic.boardSuccessTitle")}</div>
          <div className="logic-row"><span>{_("logic.sprintSuccess")}</span><strong>{_("logic.sprintSuccessDesc")}</strong></div>
          <div className="logic-row"><span>{_("logic.okrProgress")}</span><strong>{_("logic.okrProgressDesc")}</strong></div>
          <div className="logic-row"><span>{_("logic.executionWip")}</span><strong>{_("logic.executionWipDesc")}: {settings.sprintWipLimit} {_("kpi.simultaneousItems")}</strong></div>
        </div>
      </div>
      {/* FUNIL */}
      <div className={`ct ${scr === "funil" ? "a" : ""}`}><div className="fu" style={{ marginBottom: 24 }}><h1 className="gf">{_("title.funil")}</h1></div>
        <Lgd id="funil" title={_("lgd.funnelTitle")}>
          <dl className="lgd-term">
            <dt>{_("lgd.funnelLead")}</dt><dd>{_("lgd.funnelLeadDesc")}</dd>
            <dt>{_("lgd.funnelScheduled")}</dt><dd>{_("lgd.funnelScheduledDesc")}</dd>
            <dt>{_("lgd.funnelAttended")}</dt><dd>{_("lgd.funnelAttendedDesc")}</dd>
            <dt>{_("lgd.funnelConverted")}</dt><dd>{_("lgd.funnelConvertedDesc")}</dd>
          </dl>
          <div className="lgd-calc">{_("lgd.funnelFormula").split("\n").map((l,i) => <span key={i}>{l}<br/></span>)}</div>
          <p>{_("lgd.funnelDoughnut")}</p>
        </Lgd><div className="g21 fu s1"><div className="cd hv"><div className="cd-h"><div className="cd-t">{_("card.salesFunnel")}</div></div><div className="cd-b" style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 260 }}><Doughnut data={fCD as any} options={{ responsive: true, plugins: { legend: { labels: { color: tc } } } }} /></div></div></div><div className="cd hv"><div className="cd-h"><div className="cd-t">{_("card.summary")}</div></div><div className="cd-b"><div className="logic-note" style={{ margin: 0 }}><div className="logic-row"><span>{_("logic.totalLeads")}</span><strong>{leadsTotal}</strong></div><div className="logic-row"><span>{_("logic.scheduled")}</span><strong>{scheduledTotal}</strong></div><div className="logic-row"><span>{_("logic.attended")}</span><strong>{attendedTotal}</strong></div><div className="logic-row"><span>{_("logic.conversions")}</span><strong>{convertedTotal}</strong></div></div></div></div></div>
        <div className="logic-note fu s1">
          <div className="logic-title">{_("logic.funnelFormulaTitle")}</div>
          <div className="logic-row"><span>{_("logic.schedulingRate")}</span><strong>{_("logic.schedulingRateDesc")}</strong></div>
          <div className="logic-row"><span>{_("logic.attendanceRate")}</span><strong>{_("logic.attendanceRateDesc")}</strong></div>
          <div className="logic-row"><span>{_("logic.closingRate")}</span><strong>{_("logic.closingRateDesc")}</strong></div>
        </div>
      </div>

      {/* CANAIS */}
      <div className={`ct ${scr === "canais" ? "a" : ""}`}><div className="fu" style={{ marginBottom: 24 }}><h1 className="gf">{_("title.canais")}</h1></div>
        <Lgd id="canais" title={_("lgd.channelsTitle")}>
          <dl className="lgd-term">
            <dt>{_("lgd.channelsAds")}</dt><dd>{_("lgd.channelsAdsDesc")}</dd>
            <dt>{_("lgd.channelsCpl")}</dt><dd>{_("lgd.channelsCplDesc")}</dd>
            <dt>{_("lgd.channelsRoas")}</dt><dd>{_("lgd.channelsRoasDesc")}</dd>
          </dl>
          <div className="lgd-calc">{_("lgd.channelsFormula").split("\n").map((l,i) => <span key={i}>{l}<br/></span>)}</div>
          <p>{_("lgd.channelsBenchmark")}</p>
        </Lgd><div className="kg fu s1"><div className="kp"><div className="kl">{_("kpi.adsInvestment")}</div><div className="kv">R$ {marketingSpend.toLocaleString("pt-BR")}</div><div className="km">{_("logic.distributed4Channels")}</div></div><div className="kp"><div className="kl">{_("kpi.cpl")}</div><div className="kv">R$ {avgCpl.toLocaleString("pt-BR")}</div><div className="km">{_("logic.totalLeadsInPeriod")}: {leadsTotal}</div></div><div className="kp"><div className="kl">{_("kpi.roas")}</div><div className="kv">{weightedRoas}x</div><div className="km">{_("logic.attributedRevenue")}: R$ {channelRevenue.reduce((a, b) => a + b, 0).toLocaleString("pt-BR")}</div></div></div>
        <div className="cd hv fu s2"><div className="cd-h"><div className="cd-t">{_("card.channelPerformance")}</div></div><div className="cd-b" style={{ height: 300 }}><Bar data={channelCD as any} options={bO} /></div></div>
        <div className="logic-note fu s1">
          <div className="logic-title">{_("logic.channelsLegendTitle")}</div>
          <div className="logic-row"><span>{_("logic.bars")}</span><strong>{_("logic.channelMonthlyInvestment")}</strong></div>
          <div className="logic-row"><span>{_("logic.line")}</span><strong>{_("logic.channelRoasFormula")}</strong></div>
        </div>
      </div>

      {/* INTEGRAÃ‡Ã•ES */}
      <div className={`ct ${scr === "integracoes" ? "a" : ""}`}>
        <div className="fu" style={{ marginBottom: 24 }}><h1 className="gf">{_("int.title")}</h1><div style={{ color: "var(--ts)", fontSize: 14, marginTop: 4 }}>{_("int.subtitle")}</div></div>
        <div className="tn">
          <button className={`tbn ${intTab === "tracking" ? "a" : ""}`} onClick={() => setIntTab("tracking")}>{_("int.trackingTab")}</button>
          <button className={`tbn ${intTab === "data" ? "a" : ""}`} onClick={() => setIntTab("data")}>{_("int.dataTab")}</button>
          <button className={`tbn ${intTab === "crm" ? "a" : ""}`} onClick={() => setIntTab("crm")}>{_("int.crmTab")}</button>
          <button className={`tbn ${intTab === "import" ? "a" : ""}`} onClick={() => setIntTab("import")}>{_("int.fileImportTab")}</button>
        </div>

        {/* TRACKING TAB */}
        {intTab === "tracking" && <div className="fu s1">
          {/* Google Ads */}
          <div className="cd hv" style={{ marginBottom: 24 }}><div className="cd-h"><div className="cd-t">Google Ads</div><StatusBadge type="google_ads" /></div><div className="cd-b"><p style={{ fontSize: 13, color: "var(--ts)", marginBottom: 16 }}>{_("int.googleAdsDesc")}</p><div className="fr"><div><label className="fl">{_("int.customerId")}</label><input type="text" className="fi" placeholder="xxx-xxx-xxxx" value={intForm.google_ads_token || ""} onChange={e => setIntForm(p => ({ ...p, google_ads_token: e.target.value }))} /></div><div><label className="fl">{_("int.oauthToken")}</label><input type="text" className="fi" placeholder={_("int.accessToken")} value={intForm.google_ads_url || ""} onChange={e => setIntForm(p => ({ ...p, google_ads_url: e.target.value }))} /></div></div><div style={{ display: "flex", gap: 12 }}>{isIntActive("google_ads") ? <button className="bd" onClick={() => removeIntegration("google_ads")}>{_("btn.remove")}</button> : <button className="bt bp" onClick={() => saveIntegration("google_ads", "Google Ads")}>{_("btn.save")}</button>}</div><div className="rec-box"><h4>{_("int.glxRec")}</h4><p>{_("int.googleAdsRec")}</p></div></div></div>

          {/* GTM */}
          <div className="cd hv" style={{ marginBottom: 24 }}><div className="cd-h"><div className="cd-t">Google Tag Manager (GTM)</div><StatusBadge type="gtm" /></div><div className="cd-b"><p style={{ fontSize: 13, color: "var(--ts)", marginBottom: 16 }}>{_("int.gtmDesc")}</p><label className="fl">{_("int.gtmContainerId")}</label><input type="text" className="fi" placeholder="GTM-XXXXXXX" value={intForm.gtm_token || ""} onChange={e => setIntForm(p => ({ ...p, gtm_token: e.target.value }))} /><div style={{ display: "flex", gap: 12 }}>{isIntActive("gtm") ? <button className="bd" onClick={() => removeIntegration("gtm")}>{_("btn.remove")}</button> : <button className="bt bp" onClick={() => saveIntegration("gtm", "GTM")}>{_("btn.save")}</button>}</div></div></div>

          {/* Meta Pixel */}
          <div className="cd hv" style={{ marginBottom: 24 }}><div className="cd-h"><div className="cd-t">Meta Pixel</div><StatusBadge type="meta_pixel" /></div><div className="cd-b"><p style={{ fontSize: 13, color: "var(--ts)", marginBottom: 16 }}>{_("int.metaPixelDesc")}</p><label className="fl">{_("int.pixelId")}</label><input type="text" className="fi" placeholder={_("int.pixelId")} value={intForm.meta_pixel_token || ""} onChange={e => setIntForm(p => ({ ...p, meta_pixel_token: e.target.value }))} /><div style={{ display: "flex", gap: 12 }}>{isIntActive("meta_pixel") ? <button className="bd" onClick={() => removeIntegration("meta_pixel")}>{_("btn.remove")}</button> : <button className="bt bp" onClick={() => saveIntegration("meta_pixel", "Meta Pixel")}>{_("btn.save")}</button>}</div></div></div>

          {/* Meta CAPI */}
          <div className="cd hv" style={{ marginBottom: 24 }}><div className="cd-h"><div className="cd-t">Meta Conversions API (CAPI)</div><StatusBadge type="meta_capi" /></div><div className="cd-b"><p style={{ fontSize: 13, color: "var(--ts)", marginBottom: 16 }}>{_("int.metaCapiDesc")}</p><div className="fr"><div><label className="fl">{_("int.accessToken")}</label><input type="text" className="fi" placeholder={_("int.accessToken")} value={intForm.meta_capi_token || ""} onChange={e => setIntForm(p => ({ ...p, meta_capi_token: e.target.value }))} /></div><div><label className="fl">{_("int.pixelId")}</label><input type="text" className="fi" placeholder={_("int.pixelId")} value={intForm.meta_capi_url || ""} onChange={e => setIntForm(p => ({ ...p, meta_capi_url: e.target.value }))} /></div></div><div style={{ display: "flex", gap: 12 }}>{isIntActive("meta_capi") ? <button className="bd" onClick={() => removeIntegration("meta_capi")}>{_("btn.remove")}</button> : <button className="bt bp" onClick={() => saveIntegration("meta_capi", "Meta CAPI")}>{_("btn.save")}</button>}</div><div className="rec-box"><h4>{_("int.glxRec")}</h4><p>{_("int.metaCapiRec")}</p></div></div></div>

          {/* Server-Side GTM */}
          <div className="cd hv" style={{ marginBottom: 24, border: "1px solid var(--gp)" }}><div className="cd-h" style={{ background: "linear-gradient(135deg,rgba(197,138,249,.1),rgba(138,180,248,.1))" }}><div className="cd-t" style={{ color: "var(--gp)" }}>{_("int.ssGtmTitle")}</div><span className="bg in">{_("int.recommended")}</span></div><div className="cd-b"><p style={{ fontSize: 13, color: "var(--ts)", marginBottom: 16 }}>{_("int.ssGtmDesc")}</p><div className="al"><div className="al-t">{_("int.archTitle")}</div><div className="al-d">{_("int.archDesc")}</div></div></div></div>
        </div>}

        {/* DATA TAB */}
        {intTab === "data" && <div className="fu s1">
          {/* Google Sheets */}
          <div className="cd hv" style={{ marginBottom: 24 }}><div className="cd-h"><div className="cd-t">Google Sheets API</div><StatusBadge type="google_sheets" /></div><div className="cd-b"><p style={{ fontSize: 13, color: "var(--ts)", marginBottom: 16 }}>{_("int.sheetsDesc")}</p><label className="fl">{_("int.sheetsUrl")}</label><div style={{ display: "flex", gap: 12, marginBottom: 16 }}><input type="text" className="fi" style={{ margin: 0, flex: 1 }} placeholder={_("int.sheetsUrlPlaceholder")} value={intForm.google_sheets_url || ""} onChange={e => setIntForm(p => ({ ...p, google_sheets_url: e.target.value }))} />{isIntActive("google_sheets") ? <button className="bd" onClick={() => removeIntegration("google_sheets")}>{_("btn.disconnect")}</button> : <button className="bt bp" onClick={() => saveIntegration("google_sheets", "Google Sheets")}>{_("btn.connect")}</button>}</div><div className="rec-box"><h4>{_("int.sheetsMethods")}</h4><p>{_("int.sheetsMethodsDesc").split("\n").map((l,i) => <span key={i}>{l}<br/></span>)}</p></div></div></div>

          {/* Excel */}
          <div className="cd hv" style={{ marginBottom: 24 }}><div className="cd-h"><div className="cd-t">Excel (Microsoft Graph API)</div><StatusBadge type="excel" /></div><div className="cd-b"><p style={{ fontSize: 13, color: "var(--ts)", marginBottom: 16 }}>{_("int.excelDesc")}</p><div className="fr"><div><label className="fl">{_("int.clientId")}</label><input type="text" className="fi" placeholder="xxxxxxxx-xxxx-xxxx-xxxx" value={intForm.excel_token || ""} onChange={e => setIntForm(p => ({ ...p, excel_token: e.target.value }))} /></div><div><label className="fl">{_("int.tenantId")}</label><input type="text" className="fi" placeholder="xxxxxxxx-xxxx-xxxx-xxxx" value={intForm.excel_url || ""} onChange={e => setIntForm(p => ({ ...p, excel_url: e.target.value }))} /></div></div><div style={{ display: "flex", gap: 12 }}>{isIntActive("excel") ? <button className="bd" onClick={() => removeIntegration("excel")}>{_("btn.remove")}</button> : <button className="bt bp" onClick={() => saveIntegration("excel", "Excel")}>{_("btn.connect")}</button>}</div><div className="rec-box"><h4>{_("int.excelMethods")}</h4><p>{_("int.excelMethodsDesc").split("\n").map((l,i) => <span key={i}>{l}<br/></span>)}</p></div></div></div>

          {/* Power BI */}
          <Lk locked={nE} title={_("lock.powerBiTitle")} msg={_("lock.powerBiMsg")} btn={_("btn.upgradeEnterprise")}>
            <div className="cd hv"><div className="cd-h"><div className="cd-t">Power BI</div><StatusBadge type="powerbi" /></div><div className="cd-b"><p style={{ fontSize: 13, color: "var(--ts)", marginBottom: 16 }}>{_("int.powerBiDesc")}</p><label className="fl">{_("int.embedUrl")}</label><div style={{ display: "flex", gap: 12, marginBottom: 16 }}><input type="text" className="fi" style={{ margin: 0, flex: 1 }} placeholder={_("int.embedUrlPlaceholder")} value={intForm.powerbi_url || ""} onChange={e => setIntForm(p => ({ ...p, powerbi_url: e.target.value }))} />{isIntActive("powerbi") ? <button className="bd" onClick={() => removeIntegration("powerbi")}>{_("btn.disconnect")}</button> : <button className="bt bp" onClick={() => saveIntegration("powerbi", "Power BI")}>{_("btn.connect")}</button>}</div><div className="rec-box"><h4>{_("int.powerBiMethods")}</h4><p>{_("int.powerBiMethodsDesc").split("\n").map((l,i) => <span key={i}>{l}<br/></span>)}</p></div></div></div>
          </Lk>
        </div>}

        {/* CRM TAB */}
        {intTab === "crm" && <div className="fu s1">
          <div className="cd hv" style={{ marginBottom: 24 }}><div className="cd-h"><div className="cd-t">HubSpot CRM</div><StatusBadge type="hubspot" /></div><div className="cd-b"><p style={{ fontSize: 13, color: "var(--ts)", marginBottom: 16 }}>{_("int.hubspotDesc")}</p><label className="fl">{_("int.hubspotToken")}</label><input type="text" className="fi" placeholder={_("int.hubspotPlaceholder")} value={intForm.hubspot_token || ""} onChange={e => setIntForm(p => ({ ...p, hubspot_token: e.target.value }))} /><div style={{ display: "flex", gap: 12 }}>{isIntActive("hubspot") ? <button className="bd" onClick={() => removeIntegration("hubspot")}>{_("btn.remove")}</button> : <button className="bt bp" onClick={() => saveIntegration("hubspot", "HubSpot")}>{_("btn.save")}</button>}</div></div></div>

          <div className="cd hv" style={{ marginBottom: 24 }}><div className="cd-h"><div className="cd-t">RD Station</div><StatusBadge type="rdstation" /></div><div className="cd-b"><p style={{ fontSize: 13, color: "var(--ts)", marginBottom: 16 }}>{_("int.rdstationDesc")}</p><label className="fl">{_("int.rdstationToken")}</label><input type="text" className="fi" placeholder={_("int.rdstationPlaceholder")} value={intForm.rdstation_token || ""} onChange={e => setIntForm(p => ({ ...p, rdstation_token: e.target.value }))} /><div style={{ display: "flex", gap: 12 }}>{isIntActive("rdstation") ? <button className="bd" onClick={() => removeIntegration("rdstation")}>{_("btn.remove")}</button> : <button className="bt bp" onClick={() => saveIntegration("rdstation", "RD Station")}>{_("btn.save")}</button>}</div></div></div>
        </div>}

        {/* FILE IMPORT TAB */}
        {intTab === "import" && <div className="fu s1">
          <div className="cd hv" style={{ marginBottom: 24, border: "1px solid var(--gp)" }}><div className="cd-h" style={{ background: "linear-gradient(135deg,rgba(197,138,249,.1),rgba(138,180,248,.1))" }}><div className="cd-t" style={{ color: "var(--gp)" }}>{_("file.title")}</div></div><div className="cd-b">
            <p style={{ fontSize: 13, color: "var(--ts)", marginBottom: 24 }}>{_("file.subtitle")}</p>
            <div className="dz" onClick={() => fileRef.current?.click()} onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("over"); }} onDragLeave={e => e.currentTarget.classList.remove("over")} onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove("over"); const f = e.dataTransfer.files[0]; if (f) handleFileImport(f); }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>ðŸ“Š</div>
              <p style={{ fontSize: 16, fontWeight: 500, color: "var(--tp)", marginBottom: 8 }}>{_("file.dropzone")}</p>
              <p style={{ fontSize: 13, color: "var(--ts)" }}>{_("file.supported")}</p>
              <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFileImport(f); }} />
            </div>
            <div className="al" style={{ marginTop: 24 }}><div className="al-t">{_("file.howTitle")}</div><div className="al-d">{_("file.howDesc").split("\n").map((l,i) => <span key={i}>{l}<br/></span>)}</div></div>
          </div></div>
        </div>}
      </div>

      {/* ENTRADA DE DADOS */}
      <div className={`ct ${scr === "dados" ? "a" : ""}`}>
        <div className="fu" style={{ marginBottom: 24 }}><h1 className="gf">{_("title.dados")}</h1><div style={{ color: "var(--ts)", fontSize: 14, marginTop: 4 }}>{_("sub.dados")}</div></div>
        <Lgd id="dados" title={_("lgd.dadosTitle")}>
          <p>{_("lgd.dadosFinancialIntro")}</p>
          <dl className="lgd-term">
            <dt>{_("lgd.dadosRevenue")}</dt><dd>{_("lgd.dadosRevenueDesc")}</dd>
            <dt>{_("lgd.dadosFixedCost")}</dt><dd>{_("lgd.dadosFixedCostDesc")}</dd>
            <dt>{_("lgd.dadosVariableCost")}</dt><dd>{_("lgd.dadosVariableCostDesc")}</dd>
          </dl>

          <div className="lgd-calc">{_("lgd.dadosFormula").split("\n").map((l,i) => <span key={i}>{l}<br/></span>)}</div>
        </Lgd>
        <div className="cd hv fu s1"><div className="cd-b"><div className="fr"><div><label className="fl">{_("data.type")}</label><select className="fs" value={fTipo} onChange={e => setFTipo(e.target.value)}><option>{_("data.revenue")}</option><option>{_("data.cost")}</option><option>{_("data.variableCost")}</option></select></div><div><label className="fl">{_("data.value")}</label><input type="number" className="fi" placeholder={_("data.valuePlaceholder")} value={fVal} onChange={e => setFVal(e.target.value)} /></div></div><button className="bt bp" onClick={regFin}>{_("data.registerFinancial")}</button></div></div>

        {/* RECORDS TABLE WITH DELETE */}
        <div className="cd hv fu s2" style={{ marginTop: 24 }}><div className="cd-h"><div className="cd-t">{_("data.recentRecords")} ({records.length})</div></div><div className="cd-b">{records.length === 0 ? <div className="es">{_("data.noRecords")}</div> : <table className="rec-tbl"><thead><tr><th>{_("table.type")}</th><th>{_("table.detail")}</th><th>{_("table.value")}</th><th>{_("table.date")}</th><th>{_("table.action")}</th></tr></thead><tbody>{records.map(r => <tr key={r.id}><td><span className={`bg ${r.type === "financial" ? "in" : "wn"}`}>{r.type === "financial" ? _("data.financial") : _("data.attendance")}</span></td><td>{r.label}</td><td>{r.type === "financial" ? r.detail : r.detail}</td><td style={{ fontSize: 12, color: "var(--ts)" }}>{new Date(r.createdAt).toLocaleString(lang === "en" ? "en-US" : lang === "es" ? "es-ES" : "pt-BR")}</td><td><button className="bd" onClick={() => setDeleteConfirm(r.id)}>{_("btn.delete")}</button></td></tr>)}</tbody></table>}</div></div>
      </div>

      {/* RELATÃ“RIOS */}
      <div className={`ct ${scr === "relatorios" ? "a" : ""}`}><div className="fu" style={{ marginBottom: 24 }}><h1 className="gf">{_("title.relatorios")}</h1><div style={{ color: "var(--ts)", fontSize: 14, marginTop: 4 }}>{_("sub.relatorios")}</div></div>
        <Lgd id="relatorios" title={_("lgd.reportsTitle")}>
          <dl className="lgd-term">
            <dt>{_("lgd.reportsPdf")}</dt><dd>{_("lgd.reportsPdfDesc")}</dd>
            <dt>{_("lgd.reportsCsv")}</dt><dd>{_("lgd.reportsCsvDesc")}</dd>
          </dl>
          <p>{_("lgd.reportsPdfContent")}</p>
          <p>{_("lgd.reportsCsvContent")}</p>
        </Lgd><div className="g2 fu s1" style={{ marginBottom: 24 }}><div className="cd hv"><div className="cd-b" style={{ textAlign: "center", padding: "40px 20px" }}><h3 style={{ marginBottom: 8 }}>{_("card.managerialPdf")}</h3><p style={{ fontSize: 13, color: "var(--ts)", marginBottom: 24 }}>{_("card.managerialPdfDesc")}</p><button className="bt bp" onClick={() => setPdf(true)}>{_("btn.previewPdf")}</button></div></div><div className="cd hv"><div className="cd-b" style={{ textAlign: "center", padding: "40px 20px" }}><h3 style={{ marginBottom: 8 }}>{_("card.exportCsv")}</h3><p style={{ fontSize: 13, color: "var(--ts)", marginBottom: 24 }}>{_("card.exportCsvDesc")}</p><button className="bt bs" onClick={() => { toast(_("toast.preparingCsv")); setTimeout(() => toast(_("toast.csvExported")), 1500); }}>{_("btn.downloadCsv")}</button></div></div></div></div>



      {/* CONFIGURAÇÕES */}
      <div className={`ct ${scr === "configuracoes" ? "a" : ""}`}>
        <div className="fu" style={{ marginBottom: 24 }}><h1 className="gf">{_("title.configuracoes")}</h1></div>
        <Lgd id="configuracoes" title={_("lgd.settingsTitle")}>
          <p>{_("lgd.settingsIntro")}</p>
          <dl className="lgd-term">
            <dt>{_("lgd.settingsRevenue")}</dt><dd>{_("lgd.settingsRevenueDesc")}</dd>
            <dt>{_("lgd.settingsNoshow")}</dt><dd>{_("lgd.settingsNoshowDesc")}</dd>
            <dt>{_("lgd.settingsNps")}</dt><dd>{_("lgd.settingsNpsDesc")}</dd>
            <dt>{_("lgd.settingsWait")}</dt><dd>{_("lgd.settingsWaitDesc")}</dd>
          </dl>
          <div className="lgd-calc">{_("lgd.settingsNpsFormula").split("\n").map((l,i) => <span key={i}>{l}<br/></span>)}</div>
        </Lgd>

        <div className="cd hv fu s1" style={{ marginBottom: 20 }}>
          <div className="cd-h"><div className="cd-t">{_("card.goalsParams")}</div></div>
          <div className="cd-b">
            <div className="fr">
              <div><label className="fl">{_("settings.revenueGoal")}</label><input type="number" className="fi" value={settings.revenueGoal} onChange={e => setSettings(p => ({ ...p, revenueGoal: Number(e.target.value || 0) }))} /></div>
              <div><label className="fl">{_("settings.noshowLimit")}</label><input type="number" className="fi" value={settings.noShowLimit} onChange={e => setSettings(p => ({ ...p, noShowLimit: Number(e.target.value || 0) }))} /></div>
            </div>
            <div className="fr">
              <div><label className="fl">{_("settings.npsGoal")}</label><input type="number" className="fi" value={settings.npsGoal} onChange={e => setSettings(p => ({ ...p, npsGoal: Number(e.target.value || 0) }))} /></div>
              <div><label className="fl">{_("settings.waitTimeLimit")}</label><input type="number" className="fi" value={settings.waitTimeLimit} onChange={e => setSettings(p => ({ ...p, waitTimeLimit: Number(e.target.value || 0) }))} /></div>
            </div>
          </div>
        </div>

        <div className="cd hv fu s1" style={{ marginBottom: 20 }}>
          <div className="cd-h"><div className="cd-t">{_("settings.sprintOkrParams")}</div></div>
          <div className="cd-b">
            <div className="fr">
              <div><label className="fl">{_("settings.sprintCadenceDays")}</label><input type="number" className="fi" value={settings.sprintCadenceDays} onChange={e => setSettings(p => ({ ...p, sprintCadenceDays: Number(e.target.value || 0) }))} /></div>
              <div><label className="fl">{_("settings.wipLimit")}</label><input type="number" className="fi" value={settings.sprintWipLimit} onChange={e => setSettings(p => ({ ...p, sprintWipLimit: Number(e.target.value || 0) }))} /></div>
            </div>
            <div className="fr">
              <div><label className="fl">{_("settings.okrCheckinDays")}</label><input type="number" className="fi" value={settings.okrCheckInDays} onChange={e => setSettings(p => ({ ...p, okrCheckInDays: Number(e.target.value || 0) }))} /></div>
              <div><label className="fl">{_("settings.conversionGoal")}</label><input type="number" className="fi" value={settings.conversionGoal} onChange={e => setSettings(p => ({ ...p, conversionGoal: Number(e.target.value || 0) }))} /></div>
            </div>
          </div>
        </div>

        <div className="cd hv fu s1" style={{ marginBottom: 20 }}>
          <div className="cd-h"><div className="cd-t">{_("settings.alertThresholds")}</div></div>
          <div className="cd-b">
            <div className="fr">
              <div><label className="fl">{_("settings.teamDailyCapacity")}</label><input type="number" className="fi" value={settings.teamDailyCapacity} onChange={e => setSettings(p => ({ ...p, teamDailyCapacity: Number(e.target.value || 0) }))} /></div>
              <div><label className="fl">{_("settings.p1NoShowMax")}</label><input type="number" className="fi" value={settings.p1NoShowLimit} onChange={e => setSettings(p => ({ ...p, p1NoShowLimit: Number(e.target.value || 0) }))} /></div>
            </div>
            <div className="fr">
              <div><label className="fl">{_("settings.p1MinMargin")}</label><input type="number" className="fi" value={settings.p1MarginLimit} onChange={e => setSettings(p => ({ ...p, p1MarginLimit: Number(e.target.value || 0) }))} /></div>
              <div><label className="fl">{_("settings.dashboardNoShowGoal")}</label><input type="number" className="fi" value={settings.noShowLimit} onChange={e => setSettings(p => ({ ...p, noShowLimit: Number(e.target.value || 0) }))} /></div>
            </div>
            <button className="bt bp" onClick={() => toast(_("toast.settingsSaved"))}>{_("btn.updateGoals")}</button>
          </div>
        </div>

        <div className="logic-note fu s1">
          <div className="logic-title">{_("logic.operationalTitle")}</div>
          <div className="logic-row"><span>{_("logic.sprintWip")}</span><strong>{_("logic.sprintWipDesc")}</strong></div>
          <div className="logic-row"><span>{_("logic.okrCheckin")}</span><strong>{_("logic.okrCheckinDesc")}</strong></div>
          <div className="logic-row"><span>{_("logic.p1Threshold")}</span><strong>{_("logic.p1ThresholdDesc")}</strong></div>
        </div>
      </div>
    </main>
  </div></>);
}











