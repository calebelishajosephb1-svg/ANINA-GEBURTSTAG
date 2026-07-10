import React from "react";

/**
 * Cloud diffusion field. Layered blurred radial gradients drifting through
 * each other at different timings — creates atmospheric vapor without canvas.
 * `intensity` 0..1 scales overall presence.
 * `tint` is hex color for the brightest core of the clouds.
 */
export const Clouds = ({ intensity = 1, tint = "#dcd2c2", className = "" }) => {
  const layers = [
    {
      id: "cloud-a",
      bg: `radial-gradient(closest-side at 30% 40%, ${tint}55, transparent 70%),
           radial-gradient(closest-side at 70% 60%, ${tint}33, transparent 65%)`,
    },
    {
      id: "cloud-b",
      bg: `radial-gradient(closest-side at 55% 30%, ${tint}40, transparent 75%),
           radial-gradient(closest-side at 20% 70%, ${tint}25, transparent 70%)`,
    },
    {
      id: "cloud-c",
      bg: `radial-gradient(closest-side at 80% 80%, ${tint}3a, transparent 70%),
           radial-gradient(closest-side at 10% 20%, ${tint}28, transparent 70%)`,
    },
  ];
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ opacity: intensity }}
      aria-hidden
    >
      {layers.map((l) => (
        <div key={l.id} className={`cloud-layer ${l.id}`} style={{ backgroundImage: l.bg }} />
      ))}
    </div>
  );
};

export default Clouds;
