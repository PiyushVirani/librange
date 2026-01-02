import { ParsedCallNumber } from "../types/ParsedCallNumber";

export function getCallNumberKey(parsed: ParsedCallNumber): string {
  const letters = parsed.classLetters;

  const wholeNumber = Math.floor(parsed.classNumber);
  const paddedWhole = wholeNumber.toString().padStart(4, "0");

  let key = `${letters}-${paddedWhole}`;

  // Optional decimal: compare digit-by-digit by right-padding to fixed width
  if (parsed.classDecimalDigits) {
    const dec = parsed.classDecimalDigits.padEnd(6, "0").slice(0, 6);
    key += `.${dec}`;
  }

  // Optional cutter: ".H37" -> ".H0037"
  if (parsed.itemCutter) {
    const cm = parsed.itemCutter.match(/^\.(?<l>[A-Z])(?<d>\d+)$/);
    if (cm?.groups) {
      const d = cm.groups.d.padStart(4, "0");
      key += `.${cm.groups.l}${d}`;
    }
  }

  // Optional year
  if (typeof parsed.year === "number") {
    key += `-${String(parsed.year).padStart(4, "0")}`;
  }

  return key;
}
