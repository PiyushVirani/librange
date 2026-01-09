import { ParsedCallNumber } from "../types/ParsedCallNumber";
import { RangeRecord } from "../types/RangeRecord";
import { RangeMatch } from "../types/RangeMatch";
import { getCallNumberKey } from "./getCallNumberKey";
import { parseCallNumber } from "./parseCallNumber";

/**
 * Finds which range contains the call number.
 * Uses computed keys from the human-readable start/end fields,
 * so ranges.json does NOT need to store startKey/endKey.
 */
export function findRange(parsed: ParsedCallNumber, ranges: RangeRecord[]): RangeMatch | null {
  const searchKey = getCallNumberKey(parsed);

  let best: RangeMatch | null = null;
  let bestStartKey = "";

  for (const range of ranges) {
    // Skip incomplete rows (useful while ranges.json is still being populated)
    if (!range?.start || !range?.end) continue;

    const startParsed = parseCallNumber(range.start);
    const endParsed = parseCallNumber(range.end);
    if (!startParsed || !endParsed) continue;

    const a = getCallNumberKey(startParsed);
    const b = getCallNumberKey(endParsed);

    // Safety: allow start/end to be accidentally swapped in data
    const startKey = a <= b ? a : b;
    const endKey = a <= b ? b : a;

    if (searchKey >= startKey && searchKey <= endKey) {
      // Prefer the most specific match (largest startKey)
      if (!best || startKey > bestStartKey) {
        best = range;
        bestStartKey = startKey;
      }
    }
  }

  return best;
}
