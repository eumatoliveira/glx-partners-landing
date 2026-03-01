import { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react';
import { Redirect, useLocation } from 'wouter';
import { Moon, Sun } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Language } from '@/i18n';
import { normalizePlanTier } from '@shared/controlTowerRules';
import EssentialDashboard from './components/EssentialDashboard';
import ProDashboard from './components/ProDashboard';
import EnterpriseDashboard from './components/EnterpriseDashboard';
import { Filters, defaultFilters } from './data/mockData';
import { exportDashboardPDF } from './utils/pdfExport';
import './scoped.css';

type Theme = 'dark' | 'light';
type Lang = 'PT' | 'EN' | 'ES';
type Plan = 'ESSENTIAL' | 'PRO' | 'ENTERPRISE';

type ExportCapability = {
  allowCsv: boolean;
  allowPdf: boolean;
  reason?: string;
};

const FINANCIAL_EXPORT_ROLES = new Set([
  'ADMIN',
  'CEO',
  'MANAGER',
  'NETWORK_OWNER',
  'NETWORK_EXEC',
  'FINANCE_LEAD',
]);

function toDashboardLang(language: Language): Lang {
  if (language === 'en') return 'EN';
  if (language === 'es') return 'ES';
  return 'PT';
}

function toAppLanguage(language: Lang): Language {
  if (language === 'EN') return 'en';
  if (language === 'ES') return 'es';
  return 'pt';
}

function toDashboardPlan(plan: string | null | undefined): Plan {
  const normalized = normalizePlanTier(plan);
  if (normalized === 'enterprise') return 'ENTERPRISE';
  if (normalized === 'pro') return 'PRO';
  return 'ESSENTIAL';
}

function planLabel(plan: Plan): string {
  if (plan === 'ENTERPRISE') return 'Enterprise';
  if (plan === 'PRO') return 'Pro';
  return 'Essential';
}

function resolveExportRole(user: unknown): string {
  if (!user || typeof user !== 'object') return 'CLIENTE';
  const record = user as Record<string, unknown>;
  const metadata = record.metadata && typeof record.metadata === 'object' ? record.metadata as Record<string, unknown> : null;
  const candidate =
    record.dashboardRole ??
    record.profileRole ??
    metadata?.dashboardRole ??
    metadata?.profileRole ??
    metadata?.role ??
    record.role ??
    'cliente';

  return String(candidate).trim().toUpperCase();
}

function getExportCapability(plan: Plan, role: string, activeTab: number): ExportCapability {
  if (plan === 'ESSENTIAL') {
    return {
      allowCsv: false,
      allowPdf: false,
      reason: 'Plano Essencial permite apenas PDF executivo mensal automático.',
    };
  }

  const isFinancialTab =
    (plan === 'PRO' && activeTab === 2) ||
    (plan === 'ENTERPRISE' && activeTab === 2);

  if (isFinancialTab && !FINANCIAL_EXPORT_ROLES.has(role)) {
    return {
      allowCsv: false,
      allowPdf: false,
      reason: 'Seu perfil não possui permissão para exportação financeira.',
    };
  }

  return {
    allowCsv: true,
    allowPdf: true,
  };
}

const sidebarMenus: Record<Plan, { items: string[] }> = {
  ESSENTIAL: { items: ['Visão CEO', 'Agenda & No-Show', 'Financeiro Executivo', 'Marketing & Captação', 'Operação & Experiência'] },
  PRO: { items: ['Visão CEO', 'War Room', 'Financeiro Avançado', 'Agenda/Otimização', 'Marketing/Unit Economics', 'Integrações', 'Operação & Experiência', 'Equipe'] },
  ENTERPRISE: { items: ['Visão CEO', 'War Room', 'Financeiro — Investidor', 'Agenda/Otimização', 'Marketing/Unit Economics', 'Multi-Unidade', 'Integrações', 'Operação & Experiência', 'Equipe', 'Governança'] },
};

const i18n: Record<Lang, Record<string, string>> = {
  PT: {
    painelEssencial: 'Painel Essencial', painelPro: 'Painel Pro', painelEnterprise: 'Painel Enterprise',
    subtitleEssencial: 'Dashboard executivo para clínicas em estruturação',
    subtitlePro: 'Otimização inteligente por profissional, serviço e canal',
    subtitleEnterprise: 'Inteligência de rede multi-unidade para investidores',
    dadosVivo: '• Dados ao vivo', help: 'Help', atualizar: 'Atualizar',
    exportCsv: 'Exportar CSV', exportPdf: 'Exportar PDF', sair: 'Sair',
    perfil: 'PERFIL', plano: 'PLANO', idioma: 'IDIOMA',
    escuro: 'Escuro', claro: 'Claro',
    refreshMsg: 'Dados atualizados!', csvMsg: 'CSV exportado!', pdfMsg: 'PDF gerado com sucesso!',
    pdfGenerating: 'Gerando PDF...',
  },
  EN: {
    painelEssencial: 'Essential Panel', painelPro: 'Pro Panel', painelEnterprise: 'Enterprise Panel',
    subtitleEssencial: 'Executive dashboard for clinics in structuring',
    subtitlePro: 'Smart optimization by professional, service and channel',
    subtitleEnterprise: 'Multi-unit network intelligence for investors',
    dadosVivo: '• Live Data', help: 'Help', atualizar: 'Refresh',
    exportCsv: 'Export CSV', exportPdf: 'Export PDF', sair: 'Logout',
    perfil: 'PROFILE', plano: 'PLAN', idioma: 'LANGUAGE',
    escuro: 'Dark', claro: 'Light',
    refreshMsg: 'Data refreshed!', csvMsg: 'CSV exported!', pdfMsg: 'PDF generated!',
    pdfGenerating: 'Generating PDF...',
  },
  ES: {
    painelEssencial: 'Panel Esencial', painelPro: 'Panel Pro', painelEnterprise: 'Panel Enterprise',
    subtitleEssencial: 'Dashboard ejecutivo para clínicas en estructuración',
    subtitlePro: 'Optimización inteligente por profesional, servicio y canal',
    subtitleEnterprise: 'Inteligencia de red multi-unidad para inversores',
    dadosVivo: '• Datos en vivo', help: 'Ayuda', atualizar: 'Actualizar',
    exportCsv: 'Exportar CSV', exportPdf: 'Exportar PDF', sair: 'Salir',
    perfil: 'PERFIL', plano: 'PLAN', idioma: 'IDIOMA',
    escuro: 'Oscuro', claro: 'Claro',
    refreshMsg: '¡Datos actualizados!', csvMsg: '¡CSV exportado!', pdfMsg: '¡PDF generado!',
    pdfGenerating: 'Generando PDF...',
  },
};

const NotificationPanel = memo(({ onClose }: { onClose: () => void }) => (
  <div className="overlay-backdrop" onClick={onClose}>
    <div className="overlay-panel" onClick={e => e.stopPropagation()} style={{ width: 380 }}>
      <div className="overlay-header">
        <h3>Notificações</h3>
        <button className="overlay-close" onClick={onClose}>×</button>
      </div>
      <div className="overlay-body">
        <div className="notif-item"><div className="notif-badge danger">P1</div><div><strong>CAC acima do teto</strong><p>R$ 185 vs meta de R$ 150. Google Ads principal ofensor.</p><span className="notif-time">Hoje, 11:15</span></div></div>
        <div className="notif-item"><div className="notif-badge">P2</div><div><strong>No-Show acima da meta</strong><p>Taxa de 12.5% meta {'<'} 10%. 3 semanas consecutivas.</p><span className="notif-time">Hoje, 14:30</span></div></div>
        <div className="notif-item"><div className="notif-badge info">i</div><div><strong>Relatório semanal disponível</strong><p>Semana 08/2026 processada com sucesso.</p><span className="notif-time">Ontem, 18:00</span></div></div>
        <div className="notif-item"><div className="notif-badge success">✓</div><div><strong>Meta de ocupação atingida</strong><p>78% acima da meta de 75%.</p><span className="notif-time">Ontem, 09:00</span></div></div>
      </div>
    </div>
  </div>
));

const SettingsPanel = memo(({ onClose, theme, setTheme, lang, setLang }: { onClose: () => void; theme: Theme; setTheme: (t: Theme) => void; lang: Lang; setLang: (l: Lang) => void }) => (
  <div className="overlay-backdrop" onClick={onClose}>
    <div className="overlay-panel" onClick={e => e.stopPropagation()} style={{ width: 360 }}>
      <div className="overlay-header"><h3>Configurações</h3><button className="overlay-close" onClick={onClose}>×</button></div>
      <div className="overlay-body">
        <div className="settings-group"><label>Tema</label><div className="selector-row"><button className={`selector-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>Escuro</button><button className={`selector-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>Claro</button></div></div>
        <div className="settings-group"><label>Idioma</label><div className="selector-row">{(['PT', 'EN', 'ES'] as Lang[]).map(l => <button key={l} className={`selector-btn ${lang === l ? 'active' : ''}`} onClick={() => setLang(l)}>{l}</button>)}</div></div>
        <div className="settings-group"><label>Refresh automático</label><select className="filter-select" style={{ width: '100%' }}><option>Desligado</option><option>30 segundos</option><option>1 minuto</option><option>5 minutos</option></select></div>
        <div className="settings-group"><label>Notificações</label><select className="filter-select" style={{ width: '100%' }}><option>Ativadas</option><option>Apenas críticas</option><option>Desativadas</option></select></div>
      </div>
    </div>
  </div>
));

const HelpPanel = memo(({ onClose }: { onClose: () => void }) => (
  <div className="overlay-backdrop" onClick={onClose}>
    <div className="overlay-panel" onClick={e => e.stopPropagation()} style={{ width: 420 }}>
      <div className="overlay-header"><h3>Central de Ajuda</h3><button className="overlay-close" onClick={onClose}>×</button></div>
      <div className="overlay-body">
        <div className="help-section"><h4>Filtros</h4><p>Use os filtros globais para segmentar KPIs e gráficos por período, canal, profissional, procedimento, unidade ou severidade.</p></div>
        <div className="help-section"><h4>Drill-Down</h4><p>Clique em qualquer barra ou segmento nos gráficos para filtrar automaticamente. Um segundo clique desfaz o filtro.</p></div>
        <div className="help-section"><h4>Planos</h4><p><strong>Essential:</strong> 5 módulos básicos.</p><p><strong>Pro:</strong> 8 módulos com War Room, Heatmaps e Unit Economics.</p><p><strong>Enterprise:</strong> 10 módulos com Valuation, Multi-Unidade e Governança.</p></div>
        <div className="help-section"><h4>Exportação</h4><p><strong>CSV:</strong> Dados tabelados filtrados. <strong>PDF:</strong> Relatório visual com branding GLX para stakeholders.</p></div>
      </div>
    </div>
  </div>
));

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return <div className="toast-container"><div className="toast">{message}</div></div>;
}

function PlanDashboardApp() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const userPlan = toDashboardPlan((user as any)?.plan);
  const [activePlan, setActivePlan] = useState<Plan>(userPlan);
  const [activeMenuItem, setActiveMenuItem] = useState(0);
  const [theme, setTheme] = useState<Theme>('dark');
  const [lang, setLang] = useState<Lang>(() => toDashboardLang(language));
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLElement>(null);

  const t = useMemo(() => i18n[lang], [lang]);
  const menu = sidebarMenus[activePlan];
  const titleKey = activePlan === 'ESSENTIAL' ? 'painelEssencial' : activePlan === 'PRO' ? 'painelPro' : 'painelEnterprise';
  const subtitleKey = activePlan === 'ESSENTIAL' ? 'subtitleEssencial' : activePlan === 'PRO' ? 'subtitlePro' : 'subtitleEnterprise';
  const activeFilterCount = [filters.channel, filters.professional, filters.procedure, filters.status, filters.unit, filters.severity].filter(Boolean).length;
  const profileName = (user as any)?.name || 'Cliente';
  const profileEmail = (user as any)?.email || '';
  const profileRole = String((user as any)?.role || 'cliente').toUpperCase();
  const exportRole = useMemo(() => resolveExportRole(user), [user]);
  const exportCapability = useMemo(
    () => getExportCapability(activePlan, exportRole, activeMenuItem),
    [activeMenuItem, activePlan, exportRole],
  );

  useEffect(() => {
    const next = toDashboardLang(language);
    setLang(prev => (prev === next ? prev : next));
  }, [language]);

  useEffect(() => {
    setActivePlan(prev => (prev === userPlan ? prev : userPlan));
    setActiveMenuItem(0);
    setFilters(defaultFilters);
  }, [userPlan]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [activeMenuItem, activePlan]);

  const handleSetLang = useCallback((next: Lang) => {
    setLang(next);
    setLanguage(toAppLanguage(next));
  }, [setLanguage]);

  const handleRefresh = useCallback(() => {
    setRefreshKey(k => k + 1);
    setToastMsg(t.refreshMsg);
  }, [exportCapability.allowCsv, exportCapability.reason, t]);

  const handleExportCSV = useCallback(() => {
    try {
      if (!exportCapability.allowCsv) {
        throw new Error(exportCapability.reason || 'Exportacao CSV indisponivel para este perfil.');
      }

      const root = contentRef.current;
      if (!root) throw new Error('Container do dashboard não encontrado.');
      const cards = root.querySelectorAll('.overview-card');
      const tables = root.querySelectorAll('.data-table');
      let csv = '\uFEFF';
      const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;

      if (cards.length > 0) {
        csv += '"KPI","Valor"\n';
        cards.forEach(card => {
          const label = card.querySelector('.overview-card-label')?.textContent?.trim() || '';
          const value = card.querySelector('.overview-card-value')?.textContent?.trim() || '';
          csv += `${escapeCsv(label)},${escapeCsv(value)}\n`;
        });
        csv += '\n';
      }

      tables.forEach(table => {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
          const cells = row.querySelectorAll('th, td');
          const rowData: string[] = [];
          cells.forEach(cell => rowData.push(escapeCsv(cell.textContent?.trim() || '')));
          csv += rowData.join(',') + '\n';
        });
        csv += '\n';
      });

      if (cards.length === 0 && tables.length === 0) {
        throw new Error('Nenhum card ou tabela encontrado para exportar.');
      }

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `glx_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 200);
      setToastMsg(t.csvMsg);
    } catch (err) {
      console.error('CSV export error:', err);
      setToastMsg('Erro ao exportar CSV: ' + (err instanceof Error ? err.message : String(err)));
    }
  }, [t]);

  const handleLogout = useCallback(async () => {
    try {
      await logout({ redirectTo: '/login' });
    } catch (err) {
      console.error('Logout error:', err);
      setToastMsg('Erro ao sair. Tente novamente.');
    }
  }, [logout]);

  const handleExportPDF = useCallback(async () => {
    if (!contentRef.current || pdfLoading) return;
    setPdfLoading(true);
    setToastMsg(t.pdfGenerating);
    try {
      await exportDashboardPDF(contentRef.current, t[titleKey], t[subtitleKey]);
      setToastMsg(t.pdfMsg);
    } catch (err) {
      console.error('PDF export error:', err);
      setToastMsg('Erro ao gerar PDF: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setPdfLoading(false);
    }
  }, [exportCapability.allowPdf, exportCapability.reason, pdfLoading, t, titleKey, subtitleKey]);

  if ((user as any)?.role === 'admin') {
    return <Redirect to="/admin" />;
  }

  return (
    <div className="glx-plan-dashboard-root app-shell" data-theme={theme}>
      <div className="dashboard-ambient" aria-hidden="true">
        <span className="ambient-grid" />
        <span className="ambient-orb ambient-orb-a" />
        <span className="ambient-orb ambient-orb-b" />
        <span className="ambient-orb ambient-orb-c" />
      </div>
      {mobileSidebarOpen && <button type="button" className="sidebar-backdrop" aria-label="Fechar menu" onClick={() => setMobileSidebarOpen(false)} />}
      {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} theme={theme} setTheme={setTheme} lang={lang} setLang={handleSetLang} />}
      {showHelp && <HelpPanel onClose={() => setShowHelp(false)} />}
      {toastMsg && <Toast message={toastMsg} onDone={() => setToastMsg('')} />}

      <aside className={`sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">GLX</div>
          <div className="sidebar-logo-text"><span>PERFORMANCE</span><span>CONTROL TOWER</span></div>
        </div>
        <nav className="sidebar-nav">
          {menu.items.map((item, idx) => (
            <div key={idx} className={`sidebar-item ${activeMenuItem === idx ? 'active' : ''}`} onClick={() => setActiveMenuItem(idx)}>{item}</div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-profile-label">{t.perfil}</div>
          <div className="sidebar-profile-name">{profileRole}</div>
          <div className="sidebar-profile-email">{profileEmail || profileName}</div>
          <div style={{ marginTop: 14 }}>
            <div className="selector-row-label">{t.idioma}</div>
            <select className="filter-select" style={{ width: '100%' }} value={lang} onChange={e => handleSetLang(e.target.value as Lang)}>
              <option value="PT">Português</option>
              <option value="EN">English</option>
              <option value="ES">Español</option>
            </select>
          </div>
          <div style={{ marginTop: 12 }}>
            <div className="selector-row-label">TEMA</div>
            <div className="theme-toggle-wrapper" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ cursor: 'pointer' }}>
              <span className="theme-toggle-icon" aria-hidden="true">
                {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
              </span>
              <div className={`theme-toggle-track ${theme === 'light' ? 'light' : ''}`}>
                <div className="theme-toggle-thumb" />
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div className="selector-row-label">{t.plano}</div>
            <div className="selector-row">
              <button
                className="selector-btn active"
                type="button"
                title="Abrir página de planos"
                onClick={() => setLocation('/planos')}
              >
                {planLabel(activePlan)}
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-title-row">
            <button type="button" className="mobile-menu-btn" aria-label="Abrir menu" onClick={() => setMobileSidebarOpen(true)}>
              ☰
            </button>
            <div className="topbar-title"><h1>{t[titleKey]}</h1><span>{t[subtitleKey]}</span></div>
          </div>
          <div className="topbar-actions">
            {activeFilterCount > 0 && <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, marginRight: 4 }}>{activeFilterCount} filtro{activeFilterCount > 1 ? 's' : ''}</span>}
            <button className="topbar-btn live status-btn">{t.dadosVivo}</button>
            <button className="topbar-btn topbar-icon-btn notification-btn" onClick={() => setShowNotifications(true)} style={{ position: 'relative' }}>
              🔔<span style={{ position: 'absolute', top: -2, right: -2, width: 14, height: 14, borderRadius: '50%', background: 'var(--red)', color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>4</span>
            </button>
            <button className="topbar-btn" onClick={() => setShowSettings(true)}>⚙</button>
            <button className="topbar-btn text-btn" onClick={() => setShowHelp(true)}>{t.help}</button>
            <button className="topbar-btn text-btn" onClick={handleRefresh}>{t.atualizar}</button>
            <button type="button" className="topbar-btn text-btn" onClick={handleExportCSV} disabled={!exportCapability.allowCsv} title={exportCapability.allowCsv ? t.exportCsv : exportCapability.reason}>
              {t.exportCsv}
            </button>
            <button type="button" className="topbar-btn export-pdf" onClick={handleExportPDF} disabled={pdfLoading || !exportCapability.allowPdf} title={exportCapability.allowPdf ? t.exportPdf : exportCapability.reason}>
              {pdfLoading ? '...' : t.exportPdf}
            </button>
            <button className="topbar-btn text-btn" onClick={handleLogout}>{t.sair}</button>
          </div>
        </header>
        <main className="content" ref={contentRef} key={refreshKey}>
          {activePlan === 'ESSENTIAL' && <EssentialDashboard activeTab={activeMenuItem} theme={theme} filters={filters} onFiltersChange={setFilters} />}
          {activePlan === 'PRO' && <ProDashboard activeTab={activeMenuItem} theme={theme} filters={filters} onFiltersChange={setFilters} />}
          {activePlan === 'ENTERPRISE' && <EnterpriseDashboard activeTab={activeMenuItem} theme={theme} filters={filters} onFiltersChange={setFilters} />}
        </main>
      </div>
    </div>
  );
}

export default PlanDashboardApp;
