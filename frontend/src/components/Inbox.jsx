import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { CloseButton } from "./Vault";
import { MessageViewer } from "./MessageViewer";
import { Sound } from "../lib/sound";

/**
 * ACT IV — THE INBOX
 * Notifications cascade in one-by-one with intentional pacing.
 * Clicking a notification transforms it into a full-screen viewer via shared layoutId.
 * Read messages glide to the bottom; unread ones rise to the top.
 */
export const Inbox = ({ wishes, readSet, onMarkRead, onAllReadAndClosed, onClose }) => {
  const [revealCount, setRevealCount] = useState(0);
  const [openId, setOpenId] = useState(null);
  const unread = wishes.filter((w) => !readSet.has(w.id)).length;
  const allRead = readSet.size === wishes.length;

  // staggered reveal — one notification at a time with breathing pauses
  useEffect(() => {
    if (revealCount >= wishes.length) return;
    const t = setTimeout(() => {
      setRevealCount((c) => c + 1);
      Sound.play("chime");
    }, revealCount === 0 ? 700 : 520);
    return () => clearTimeout(t);
  }, [revealCount, wishes.length]);

  // Fire "all read and closed" exactly when the user closes the viewer
  // AND every wish is read. The act-switch is handled by the parent.
  useEffect(() => {
    if (allRead && openId === null && revealCount > 0) {
      const t = setTimeout(() => onAllReadAndClosed?.(), 650);
      return () => clearTimeout(t);
    }
  }, [allRead, openId, revealCount, onAllReadAndClosed]);

  const open = (id) => { setOpenId(id); Sound.play("whoosh"); };
  // Mark-as-read happens HERE — exactly when the user closes the viewer.
  // The layoutId close animation then naturally carries the card to its new
  // bottom-of-list home, giving one continuous "slide down" motion.
  const close = () => {
    if (openId && !readSet.has(openId)) onMarkRead(openId);
    setOpenId(null);
  };

  // Smart ordering: unread (in original order) first, read (in original order) last.
  // Built off the currently-revealed slice so the cascade still flows naturally.
  // JS Array.sort is stable since ES2019 → original order is preserved within each group.
  const orderedWishes = useMemo(() => {
    const visible = wishes.slice(0, revealCount);
    return [...visible].sort((a, b) => {
      const aRead = readSet.has(a.id) ? 1 : 0;
      const bRead = readSet.has(b.id) ? 1 : 0;
      return aRead - bRead;
    });
  }, [wishes, revealCount, readSet]);

  const openWish = wishes.find((w) => w.id === openId);

  return (
    <motion.div
      data-testid="inbox-screen"
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* Deep stage backdrop */}
      <div className="absolute inset-0" style={{
        background:
          "radial-gradient(ellipse at 50% 30%, #1a1614 0%, #08070a 55%, #000 100%)",
      }} />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 20% 80%, rgba(245,196,81,0.10), transparent 55%)," +
            "radial-gradient(circle at 80% 20%, rgba(79,124,255,0.10), transparent 55%)",
        }}
      />
      <div className="absolute inset-0 grain pointer-events-none" />

      <CloseButton onClick={onClose} testid="inbox-close" />

      {/* Header */}
      <div className="absolute top-6 left-8 z-20">
        <div className="mono text-[10px] tracking-[0.5em] uppercase text-white/55">notification center</div>
        <div className="mt-1 flex items-baseline gap-3 text-white">
          <span className="serif text-3xl font-light tracking-tight">Messages</span>
          <span
            data-testid="inbox-unread-count"
            className="mono text-sm text-amber-200/85"
          >
            {unread} unread
          </span>
        </div>
      </div>

      {/* Scrollable column of notifications */}
      <div className="absolute inset-0 pt-32 pb-10 px-4 sm:px-0 z-10 scroll-pane overflow-y-auto">
        <LayoutGroup>
          <div className="mx-auto w-[min(96vw,640px)] flex flex-col gap-3">
            <AnimatePresence>
              {orderedWishes.map((w) => {
                const isRead = readSet.has(w.id);
                const originalIdx = wishes.findIndex((x) => x.id === w.id) + 1;
                return (
                  <motion.button
                    layout
                    layoutId={`card-${w.id}`}
                    key={w.id}
                    data-testid={`notification-${originalIdx}`}
                    data-read={isRead}
                    onClick={() => open(w.id)}
                    initial={{ opacity: 0, y: -24, scale: 0.96, filter: "blur(12px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    transition={{
                      layout: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                      default: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                    }}
                    whileHover={{ y: -1, scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                    className="glass text-left rounded-2xl px-4 py-4 flex items-start gap-4 relative no-select"
                    style={{
                      opacity: isRead ? 0.5 : 1,
                    }}
                  >
                    <span
                      className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background: isRead
                          ? "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))"
                          : "linear-gradient(135deg, #4f7cff 0%, #2d4fd6 100%)",
                        boxShadow: isRead
                          ? "none"
                          : "0 8px 22px -8px rgba(79,124,255,0.6), inset 0 1px 0 rgba(255,255,255,0.25)",
                      }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                           stroke={isRead ? "rgba(255,255,255,0.45)" : "#fff"}
                           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <span className={`font-semibold text-[15px] tracking-tight truncate ${isRead ? "text-white/65" : "text-white"}`}>
                          {w.senderName}
                        </span>
                        <span className="mono text-[10px] tracking-[0.3em] uppercase text-white/45 shrink-0">
                          {isRead ? "read" : "now"}
                        </span>
                      </div>
                      <div className={`mt-1 text-[12.5px] mono tracking-[0.35em] uppercase ${isRead ? "text-white/35" : "text-amber-200/85"}`}>
                        {isRead ? "Read" : "Unread"}
                      </div>
                    </div>
                    {!isRead && (
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(245,196,81,0.8)]" />
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
            {revealCount < wishes.length && (
              <div className="text-center mono text-[10px] tracking-[0.4em] uppercase text-white/35 mt-6 breathe">
                · more arriving ·
              </div>
            )}
          </div>
        </LayoutGroup>
      </div>

      {/* Message viewer (transforms from card) */}
      <AnimatePresence>
        {openWish && (
          <MessageViewer
            wish={openWish}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Inbox;
