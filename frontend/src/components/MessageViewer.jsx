import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

/**
 * Apple-style app-opening transform of a notification into a full viewer.
 * Left: large photo. Right: typewriter wish.
 */
export const MessageViewer = ({ wish, onClose }) => {
  // Escape key closes the viewer — keyboard parity with the ✕ button.
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      data-testid="message-viewer"
      layoutId={`card-${wish.id}`}
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 z-40 flex items-center justify-center px-4 sm:px-8 lg:px-16 py-10"
      transition={{ type: "spring", stiffness: 220, damping: 30 }}
    >
      {/* Backdrop softening */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 -z-10"
        style={{
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
        onClick={onClose}
      />
      <div className="relative w-[min(96vw,1180px)] h-[min(92vh,720px)] glass-dark rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-[auto_1fr] gap-0 md:gap-2 p-4 sm:p-6 md:p-8 pt-14 sm:pt-6 md:pt-8 overflow-y-auto scroll-pane"
           style={{ boxShadow: "0 60px 140px -40px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.07)" }}>
        {/* LEFT: 3:4 vertical photo frame (centered, contained) */}
        <div className="relative self-center mx-auto md:mx-0 md:my-auto"
             style={{ width: "clamp(180px, 60vw, 360px)", aspectRatio: "3 / 4" }}>
          <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-black"
               style={{ boxShadow: "0 30px 60px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}>
            {wish.photo ? (
              <motion.img
                src={wish.photo}
                alt={wish.senderName}
                className="absolute inset-0 w-full h-full object-cover no-select"
                draggable={false}
                initial={{ scale: 1.06, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.25, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
            ) : (
              <PhotoPlaceholder />
            )}
            <div className="absolute inset-x-0 bottom-0 p-4 z-10"
                 style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }}>
              <div className="mono text-[9px] tracking-[0.4em] uppercase text-amber-200/80">from</div>
              <div className="serif text-lg sm:text-xl text-white mt-0.5 tracking-tight truncate">
                {wish.senderName}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: typewriter */}
        <div className="relative px-2 sm:px-6 lg:px-10 py-4 md:py-8 flex flex-col min-w-0">
          <div className="mono text-[10px] tracking-[0.5em] uppercase text-white/45 mb-4">
            · a memory ·
          </div>
          <div className="flex-1 overflow-y-auto scroll-pane pr-2">
            <Typewriter text={wish.body} />
          </div>
          <div className="mt-6 flex items-center gap-3 mono text-[10px] tracking-[0.4em] uppercase text-white/45">
            <span className="block w-8 h-px bg-white/30" />
            press × to close
          </div>
        </div>

        {/* close button — fixed top-right of the viewer itself */}
        <button
          type="button"
          data-testid="viewer-close"
          onClick={onClose}
          aria-label="Close message"
          className="absolute top-5 right-5 sm:top-5 sm:right-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full glass flex items-center justify-center text-white/85 hover:text-white"
          style={{ marginTop: "max(0px, env(safe-area-inset-top))" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

const PhotoPlaceholder = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="absolute inset-0"
         style={{
           background:
             "radial-gradient(circle at 30% 30%, rgba(245,196,81,0.18), transparent 60%)," +
             "radial-gradient(circle at 70% 80%, rgba(79,124,255,0.18), transparent 65%)",
         }} />
    <div className="relative text-center">
      <div className="mono text-[10px] tracking-[0.5em] uppercase text-white/40">photo</div>
      <div className="mt-2 serif text-xl text-white/70">[PHOTO_PLACEHOLDER]</div>
    </div>
  </div>
);

/** Typewriter — speed is character-paced with subtle natural variance.
 *  Font size auto-adjusts to the wish length so the full message fits
 *  on screen without scrolling, regardless of how long it runs.
 */
const Typewriter = ({ text }) => {
  const [out, setOut] = useState("");
  const idxRef = useRef(0);

  useEffect(() => {
    setOut("");
    idxRef.current = 0;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      const i = idxRef.current;
      if (i >= text.length) return;
      setOut(text.slice(0, i + 1));
      idxRef.current = i + 1;
      const ch = text[i];
      // natural punctuation cadence
      let delay = 18 + Math.random() * 22;
      if (",;:".includes(ch)) delay = 140;
      else if (".!?".includes(ch)) delay = 240;
      else if (ch === "\n") delay = 200;
      setTimeout(tick, delay);
    };
    const start = setTimeout(tick, 520); // breathing room after open
    return () => {
      cancelled = true;
      clearTimeout(start);
    };
  }, [text]);

  // Length-based size bucket — keeps every wish fitting the viewer pane.
  const n = text.length;
  const sizeClass =
    n <= 220 ? "text-[22px] sm:text-[26px] lg:text-[30px] leading-[1.55]"      // short → spacious
    : n <= 450 ? "text-[19px] sm:text-[21px] lg:text-[23px] leading-[1.55]"    // medium → default
    : n <= 700 ? "text-[17px] sm:text-[18px] lg:text-[19px] leading-[1.5]"     // long → tighter
    :            "text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.5]";     // very long → compact

  return (
    <div className={`serif text-white/90 ${sizeClass} whitespace-pre-wrap tracking-[-0.005em]`}
         data-testid="typewriter-text">
      {out}
      <span className="caret align-middle" />
    </div>
  );
};

export default MessageViewer;
