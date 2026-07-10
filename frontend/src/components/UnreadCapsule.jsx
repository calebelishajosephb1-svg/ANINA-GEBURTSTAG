import React from "react";
import { motion } from "framer-motion";

/**
 * Frosted glass capsule in the top-right.
 * - When unread > 0: shows "💬 N Unread Messages"
 * - When unread = 0 and journey complete: shows "✓ You Have Read All Messages" (dimmer)
 */
export const UnreadCapsule = ({ unread, total, completed, onOpen }) => {
  const allRead = completed && unread === 0;
  const label = allRead
    ? "You Have Read All Messages"
    : `${unread} Unread Message${unread === 1 ? "" : "s"}`;

  return (
    <motion.button
      type="button"
      data-testid="unread-capsule"
      onClick={onOpen}
      initial={{ opacity: 0, y: -14, filter: "blur(8px)" }}
      animate={{ opacity: allRead ? 0.7 : 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 1.6, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -1, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className="glass group absolute top-6 right-6 z-30 rounded-full px-5 py-3 pr-6 flex items-center gap-3 no-select"
      style={{ fontFamily: "Geist, system-ui, sans-serif" }}
    >
      <span
        className="inline-flex items-center justify-center w-7 h-7 rounded-full"
        style={{
          background: allRead
            ? "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))"
            : "linear-gradient(135deg, #f5c451, #e08a2d)",
          color: allRead ? "rgba(255,255,255,0.6)" : "#1a1410",
          fontSize: 13,
          fontWeight: 700,
          boxShadow: allRead
            ? "none"
            : "0 0 0 1px rgba(255,255,255,0.15), 0 6px 18px -4px rgba(245,196,81,0.55)",
        }}
      >
        {allRead ? "✓" : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </span>
      <span
        data-testid="unread-capsule-label"
        className="text-[15px] font-medium tracking-tight"
        style={{ color: allRead ? "rgba(244,241,236,0.65)" : "rgba(244,241,236,0.95)" }}
      >
        {label}
      </span>
      {!allRead && (
        <span className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-amber-300 breathe" />
      )}
    </motion.button>
  );
};

export default UnreadCapsule;
