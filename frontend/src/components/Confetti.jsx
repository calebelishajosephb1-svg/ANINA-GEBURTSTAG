import React, { useEffect, useRef } from "react";

/**
 * Premium confetti burst — canvas-driven simulation.
 * Particles spawn outward from center, accelerate, slow, rotate.
 * Colors: gold, purple, blue, silver, red, orange.
 */
const COLORS = ["#f5c451", "#a259ff", "#4f7cff", "#d6dde6", "#ef4444", "#f97316", "#ffffff"];

export const Confetti = ({ duration = 3200 }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    const cx = () => canvas.width / 2;
    const cy = () => canvas.height / 2;

    const N = 260;
    const parts = Array.from({ length: N }, () => spawn(cx(), cy(), dpr));

    const start = performance.now();
    let last = start;

    const tick = (t) => {
      const dt = Math.min(40, t - last) / 16.667;
      last = t;
      const elapsed = t - start;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of parts) {
        p.vy += 0.06 * dt; // gravity
        p.vx *= 0.992;
        p.vy *= 0.995;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        p.life -= dt;

        const alpha = Math.max(0, Math.min(1, p.life / p.maxLife));
        if (alpha <= 0) continue;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.size, -p.size * 0.4, p.size * 2, p.size * 0.8);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // ribbon
          ctx.fillRect(-p.size * 0.2, -p.size, p.size * 0.4, p.size * 2);
        }
        ctx.restore();

        if (p.life <= 0 || p.y > canvas.height + 80) {
          // respawn during the first ~60% of the duration only
          if (elapsed < duration * 0.55) Object.assign(p, spawn(cx(), cy(), dpr));
        }
      }

      if (elapsed < duration) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [duration]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="confetti-canvas"
      className="absolute inset-0 z-10 pointer-events-none"
      aria-hidden
    />
  );
};

function spawn(cx, cy, dpr) {
  const angle = Math.random() * Math.PI * 2;
  const speed = (4 + Math.random() * 10) * dpr;
  const shape = Math.random() < 0.55 ? "rect" : Math.random() < 0.5 ? "circle" : "ribbon";
  return {
    x: cx + (Math.random() - 0.5) * 40,
    y: cy + (Math.random() - 0.5) * 40,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 4 * dpr,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.25,
    size: (4 + Math.random() * 8) * dpr,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape,
    life: 90 + Math.random() * 80,
    maxLife: 170,
  };
}

export default Confetti;
