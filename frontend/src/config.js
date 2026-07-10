// =============================================================
//  🎂  THE MEMORY VAULT — ONE-FILE CONFIG
//  Edit only this file to re-skin the entire experience for
//  anyone's birthday. Save → the page hot-reloads.
// =============================================================

// 1) THE HERO — whose birthday is it?
export const HERO_NAME = "Racksheetth";          // appears in title + finale
export const AGE       = 19;                     // appears in finale: "19 Years."

// 2) HERO IMAGE — drop your file at /public/assets/hero-background.png
//    (any aspect, any size — auto-covers the full screen)
export const HERO_IMAGE = "/assets/hero-horizontal.png";    // desktop
export const HERO_IMAGE_MOBILE = "/assets/hero-vertical.png"; // phone / tablet portrait

// 3) VAULT PASSPHRASE (case-insensitive — letters must match)
export const PASSWORD = "GEBURTSTAG";
export const HINT     = "Birthday in German";

// 4) WISHES — one entry per well-wisher. Default 5. Add as many as you like.
//    Photos go in /public/assets/wishers/  (any extension works)
//    Set `photo: null` to use the elegant placeholder card.
export const WISHES = [
  {
    senderName: "Wisher One",
    body: `Replace this with the first wish.\n\nLeave blank lines between paragraphs — they show in the typewriter.`,
    photo: null, // e.g. "/assets/wishers/wisher1.jpg"
  },
  {
    senderName: "Wisher Two",
    body: `Second wish goes here.`,
    photo: null,
  },
  {
    senderName: "Wisher Three",
    body: `Third wish goes here.`,
    photo: null,
  },
  {
    senderName: "Wisher Four",
    body: `Fourth wish goes here.`,
    photo: null,
  },
  {
    senderName: "Wisher Five",
    body: `Fifth wish goes here.`,
    photo: null,
  },
];
