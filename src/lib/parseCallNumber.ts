import { ParsedCallNumber } from "../types/ParsedCallNumber";

export function parseCallNumber(input: string): ParsedCallNumber | null {
  // Normalize pasted multi-line labels into a single line.
  const clean = input.replace(/\s+/g, " ").trim().toUpperCase();
  if (!clean) return null;

  // Pattern (conservative MVP):
  // - 1–3 starting letters (rule: may not start with 4+ letters)
  // - optional "x" marker after letters (represents 1/2)
  // - whole number: 1–4 digits
  // - optional decimal part: "." followed by digits (spaces around '.' allowed in pasted labels)
  // - optional first cutter: "." + letter + digits (digits may be separated by spaces if wrapped)
  const regex =
    /^([A-Z]{1,3})\s*(?:X\s*)?(\d{1,4})(?:\s*\.\s*(\d+))?\s*(\.\s*[A-Z]\s*(?:\d\s*)+)?/;

  const match = clean.match(regex);
  if (!match) return null;

  const classLetters = match[1];

  const whole = match[2];
  const dec = match[3];
  const classNumber = parseFloat(dec ? `${whole}.${dec}` : whole);

  let itemCutter: string | undefined;
  if (match[4]) {
    // Normalize cutter: remove all whitespace inside it (". J 3 8" -> ".J38")
    itemCutter = match[4].replace(/\s+/g, "");
  }

  return {
    raw: input,
    classLetters,
    classNumber,
    itemCutter,
  };
}
