import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clouds } from "./Clouds";
import { Confetti } from "./Confetti";
import { Sound } from "../lib/sound";

/**
 * ACT III — COUNTDOWN
 * 3 → 2 → 1 cinematic reveal, then celebration burst.
 */
export const Countdown = ({ onDone }) => {
  const [step, setStep] = useState(-1); // -1 init, 0=3, 1=2, 2=1, 3=burst
  const seq = [3, 2, 1];

  useEffect(() => {
    const t0 = setTimeout(() => setStep(0), 700);
    return () => clearTimeout(t0);
  }, []);

  useEffect(() => {
    if (step < 0 || step > 2) return;
    Sound.play("boom");
    const t = setTimeout(() => setStep(step + 1), 1700);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step === 3) {
      Sound.play("celebrate");
      const t = setTimeout(onDone, 3200);
      return () => clearTimeout(t);
    }
  }, [step, onDone]);

  const ease = [0.16, 1, 0.3, 1];

  return (
    <motion.div
      data-testid="countdown-screen"
      className="absolute inset-0 bg-black overflow-hidden flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Clouds intensity={step < 3 ? 1 : 0.4} tint="#c8bda7" />
      <div className="absolute inset-0 grain pointer-events-none" />

      <AnimatePresence mode="wait">
        {step >= 0 && step <= 2 && (
          <motion.div
            key={seq[step]}
            data-testid={`countdown-num-${seq[step]}`}
            initial={{ opacity: 0, scale: 1.35, filter: "blur(60px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.15, filter: "blur(40px)" }}
            transition={{ duration: 1.2, ease }}
            className="countdown-num no-select"
          >
            {seq[step]}
          </motion.div>
        )}
      </AnimatePresence>

      {step === 3 && <Confetti />}

      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(20px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.6, ease, delay: 0.4 }}
          className="absolute z-20 serif text-white text-center px-6"
          data-testid="countdown-celebrate"
        >
          <div className="mono text-[11px] tracking-[0.5em] uppercase text-amber-200/80 mb-4">·  celebration  ·</div>
          <div className="text-6xl sm:text-7xl lg:text-8xl font-light tracking-tight shimmer-text">
            Nineteen.
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Countdown;
