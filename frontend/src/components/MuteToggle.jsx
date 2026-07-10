import React, { useEffect, useState } from "react";
import { Sound } from "../lib/sound";

/**
 * Tiny mute toggle — bottom-left. Audio defaults to muted until the user
 * explicitly enables it (browser autoplay rules + minimalist spec).
 */
export const MuteToggle = () => {
  const [muted, setMuted] = useState(true);

  useEffect(() => { Sound.setMuted(true); }, []);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    Sound.setMuted(next);
    if (!next) Sound.loop("ambient");
    else Sound.stop("ambient");
  };

  return (
    <button
      type="button"
      data-testid="mute-toggle"
      onClick={toggle}
      aria-label={muted ? "Enable sound" : "Mute"}
      className="glass fixed bottom-6 left-6 z-50 w-10 h-10 rounded-full flex items-center justify-center text-white/75 hover:text-white transition-colors"
    >
      {muted ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4z"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
      )}
    </button>
  );
};

export default MuteToggle;
