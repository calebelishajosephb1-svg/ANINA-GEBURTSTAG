# RACKSHEETTH: THE MEMORY VAULT — PRD

## Original Problem Statement
Build a world-class, Apple-caliber, cinematic interactive web experience for
Racksheetth's 19th birthday. Five acts: ARRIVAL → VAULT → COUNTDOWN → INBOX → FINALE.
A single hero image (RACK.png) anchors the journey; messages from well-wishers are
discovered one-by-one through a notification center; a finale reveals "19 Years",
"Countless Memories", then the typewriter signature "Happy Birthday, Racksheetth."
returns the user to the hero with the capsule reading "You Have Read All Messages."

## User Choices (captured)
- Photo placeholders: plain placeholder boxes (RACK.png used only as hero)
- Number of wishes: 16
- State persistence: reset every visit (no MongoDB, no localStorage)
- Audio: skipped entirely
- Wish content: clear placeholder text only

## Architecture
- Frontend-only experience. Backend untouched.
- React 19 + framer-motion (already installed)
- State machine in `App.js` controls 5 acts
- `data/wishes.js` exposes 16 placeholder entries (id / senderName / preview / body / photo)
- Cloud diffusion via blurred radial gradient layers with staggered drift keyframes
- Confetti via canvas with 260 particles (gold, purple, blue, silver, red, orange, white)
- Typography: Fraunces (Google) editorial serif + Geist + Geist Mono

## Implemented (2026-02)
- ✅ Act I — Hero with ken-burns parallax of RACK.png, ambient motes, animated title reveal (Fraunces, layered timing), eyebrow label "Nineteen · MMXXVI"
- ✅ Unread capsule (frosted glass, gold pulse dot, hover lift)
- ✅ Act II — Vault: black void, cloud diffusion, password panel emerging from blur, hint, shake on error, ✕ close
- ✅ Act III — Countdown 3/2/1 with serif gradient numerals + shimmer "Nineteen." reveal
- ✅ Premium canvas confetti burst (260 particles, multi-shape, gravity, rotation)
- ✅ Act IV — Inbox: notification center with cascaded reveal (520ms pacing), Apple-style shared-layout transform to message viewer, two-column viewer with photo placeholder + typewriter wish text, unread/read state engine, live unread counter, scoped close ✕
- ✅ Act V — Finale: "19 Years." → "Countless Memories." → typewriter "Happy Birthday, Racksheetth." through cloud diffusion, returns to hero
- ✅ Completed state: capsule dims to "✓ You Have Read All Messages"
- ✅ data-testid coverage on every interactive element

## File Map
- `frontend/src/App.js` — act state machine
- `frontend/src/components/Hero.jsx` — Act I
- `frontend/src/components/UnreadCapsule.jsx`
- `frontend/src/components/Vault.jsx` (+ exported CloseButton)
- `frontend/src/components/Countdown.jsx`
- `frontend/src/components/Confetti.jsx`
- `frontend/src/components/Inbox.jsx`
- `frontend/src/components/MessageViewer.jsx`
- `frontend/src/components/Finale.jsx`
- `frontend/src/components/Clouds.jsx`
- `frontend/src/components/Particles.jsx`
- `frontend/src/data/wishes.js` — placeholders + PASSWORD constant
- `frontend/public/assets/RACK.png` — hero image

## How to add real content
1. Drop a wisher photo into `frontend/public/assets/wishers/<name>.jpg`
2. Edit `frontend/src/data/wishes.js` and replace placeholders:
   ```js
   { id: 'wish-1', senderName: 'Aanya', preview: 'Happy birthday, Rack!',
     body: 'Hey Rack, 19 already...\n\nLove, Aanya',
     photo: '/assets/wishers/aanya.jpg' }
   ```
3. To change passphrase, edit `PASSWORD` constant in `data/wishes.js`.

## Backlog (P1)
- Audio: cloud whoosh / countdown booms / celebration impact (hooks ready, files missing)
- Per-visit persistence option (localStorage) toggled via env flag
- Optional sender byline animation in viewer

## P2
- Mobile portrait fine-tuning (already responsive, but title sizing can scale tighter)
- Replay button on completion state
- Picture-in-picture mini-finale when reopening after completed
