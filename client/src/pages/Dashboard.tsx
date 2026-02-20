import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Bell, Settings, LogOut, BarChart3, FileText, Users, Calendar, Zap, TrendingUp, TrendingDown } from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [modalOpen, setModalOpen] = useState<string | null>(null);

  // Redireciona para login se não estiver autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [loading, isAuthenticated, setLocation]);

  if (!loading && !isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#0f1115" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "12px" }}>⏳</div>
          <p style={{ color: "#94a3b8" }}>Carregando...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.className = newTheme === "light" ? "light-theme" : "";
  };

  const navigate = (page: string) => {
    setActiveNav(page);
  };

  const closeModal = (modalId: string) => {
    setModalOpen(null);
  };

  const openModal = (modalId: string) => {
    setModalOpen(modalId);
  };

  const showToast = (message: string) => {
    const container = document.getElementById("toastContainer");
    if (container) {
      const toast = document.createElement("div");
      toast.className = "toast";
      toast.textContent = message;
      container.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }
  };

  const actionAndClose = (modalId: string, message: string) => {
    closeModal(modalId);
    showToast(message);
  };

  return (
    <div>
      <style>{`
      :root {
        --bg: #0f1115;
        --surface: #1a1d24;
        --surface-hover: #252a33;
        --surface-active: #2e3540;
        --border: #2e3540;
        --border-light: #3e4756;
        --text-primary: #e2e8f0;
        --text-secondary: #94a3b8;
        --g-blue: #8ab4f8;
        --g-blue-hover: #aecbfa;
        --g-blue-bg: rgba(138, 180, 248, 0.15);
        --g-blue-text: #8ab4f8;
        --g-red: #f28b82;
        --g-red-bg: rgba(242, 139, 130, 0.15);
        --g-red-text: #f28b82;
        --g-yellow: #fdd663;
        --g-yellow-bg: rgba(253, 214, 99, 0.15);
        --g-yellow-text: #fdd663;
        --g-green: #81c995;
        --g-green-bg: rgba(129, 201, 149, 0.15);
        --g-green-text: #81c995;
        --g-purple: #c58af9;
        --sidebar-w: 260px;
        --topbar-h: 70px;
        --radius-card: 16px;
        --radius-btn: 100px;
        --shadow-1: 0 4px 12px rgba(0, 0, 0, 0.4);
        --shadow-2: 0 8px 24px rgba(0, 0, 0, 0.6);
        --blur-filter: blur(8px);
        --overlay-bg: rgba(15, 17, 21, 0.7);
      }

      body.light-theme {
        --bg: #f8f9fa;
        --surface: #ffffff;
        --surface-hover: #f1f3f4;
        --surface-active: #e8eaed;
        --border: #dadce0;
        --border-light: #bdc1c6;
        --text-primary: #202124;
        --text-secondary: #5f6368;
        --g-blue: #1a73e8;
        --g-blue-hover: #1b66c9;
        --g-blue-bg: #e8f0fe;
        --g-blue-text: #1967d2;
        --g-red: #ea4335;
        --g-red-bg: #fce8e6;
        --g-red-text: #c5221f;
        --g-yellow: #fbbc04;
        --g-yellow-bg: #fef7e0;
        --g-yellow-text: #e37400;
        --g-green: #34a853;
        --g-green-bg: #e6f4ea;
        --g-green-text: #137333;
        --g-purple: #9333ea;
        --shadow-1: 0 1px 3px rgba(60,64,67,0.3);
        --shadow-2: 0 4px 8px rgba(60,64,67,0.15);
        --overlay-bg: rgba(255, 255, 255, 0.7);
      }

      * { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body {
        background-color: var(--bg);
        background-image: radial-gradient(var(--border) 1px, transparent 1px);
        background-size: 24px 24px;
        color: var(--text-primary);
        font-family: 'Roboto', sans-serif;
        min-height: 100vh;
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
        transition: background-color 0.3s, color 0.3s;
      }

      h1, h2, h3, h4, h5 { font-family: 'Google Sans', sans-serif; }

      .app { display: flex; min-height: 100vh; animation: fadeIn 0.5s; }
      .sidebar { width: var(--sidebar-w); background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 200; transition: background-color 0.3s, border-color 0.3s; }
      .logo-wrap { padding: 20px 24px; display: flex; align-items: center; gap: 12px; height: var(--topbar-h); border-bottom: 1px solid transparent; }
      .logo-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--g-blue); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-family: 'Google Sans'; }
      .logo-name { font-size: 18px; font-weight: 500; color: var(--text-primary); font-family: 'Google Sans'; }
      .nav-wrap { flex: 1; overflow-y: auto; padding: 12px 0; }
      .nav-wrap::-webkit-scrollbar { width: 4px; }
      .nav-wrap::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
      .nav-group-label { font-size: 11px; font-weight: 500; text-transform: uppercase; color: var(--text-secondary); padding: 8px 24px; margin-top: 8px; letter-spacing: 0.8px; }
      .nav-item { display: flex; align-items: center; gap: 16px; padding: 0 24px; height: 44px; cursor: pointer; font-size: 14px; font-weight: 500; color: var(--text-primary); border-radius: 0 var(--radius-btn) var(--radius-btn) 0; margin-right: 16px; transition: background 0.2s; }
      .nav-item:hover { background: var(--surface-hover); }
      .nav-item.active { background: var(--g-blue-bg); color: var(--g-blue-text); }
      .nav-icon { width: 20px; height: 20px; flex-shrink: 0; stroke: var(--text-secondary); stroke-width: 1.5; fill: none; }
      .nav-item.active .nav-icon { stroke: var(--g-blue-text); }
      .sidebar-bottom { padding: 16px; border-top: 1px solid var(--border); }
      .user-card { display: flex; align-items: center; gap: 12px; padding: 8px; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
      .user-card:hover { background: var(--surface-hover); }
      .avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--text-primary); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: var(--bg); }
      .user-info { flex: 1; overflow: hidden; }
      .user-name { font-size: 13px; font-weight: 500; color: var(--text-primary); white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
      .user-email { font-size: 11px; color: var(--text-secondary); }

      .main { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; min-width: 0; }
      .topbar { height: var(--topbar-h); background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 100; transition: background-color 0.3s, border-color 0.3s; }
      .page-title { font-size: 20px; font-weight: 500; color: var(--text-primary); font-family: 'Google Sans'; }
      .topbar-right { display: flex; align-items: center; gap: 16px; }

      .content { padding: 32px; flex: 1; max-width: 1400px; margin: 0 auto; width: 100%; }
      .page-header { margin-bottom: 24px; }
      .page-meta { color: var(--text-secondary); font-size: 14px; margin-top: 4px; }

      .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-card); transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s, border-color 0.3s; overflow: hidden; box-shadow: var(--shadow-1); position: relative; margin-bottom: 24px; }
      .card:hover { box-shadow: var(--shadow-2); border-color: var(--border-light); transform: translateY(-2px); }
      .card-header { padding: 20px 24px 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); }
      .card-title { font-size: 16px; font-weight: 500; color: var(--text-primary); font-family: 'Google Sans'; }
      .card-body { padding: 24px; position: relative; }

      .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }
      .kpi { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-card); padding: 20px; box-shadow: var(--shadow-1); transition: transform 0.2s, border-color 0.2s; position: relative; }
      .kpi:hover { transform: translateY(-2px); border-color: var(--border-light); }
      .kpi-label { font-size: 13px; font-weight: 500; color: var(--text-secondary); margin-bottom: 12px; font-family: 'Google Sans'; }
      .kpi-val { font-size: 32px; font-weight: 400; color: var(--text-primary); font-family: 'Google Sans'; margin-bottom: 6px; }
      .kpi-change { font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 4px; }
      .kpi-change.positive { color: var(--g-green-text); }
      .kpi-change.negative { color: var(--g-red-text); }

      .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
      .quick-action { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-card); padding: 24px; text-align: center; cursor: pointer; transition: all 0.3s; }
      .quick-action:hover { border-color: var(--g-blue); transform: translateY(-4px); box-shadow: var(--shadow-2); }
      .quick-action-icon { font-size: 32px; margin-bottom: 12px; }
      .quick-action-title { font-size: 16px; font-weight: 500; color: var(--text-primary); margin-bottom: 8px; font-family: 'Google Sans'; }
      .quick-action-desc { font-size: 13px; color: var(--text-secondary); }

      .coming-soon { background: var(--g-yellow-bg); border: 1px solid var(--g-yellow); border-radius: var(--radius-card); padding: 24px; }
      .coming-soon-title { font-size: 18px; font-weight: 500; color: var(--text-primary); margin-bottom: 8px; font-family: 'Google Sans'; }
      .coming-soon-desc { font-size: 13px; color: var(--text-secondary); margin-bottom: 16px; }
      .coming-soon-list { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .coming-soon-item { font-size: 13px; color: var(--text-primary); display: flex; align-items: center; gap: 8px; }
      .coming-soon-item::before { content: "●"; color: var(--g-yellow); }

      .badge { padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; display: inline-block; }
      .badge.success { background: var(--g-green-bg); color: var(--g-green-text); }
      .badge.danger { background: var(--g-red-bg); color: var(--g-red-text); }

      .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 24px; border-radius: var(--radius-btn); font-family: 'Google Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; border: none; outline: none; }
      .btn-primary { background: var(--g-blue); color: #000; font-weight: 600; }
      .btn-primary:hover { filter: brightness(1.1); box-shadow: var(--shadow-1); transform: translateY(-1px); }
      .btn-secondary { background: var(--surface-hover); color: var(--text-primary); border: 1px solid var(--border); }
      .btn-secondary:hover { background: var(--surface-active); border-color: var(--border-light); }
      .btn-ghost { background: transparent; color: var(--text-primary); border: 1px solid transparent; padding: 8px; }
      .btn-ghost:hover { background: var(--surface-hover); }

      .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 1000; display: none; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
      .modal-overlay.open { display: flex; animation: fadeIn 0.2s; }
      .modal { background: var(--surface); border-radius: 16px; border: 1px solid var(--border); width: 90%; max-width: 500px; box-shadow: var(--shadow-2); overflow: hidden; animation: slideUp 0.3s ease; }
      .modal-header { padding: 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
      .modal-title { font-size: 18px; font-weight: 500; font-family: 'Google Sans'; color: var(--text-primary); }
      .modal-close { cursor: pointer; color: var(--text-secondary); font-size: 20px; background: transparent; border: none; padding: 8px; border-radius: 50%; transition: background 0.2s; }
      .modal-body { padding: 24px; }
      .modal-footer { padding: 16px 24px; background: rgba(0,0,0,0.1); display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid var(--border); }

      .form-label { font-size: 13px; font-weight: 500; color: var(--text-secondary); margin-bottom: 8px; display: block; text-align: left; }
      .form-input, .form-select { width: 100%; background: var(--surface-hover); border: 1px solid var(--border); color: var(--text-primary); font-family: 'Roboto', sans-serif; font-size: 14px; padding: 12px 16px; border-radius: 8px; outline: none; transition: border 0.2s; margin-bottom: 16px; }
      .form-input:focus, .form-select:focus { border-color: var(--g-blue); }

      .toast-container { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
      .toast { background: var(--g-blue-text); color: #000; padding: 12px 24px; border-radius: 100px; font-size: 14px; font-weight: bold; display: flex; align-items: center; gap: 12px; animation: toastIn 0.3s ease; box-shadow: 0 8px 16px rgba(138, 180, 248, 0.2); }

      @keyframes toastIn { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

      .icon-btn { width: 40px; height: 40px; border-radius: 50%; background: transparent; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); transition: background 0.2s; }
      .icon-btn:hover { background: var(--surface-hover); color: var(--text-primary); }
    `}</style>

      <div className="app" id="main-app">
      <div className="toast-container" id="toastContainer"></div>

      {/* Modals */}
      <div className={`modal-overlay ${modalOpen === "profissional" ? "open" : ""}`} id="modalProfissional">
        <div className="modal">
          <div className="modal-header">
            <div className="modal-title">Adicionar Profissional</div>
            <button className="modal-close" onClick={() => closeModal("profissional")}>✕</button>
          </div>
          <div className="modal-body">
            <div style={{ marginBottom: "16px" }}>
              <label className="form-label">Nome Completo</label>
              <input type="text" className="form-input" placeholder="Ex: Dr. João Silva" />
            </div>
            <div>
              <label className="form-label">Função / Especialidade</label>
              <select className="form-select">
                <option>Médico(a)</option>
                <option>Recepção</option>
                <option>Comercial</option>
                <option>Gerência</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => closeModal("profissional")}>Cancelar</button>
            <button className="btn btn-primary" onClick={() => actionAndClose("profissional", "Profissional adicionado com sucesso!")}>Salvar</button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-wrap">
          <div className="logo-icon">G</div>
          <div className="logo-name">GLX Workspace</div>
        </div>
        <nav className="nav-wrap">
          <div className="nav-group">
            <div className="nav-group-label">Visão Geral</div>
            <div className={`nav-item ${activeNav === "dashboard" ? "active" : ""}`} onClick={() => navigate("dashboard")}>
              <BarChart3 className="nav-icon" size={20} /> Dashboard
            </div>
            <div className={`nav-item ${activeNav === "realtime" ? "active" : ""}`} onClick={() => navigate("realtime")}>
              <Zap className="nav-icon" size={20} /> Tempo Real
            </div>
          </div>
          <div className="nav-group">
            <div className="nav-group-label">Operação & Equipe</div>
            <div className={`nav-item ${activeNav === "agenda" ? "active" : ""}`} onClick={() => navigate("agenda")}>
              <Calendar className="nav-icon" size={20} /> Agenda & Capacidade
            </div>
            <div className={`nav-item ${activeNav === "equipe" ? "active" : ""}`} onClick={() => navigate("equipe")}>
              <Users className="nav-icon" size={20} /> Equipe
            </div>
          </div>
          <div className="nav-group">
            <div className="nav-group-label">Comercial</div>
            <div className={`nav-item ${activeNav === "funil" ? "active" : ""}`} onClick={() => navigate("funil")}>
              <TrendingUp className="nav-icon" size={20} /> Funil de Vendas
            </div>
          </div>
        </nav>
        <div className="sidebar-bottom">
          <div className="user-card">
            <div className="avatar">{user?.name?.charAt(0) || "U"}</div>
            <div className="user-info">
              <div className="user-name">{user?.name || "Usuário"}</div>
              <div className="user-email">{user?.email || ""}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main">
        <div className="topbar">
          <div className="page-title">Dashboard</div>
          <div className="topbar-right">
            <button className="icon-btn">
              <Bell size={20} />
            </button>
            <button className="icon-btn" onClick={toggleTheme}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button className="icon-btn">
              <Settings size={20} />
            </button>
            <button className="icon-btn" onClick={handleLogout} title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="content">
          {/* Welcome Section */}
          <div className="page-header">
            <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "8px" }}>Bem-vindo de volta, {user?.name?.split(" ")[0] || "Cliente"}!</h1>
            <p className="page-meta">Aqui está um resumo da performance da sua clínica.</p>
          </div>

          {/* KPIs */}
          <div className="kpi-grid">
            <div className="kpi">
              <div className="kpi-label">Faturamento Mensal</div>
              <div className="kpi-val">R$ 450.000</div>
              <div className="kpi-change positive">↑ +12%</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Margem de Lucro</div>
              <div className="kpi-val">28%</div>
              <div className="kpi-change positive">↑ +3%</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Novos Pacientes</div>
              <div className="kpi-val">156</div>
              <div className="kpi-change positive">↑ +8%</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Taxa de Retorno</div>
              <div className="kpi-val">72%</div>
              <div className="kpi-change negative">↓ -2%</div>
            </div>
          </div>

          {/* Quick Actions */}
          <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px", marginTop: "32px" }}>Acesso Rápido</h2>
          <div className="grid-4">
            <div className="quick-action">
              <div className="quick-action-icon">📊</div>
              <div className="quick-action-title">Dashboards</div>
              <div className="quick-action-desc">Visualize seus KPIs em tempo real</div>
            </div>
            <div className="quick-action">
              <div className="quick-action-icon">📄</div>
              <div className="quick-action-title">Relatórios</div>
              <div className="quick-action-desc">Acesse relatórios de performance</div>
            </div>
            <div className="quick-action">
              <div className="quick-action-icon">👥</div>
              <div className="quick-action-title">Equipe</div>
              <div className="quick-action-desc">Gerencie sua equipe</div>
            </div>
            <div className="quick-action">
              <div className="quick-action-icon">📅</div>
              <div className="quick-action-title">Agenda</div>
              <div className="quick-action-desc">Próximas reuniões e eventos</div>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="coming-soon" style={{ marginTop: "32px" }}>
            <div className="coming-soon-title">Em Breve: Novos Recursos</div>
            <div className="coming-soon-desc">Estamos trabalhando em novos recursos exclusivos para parceiros GLX, incluindo:</div>
            <div className="coming-soon-list">
              <div className="coming-soon-item">Dashboards interativos em tempo real</div>
              <div className="coming-soon-item">Relatórios automatizados por e-mail</div>
              <div className="coming-soon-item">Biblioteca de materiais exclusivos</div>
              <div className="coming-soon-item">Chat de suporte direto com consultores</div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
