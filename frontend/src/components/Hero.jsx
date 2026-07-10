import React from "react";
import { motion } from "framer-motion";
import { AmbientMotes } from "./Particles";
import { HERO_NAME, HERO_IMAGE, HERO_IMAGE_MOBILE } from "../config";

/**
 * ACT I — ARRIVAL
 * Full-bleed RACK.png with ken-burns drift, ambient motes, vignette,
 * and a layered title reveal at the lower-left.
 */
export const Hero = ({ completed, children }) => {
  const ease = [0.22, 1, 0.36, 1];

  return (
    <div className="absolute inset-0 overflow-hidden" data-testid="hero-screen">
      {/* RACK.png — sacred */}
      <motion.div
        className="absolute inset-0 ken-burns"
        initial={{ opacity: 0, scale: 1.04, filter: "blur(14px)" }}
        animate={{ opacity: 1, scale: 1.02, filter: "blur(0px)" }}
        transition={{ duration: 1.6, ease }}
      >
        <picture>
          <source media="(max-width: 767px)" srcSet={HERO_IMAGE_MOBILE} />
          <img
            src={HERO_IMAGE}
            alt={HERO_NAME}
            decoding="async"
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover no-select"
            draggable={false}
          />
        </picture>
      </motion.div>

      {/* Vignette to deepen the edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)",
        }}
      />
      {/* Bottom shade so the title sits cleanly */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0) 100%)",
        }}
      />
      {/* Soft lower-left shade to deepen the title area */}
      <div
        className="absolute left-0 bottom-0 w-[58%] h-[55%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 18% 80%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 78%)",
        }}
      />

      <AmbientMotes count={26} />

      {/* Title — lower-left, no subtitle */}
      <div
        data-testid="hero-title"
        className="absolute left-8 sm:left-12 lg:left-16 bottom-28 sm:bottom-14 lg:bottom-20 z-20 no-select max-w-[92vw]"
        style={{ fontFamily: "Fraunces, serif" }}
      >
        <TitleReveal />
      </div>

      {children}

      {/* Bottom-right cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: completed ? 0.35 : 0.55 }}
        transition={{ delay: 2.4, duration: 1.2 }}
        className="absolute bottom-6 right-8 z-20 mono text-[10px] tracking-[0.4em] uppercase text-white/60 no-select"
      >
        {completed ? "the vault · closed" : "open the vault →"}
      </motion.div>
    </div>
  );
};

const TitleReveal = () => {
  const ease = [0.22, 1, 0.36, 1];
  const lines = ["Happy", "Birthday", `${HERO_NAME}!!!`];
  return (
    <div className="leading-[0.92] tracking-[-0.035em] font-light text-white">
      {lines.map((word, i) => (
        <div key={word} className="overflow-hidden">
          <motion.div
            initial={{ y: "110%", opacity: 0, filter: "blur(12px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            transition={{
              delay: 0.6 + i * 0.28,
              duration: 1.2,
              ease,
            }}
            className="text-[11vw] sm:text-[9vw] lg:text-[7.5vw] xl:text-[7vw]"
            style={{
              textShadow:
                "0 4px 30px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.7)",
            }}
          >
            {word}
          </motion.div>
        </div>
      ))}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.7, duration: 1.4, ease }}
        className="mt-5 h-px w-44 origin-left bg-gradient-to-r from-amber-300/80 via-white/40 to-transparent"
      />
    </div>
  );
};

export default Hero;
