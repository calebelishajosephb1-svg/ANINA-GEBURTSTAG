/**
 * Minimal sound engine — single shared <Audio> elements, lazy-instantiated.
 * Files live in /assets/audio/.
 */
const FILES = {
  unlock:    "/assets/audio/unlock.mp3",
  boom:      "/assets/audio/boom.mp3",
  whoosh:    "/assets/audio/whoosh.mp3",
  celebrate: "/assets/audio/celebrate.mp3",
  chime:     "/assets/audio/chime.mp3",
  ambient:   "/assets/audio/ambient.mp3",
  hero:      "/assets/audio/hero.mp3",       // ← soundtrack for the inbox + return home
};

const VOLUMES = {
  unlock: 0.35,
  boom: 0.45,
  whoosh: 0.25,
  celebrate: 0.55,
  chime: 0.35,
  ambient: 0.18,
  hero: 0.55,
};

const cache = {};
let muted = false;
const fadeTokens = {}; // per-track token to cancel in-flight fades

function getAudio(name) {
  if (typeof Audio === "undefined") return null;
  if (!cache[name]) {
    const el = new Audio(FILES[name]);
    el.preload = "auto";
    el.volume = VOLUMES[name] ?? 0.4;
    cache[name] = el;
  }
  return cache[name];
}

export const Sound = {
  play(name) {
    if (muted) return;
    const el = getAudio(name);
    if (!el) return;
    try {
      el.currentTime = 0;
      const p = el.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch { /* ignored — browser autoplay rules */ }
  },

  loop(name) {
    if (muted) return;
    const el = getAudio(name);
    if (!el) return;
    fadeTokens[name] = (fadeTokens[name] || 0) + 1; // cancel any in-flight fade
    el.loop = true;
    el.volume = VOLUMES[name] ?? 0.4;
    try {
      const p = el.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch { /* ignored */ }
  },

  stop(name) {
    const el = cache[name];
    if (!el) return;
    fadeTokens[name] = (fadeTokens[name] || 0) + 1;
    try { el.pause(); el.currentTime = 0; } catch { /* ignored */ }
  },

  /** Pause without resetting position — resumable via loop()/fadeIn(). */
  pause(name) {
    const el = cache[name];
    if (!el) return;
    fadeTokens[name] = (fadeTokens[name] || 0) + 1;
    try { el.pause(); } catch { /* ignored */ }
  },

  /** Smooth fade in — call while muted-check gates entry. Preserves position. */
  fadeIn(name, ms = 900) {
    if (muted) return;
    const el = getAudio(name);
    if (!el) return;
    const token = (fadeTokens[name] = (fadeTokens[name] || 0) + 1);
    const target = VOLUMES[name] ?? 0.4;
    el.loop = true;
    el.volume = 0;
    try {
      const p = el.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch { /* ignored */ }
    const t0 = performance.now();
    const step = () => {
      if (fadeTokens[name] !== token) return; // cancelled by another action
      const k = Math.min(1, (performance.now() - t0) / ms);
      el.volume = target * k;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },

  /** Smooth fade out then pause. Position is preserved (resumable). */
  fadeOut(name, ms = 800) {
    const el = cache[name];
    if (!el) return;
    const token = (fadeTokens[name] = (fadeTokens[name] || 0) + 1);
    const start = el.volume;
    const target = VOLUMES[name] ?? 0.4;
    const t0 = performance.now();
    const step = () => {
      if (fadeTokens[name] !== token) return; // cancelled
      const k = Math.min(1, (performance.now() - t0) / ms);
      el.volume = start * (1 - k);
      if (k < 1) requestAnimationFrame(step);
      else { try { el.pause(); el.volume = target; } catch { /* ignored */ } }
    };
    requestAnimationFrame(step);
  },

  setMuted(v) {
    muted = !!v;
    if (muted) Object.values(cache).forEach(a => { try { a.pause(); } catch { /* ignored */ } });
  },
  isMuted() { return muted; },
};
