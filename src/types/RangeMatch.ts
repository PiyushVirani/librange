import { RangeRecord } from "./RangeRecord";

export interface RangeMatch extends RangeRecord {
    // Currently identical to RangeRecord.
    // In the future, you could add fields like:
    // matchConfidence: number;
    // exactLocationDetails?: string;
}