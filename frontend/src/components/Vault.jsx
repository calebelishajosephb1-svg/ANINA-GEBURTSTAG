import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clouds } from "./Clouds";
import { PASSWORD, HINT } from "../data/wishes";
import { Sound } from "../lib/sound";

/**
 * ACT II — THE VAULT
 * Black void, clouds, password panel emerges from vapor.
 */
export const Vault = ({ onUnlock, onClose }) => {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 1400);
    return () => clearTimeout(t);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (unlocking) return;
    if (pw.trim().toUpperCase() === PASSWORD) {
      setUnlocking(true);
      Sound.play("unlock");
      setTimeout(() => onUnlock(), 900);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1200);
    }
  };

  const ease = [0.22, 1, 0.36, 1];

  return (
    <motion.div
      data-testid="vault-screen"
      className="absolute inset-0 bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Clouds intensity={unlocking ? 1.2 : 0.85} tint="#b9b1a0" />
      <div className="absolute inset-0 grain pointer-events-none" />

      {/* close button */}
      <CloseButton onClick={onClose} testid="vault-close" />

      <AnimatePresence>
        {!unlocking && (
          <motion.form
            key="pwpanel"
            onSubmit={submit}
            className="absolute inset-0 flex items-center justify-center z-10"
            initial={{ opacity: 0, filter: "blur(30px)", scale: 1.05 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, filter: "blur(40px)", scale: 0.95 }}
            transition={{ duration: 1.4, ease, delay: 0.4 }}
          >
            <div className="glass-dark rounded-3xl px-10 py-10 sm:px-14 sm:py-14 w-[min(92vw,520px)] relative"
                 style={{ boxShadow: "0 60px 120px -40px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
              <div className="mono text-[10px] tracking-[0.5em] uppercase text-white/55 mb-6">
                · The Memory Vault ·
              </div>
              <h2 className="serif text-4xl sm:text-5xl font-light text-white leading-tight tracking-tight">
                Enter the<br/>passphrase.
              </h2>
              <p className="mt-3 text-white/55 text-sm">
                Hint — <span className="italic">{HINT}</span>
              </p>

              <div className="mt-8 relative">
                <input
                  ref={inputRef}
                  data-testid="vault-password-input"
                  type="password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="••••••••••"
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full bg-transparent border-0 border-b border-white/20 focus:border-amber-300/80 focus:outline-none px-1 py-3 text-white text-2xl tracking-[0.35em] uppercase mono transition-colors"
                  style={{ caretColor: "#f5c451" }}
                />
                <motion.div
                  animate={error ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 pointer-events-none"
                />
              </div>

              <div className="mt-8 flex items-center justify-between">
                <span
                  data-testid="vault-error"
                  className={`text-xs mono uppercase tracking-[0.3em] ${error ? "text-rose-300" : "text-transparent"} transition-colors`}
                >
                  · denied · try again ·
                </span>
                <button
                  type="submit"
                  data-testid="vault-unlock-button"
                  className="group relative inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-black transition-transform active:scale-[0.97]"
                  style={{
                    background: "linear-gradient(135deg, #f5c451, #e08a2d)",
                    boxShadow: "0 12px 30px -10px rgba(245,196,81,0.55), inset 0 1px 0 rgba(255,255,255,0.4)",
                  }}
                >
                  Unlock
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const CloseButton = ({ onClick, testid = "close-button", className = "" }) => (
  <button
    type="button"
    data-testid={testid}
    onClick={onClick}
    aria-label="Close"
    className={`glass fixed top-6 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors ${className}`}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  </button>
);

export default Vault;
