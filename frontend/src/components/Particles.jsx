import React, { useMemo } from "react";

/** Ambient floating motes for the hero. Pure CSS-animated. */
export const AmbientMotes = ({ count = 28 }) => {
  const motes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: `mote-${i}-${Math.random().toString(36).slice(2, 8)}`,
        left: Math.random() * 100,
        top: 80 + Math.random() * 30,
        duration: 18 + Math.random() * 22,
        delay: -Math.random() * 25,
        dx: (Math.random() - 0.5) * 80,
        size: Math.random() * 2 + 1,
        opacity: 0.3 + Math.random() * 0.6,
      })),
    [count]
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {motes.map((m) => (
        <span
          key={m.id}
          className="particle"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: `${m.size}px`,
            height: `${m.size}px`,
            opacity: m.opacity,
            animationDuration: `${m.duration}s`,
            animationDelay: `${m.delay}s`,
            "--dx": `${m.dx}px`,
          }}
        />
      ))}
    </div>
  );
};

export default AmbientMotes;
