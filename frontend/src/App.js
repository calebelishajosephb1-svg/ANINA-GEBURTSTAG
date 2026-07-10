import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import "@/App.css";
import { wishes as ALL_WISHES } from "@/data/wishes";

import Hero from "@/components/Hero";
import UnreadCapsule from "@/components/UnreadCapsule";
import Vault from "@/components/Vault";
import Countdown from "@/components/Countdown";
import Inbox from "@/components/Inbox";
import Finale from "@/components/Finale";
import MuteToggle from "@/components/MuteToggle";
import { HERO_IMAGE } from "@/config";
import { Sound } from "@/lib/sound";

const ACTS = {
  ARRIVAL: "arrival",
  VAULT: "vault",
  COUNTDOWN: "countdown",
  INBOX: "inbox",
  FINALE: "finale",
};

function App() {
  const [act, setAct] = useState(ACTS.ARRIVAL);
  const [authed, setAuthed] = useState(false);
  const [readIds, setReadIds] = useState(() => new Set());
  const [completed, setCompleted] = useState(false);

  const wishes = ALL_WISHES;
  const unread = wishes.length - readIds.size;

  // Preload every wisher photo + the hero on mount — guarantees zero-flash
  // when a notification opens. Browser caches the bytes; React just renders.
  useEffect(() => {
    const urls = [HERO_IMAGE, ...wishes.map((w) => w.photo).filter(Boolean)];
    urls.forEach((src) => { const im = new Image(); im.decoding = "async"; im.src = src; });
  }, [wishes]);

  // Hero soundtrack lifecycle (assets/audio/hero.mp3):
  //   • Inbox opens → fade in, loop
  //   • Finale starts → fade out (position preserved)
  //   • Return home AFTER finale → fade back in, keeps looping until refresh
  //   • User closes inbox early (✕) → gentle fade out
  useEffect(() => {
    if (act === ACTS.INBOX) {
      Sound.stop("ambient");         // avoid double music
      Sound.fadeIn("hero", 1400);
    } else if (act === ACTS.FINALE) {
      Sound.fadeOut("hero", 900);    // temporary pause for the 19 Years moment
    } else if (act === ACTS.ARRIVAL && completed) {
      Sound.fadeIn("hero", 1600);    // resume from where it paused, until refresh
    } else if (act === ACTS.ARRIVAL) {
      Sound.fadeOut("hero", 700);    // fades if user closed inbox before completing
    }
  }, [act, completed]);

  // Capsule click — auth gate only first time, never again per session
  const handleOpenCapsule = () => {
    if (!authed) setAct(ACTS.VAULT);
    else setAct(ACTS.INBOX);
  };

  const handleUnlock = () => {
    setAuthed(true);
    setAct(ACTS.COUNTDOWN);
  };

  const handleCountdownDone = () => setAct(ACTS.INBOX);

  const handleMarkRead = (id) => {
    setReadIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  // Triggered by Inbox when the user closes the LAST wish viewer AND
  // all wishes are read. Plays the finale exactly once.
  const handleAllReadAndClosed = () => {
    if (completed) return;
    setAct(ACTS.FINALE);
  };

  const handleFinaleDone = () => {
    setCompleted(true);
    setAct(ACTS.ARRIVAL);
  };

  return (
    <div className="App">
      {act === ACTS.ARRIVAL && (
        <Hero completed={completed}>
          <UnreadCapsule
            unread={unread}
            total={wishes.length}
            completed={completed}
            onOpen={handleOpenCapsule}
          />
        </Hero>
      )}

      <AnimatePresence mode="wait">
        {act === ACTS.VAULT && (
          <Vault
            key="vault"
            onUnlock={handleUnlock}
            onClose={() => setAct(ACTS.ARRIVAL)}
          />
        )}
        {act === ACTS.COUNTDOWN && (
          <Countdown key="countdown" onDone={handleCountdownDone} />
        )}
        {act === ACTS.INBOX && (
          <Inbox
            key="inbox"
            wishes={wishes}
            readSet={readIds}
            onMarkRead={handleMarkRead}
            onAllReadAndClosed={handleAllReadAndClosed}
            onClose={() => setAct(ACTS.ARRIVAL)}
          />
        )}
        {act === ACTS.FINALE && (
          <Finale key="finale" onDone={handleFinaleDone} />
        )}
      </AnimatePresence>

      <MuteToggle />
    </div>
  );
}

export default App;
