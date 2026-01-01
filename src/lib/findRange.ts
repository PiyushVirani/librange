import { ParsedCallNumber } from "../types/ParsedCallNumber";
import { RangeRecord } from "../types/RangeRecord";
import { RangeMatch } from "../types/RangeMatch";
import { getCallNumberKey } from "./getCallNumberKey";

/**
 * Scans the list of ranges to find which one contains the call number.
 * * @param parsed The object returned from parseCallNumber
 * @param ranges The array of range data (from ranges.json)
 * @returns The matching Range record, or null if no match found.
 */
export function findRange(
    parsed: ParsedCallNumber, 
    ranges: RangeRecord[]
): RangeMatch | null {
    
    // 1. Generate the standardized key (e.g., "QA-0076")
    const searchKey = getCallNumberKey(parsed);

    // 2. Linear Scan
    // Since we have a small dataset (tens or hundreds of ranges), 
    // a simple loop is extremely fast and easy to debug.
    for (const range of ranges) {
        // 3. Comparison Logic
        // Because we padded our numbers (QA-0001, QA-0076), we can use 
        // standard string comparison operators (>= and <=).
        if (searchKey >= range.startKey && searchKey <= range.endKey) {
            return range; // Found it!
        }
    }

    return null; // No range found for this call number
}