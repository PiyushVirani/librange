import { ParsedCallNumber } from "../types/ParsedCallNumber";

export function parseCallNumber(input: string): ParsedCallNumber | null {
  const clean = input.replace(/\s+/g, " ").trim().toUpperCase();
  if (!clean) return null;

  // Supports:
  // - cutter with or without a dot: "B 128 C8" or "B 128 .C8"
  // - optional decimal: "QA 76.73"
  // - optional year: "B 2220 1969"
  const regex =
    /^([A-Z]{1,3})\s*(?:X\s*)?(\d{1,4})(?:\s*\.\s*(\d+))?(?:\s*\.?\s*([A-Z])\s*(\d(?:\s*\d)*))?(?:\s+([12]\d{3}))?/;

  const m = clean.match(regex);
  if (!m) return null;

  const classLetters = m[1];
  const whole = m[2];
  const decDigits = m[3];

  const classNumber = parseFloat(decDigits ? `${whole}.${decDigits}` : whole);

  const cutterLetter = m[4];
  const cutterDigitsRaw = m[5];
  const yearRaw = m[6];

  let itemCutter: string | undefined;
  if (cutterLetter && cutterDigitsRaw) {
    const cutterDigits = cutterDigitsRaw.replace(/\s+/g, "");
    itemCutter = `.${cutterLetter}${cutterDigits}`;
  }

  const year = yearRaw ? Number(yearRaw) : undefined;

  return {
    raw: input,
    classLetters,
    classNumber,
    classDecimalDigits: decDigits,
    itemCutter,
    year,
  };
}
