import { ParsedCallNumber } from "../types/ParsedCallNumber";
import { RangeRecord } from "../types/RangeRecord";
import { RangeMatch } from "../types/RangeMatch";
import { getCallNumberKey } from "./getCallNumberKey";
import { parseCallNumber } from "./parseCallNumber";

/**
 * Finds which physical range contains the call number.
 * Each physical range has two independent spans (left + right).
 *
 * Returns the range record plus the matched "side".
 */
export function findRange(parsed: ParsedCallNumber, ranges: RangeRecord[]): RangeMatch | null {
  const searchKey = getCallNumberKey(parsed);

  let best: RangeMatch | null = null;
  let bestStartKey = "";
  let bestEndKey = "";

  const considerSide = (
    range: RangeRecord,
    side: "left" | "right",
    startRaw: string,
    endRaw: string
  ) => {
    if (!startRaw || !endRaw) return;

    const startParsed = parseCallNumber(startRaw);
    const endParsed = parseCallNumber(endRaw);
    if (!startParsed || !endParsed) return;

    const a = getCallNumberKey(startParsed);
    const b = getCallNumberKey(endParsed);

    // Safety: allow start/end to be swapped in data
    const startKey = a <= b ? a : b;
    const endKey = a <= b ? b : a;

    if (searchKey >= startKey && searchKey <= endKey) {
      const isBetter =
        !best ||
        startKey > bestStartKey ||
        (startKey === bestStartKey && endKey < bestEndKey);

      if (isBetter) {
        best = { ...range, side };
        bestStartKey = startKey;
        bestEndKey = endKey;
      }
    }
  };

  for (const range of ranges) {
    if (!range) continue;

    considerSide(range, "left", range.startLeft, range.endLeft);
    considerSide(range, "right", range.startRight, range.endRight);
  }

  return best;
}
