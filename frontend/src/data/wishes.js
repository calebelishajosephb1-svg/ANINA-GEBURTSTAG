// Derived from /src/config.js — do not edit here.
import { WISHES, PASSWORD as P, HINT as H } from "../config";

export const wishes = WISHES.map((w, i) => ({
  id: `wish-${i + 1}`,
  senderName: w.senderName,
  body: w.body,
  photo: w.photo ?? null,
}));

export const PASSWORD = P;
export const HINT = H;
