import { useEffect, useMemo, useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";
import { shouldEnableParticles } from "@/animation/utils/perfGuards";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
};

export default function DashboardParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(true);
  const caps = useMotionCapabilities();
  const enabled = shouldEnableParticles(caps);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 1200], [0, -24]);

  const particleCount = useMemo(() => {
    if (!enabled) return 0;
    if (caps.tier === "tv") return 34;
    if (caps.tier === "desktop") return 24;
    return 16;
  }, [caps.tier, enabled]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!enabled) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let lastTs = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.045,
        vy: (Math.random() - 0.5) * 0.04 - 0.01,
        r: Math.random() * 1.4 + 0.4,
        a: Math.random() * 0.22 + 0.04,
      }));
    };

    const tick = (ts: number) => {
      if (!runningRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const delta = Math.min(48, lastTs ? ts - lastTs : 16.7);
      lastTs = ts;
      const dt = delta / 16.7;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (p.x < -8) p.x = width + 8;
        if (p.x > width + 8) p.x = -8;
        if (p.y < -8) p.y = height + 8;
        if (p.y > height + 8) p.y = -8;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.a})`;
        ctx.fill();

        const next = particles[(i + 1) % particles.length];
        const dx = next.x - p.x;
        const dy = next.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = `rgba(103, 232, 249, ${0.04 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      runningRef.current = document.visibilityState === "visible";
    };

    const onResize = () => resize();
    resize();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, particleCount]);

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] opacity-40"
      style={{ y: enabled ? parallaxY : 0 }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f0d0a]/80" />
    </m.div>
  );
}

