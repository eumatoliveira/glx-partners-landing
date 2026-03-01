import { useState, useEffect, useCallback } from "react";
import { type Alert, type AlertPriority, playAlertSound, getP1Count } from "@/lib/alertEngine";

const SLIDER_CSS = `
.alert-slider{position:relative;background:#111113;border:1px solid #2a2a2e;border-radius:16px;overflow:hidden;transition:all .3s}
.alert-slider.war-room{border-color:#EF4444;box-shadow:0 0 30px rgba(239,68,68,.15)}
.alert-slider-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #2a2a2e}
.alert-slider-title{display:flex;align-items:center;gap:10px;font-size:15px;font-weight:600;color:#fff;font-family:'Google Sans',sans-serif}
.alert-slider-count{display:flex;gap:6px}
.alert-badge{padding:3px 10px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:.3px}
.alert-badge.p1{background:rgba(239,68,68,.15);color:#EF4444}
.alert-badge.p2{background:rgba(255,122,0,.15);color:#FF7A00}
.alert-badge.p3{background:rgba(250,204,21,.15);color:#EAB308}
.alert-slide{padding:20px;min-height:120px;animation:slideIn .3s ease}
.alert-slide-priority{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:6px;font-size:12px;font-weight:700;letter-spacing:.5px;margin-bottom:12px}
.alert-slide-priority.p1{background:rgba(239,68,68,.12);color:#EF4444;animation:pulseGlow 2s ease-in-out infinite}
.alert-slide-priority.p2{background:rgba(255,122,0,.12);color:#FF7A00}
.alert-slide-priority.p3{background:rgba(250,204,21,.10);color:#EAB308}
.alert-slide-title{font-size:16px;font-weight:600;color:#fff;margin-bottom:6px;font-family:'Google Sans',sans-serif}
.alert-slide-msg{font-size:13px;color:#A1A1AA;line-height:1.6;margin-bottom:12px}
.alert-slide-impact{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#1A1A1D;border-radius:8px;font-size:12px;color:#FF7A00;font-weight:600}
.alert-slide-time{font-size:11px;color:#71717A;margin-top:8px}
.alert-slide-actions{display:flex;gap:8px;margin-top:14px}
.alert-slide-actions button{padding:7px 16px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s;border:none;font-family:'Google Sans',sans-serif}
.alert-btn-resolve{background:#22C55E;color:#000}.alert-btn-resolve:hover{filter:brightness(1.1)}
.alert-btn-assign{background:#1A1A1D;color:#A1A1AA;border:1px solid #2a2a2e!important}.alert-btn-assign:hover{color:#fff;border-color:#3a3a40!important}
.alert-btn-dismiss{background:transparent;color:#71717A}.alert-btn-dismiss:hover{color:#A1A1AA}
.alert-dots{display:flex;justify-content:center;gap:8px;padding:12px 20px;border-top:1px solid #2a2a2e}
.alert-dot{width:8px;height:8px;border-radius:50%;background:#2a2a2e;cursor:pointer;transition:all .2s;border:none;padding:0}
.alert-dot.active{background:#FF7A00;box-shadow:0 0 8px rgba(255,122,0,.4);transform:scale(1.2)}
.alert-dot.p1{border:1px solid #EF4444}.alert-dot.p1.active{background:#EF4444;box-shadow:0 0 8px rgba(239,68,68,.4)}
.alert-threshold-bar{height:4px;border-radius:2px;background:#1A1A1D;margin-top:10px;overflow:hidden}
.alert-threshold-fill{height:100%;border-radius:2px;transition:width .5s ease}
@keyframes pulseGlow{0%,100%{box-shadow:0 0 4px rgba(239,68,68,.2)}50%{box-shadow:0 0 16px rgba(239,68,68,.4)}}
@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
.war-room-banner{background:linear-gradient(90deg,#EF4444,#DC2626);color:#fff;padding:8px 20px;font-size:12px;font-weight:700;text-align:center;letter-spacing:.5px;animation:pulseGlow 2s ease-in-out infinite}
`;

const PRIORITY_LABELS: Record<AlertPriority, string> = {
  P1: "P1 CRÍTICO",
  P2: "P2 ATENÇÃO",
  P3: "P3 MONITORAR",
};

interface AlertSliderProps {
  alerts: Alert[];
  onResolve?: (alertId: string) => void;
  onAssign?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
}

export default function AlertSlider({ alerts, onResolve, onAssign, onDismiss }: AlertSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);

  const activeAlerts = alerts.filter((a) => !a.acknowledged);
  const p1Count = getP1Count(alerts);
  const p2Count = activeAlerts.filter((a) => a.priority === "P2").length;
  const p3Count = activeAlerts.filter((a) => a.priority === "P3").length;
  const isWarRoom = p1Count >= 2;

  useEffect(() => {
    if (activeAlerts.length > 0 && !hasPlayedSound) {
      const highestPriority = activeAlerts[0]?.priority ?? "P3";
      playAlertSound(highestPriority);
      setHasPlayedSound(true);
    }
  }, [activeAlerts.length, hasPlayedSound]);

  useEffect(() => {
    if (currentIndex >= activeAlerts.length) {
      setCurrentIndex(Math.max(0, activeAlerts.length - 1));
    }
  }, [activeAlerts.length, currentIndex]);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  if (activeAlerts.length === 0) return null;

  const current = activeAlerts[currentIndex];
  if (!current) return null;

  const thresholdColor =
    current.priority === "P1" ? "#EF4444" : current.priority === "P2" ? "#FF7A00" : "#FACC15";
  const deviationWidth = Math.min(100, Math.abs(current.deviationPercent));

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "agora";
    if (mins < 60) return `há ${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `há ${hours}h`;
    return `há ${Math.floor(hours / 24)}d`;
  };

  return (
    <>
      <style>{SLIDER_CSS}</style>
      <div className={`alert-slider ${isWarRoom ? "war-room" : ""}`}>
        {isWarRoom && (
          <div className="war-room-banner">
            SITUACAO CRÍTICA - {p1Count} alertas P1 ativos
          </div>
        )}

        <div className="alert-slider-header">
          <div className="alert-slider-title">Alertas Ativos ({activeAlerts.length})</div>
          <div className="alert-slider-count">
            {p1Count > 0 && <span className="alert-badge p1">{p1Count} P1</span>}
            {p2Count > 0 && <span className="alert-badge p2">{p2Count} P2</span>}
            {p3Count > 0 && <span className="alert-badge p3">{p3Count} P3</span>}
          </div>
        </div>

        <div className="alert-slide" key={current.id}>
          <div className={`alert-slide-priority ${current.priority.toLowerCase()}`}>
            {PRIORITY_LABELS[current.priority]}
          </div>
          <div className="alert-slide-title">{current.title}</div>
          <div className="alert-slide-msg">{current.message}</div>

          {current.financialImpact != null && current.financialImpact > 0 && (
            <div className="alert-slide-impact">
              Impacto estimado: -R${" "}
              {current.financialImpact.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
            </div>
          )}

          <div className="alert-threshold-bar">
            <div
              className="alert-threshold-fill"
              style={{ width: `${deviationWidth}%`, background: thresholdColor }}
            />
          </div>

          <div className="alert-slide-time">{formatTime(current.timestamp)}</div>

          <div className="alert-slide-actions">
            <button className="alert-btn-resolve" onClick={() => onResolve?.(current.id)}>
              Resolver
            </button>
            <button className="alert-btn-assign" onClick={() => onAssign?.(current.id)}>
              Atribuir
            </button>
            <button className="alert-btn-dismiss" onClick={() => onDismiss?.(current.id)}>
              Ignorar
            </button>
          </div>
        </div>

        {activeAlerts.length > 1 && (
          <div className="alert-dots">
            {activeAlerts.map((alert, i) => (
              <button
                key={alert.id}
                className={`alert-dot ${i === currentIndex ? "active" : ""} ${alert.priority === "P1" ? "p1" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Alerta ${i + 1}: ${alert.title}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
