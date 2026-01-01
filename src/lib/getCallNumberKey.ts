import { ParsedCallNumber } from "../types/ParsedCallNumber";

export function getCallNumberKey(parsed: ParsedCallNumber): string {
  // 1. Get the class letters (e.g., "QA")
  const letters = parsed.classLetters;

  // 2. Get the whole number part (e.g., 76.73 -> 76)
  const wholeNumber = Math.floor(parsed.classNumber);

  // 3. Pad with zeros to 4 digits (e.g., 76 -> "0076")
  // This ensures QA 100 sorts after QA 76
  const paddedNumber = wholeNumber.toString().padStart(4, '0');

  // 4. Construct Key: "QA-0076"
  // Note: We currently ignore decimals and cutters for Range Lookup 
  // because library ranges are usually defined by the Whole Number.
  return `${letters}-${paddedNumber}`;
}