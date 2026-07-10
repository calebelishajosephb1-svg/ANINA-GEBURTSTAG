import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clouds } from "./Clouds";
import { Sound } from "../lib/sound";
import { HERO_NAME, AGE } from "../config";
import { numberToWords } from "../lib/numberToWords";

/**
 * ACT V — THE FINALE
 */
export const Finale = ({ onDone }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timings = [1400, 3600, 3600, 5200, 2200];
    if (phase === 1) Sound.play("whoosh");
    if (phase === 2) Sound.play("whoosh");
    if (phase === 3) Sound.play("chime");
    const t = setTimeout(() => {
      if (phase < 4) setPhase(phase + 1);
      else onDone();
    }, timings[phase]);
    return () => clearTimeout(t);
  }, [phase, onDone]);

  return (
    <motion.div
      data-testid="finale-screen"
      className="absolute inset-0 bg-black overflow-hidden flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.0 }}
    >
      <Clouds intensity={phase === 0 || phase === 4 ? 0.4 : 0.9} tint="#cabfa9" />
      <div className="absolute inset-0 grain pointer-events-none" />

      <AnimatePresence mode="wait">
        {phase === 1 && (
          <CloudWord key="p1" testid="finale-19" text={`${numberToWords(AGE)} Years.`} />
        )}
        {phase === 2 && (
          <CloudWord key="p2" testid="finale-memories" text="Countless Memories." />
        )}
        {phase === 3 && (
          <FinaleTypewriter key="p3" />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CloudWord = ({ text, testid }) => (
  <motion.div
    data-testid={testid}
    initial={{ opacity: 0, scale: 1.08, filter: "blur(40px)" }}
    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
    exit={{ opacity: 0, scale: 1.04, filter: "blur(40px)" }}
    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
    className="serif text-white text-center no-select px-6"
    style={{ textShadow: "0 0 60px rgba(255, 230, 180, 0.18)" }}
  >
    <div className="text-[14vw] sm:text-[11vw] lg:text-[9vw] font-light leading-[0.95] tracking-[-0.04em] shimmer-text">
      {text}
    </div>
  </motion.div>
);

const FinaleTypewriter = () => {
  const target = `Happy Birthday, ${HERO_NAME}.`;
  const [out, setOut] = useState("");
  useEffect(() => {
    let i = 0;
    setOut("");
    const t = setInterval(() => {
      i++;
      setOut(target.slice(0, i));
      if (i >= target.length) clearInterval(t);
    }, 95);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.div
      data-testid="finale-typewriter"
      initial={{ opacity: 0, filter: "blur(30px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(30px)" }}
      transition={{ duration: 1.4 }}
      className="serif text-white text-center no-select px-6"
    >
      <div className="text-[8vw] sm:text-[6vw] lg:text-[5vw] font-light leading-tight tracking-tight">
        {out}
        <span className="caret" />
      </div>
    </motion.div>
  );
};

export default Finale;
