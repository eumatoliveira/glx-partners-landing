import type { AlertSeverity } from "@shared/types";

const AUDIO_BY_SEVERITY: Record<AlertSeverity, string> = {
  P1: "/audio/som_P1.mp3",
  P2: "/audio/som_P2.mp3",
  P3: "/audio/som_P3.mp3",
};

const severityOrder: Record<AlertSeverity, number> = {
  P1: 3,
  P2: 2,
  P3: 1,
};

function playOscillator(severity: AlertSeverity) {
  if (typeof window === "undefined") return;
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return;

  try {
    const ctx = new AudioCtx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = severity === "P1" ? 420 : severity === "P2" ? 620 : 820;
    gain.gain.value = severity === "P1" ? 0.12 : severity === "P2" ? 0.08 : 0.05;

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.45);
  } catch (error) {
    console.info("[AudioAlertService] fallback oscillator unavailable", error);
  }
}

export async function playAlertAudio(severity: AlertSeverity): Promise<void> {
  if (typeof window === "undefined") return;
  const path = AUDIO_BY_SEVERITY[severity];
  try {
    const audio = new Audio(path);
    await audio.play();
  } catch (error) {
    console.info("[AudioAlertService] mp3 not available, using fallback:", path, error);
    playOscillator(severity);
  }
}

export function getHighestSeverity(severities: AlertSeverity[]): AlertSeverity {
  if (severities.length === 0) return "P3";
  return [...severities].sort((a, b) => severityOrder[b] - severityOrder[a])[0]!;
}

export const AudioAlertService = {
  playAlertAudio,
  getHighestSeverity,
  sources: AUDIO_BY_SEVERITY,
};
