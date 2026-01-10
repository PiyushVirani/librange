import { ParsedCallNumber } from "../types/ParsedCallNumber";
import { SectionRecord } from "../types/SectionRecord";
import { SectionMatch } from "../types/SectionMatch";
import { getCallNumberKey } from "./getCallNumberKey";
import { parseCallNumber } from "./parseCallNumber";

/**
 * Finds which "general section" contains the call number.
 * Sections can intentionally overlap; we choose the most specific match:
 *  - highest startKey
 *  - if tied, lowest endKey
 */
export function findSection(parsed: ParsedCallNumber, sections: SectionRecord[]): SectionMatch | null {
  const searchKey = getCallNumberKey(parsed);

  let best: SectionMatch | null = null;
  let bestStartKey = "";
  let bestEndKey = "";

  for (const section of sections) {
    if (!section?.start || !section?.end) continue;

    const startParsed = parseCallNumber(section.start);
    const endParsed = parseCallNumber(section.end);
    if (!startParsed || !endParsed) continue;

    const a = getCallNumberKey(startParsed);
    const b = getCallNumberKey(endParsed);

    const startKey = a <= b ? a : b;
    const endKey = a <= b ? b : a;

    if (searchKey >= startKey && searchKey <= endKey) {
      const isBetter =
        !best ||
        startKey > bestStartKey ||
        (startKey === bestStartKey && endKey < bestEndKey);

      if (isBetter) {
        best = section;
        bestStartKey = startKey;
        bestEndKey = endKey;
      }
    }
  }

  return best;
}
